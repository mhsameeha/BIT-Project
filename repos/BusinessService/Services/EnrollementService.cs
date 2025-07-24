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
        
        public List<EnrollmentDto> GetEnrolledCourses(Guid learnerid)
        {
            var result = (from enrollement in _context.Enrollments
                          join course in _context.Courses on enrollement.CourseId equals course.CourseId
                          where enrollement.LearnerFk == learnerid
                          select new EnrollmentDto
                          {
                              courseName = course.Title
                          }).ToList();
            return result;
        }

        public List<EnrollmentsByTutorDto> GetEnrollmentsByTutor(string email)
        {
            //var tutors = (from u in _context.Users
            //              join t in _context.Tutors on u.UserId equals t.UserId
            //              where u.Email == email
            //              select new
            //              {
            //                  Id = t.TutorId
            //              }).FirstOrDefault();

            //if (tutors == null) return null;

            //var findEnrollments = _context.Enrollments
            //                .Include(c => c.Course)
            //                .Where(c => c.EnrollmentStatus.ToLower() == "active")
            //                .Select(c => new EnrollmentsByTutorDto
            //                {
            //                    EnrollmentId = c.EnrollmentId,
            //                    CourseId = c.CourseId,
            //                    CourseName = c.Course.Title,
            //                    EnrolledDate = c.EnrolledDate,
            //                    CoursePrice = c.Course.Price,
            //                }).toList();

            //return findEnrollments;

            return null;
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
