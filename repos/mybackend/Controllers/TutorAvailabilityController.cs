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
    public class TutorAvailabilityController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TutorAvailabilityController (ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: api/<ValuesController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ValuesController>
        [HttpPost("AddAvailability")]
        public void Post([FromBody] TutorAvailabilitySettingsDto tutorAvailability)
        {
     
            var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            ITutorAvailabilityService tutorAvailabilityService = new TutorAvailabiltyService(_context);
            var result = tutorAvailabilityService.SaveTutorAvailabilty(tutorAvailability, email);
        }

        // GET api/TutorAvailability/GetAvailability
        [HttpGet("GetAvailability")]
        public ActionResult<TutorAvailabilitySettingsDto> GetAvailability()
        {
            try
            {
                var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
                
                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest("User email not found in claims");
                }

                ITutorAvailabilityService tutorAvailabilityService = new TutorAvailabiltyService(_context);
                var result = tutorAvailabilityService.GetTutorAvailability(email);
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
