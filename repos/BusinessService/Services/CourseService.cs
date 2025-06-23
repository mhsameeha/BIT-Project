using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;

namespace BusinessService.Services
{
    public class CourseService : ICourseService
    {

        private readonly ApplicationDbContext _context;
        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<CourseDetailDto> GetCourseDetails()
        {

            var result = (from coursecontent in _context.CourseContents
                          join course in _context.Courses on coursecontent.CourseId equals course.CourseId
                          join category in _context.Categories on course.CategoryFk equals category.CategoryId

                          select new CourseDetailDto
                          {
                              CourseId = course.CourseId,
                              CourseName = course.CourseName,
                              Fee = course.Fee,
                              PublishedDate = course.PublishedDate,
                              CategoryName = category.CategoryName,
                              CourseIntro = coursecontent.BriefIntro
                          }).ToList();
            return result;
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
