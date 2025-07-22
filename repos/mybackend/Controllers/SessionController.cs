using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<SessionController>/5
        [HttpPut("UpdateSessionStatus")]
        public void UpdateSessionStatus([FromBody] SessionStatusDto sessionStatus)
        {
            var email = "prof.chen@educonnect.com";
            //var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            ISessionService sessionService = new SessionService(_context);
            sessionService.UpdateSessionStatus(sessionStatus, email);
        }

        // DELETE api/<SessionController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
