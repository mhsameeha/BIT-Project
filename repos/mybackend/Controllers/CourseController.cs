using BusinessService.Interfaces;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;
using BusinessService.Data;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        public CourseController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<CourseController>
        [HttpGet("Courses")]
        public Task<PaginatedCoursesDto> GetCoursesAsync(int page = 1, int items = 5)
        {
            ICourseService courseService = new CourseService(_context);
            var course = courseService.GetCoursesAsync(page, items);
            return course;
        }

        [HttpGet ("Categories")]
        public List<Category> GetCourseCategories()
        {
            ICourseService courseService = new CourseService(_context);
            return courseService.getCourseCategories();
        }

        [HttpGet("Difficulties")]
        public List<CourseDifficulty> GetCourseDifficulties()
        {
            ICourseService courseService = new CourseService(_context);
            return courseService.getCourseDifficulties();
        }


        [HttpPost("AddCourse")]
        public (Course,CourseContent) AddNewCourse([FromBody] CourseDetailDto newCourse)
        {
            ICourseService courseService = new CourseService(_context);
            var courseName = courseService.addCourse(newCourse);
            return courseName;
        }

        // POST api/<CourseController>
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        // PUT api/<CourseController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //    ICourseService courseService = new CourseService();
        //    courseService.addCourse(id,value);
        //}

        // DELETE api/<CourseController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //    ICourseService courseService = new CourseService();
        //    courseService.DeleteCourse(id);
        //}
    }
}
