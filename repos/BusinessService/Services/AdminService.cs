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
            var tutors = _context.Users
                        .Include(t => t.Tutor)
                        .Where(t => t.Tutor.Status.ToLower() == "pending")
                        .Select(g => new RecentTutorApplicationsDto
                        {
                            TutorId = g.Tutor.TutorId,
                            TutorName = g.FirstName + ' ' + g.LastName,
                            Status = g.Tutor.Status,
                            ApprovalRequestDate = g.Tutor.ApprovalRequestDate
                        })
                     .ToList();

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
                RecentTutorApplications = tutors,
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
    }
          
}
