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

        public async Task<PaginatedCoursesDto> GetCoursesAsync(int page, int pageSize)
        {
            //var ratingQuery = (from course in _context.Courses
            //                   join coursereview in _context.CourseReviews on course.CourseId equals coursereview.CourseFk into ccr
            //                   from courserating in ccr.DefaultIfEmpty()
            //                   select new
            //                   {
            //                       CourseId = course.CourseId,
            //                       AverageRating = ccr.Average(r => r.Rating)
            //                   }
            //              ).ToListAsync();



            //var totalDurationQuery = (from course in _context.Courses
            //                          join coursecontent in _context.CourseContents on course.CourseId equals coursecontent.CourseFk into ccc
            //                          from duration in ccc.DefaultIfEmpty()
            //                          select new
            //                          {
            //                              CourseId = course.CourseId,
            //                              TotalDurationTicks = ccc.Sum(s => s.Duration.HasValue ? s.Duration.Value.Ticks : 0),
            //                          }
            //                     ).ToList()
            //         .Select(x => new
            //         {
            //             x.CourseId,
            //             TotalDuration = new TimeSpan(x.TotalDurationTicks) // back to TimeSpan
            //         }).ToList();

            //var totalEnrolledStudents = (from course in _context.Courses
            //                             join enrollment in _context.Enrollments on course.CourseId equals enrollment.CourseFk
            //                             )



            var result = (from course in _context.Courses
                          join category in _context.Categories on course.CategoryFk equals category.CategoryId
                          join difficulty in _context.CourseDifficulties on course.CourseDifficultyFk equals difficulty.CourseDifficultyId
                          join tutor in _context.Tutors on course.TutorFk equals tutor.TutorId
                          join user in _context.Users on tutor.UserFk equals user.UserId //innerJoin
                          //join rating in ratingQuery on course.CourseId equals rating.CourseId into temp
                          //from courseRating in temp.DefaultIfEmpty()
                          //join totalDuration in totalDurationQuery on course.CourseId equals totalDuration.CourseId into duration
                          //from totalCourseDuration in duration.DefaultIfEmpty()
                          select new CourseDetailDto
                          {
                              CourseId = course.CourseId,
                              Title = course.Title,
                              TutorName = user.FirstName + ' ' + user.LastName,
                              //Rating = courseRating != null ? courseRating.AverageRating : 0,
                              //Duration = totalCourseDuration != null ? totalCourseDuration.TotalDuration : TimeSpan.Zero,
                              Rating = (decimal?)4.2,
                              Duration = null,
                              EnrolledStudents = 2,
                              ReviewCount = 2,
                              Sections = 2,
                              Price = course.Price,
                              CourseDifficulty = difficulty.CourseDifficultyName,
                              UpdatedDate = course.UpdatedDate,
                              CategoryName = category.CategoryName,
                              Introduction = course.Introduction
                          }).ToList();

            var totalCount = await _context.Courses.CountAsync();

            return new PaginatedCoursesDto
            {
                TotalItems = totalCount,
                Page = page,
                PageSize = (int)Math.Ceiling((decimal)totalCount / pageSize),
                Courses = result
                .Skip((page-1) * pageSize)
                .Take(pageSize)
                .ToList(),
            };
          
        }


        //public Course addCourse(AddCourseDto course)
        //{
        //    var category = _context.Categories.FirstOrDefault(x => x.CategoryName == course.Category);
        //    var newCourse = new Course
        //    {
        //        CourseId= Guid.NewGuid(),
        //        CourseName= course.CourseName,
        //         CategoryFk= category.CategoryId,
        //         Status = "Pending",
        //         CreatedDate= DateTime.Now,
        //         PublishedDate= null,
        //         UpdatedDate = null,
        //         TutorFk = 20001





        //    };

        //    return course;
        //    throw new NotImplementedException();
        //}

        //public string GetCoursebyId(int id)
        //{

        //    return courseSet.First(x => x.Key == id).Value;
        //}

        //public IEnumerable<string> GetAllCourses()
        //{

        //    return ;
        //}


        //public void DeleteCourse(int id)
        //{
        //    var removeCourse = courseSet.FirstOrDefault(x => x.Key == id);
        //    courseSet.Remove(removeCourse);
        //}
    }
}
