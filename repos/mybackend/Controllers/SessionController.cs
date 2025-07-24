using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Services;
using BusinessService.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EduConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SessionController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<SessionController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<SessionController>/5
        [HttpGet("SessionsByTutor")]
        public IActionResult GetSessionsByTutor()
        {
            var email = "prof.chen@educonnect.com";
            //var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            ISessionService sessionService = new SessionService(_context);
            var result = sessionService.SessionsByTutor(email);
            return Ok(result);
        }

        // POST api/<SessionController>
        [HttpPost("book")]
        public async Task<IActionResult> BookSession([FromForm] SessionBookingRequestDto request)
        {
            try
            {
                // Get learner email from claims (similar to CourseController)
                var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

                ISessionService sessionService = new SessionService(_context);
                var result = await sessionService.BookSession(request, email!);
                
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An unexpected error occurred while booking the session." });
            }
        }

        // POST api/<SessionController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<SessionController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<SessionController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
