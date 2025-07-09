using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;

namespace BusinessService.Services
{
    public class TutorService : ITutorService
    {
        private readonly ApplicationDbContext _context;
          public TutorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<TutorDto> getAllTutors()
        {
            var result = (from tutor in _context.Tutors
                          join user in _context.Users on tutor.UserFk equals user.UserId
                          select new TutorDto
                          {
                              TutorId = tutor.TutorId,
                              FirstName = user.FirstName,
                              LastName = user.LastName,
                              Status = tutor.Status,
                              TutorName = user.FirstName + " " + user.LastName,
                          }).ToList();
            return result;
        }

        public List<SessionDto> UpcomingSessions(Guid tutorId)
        {
            var result = (from session in _context.Sessions
                          join learner in _context.Learners on session.LearnerFk equals learner.LearnerId
                          join user in _context.Users on learner.UserFk equals user.UserId
                          where session.TutorFk == tutorId
                          select new SessionDto
                          {
                            
                              StartTime = session.StartTime,
                              EndTime = session.EndTime,
                              SessionName = session.SessionName,
             
                              LearnerName = user.FirstName + " " + user.LastName,
                          }).ToList();
            return result;
        }
    }
}

