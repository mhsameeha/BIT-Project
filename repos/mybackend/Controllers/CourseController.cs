using BusinessService.Interfaces;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;
using BusinessService.Data;
using BusinessService.Models.DTOs;

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
        [HttpGet]
        public List<CourseDetailDto> Get()
        {
            ICourseService courseService = new CourseService(_context);
            var course = courseService.GetCourseDetails();
            return course;
        }

        // GET api/<CourseController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    ICourseService courseService = new CourseService();
        //    var courseName = courseService.GetCoursebyId(id);
        //    return courseName;
        //}

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
