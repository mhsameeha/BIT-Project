using System.Security.Claims;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using BusinessService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class TutorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TutorController(ApplicationDbContext context)
        {
            _context = context;
        }
        //GET: api/<TutorController>
        [HttpGet("tutors")]
        public List<TutorDto> getAllTutors()
        {
            ITutorService TutorService = new TutorService(_context);
            var result = TutorService.GetAllTutors();
            return result;
        }

        //GET: api/<TutorController>/available-tutors
        [HttpGet("available-tutors")]
        public IActionResult GetAvailableTutorsWithDetails()
        {
            try
            {
                ITutorService tutorService = new TutorService(_context);
                var result = tutorService.GetAvailableTutorsWithDetails();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to retrieve tutors", message = ex.Message });
            }
        }

        //GET: api/<TutorController>/tutor/{tutorId}
        [HttpGet("tutor/{tutorId}")]
        public IActionResult GetTutorById(string tutorId)
        {
            try
            {
                if (!Guid.TryParse(tutorId, out Guid tutorGuid))
                {
                    return BadRequest(new { error = "Invalid tutor ID format" });
                }

                ITutorService tutorService = new TutorService(_context);
                var result = tutorService.GetTutorById(tutorGuid);
                
                if (result == null)
                {
                    return NotFound(new { error = "Tutor not found" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to retrieve tutor", message = ex.Message });
            }
        }

        //GET: api/<TutorController>/availability/{tutorId}
        [HttpGet("availability/{tutorId}")]
        public IActionResult GetTutorAvailability(string tutorId)
        {
            try
            {
                if (!Guid.TryParse(tutorId, out Guid tutorGuid))
                {
                    return BadRequest(new { error = "Invalid tutor ID format" });
                }

                ITutorService tutorService = new TutorService(_context);
                var result = tutorService.GetTutorAvailability(tutorGuid);
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to retrieve tutor availability", message = ex.Message });
            }
        }

        //GET: api/<TutorController>/learner-info
        [HttpGet("learner-info")]
        public IActionResult GetLearnerFromClaims()
        {
            try
            {
                var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
                
                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new { error = "Email not found in claims" });
                }

                // Get user by email
                var user = _context.Users.FirstOrDefault(u => u.Email == email);
                if (user == null)
                {
                    return NotFound(new { error = "User not found" });
                }

                // Get learner by user ID
                var learner = _context.Learners.FirstOrDefault(l => l.UserFk == user.UserId);
                if (learner == null)
                {
                    return NotFound(new { error = "Learner profile not found" });
                }

                return Ok(new { 
                    learnerId = learner.LearnerId,
                    userId = user.UserId,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to retrieve learner information", message = ex.Message });
            }
        }

        // GET api/<TutorController>/5

        // POST api/<TutorController>
        [HttpGet ("tutorCourses/{page}")]
        public Task<PaginatedCoursesDto> GetCoursesByTutor( int page = 1, int items = 5 )
        {
            var email = "prof.chen@educonnect.com";
            //var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            ITutorService tutorService = new TutorService(_context);
            var course = tutorService.GetCoursesByTutor( email, page, items);
            return course;
        }
        [HttpGet("TutorDashboardData")]
        public IActionResult GetTutorDashboardData()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            ITutorService TutorService = new TutorService(_context);
            var result = TutorService.GetTutorDashboardData(email);
            return Ok (result);
        }

        // PUT api/<TutorController>/5
        [HttpGet("UpcomingSessions")]
        public IActionResult GetUpcomingSessions()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;

            ITutorService TutorService = new TutorService(_context);
            var result = TutorService.UpcomingSessions(email);
            return Ok(result);
        }

        // DELETE api/<TutorController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
