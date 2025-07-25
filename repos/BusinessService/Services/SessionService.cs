using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
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
                          join tutor in _context.Tutors on session.TutorFk equals tutor.TutorId
                          where session.TutorFk == tutors.Id
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

        public async Task<SessionBookingResponseDto> BookSession(SessionBookingRequestDto request, string learnerEmail)
        {
            try
            {
                // Get learner information from email
                var learner = await _context.Learners
                    .Join(_context.Users, l => l.UserFk, u => u.UserId, (l, u) => new { Learner = l, User = u })
                    .Where(x => x.User.Email == learnerEmail)
                    .Select(x => x.Learner)
                    .FirstOrDefaultAsync();

                if (learner == null)
                {
                    throw new InvalidOperationException("Learner not found");
                }

                // Verify tutor exists
                var tutorExists = await _context.Tutors.AnyAsync(t => t.TutorId == request.TutorId);
                if (!tutorExists)
                {
                    throw new InvalidOperationException("Tutor not found");
                }

                // Create session record
                var session = new Session
                {
                    SessionId = Guid.NewGuid(),
                    SessionName = request.SessionName,
                    LearnerFk = learner.LearnerId,
                    TutorFk = request.TutorId,
                    StartTime = request.StartTime,
                    EndTime = request.EndTime,
                    SessionFee = request.SessionFee,
                    SessionStatus = "Pending Payment Approval",
                    IsPaid = false,
                    RequestMessage = request.RequestMessage
                };

                _context.Sessions.Add(session);

                // Create payment record
                var payment = new Payment
                {
                    PaymentId = Guid.NewGuid(),
                    PaymentType = "Session Booking",
                    TutorFk = request.TutorId,
                    LearnerFk = learner.LearnerId,
                    Amount = request.SessionFee,
                    Currency = request.Currency ?? "LKR",
                    PaymentStatus = "Pending Verification",
                    PaymentDate = DateTime.UtcNow,
                    GatewayRef = request.TransactionReference
                };

                // Convert payment proof to byte array if provided
                if (request.PaymentProof != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await request.PaymentProof.CopyToAsync(memoryStream);
                        payment.PaymentProof = memoryStream.ToArray();
                    }
                }

                _context.Payments.Add(payment);

                // Save changes
                await _context.SaveChangesAsync();

                return new SessionBookingResponseDto
                {
                    SessionId = session.SessionId,
                    PaymentId = payment.PaymentId,
                    Message = "Session booking submitted successfully. Your payment will be verified and you will be notified once approved.",
                    SessionStatus = session.SessionStatus,
                    PaymentStatus = payment.PaymentStatus ?? "Pending Verification"
                };
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to book session: {ex.Message}", ex);
            }
        }


        public void UpdateSessionStatus(SessionStatusDto sessionStatus, string email)
        {
            if (sessionStatus == null) return;

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
