using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Services
{
    public class CourseService : ICourseService
    {

        private readonly ApplicationDbContext _context;
        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public (Course, CourseContent) addCourse(CourseDetailDto newCourse)
        {
            var course = new Course
            {
                CourseId = Guid.NewGuid(),
                TutorFk = newCourse.TutorFk, //should come from the frontend
                Price = newCourse.Price,
                Title = newCourse.Title,
                Introduction = newCourse.Introduction,
                Description = newCourse.Description,
                CourseDifficultyFk = _context.CourseDifficulties.FirstOrDefault(d => d.CourseDifficultyName == newCourse.CourseDifficulty).CourseDifficultyId,
                CategoryFk = _context.Categories.FirstOrDefault(c => c.CategoryName == newCourse.CategoryName).CategoryId,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                IsEnabled = true,
                //CourseImage = newCourse.CourseImage != null
                //                                ? Convert.ToBase64String(newCourse.CourseImage)
                //                                : null,
                CourseImage = null,
                LanguageFk = _context.Languages.FirstOrDefault(l=>l.Languages==newCourse.Language).LanguageId,

            };

            _context.Add(course);
            _context.SaveChanges();

            var courseContent = new CourseContent
            {
                ContentId = Guid.NewGuid(),
                CourseFk = course.CourseId,
                Title = newCourse.ContentTitle,
                Description = newCourse.Description,
                Duration = newCourse.Duration,
                SortOrder = newCourse.SortOrder,
                IsActive = true,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                SubContent = newCourse.SubContent,
                Tags = newCourse.Tags.ToString(),

            };
            _context.Add(courseContent);
            _context.SaveChanges();

            return (course, courseContent);
        }

        public List<Category> getCourseCategories()
        {
         
        
            var categories = _context.Categories
                .OrderBy(c => c.CategoryName)
                .ToList();
            return categories;
        }

        public List<CourseDifficulty> getCourseDifficulties()
        {
            var difficulties = _context.CourseDifficulties
               .OrderBy(c => c.CourseDifficultyName)
               .ToList();
            return difficulties;
        }

        public async Task<PaginatedCoursesDto> GetCoursesAsync(int page, int items)
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


            var totalCount = await _context.Courses.CountAsync();
            return new PaginatedCoursesDto
            {
                TotalItems = totalCount,
                Page = page,
                PageSize = (int)Math.Ceiling((decimal)totalCount / items),
                Courses = result
                .Skip((page-1) * items)
                .Take(items)
                .ToList(),
            };
          
        }


        //public void DeleteCourse(int id)
        //{
        //    var removeCourse = courseSet.FirstOrDefault(x => x.Key == id);
        //    courseSet.Remove(removeCourse);
        //}
    }
}
