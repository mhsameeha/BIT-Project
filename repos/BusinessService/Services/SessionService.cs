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
    public class SessionService : ISessionService
    {
        private readonly ApplicationDbContext _context;

        public SessionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<SessionByTutorDto> SessionsByTutor(string email)
        {
            var tutors = (from u in _context.Users
                          join t in _context.Tutors on u.UserId equals t.UserId
                          where u.Email == email
                          select new
                          {
                              Id = t.TutorId
                          }).FirstOrDefault();

            if (tutors == null)
            {
                return null;
            }

            var result = (from session in _context.Sessions
                          join learner in _context.Learners on session.LearnerFk equals learner.LearnerId
                          join user in _context.Users on learner.UserFk equals user.UserId
                          join tutor in _context.Tutors on session.TutorId equals tutor.TutorId
                          where session.TutorId == tutors.Id
                          select new SessionByTutorDto
                          {
                              SessionId = session.SessionId,
                              StartTime = session.StartTime,
                              EndTime = session.EndTime,
                              SessionName = session.SessionName,
                              Cost = session.SessionFee,
                              Duration = session.EndTime - session.StartTime,
                              //LearnerProfPic = learner.LearnerProfPic != null
                              //                  ? Convert.ToBase64String(learner.LearnerProfPic)
                              //                  : null,
                              LearnerName = user.FirstName + " " + user.LastName,
                              LearnerEmail = user.Email,
                              SessionStatus = session.SessionStatus,
                              IsPaid = session.IsPaid,
                              RequestMessage = session.RequestMessage,
                              RejectionReason = session.RejectionReason

                          }).ToList();
            return result;
        }

        public void UpdateSessionStatus(SessionStatusDto sessionStatus, string email)
        {
            var tutors = (from u in _context.Users
                          join t in _context.Tutors on u.UserId equals t.UserId
                          where u.Email == email
                          select new
                          {
                              Id = t.TutorId
                          }).FirstOrDefault();
            var session = _context.Sessions.FirstOrDefault(x => x.SessionId == sessionStatus.SessionId);

            if (tutors != null && session != null)
            {
                

                session.SessionStatus = sessionStatus.SessionStatus;
                session.RejectionReason = sessionStatus.RejectionReason;

                _context.SaveChanges();
            }

        }
    }
}
