using BusinessService.Interfaces;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;
using BusinessService.Data;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using Microsoft.AspNetCore.Authorization;

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
        [HttpGet("GetAllCourses/{page}")]
        public Task<PaginatedCoursesDto> GetAllCourses(int page = 1, int items = 10)
        {
            ICourseService courseService = new CourseService(_context);
            var course = courseService.GetAllCourses(page, items);
            return course;
        }

        [HttpGet ("Categories")]
        public List<Category> GetCourseCategories()
        {
            ICourseService courseService = new CourseService(_context);
            return courseService.GetCourseCategories();
        }

        [HttpGet("Difficulties")]
        public List<CourseDifficulty> GetCourseDifficulties()
        {
            ICourseService courseService = new CourseService(_context);
            return courseService.GetCourseDifficulties();
        }


        [HttpPost("AddCourse")]
        public IActionResult AddNewCourse([FromBody] CourseDto newCourse)

        {
            //var email = "prof.chen@educonnect.com";
            var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            ICourseService courseService = new CourseService(_context);
            var course = courseService.AddCourse(newCourse, email);
            return Ok(new {course});
        }


        [HttpGet("Languages")]
        public List<Language> GetCourseLanguages()
        {
            ICourseService courseService = new CourseService(_context);
            return courseService.GetCourseLanguages();
        }

        [HttpGet ("CourseById/{courseId}")]

        public IActionResult GetCourseById(Guid courseId)

        {
            var email = "prof.chen@educonnect.com";
            ICourseService courseService = new CourseService(_context);
            var course = courseService.GetCoursebyId(courseId);
            return Ok(course);
        }

        [HttpPut("UpdateCourse/{courseId}")]

        public IActionResult UpdateCourse([FromBody] UpdateCourseDto course, Guid courseId)
        {
            var email = "prof.chen@educonnect.com";
            ICourseService courseService = new CourseService(_context);
            var result = courseService.UpdateCourse( course,email,courseId);
            return Ok();

        }

        [HttpDelete("DeleteCourse/{Id}")]

        public IActionResult DeleteCourse(Guid Id)
        {
            ICourseService courseService = new CourseService (_context);
            courseService.DeleteCourse(Id);
            return Ok();

        }


    }
}
