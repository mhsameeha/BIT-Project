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
                          join user in _context.Users on tutor.UserFk equals user.UserId
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
                          join t in _context.Tutors on u.UserId equals t.UserFk
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
                               where c.TutorFk == tutor.Id && e.EnrolledDate >= oneWeekAgo
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

        public TutorProfileDataDto GetTutorProfileData(string email)
        {
            var tutor = (from u in _context.Users
                         join t in _context.Tutors on u.UserId equals t.UserFk
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
                .Where(c => c.TutorFk == tutor.Id)
                .SelectMany(c => c.Enrollment)
                .Count(e => e.EnrolledDate >= oneWeekAgo);
      



            var monthlyCourseIncome = _context.Courses
                .Where(c => c.TutorFk == tutor.Id)
                .SelectMany(c => c.Enrollment
                    .Where(e => e.EnrolledDate >= oneMonthAgo)
                    .Select(e => c.Price))
                .Sum();



            var courseIncome = _context.Courses
               .Where(x => x.TutorFk == tutor.Id)
               .Select(c => c.Price * c.Enrollment.Count)
               .Sum();
       
                var monthlyIncome = monthlyCourseIncome + monthlySessionIncome;

                return new TutorProfileDataDto
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
                         join t in _context.Tutors on u.UserId equals t.UserFk
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
                           join category in _context.Categories on course.CategoryFk equals category.CategoryId
                           join difficulty in _context.CourseDifficulties on course.CourseDifficultyFk equals difficulty.CourseDifficultyId
                           join tutor in _context.Tutors on course.TutorFk equals tutor.TutorId
                           join user in _context.Users on tutor.UserFk equals user.UserId //innerJoin
                           where tutor.TutorId == currentTutor                        
                           select new
                           {
                               CourseId = course.CourseId,
                               Title = course.Title,
                               TutorName = user.FirstName + ' ' + user.LastName,
                               Price = course.Price,
                               CourseDifficulty = difficulty.CourseDifficultyName,
                               UpdatedDate = course.UpdatedDate,
                               CategoryName = category.CategoryName,
                               Introduction = course.Introduction
                           }).ToList();
            var result = courses.Select(c => new CourseDetailDto
            {
                CourseId = c.CourseId,
                Title = c.Title,
                TutorName = c.TutorName,
                Price = c.Price,
                CourseDifficulty = c.CourseDifficulty,
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
                         join t in _context.Tutors on u.UserId equals t.UserFk
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
    }
}

