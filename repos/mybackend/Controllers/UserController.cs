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
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/<UserController>
        [HttpGet("GetUserProfile")]
        [Authorize]

        public ActionResult<UserDto> GetUserProfile()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized("Email claim not found in token.");
            IUserService userService = new UserService(_context);
            var userProfile = userService.GetUserProfile(email);
            if (userProfile == null)
                return NotFound("User not found.");
            return Ok(userProfile);
        }

        

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<UserController>
        [HttpPost("signup")]
        public IActionResult SignUp([FromBody] UserDto user)
        {
            IUserService UserService = new UserService(_context);
            var newUser = UserService.addUser(user);
            return Ok(newUser);

        }

        [HttpPost("SignIn")]
        public IActionResult SignIn(LoginDto currentUser)
        {

            IUserService UserService = new UserService(_context);
            var token = UserService.SignIn(currentUser);


            if (token != "Invalid Credentials")
            {
       
                return Ok(new { token });

            }

            return BadRequest("Invalid Credentials");
            
        }


        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
