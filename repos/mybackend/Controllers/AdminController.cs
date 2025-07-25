using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EduConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<AdminController>
        [HttpGet("AdminDashboardData")]
        public IActionResult GetAdminDashboardData()
        {
            IAdminService adminService = new AdminService(_context);
            var result = adminService.GetAdminDashboardData();
            return Ok(result);

        }

        [HttpGet("PaymentApproval")]
        public IActionResult GetPaymentApprovals()
        {
            IAdminService adminService = new AdminService(_context);
            var result = adminService.GetPaymentApprovals();
            return Ok(result);

        }



        // GET api/<AdminController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<AdminController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<AdminController>/5
        [HttpPut("ApproveTutorApp/{tutorId}")]
        public void ApproveTutorApplication(Guid tutorId)
        {
            IAdminService adminService = new AdminService(_context);
            adminService.ApproveTutorApplication(tutorId);
        }
        [HttpPut("RejectTutorApp/{tutorId}")]
        public void RejectTutorApplication(Guid tutorId)
        {
            IAdminService adminService = new AdminService(_context);
            adminService.RejectTutorApplication(tutorId);
        }


        // DELETE api/<AdminController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
