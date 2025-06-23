using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SpendSmart.Models;

namespace SpendSmart.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private readonly SpendSmartDbContext _context;

        public HomeController(ILogger<HomeController> logger, SpendSmartDbContext context)
        {
            _logger = logger;
            _context = context; 

        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Learners()
        {
            var allLearners = _context.Learners.ToList();

            var totalLearners = allLearners.Count();

            ViewBag.Learners = totalLearners;
            return View(allLearners);
        
        }

        public IActionResult CreateEditLearner(int? id)
        {
            if (id != null)
            {
                var learnerInDb = _context.Learners.SingleOrDefault(learner => learner.learnerId == id);
                return View(learnerInDb);
            }

            return View();
        }

        public IActionResult DeleteLearner (int id)
        {
            var learnerInDb = _context.Learners.SingleOrDefault(learner => learner.learnerId == id);
            _context.Learners.Remove(learnerInDb);
            _context.SaveChanges();
            return RedirectToAction("Learners");
        }
        public IActionResult CreateEditLearnerForm(Learners model)
        {
            if (model.learnerId == 0)
                {
                _context.Learners.Add(model);

            } else
            {
                _context.Learners.Update(model);
            }

            _context.SaveChanges();

            return RedirectToAction("Learners");
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
