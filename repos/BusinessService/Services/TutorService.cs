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

        public async Task<PaginatedCoursesDto> TutorCourses(Guid tutorId, int page, int items)
        {
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
                                   c.CourseFk,
                                   c.Duration
                              
                                
                               })
                               .AsEnumerable() // Switches to in-memory LINQ
                               .GroupBy(c => c.CourseFk)
                               .Select(g => new
                               {
                                   CourseId = g.Key,
                                   TotalDuration = TimeSpan.FromTicks(
                                       g.Sum(c =>
                                           TimeSpan.TryParse(c.Duration, out var ts) ? ts.Ticks : 0
                                       )
                                   ).ToString(@"hh\:mm\:ss")
                               })
                               .ToList();

            var enrolledStudents = await _context.Enrollments
                                       .GroupBy(r => r.CourseFk)
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
                           where tutorId == tutor.TutorId
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

        public List<SessionDto> UpcomingSessions(Guid tutorId)
        {
            var result = (from session in _context.Sessions
                          join learner in _context.Learners on session.LearnerFk equals learner.LearnerId
                          join user in _context.Users on learner.UserFk equals user.UserId
                          join tutor in _context.Tutors on session.TutorFk equals tutor.TutorId
                          where session.TutorFk == tutorId && session.SessionStatus == "Scheduled"
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

