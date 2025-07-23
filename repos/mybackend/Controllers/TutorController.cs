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
    [Authorize]
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

        // GET api/<TutorController>/5

        // POST api/<TutorController>
        [HttpGet ("tutorCourses/{page}")]
        public Task<PaginatedCoursesDto> GetCoursesByTutor( int page = 1, int items = 5 )
        {

            var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
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

        [HttpGet("TutorData")]
        public IActionResult GetTutorAccountDetails()
        {
          
            var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            ITutorService TutorService = new TutorService(_context);
            var result = TutorService.GetTutorAccountDetails(email);
            return Ok(result);
        }

        [HttpGet("TutorData/{tutorId}")]
        public IActionResult GetTutorAccountDetails(Guid tutorId)
        {

            ITutorService TutorService = new TutorService(_context);
            var result = TutorService.GetTutorAccountDetails(tutorId);
            return Ok(result);
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
