using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.Entities;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {


        private readonly ApplicationDbContext _context;

        public TestController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<TestController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<TestController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<TestController>
        [HttpPost]
        public IActionResult Post([FromBody]TestEntity entity)
        {
            ITestService TestService = new TestService(_context);
            var newEntity = TestService.addTest(entity, entity);
            return Ok(newEntity);
        }
        

        // PUT api/<TestController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<TestController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpPost("signin")]
        public IActionResult SignIn(User currentUser)
        {

            ITestService TestService = new TestService(_context);
            var access = TestService.SignIn(currentUser);

            if (access == true)
            {
                var token = TestService.GenerateToken(currentUser);
                return Ok(new { token });

            }

            return BadRequest("Invalid Credentials");
        }
    }
}
