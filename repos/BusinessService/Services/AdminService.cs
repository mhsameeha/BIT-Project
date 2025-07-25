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
using static BusinessService.Models.DTOs.AdminDashboardDto;

namespace BusinessService.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }

        public AdminDashboardDto GetAdminDashboardData()
        {

            var oneMonthAgo = DateTime.Now.AddDays(-30);
            var tutorEdu = _context.Tutors
                            .Select(t => new
                            {
                                TutorId = t.TutorId,
                                Education = t.Education,
                            }
                            ).ToList();

            var tutorSpec = _context.TutorSpecialities
                            .Include(t => t.Speciality)
                            .GroupBy(t => t.TutorId)
                            .Select(g => new
                            {
                                TutorId = g.Key,
                                Specialities = g.Select(s => s.Speciality.SpecialityName).ToList()

                            }).ToList();

        var tutors = _context.Tutors
                .Include(t => t.Users)
                .Select(t => new TutorApplicationsDto
                {
                    TutorId = t.TutorId,
                    TutorName = t.Users.FirstName + " " + t.Users.LastName,
                    Status = char.ToUpper(t.Status[0]) + t.Status.Substring(1).ToLower(),
                    ApprovalRequestDate = t.ApprovalRequestDate,
                    Email = t.Users.Email,
                }).ToList();

            //var newt =( from s in  tutorSpec
            //           join t in tutors on s.TutorId equals t.TutorId into joined
            //           from sp in joined.DefaultIfEmpty()
            //           select new TutorApplicationsDto
            //           {
            //               TutorId = sp.TutorId,
            //               TutorName = sp.TutorName,
            //               Status = sp.Status,
            //               ApprovalRequestDate = sp.ApprovalRequestDate,
            //               Email = sp.Email,
            //               Specialities = s != null ? s.Specialities : new List<string>(),
            //           }).ToList();


            var totalTutors = _context.Tutors
                             .Where(x => x.Status.ToLower() == "Approved")
                            .Count();

            var totalStudents = _context.Learners
                           .Count();

            var newStudentsThisMonth = _context.Users
                                .Where(u => u.CreatedDate >= oneMonthAgo && u.Role.ToLower() == "learner")
                                 .Count();

            var sessionIncome = _context.Sessions
                                .Where(s => s.IsPaid == true)
                                .Sum(s => s.SessionFee);


            var totalCourseIncome = _context.Enrollments
                                .Where(e => e.IsPaid)
                                .Select(e => e.Course.Price) 
                                .Sum();


            var monthlyCourseIncome = _context.Enrollments
                                       .Where(e => e.IsPaid && e.EnrolledDate >=oneMonthAgo )
                                       .Select(e => e.Course.Price)
                                       .Sum();

            var monthlySessionIncome = _context.Sessions
                           .Where(s => s.IsPaid == true && s.StartTime >=oneMonthAgo)
                           .Sum(s => s.SessionFee);


            var totalIncome = sessionIncome + totalCourseIncome;
            var monthlyIncome = monthlyCourseIncome + monthlySessionIncome;

            var pendingApprovals = _context.Tutors
                                    .Where(t => t.Status.ToLower() == "pending")
                                    .Count();

            var approvedTutors = _context.Tutors
                                    .Where(t => t.Status.ToLower() == "approved")
                                    .Count();


            var adminDashbaordData = new AdminDashboardDto
            {
                TotalRevenue = totalIncome,
                MonthlyRevenue = monthlyIncome,
                TotalStudents = totalStudents,
                TotalTutors = totalTutors,
                PendingTutorApprovals = pendingApprovals,
                ApprovedTutors = approvedTutors,
                TutorApplications = tutors,
                NewStudentsThisMonth = newStudentsThisMonth




            };

            return adminDashbaordData;
        }



        public string ApproveTutorApplication(Guid tutorId)
        {
            var tutor = _context.Tutors.FirstOrDefault(x => x.TutorId == tutorId);
            if (tutor == null) return "Tutor doesn't exist";

            tutor.Status = "Approved";
            tutor.ApprovedDate = DateTime.Now;
            _context.SaveChanges();

            return "Tutor Approved";


        }

        public string RejectTutorApplication(Guid tutorId)
        {
            var tutor = _context.Tutors.FirstOrDefault(x => x.TutorId == tutorId);
            if (tutor == null) return "Tutor doesn't exist";
            tutor.Status = "Rejected";
            _context.SaveChanges();
            return "Tutor Rejected";
        }

        public List<PaymentApprovalDto> GetPaymentApprovals()
        {
            var payments = (from p in _context.Payments


                            join l in _context.Learners on p.LearnerFk equals l.LearnerId into learnerGroup
                            from l in learnerGroup.DefaultIfEmpty()

                            join u in _context.Users on l.UserFk equals u.UserId into userGroup
                            from u in userGroup.DefaultIfEmpty()

                            select new PaymentApprovalDto
                            {
                                PaymentId = p.PaymentId,
                                PaymentType = p.PaymentType,
                                LearnerName = u != null ? u.FirstName + " " + u.LastName : "Unknown",
                                Status = p.PaymentStatus,
                                PaymentDate = p.PaymentDate,
                                ReferenceNo = p.GatewayRef,
                                PaymentProof = p.PaymentProof,
                                Amount = p.Amount
                            }).ToList();

            return payments;
        }

        public string GetPaymentStatus(Guid paymentId, string status)
        {
   
         var payment = _context.Payments.FirstOrDefault(x => x.PaymentId ==paymentId);
        if (payment !=null){
            payment.PaymentStatus = "Completed";

            if (payment.PaymentType?.ToLower()=="course payment"){
                var enrollment = _context.Enrollments
                                .FirstOrDefault(e => e.LearnerFk == payment.LearnerFk && e.CourseId == payment.CourseFk);

                enrollment.IsPaid = true;
                enrollment.EnrollmentStatus = "Active";
                enrollment.EnrolledDate = DateTime.Now;
                  
                }

                if (payment.PaymentType?.ToLower() == "session booking")
                {
                    var session = _context.Sessions
                                    .FirstOrDefault(s => s.LearnerFk == payment.LearnerFk && s.TutorFk == payment.TutorFk);
                    session.SessionStatus = "Confirmed";
                    session.IsPaid = true;
                  

                }
                _context.SaveChanges();

                return "Payment status updated successfully.";
            }
      


            return "Payment status update unsuccessful";

        }
    }
          
}
