﻿using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TutorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TutorController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<TutorController>
        //[HttpGet]
        //public  Get()
        //{
          
        //}

        // GET api/<TutorController>/5
        [HttpGet("{id}")]
        public List<SessionDto> TutorSessions(Guid id)
        {
            ITutorService TutorService = new TutorService(_context);
            var result = TutorService.UpcomingSessions(id);
            return result;
        }

        // POST api/<TutorController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<TutorController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<TutorController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
