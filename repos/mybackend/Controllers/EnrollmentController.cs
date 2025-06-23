using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
       public EnrollmentController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<EnrollmentController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<EnrollmentController>/5
        [HttpGet("{id}")]
        public List<EnrollmentDto> Get(Guid id)
        {
            IEnrollementService EnrollementService = new EnrollementService(_context);
            var result = EnrollementService.getEnrolledCourses(id);
            return result;
        }

        // POST api/<EnrollmentController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<EnrollmentController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<EnrollmentController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
