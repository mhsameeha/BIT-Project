using BusinessService.Interfaces;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;
using BusinessService.Data;
using BusinessService.Models.Entities;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LearnerController : ControllerBase
    {


        private readonly ApplicationDbContext _context;

        public LearnerController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<LearnerController>
    //    [HttpGet]
    //    public ActionResult<List<Learner>> GetAllLearners()
    //    {
    //        var allLearners = _context.Learners.ToList();

    //        return Ok(allLearners);
    //    }

    //    // GET api/<LearnerController>/5
    //    [HttpGet("{id}")]
    //    public Learner Get(int id)
    //    {
    //        ILearnerService learnerService = new LearnerService(_context);
    //        var learner = learnerService.GetLearnerById(id);
    //        return learner;
    //    }

    //    //  save / create
    //    // POST api/<LearnerController>
    //    [HttpPost]
    //    public IActionResult Post([FromBody] Learner learner)
    //    {
    //        ILearnerService learnerService = new LearnerService(_context);
    //        var newLearner = learnerService.addLearner(learner, learner);
    //        return Ok(newLearner);
    //    }

    //    //update
    //    // PUT api/<LearnerController>/5
    //    [HttpPut("{id}")]
    //    public IActionResult Put(int id, [FromBody] Learner learner)
    //    {
    //        ILearnerService learnerService = new LearnerService(_context);
    //        learner = learnerService.updateLearner(id,learner);
    //        return Ok(learner);

    //    }

    //    // DELETE api/<LearnerController>/5
    //    [HttpDelete("{id}")]
    //    public void Delete(int id)
    //    {
    //        ILearnerService learnerService = new LearnerService(_context);
    //        learnerService.removeLearner(id);
          
    //    }
    }
}
