using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.Entities;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialityController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SpecialityController (ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/<SpecialityController>
        [HttpGet]
        public List<Speciality> Get()
        {
            ISpecialityService speciality = new SpecialityService(_context);
            var specialityList = speciality.SpecialityList();
            return specialityList;
        }

        // GET api/<SpecialityController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<SpecialityController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<SpecialityController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<SpecialityController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
