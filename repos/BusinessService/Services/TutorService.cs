using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using static System.Collections.Specialized.BitVector32;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace BusinessService.Services
{
    public class TutorService : ITutorService
    {
        private readonly ApplicationDbContext _context;
          public TutorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<TutorDto> GetAllTutors()
        {
            var result = (from tutor in _context.Tutors
                          join user in _context.Users on tutor.UserId equals user.UserId
                          select new TutorDto
                          {
                              TutorId = tutor.TutorId,
                              FirstName = user.FirstName,
                              LastName = user.LastName,
                              Status = tutor.Status,
                              TutorName = user.FirstName + " " + user.LastName,
                          }).ToList();
            return result;
        }

        public List<NewStudentsDto> GetNewStudents(string email)
        {

            var tutor = (from u in _context.Users
                          join t in _context.Tutors on u.UserId equals t.UserId
                          where u.Email == email
                          select new
                          {
                              Id = t.TutorId
                          }).FirstOrDefault();

            if (tutor == null)
            {
                return null;

            }
            var oneWeekAgo = DateTime.Now.AddDays(-7);

            var newStudents = (from c in _context.Courses
                               join e in _context.Enrollments on c.CourseId equals e.CourseId
                               join l in _context.Learners on e.LearnerFk equals l.LearnerId
                               join u in _context.Users on l.UserFk equals u.UserId
                               where c.TutorId == tutor.Id && e.EnrolledDate >= oneWeekAgo
                               select new NewStudentsDto
                               {
                                   LearnerId = l.LearnerId,
                                   CourseTitle = c.Title,
                                   LearnerName = u.FirstName + ' ' + u.LastName,
                                   enrolledDay = EF.Functions.DateDiffDay(e.EnrolledDate, DateTime.UtcNow),
                                   LearnerProfPic = l.LearnerProfPic
                               }).ToList();

            return newStudents;
        }

        public TutorDashboardDataDto GetTutorDashboardData(string email)
        {
            var tutor = (from u in _context.Users
                         join t in _context.Tutors on u.UserId equals t.UserId
                         where u.Email == email
                         select new
                         {
                             Id = t.TutorId
                         }).FirstOrDefault();

            if (tutor == null)
            {
                return null;
            }
       
                var sessionIncome = _context.Sessions
               .Where(x => x.TutorFk == tutor.Id)
               .Sum(x => x.SessionFee);
            var oneMonthAgo = DateTime.Now.AddDays(-30);

            var monthlySessionIncome = _context.Sessions
            .Where(x => x.TutorFk == tutor.Id && x.EndTime >= oneMonthAgo && x.SessionStatus == "Completed")
            .Sum(x => x.SessionFee);
            var oneWeekAgo = DateTime.Now.AddDays(-7);

            var query = _context.Courses.Where(c => c.CourseId != Guid.Empty);
            Console.WriteLine(query.ToQueryString());


            var newStudents = _context.Courses
                .Where(c => c.TutorId == tutor.Id)
                .SelectMany(c => c.Enrollment)
                .Count(e => e.EnrolledDate >= oneWeekAgo);
      



            var monthlyCourseIncome = _context.Courses
                .Where(c => c.TutorId == tutor.Id)
                .SelectMany(c => c.Enrollment
                    .Where(e => e.EnrolledDate >= oneMonthAgo)
                    .Select(e => c.Price))
                .Sum();



            var courseIncome = _context.Courses
               .Where(x => x.TutorId == tutor.Id)
               .Select(c => c.Price * c.Enrollment.Count)
               .Sum();
       
                var monthlyIncome = monthlyCourseIncome + monthlySessionIncome;

                return new TutorDashboardDataDto
                {
                    MonthylCourseIncome = courseIncome,
                    MonthlySessionIncome = sessionIncome,
                    NewStudents = newStudents,
                    MonthlyIncome = monthlyIncome
                };




            }
        

        public async Task<PaginatedCoursesDto> GetCoursesByTutor(string email, int page, int items)
        {
            var currentTutor = await (from u in _context.Users
                         join t in _context.Tutors on u.UserId equals t.UserId
                         where u.Email == email
                         select t.TutorId)
                         .FirstOrDefaultAsync();

            var ratings = await _context.CourseReviews
                                         .GroupBy(r => r.CourseFk)
                                         .Select(g => new
                                         {
                                             CourseId = g.Key,
                                             AverageRating = g.Average(r => r.Rating),
                                             reviewCount = g.Count()
                                         })
                                         .ToListAsync();
            var duration = _context.CourseContents
                               .Select(c => new
                               {
                                   c.CourseId,
                                   c.ContentDuration
                              
                                
                               })
                               .AsEnumerable() // Switches to in-memory LINQ
                               .GroupBy(c => c.CourseId)
                               .Select(g => new
                               {
                                   CourseId = g.Key,
                                   TotalDuration = TimeSpan.FromTicks(
                                       g.Sum(c =>
                                           TimeSpan.TryParse(c.ContentDuration, out var ts) ? ts.Ticks : 0
                                       )
                                   ).ToString(@"hh\:mm\:ss")
                               })
                               .ToList();

            var enrolledStudents = await _context.Enrollments
                                       .GroupBy(r => r.CourseId)
                                       .Select(g => new
                                       {
                                           CourseId = g.Key,
                                           StudentEnrolled = g.Count(),
                                           
                                       })
                                       .ToListAsync();


            var courses = (from course in _context.Courses
                           join category in _context.Categories on course.CategoryId equals category.CategoryId
                           join difficulty in _context.CourseDifficulties on course.CourseDifficultyId equals difficulty.CourseDifficultyId
                           join tutor in _context.Tutors on course.TutorId equals tutor.TutorId
                           join user in _context.Users on tutor.UserId equals user.UserId //innerJoin
                           where (tutor.TutorId == currentTutor  && course.IsDeleted==false )                      
                           select new
                           {
                               CourseId = course.CourseId,
                               Title = course.Title,
                               TutorName = user.FirstName + ' ' + user.LastName,
                               Price = course.Price,
                               CourseDifficulty = difficulty.CourseDifficultyName,
                               UpdatedDate = course.UpdatedDate,
                               CategoryName = category.CategoryName,
                               TutorId = course.TutorId,
                               Introduction = course.Introduction
                           }).ToList();
            var result = courses.Select(c => new CourseDetailDto
            {
                CourseId = c.CourseId,
                Title = c.Title,
                TutorName = c.TutorName,
                TutorFk = c.TutorId,
                Price = c.Price,
                CourseDifficultyName = c.CourseDifficulty,
                CategoryName = c.CategoryName,
                UpdatedDate = c.UpdatedDate,
                Introduction = c.Introduction,
                Rating = ratings.FirstOrDefault(r => r.CourseId == c.CourseId)?.AverageRating ?? 0,
                ReviewCount = ratings.FirstOrDefault(r => r.CourseId == c.CourseId)?.reviewCount ?? 0,

                Duration = duration.FirstOrDefault(r => r.CourseId == c.CourseId)?.TotalDuration ?? "0",

                EnrolledStudents = enrolledStudents.FirstOrDefault(r => r.CourseId == c.CourseId)?.StudentEnrolled ?? 0,

            }).ToList();


            var totalCount = result.Count();
            return new PaginatedCoursesDto
            {
                TotalItems = totalCount,
                Page = page,
                PageSize = (int)Math.Ceiling((decimal)totalCount / items),
                Courses = result
                .Skip((page - 1) * items)
                .Take(items)
                .ToList(),
            };
        }

        public List<SessionDto> UpcomingSessions(string email)
        {
            var tutors = (from u in _context.Users
                         join t in _context.Tutors on u.UserId equals t.UserId
                         where u.Email == email
                         select new
                         {
                             Id = t.TutorId
                         }).FirstOrDefault();

            if (tutors == null)
            {
                return null;
            }

            var result = (from session in _context.Sessions
                          join learner in _context.Learners on session.LearnerFk equals learner.LearnerId
                          join user in _context.Users on learner.UserFk equals user.UserId
                          join tutor in _context.Tutors on session.TutorFk equals tutor.TutorId
                          where session.TutorFk == tutors.Id && session.SessionStatus == "Scheduled"
                          select new SessionDto
                          {
                            
                              StartTime = session.StartTime,
                              EndTime = session.EndTime,
                              SessionName = session.SessionName,
                              TutorRate = tutor.TutorRate,
                              LearnerProfPic = learner.LearnerProfPic != null
                                                ? Convert.ToBase64String(learner.LearnerProfPic)
                                                : null,
                              LearnerName = user.FirstName + " " + user.LastName,
                          }).ToList();
            return result;
        }

        public List<TutorDetailDto> GetAvailableTutorsWithDetails()
        {
            try
            {
                // First get basic tutor and user data without the problematic Language field
                var tutorsWithDetails = (from tutor in _context.Tutors
                                       join user in _context.Users on tutor.UserId equals user.UserId
                                       where tutor.Status == "Approved"
                                       select new { 
                                           TutorId = tutor.TutorId,
                                           UserFk = tutor.UserId,
                                           TutorDescription = tutor.TutorDescription,
                                           TutorRate = tutor.TutorRate,
                                           Status = tutor.Status,
                                           Experience = tutor.Experience,
                                           Education = tutor.Education,
                                           FirstName = user.FirstName,
                                           LastName = user.LastName
                                       }).ToList();

                var result = new List<TutorDetailDto>();

                foreach (var tutorData in tutorsWithDetails)
                {
                    try
                    {
                        // Check if tutor has enabled time slots
                        var hasAvailableTimeSlots = _context.TutorWeeklyAvailabilities
                            .Any(wa => wa.TutorId == tutorData.TutorId && 
                                      _context.TutorTimeslots.Any(ts => ts.AvailabilityId == wa.AvailabilityId));

                        if (!hasAvailableTimeSlots)
                            continue; // Skip tutors without available time slots

                        // Get specialities for this tutor
                        var specialities = (from ts in _context.TutorSpecialities
                                          join s in _context.Specialities on ts.SpecialityFk equals s.SpecialityId
                                          where ts.TutorFk == tutorData.TutorId
                                          select s.SpecialityName ?? string.Empty).ToList();

                        var tutorDetailDto = new TutorDetailDto
                        {
                            TutorId = tutorData.TutorId,
                            FirstName = tutorData.FirstName,
                            LastName = tutorData.LastName,
                            TutorName = (tutorData.FirstName ?? "") + " " + (tutorData.LastName ?? ""),
                            TutorDescription = tutorData.TutorDescription,
                            TutorRate = tutorData.TutorRate,
                            Status = tutorData.Status,
                            Experience = JsonConvert.SerializeObject(tutorData.Experience),
                            Education = JsonConvert.SerializeObject(tutorData.Education),
                            Language = new string[] { "English" }, // Default language for now
                            Specialities = specialities,
                            HasAvailableTimeSlots = hasAvailableTimeSlots
                        };

                        result.Add(tutorDetailDto);
                    }
                    catch (Exception ex)
                    {
                        // Log the error and continue with next tutor
                        Console.WriteLine($"Error processing tutor {tutorData.TutorId}: {ex.Message}");
                        continue;
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAvailableTutorsWithDetails: {ex.Message}");
                return new List<TutorDetailDto>();
            }
        }

        public TutorDetailDto GetTutorById(Guid tutorId)
        {
            try
            {
                var tutorData = (from tutor in _context.Tutors
                               join user in _context.Users on tutor.UserId equals user.UserId
                               where tutor.TutorId == tutorId && tutor.Status == "Approved"
                               select new { 
                                   TutorId = tutor.TutorId,
                                   UserFk = tutor.UserId,
                                   TutorDescription = tutor.TutorDescription,
                                   TutorRate = tutor.TutorRate,
                                   Status = tutor.Status,
                                   Experience = tutor.Experience,
                                   Education = tutor.Education,
                                   FirstName = user.FirstName,
                                   LastName = user.LastName
                               }).FirstOrDefault();

                if (tutorData == null)
                    return null;

                // Check if tutor has enabled time slots
                var hasAvailableTimeSlots = _context.TutorWeeklyAvailabilities
                    .Any(wa => wa.TutorId == tutorData.TutorId && 
                              _context.TutorTimeslots.Any(ts => ts.AvailabilityId == wa.AvailabilityId));

                // Get specialities for this tutor
                var specialities = (from ts in _context.TutorSpecialities
                                  join s in _context.Specialities on ts.SpecialityFk equals s.SpecialityId
                                  where ts.TutorFk == tutorData.TutorId
                                  select s.SpecialityName ?? string.Empty).ToList();

                return new TutorDetailDto
                {
                    TutorId = tutorData.TutorId,
                    FirstName = tutorData.FirstName,
                    LastName = tutorData.LastName,
                    TutorName = (tutorData.FirstName ?? "") + " " + (tutorData.LastName ?? ""),
                    TutorDescription = tutorData.TutorDescription,
                    TutorRate = tutorData.TutorRate,
                    Status = tutorData.Status,
                    Experience = JsonConvert.SerializeObject(tutorData.Experience),
                    Education = JsonConvert.SerializeObject(tutorData.Education),
                    Language = new string[] { "English" }, // Default language for now
                    Specialities = specialities,
                    HasAvailableTimeSlots = hasAvailableTimeSlots
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTutorById: {ex.Message}");
                throw new Exception("Failed to retrieve tutor details", ex);
            }
        }

        public object GetTutorAvailability(Guid tutorId)
        {
            try
            {
                // Get tutor's weekly availability settings
                var weeklyAvailabilities = _context.TutorWeeklyAvailabilities
                    .Where(wa => wa.TutorId == tutorId)
                    .ToList();

                if (!weeklyAvailabilities.Any())
                {
                    return new TutorAvailabilityResponseDto
                    {
                        TutorId = tutorId,
                        Availability = new List<TutorAvailabilityDto>(),
                        DateAvailability = new List<TutorDateAvailabilityDto>()
                    };
                }

                // Get all time slots for these availabilities
                var availabilityIds = weeklyAvailabilities.Select(wa => wa.AvailabilityId).ToList();
                var timeSlots = _context.TutorTimeslots
                    .Where(ts => availabilityIds.Contains(ts.AvailabilityId))
                    .ToList();

                // Generate dates for the next 30 days
                var startDate = DateTime.Today;
                var endDate = startDate.AddDays(30);
                var dateAvailabilities = new List<TutorDateAvailabilityDto>();

                for (var date = startDate; date <= endDate; date = date.AddDays(1))
                {
                    var dayOfWeek = date.DayOfWeek.ToString();
                    
                    // Find weekly availability for this day
                    var weeklyAvailability = weeklyAvailabilities
                        .FirstOrDefault(wa => wa.Day.Equals(dayOfWeek, StringComparison.OrdinalIgnoreCase));

                    if (weeklyAvailability != null)
                    {
                        // Get time slots for this day
                        var dayTimeSlots = timeSlots
                            .Where(ts => ts.AvailabilityId == weeklyAvailability.AvailabilityId)
                            .Where(ts => !IsTimeSlotBookedForDate(tutorId, date, ts.Starttime))
                            .Select(ts => ts.Starttime)
                            .OrderBy(ts => ConvertTimeToSortable(ts))
                            .ToList();

                        if (dayTimeSlots.Any())
                        {
                            dateAvailabilities.Add(new TutorDateAvailabilityDto
                            {
                                Date = date,
                                DayOfWeek = dayOfWeek,
                                TimeSlots = dayTimeSlots
                            });
                        }
                    }
                }

                // Also maintain backward compatibility with old format
                var weeklyAvailabilityDto = weeklyAvailabilities
                    .Select(wa => new TutorAvailabilityDto
                    {
                        Day = wa.Day,
                        TimeSlots = timeSlots
                            .Where(ts => ts.AvailabilityId == wa.AvailabilityId)
                            .Select(ts => ts.Starttime)
                            .OrderBy(ts => ConvertTimeToSortable(ts))
                            .ToList()
                    })
                    .ToList();

                return new TutorAvailabilityResponseDto
                {
                    TutorId = tutorId,
                    Availability = weeklyAvailabilityDto,
                    DateAvailability = dateAvailabilities
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTutorAvailability: {ex.Message}");
                return new TutorAvailabilityResponseDto
                {
                    TutorId = tutorId,
                    Availability = new List<TutorAvailabilityDto>(),
                    DateAvailability = new List<TutorDateAvailabilityDto>()
                };
            }
        }

        private bool IsTimeSlotBookedForDate(Guid tutorId, DateTime date, string startTime)
        {
            try
            {
                // Get sessions for this tutor on the specific date that are not cancelled or rejected
                var bookedSessions = _context.Sessions
                    .Where(s => s.TutorFk == tutorId 
                               && s.StartTime.Date == date.Date
                               && s.SessionStatus != "Cancelled" 
                               && s.SessionStatus != "Rejected")
                    .ToList();

                // Check if any session conflicts with this time slot
                foreach (var session in bookedSessions)
                {
                    var sessionStartTime = session.StartTime.ToString("HH:mm");
                    if (TryParseToTimeSpan(startTime, out var slotTs))
                    {
                        var sessionTs = session.StartTime.TimeOfDay;
                        if (sessionTs.Hours == slotTs.Hours && sessionTs.Minutes == slotTs.Minutes)
                        {
                            return true; // Time slot is booked
                        }
                    }
                }

                return false; // Time slot is available
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in IsTimeSlotBookedForDate: {ex.Message}");
                return false; // In case of error, assume available
            }
        }

        private bool TryParseToTimeSpan(string time, out TimeSpan result)
        {
            // Try parsing "10.00", "10:00", "10:00 AM", etc.
            if (TimeSpan.TryParse(time.Replace('.', ':'), out result))
                return true;
            if (DateTime.TryParse(time, out var dt))
            {
                result = dt.TimeOfDay;
                return true;
            }
            result = default;
            return false;
        }

        private string ConvertTimeToSortable(string timeString)
        {
            try
            {
                if (DateTime.TryParse(timeString, out DateTime time))
                {
                    return time.ToString("HH:mm");
                }
                return timeString;
            }
            catch
            {
                return timeString;
            }
        }
        public TutorData GetTutorAccountDetails(string email)
        {
            var tutor = (from u in _context.Users
                          join t in _context.Tutors on u.UserId equals t.UserId
                          where u.Email == email
                          select new
                          {
                              Id = t.TutorId
                          }).FirstOrDefault();

            if (tutor == null)
            {
                return null;
            }

            var tutorDetails = _context.Users
                               .Include(u => u.Tutor).FirstOrDefault(t => t.Tutor.TutorId == tutor.Id);
            if (tutorDetails == null)
            {
                return null;
            }

            var availability = _context.TutorWeeklyAvailabilities
                .Where(a => a.TutorId == tutor.Id)
                .Include(a => a.TimeSlots) // assumes a.TimeSlots is ICollection<TutorTimeSlot>
                .ToList();

            var allDayAvailableDays = _context.TutorWeeklyAvailabilities
                                    .Where(x => x.IsAvailable && x.AllDay)
                                    .Select(x => x.Day)
                                    .ToList();
            var someSlotsAvailable = _context.TutorWeeklyAvailabilities
                                  .Where(x => x.IsAvailable && x.AllDay == false)
                                  .Select(x => new TutorAvailabilitySlotsDto
                                  {
                                     Day = x.Day,
                                     TimeSlots = x.TimeSlots,
                                  })
                                  .ToList();

            var sessionsCompleted = 0;

            decimal avgRating = 0;

            if (sessionsCompleted > 0)
            {
                avgRating = _context.Sessions
                            .Where(s => s.TutorFk == tutor.Id && s.SessionStatus.ToLower() == "completed")
                            .Sum(s => s.SessionRate) / sessionsCompleted;
            }

          


            return new TutorData
            {
                Name = tutorDetails.FirstName + ' ' + tutorDetails.LastName,
                Dob = tutorDetails.Dob,
                Email = tutorDetails.Email,
                Status = tutorDetails.Tutor.Status,
                TutorRate = tutorDetails.Tutor.TutorRate,
                TutorProfPic = tutorDetails.Tutor.TutorProfPic,
                TutorDescription = tutorDetails.Tutor.TutorDescription,
                Education = tutorDetails.Tutor.EducationJson,
                Experience = tutorDetails.Tutor.ExperienceJson,
                Language = tutorDetails.Tutor.Language,
                ApprovedDate = tutorDetails.Tutor.ApprovedDate,
                Availability = someSlotsAvailable,

            };
          
        }

        public TutorData GetTutorAccountDetails(Guid tutorId)
        {
        

            var tutorDetails = _context.Users
                               .Include(u => u.Tutor).FirstOrDefault(t => t.Tutor.TutorId == tutorId);


    

            if (tutorDetails == null)
            {
                return null;
            }


            var TutorProfileData = new TutorData
            {
                Name = tutorDetails.FirstName + ' ' + tutorDetails.LastName,
                Dob = tutorDetails.Dob,
                Email = tutorDetails.Email,
                Status = tutorDetails.Tutor.Status,
                TutorRate = tutorDetails.Tutor.TutorRate,
                TutorProfPic = tutorDetails.Tutor.TutorProfPic,
                TutorDescription = tutorDetails.Tutor.TutorDescription,
                Education = tutorDetails.Tutor.EducationJson,
                Experience = tutorDetails.Tutor.ExperienceJson,
                Language = tutorDetails.Tutor.Language,

            };

            return TutorProfileData;    

        }

 
    }
}

