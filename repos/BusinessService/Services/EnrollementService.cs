using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Services
{
    public class EnrollementService : IEnrollementService
    {
        private readonly ApplicationDbContext _context;
        public EnrollementService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        //public List<EnrollmentDto> GetEnrolledCourses(Guid learnerid)
        //{
        //    var result = (from enrollement in _context.Enrollments
        //                  join course in _context.Courses on enrollement.CourseId equals course.CourseId
        //                  where enrollement.LearnerFk == learnerid
        //                  select new EnrollmentDto
        //                  {
        //                      CourseName = course.Title,
        //                      EnrollmentId = enrollement.EnrollmentId,
        //                      CourseId = enrollement.CourseId ?? Guid.Empty,
        //                      EnrollmentStatus = enrollement.EnrollmentStatus,
        //                      EnrolledDate = enrollement.EnrolledDate ?? DateTime.UtcNow,
        //                      IsPaid = enrollement.IsPaid
        //                  }).ToList();
        //    return result;
        //}

        public async Task<List<EnrollmentDto>> GetEnrollmentsByLearnerEmailAsync(string userEmail)
        {
            var result = await (from u in _context.Users
                               join l in _context.Learners on u.UserId equals l.UserFk
                               join e in _context.Enrollments on l.LearnerId equals e.LearnerFk
                               join c in _context.Courses on e.CourseId equals c.CourseId
                               join p in _context.Payments on new { CourseId = e.CourseId, LearnerId = e.LearnerFk } 
                                   equals new { CourseId = p.CourseFk, LearnerId = p.LearnerFk } into payments
                               from payment in payments.DefaultIfEmpty()
                               where u.Email == userEmail
                               select new EnrollmentDto
                               {
                                   CourseName = c.Title,
                                   EnrollmentId = e.EnrollmentId,
                                   CourseId = e.CourseId ?? Guid.Empty,
                                   EnrollmentStatus = e.EnrollmentStatus,
                                   EnrolledDate = e.EnrolledDate ?? DateTime.UtcNow,
                                   IsPaid = e.IsPaid,
                                   PaymentStatus = payment != null ? payment.PaymentStatus : null
                               }).ToListAsync();
            
            return result;
        }

        public async Task<EnrollmentDto?> GetCourseEnrollmentStatusAsync(string userEmail, Guid courseId)
        {
            var result = await (from u in _context.Users
                               join l in _context.Learners on u.UserId equals l.UserFk
                               join e in _context.Enrollments on l.LearnerId equals e.LearnerFk
                               join c in _context.Courses on e.CourseId equals c.CourseId
                               join p in _context.Payments on new { CourseId = e.CourseId, LearnerId = e.LearnerFk } 
                                   equals new { CourseId = p.CourseFk, LearnerId = p.LearnerFk } into payments
                               from payment in payments.DefaultIfEmpty()
                               where u.Email == userEmail && e.CourseId == courseId
                               select new EnrollmentDto
                               {
                                   CourseName = c.Title,
                                   EnrollmentId = e.EnrollmentId,
                                   CourseId = e.CourseId ?? Guid.Empty,
                                   EnrollmentStatus = e.EnrollmentStatus,
                                   EnrolledDate = e.EnrolledDate ?? DateTime.UtcNow,
                                   IsPaid = e.IsPaid,
                                   PaymentStatus = payment != null ? payment.PaymentStatus : null
                               }).FirstOrDefaultAsync();
            
            return result;
        }

        public List<EnrollmentsByTutorDto> GetEnrollmentsByTutor(string email)
        {
            var tutors = (from u in _context.Users
                          join t in _context.Tutors on u.UserId equals t.UserId
                          where u.Email == email
                          select new
                          {
                              Id = t.TutorId
                          }).FirstOrDefault();

            if (tutors == null) return null;

            var findEnrollments = (from e in _context.Enrollments
                                   join c in _context.Courses on e.CourseId equals c.CourseId
                                   join l in _context.Learners on e.LearnerFk equals l.LearnerId
                                   join u in _context.Users on l.UserFk equals u.UserId into courseGroup
                                   from g in courseGroup.DefaultIfEmpty() // This makes it a LEFT JOIN
                                   where e.EnrollmentStatus.ToLower() == "active" && c.TutorId == tutors.Id
                                   select new EnrollmentsByTutorDto
                                   {
                                       EnrollmentId = e.EnrollmentId,
                                       CourseId = c != null ? c.CourseId : Guid.Empty,
                                       CourseName = c != null ? c.Title : "Unknown",
                                       EnrolledDate = e.EnrolledDate,
                                       CoursePrice = c != null ? c.Price : 0,
                                       LearnerName = g.FirstName + ' ' + g.LastName,
                                       LearnerProfPic = l.LearnerProfPic
                                   }).ToList();

            return findEnrollments;

                }

        public async Task<PaymentResponseDto> ProcessPaymentAsync(PaymentDto paymentDto, string userEmail)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var leanerId = (from u in _context.Users
                             join t in _context.Learners on u.UserId equals t.UserFk
                             where u.Email == userEmail
                             select new
                             {
                                 Id = t.LearnerId
                             }).FirstOrDefault()?.Id;


                // Check if the user is already enrolled in this course
                var existingEnrollment = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.CourseId == paymentDto.CourseId && e.LearnerFk == leanerId);

                if (existingEnrollment != null)
                {
                    throw new InvalidOperationException("Student is already enrolled in this course.");
                }

                // Create Payment record
                var payment = new Payment
                {
                    PaymentId = Guid.NewGuid(),
                    PaymentType = paymentDto.PaymentType,
                    LearnerFk = leanerId,
                    Amount = paymentDto.Amount,
                    Currency = paymentDto.Currency,
                    PaymentStatus = "Pending", // Will be updated when admin verifies
                    PaymentDate = DateTime.UtcNow,
                    GatewayRef = paymentDto.TransactionReference,
                    CourseFk = paymentDto.CourseId,
                    PaymentProof = paymentDto.PaymentProof
                };

                _context.Payments.Add(payment);

                // Create Enrollment record
                var enrollment = new Enrollment
                {
                    EnrollmentId = Guid.NewGuid(),
                    CourseId = paymentDto.CourseId,
                    LearnerFk = leanerId,
                    IsPaid = false, // Will be updated when payment is verified
                    EnrolledDate = DateTime.UtcNow,
                    EnrollmentStatus = "Pending Verification"
                };

                _context.Enrollments.Add(enrollment);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new PaymentResponseDto
                {
                    PaymentId = payment.PaymentId,
                    EnrollmentId = enrollment.EnrollmentId,
                    PaymentStatus = payment.PaymentStatus ?? "Pending",
                    PaymentDate = payment.PaymentDate ?? DateTime.UtcNow,
                    Message = "Payment submitted successfully. Your enrollment will be processed once payment is verified."
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
