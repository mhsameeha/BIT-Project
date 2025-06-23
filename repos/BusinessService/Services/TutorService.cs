using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;

namespace BusinessService.Services
{
    public class TutorService : ITutorService
    {
        private readonly ApplicationDbContext _context;
          public TutorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<SessionDto> UpcomingSessions(Guid tutorId)
        {
            var result = (from session in _context.Sessions
                          join learner in _context.Learners on session.LearnerId equals learner.LearnerId
                          join user in _context.Users on learner.UserFk equals user.Id
                          where session.TutorId == tutorId
                          select new SessionDto
                          {
                            
                              Duration = session.Duration,
                              SessionName = session.SessionName,
                              SessionTime = session.SessionTime,
                              LearnerName = user.FirstName + " " + user.LastName,
                          }).ToList();
            return result;
        }
    }
}

