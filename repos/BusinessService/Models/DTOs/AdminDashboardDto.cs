using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class AdminDashboardDto
    {
        public int TotalStudents { get; set; }

        public int TotalTutors { get; set; }


        public int PendingTutorApprovals { get; set; }

        public int ApprovedTutors { get; set; }

        public decimal TotalRevenue { get; set; }

        public decimal MonthlyRevenue { get; set; }

        public int NewStudentsThisMonth { get; set; }

        public List<TutorApplicationsDto>? TutorApplications { get; set; }
        public class TutorApplicationsDto
{
        public List<string>? Specialities;

        public Guid? TutorId { get; set; }
        public string? TutorName { get; set; }

        public string? Status { get; set; }

        public string? Email { get; set; }
         public DateTime? ApprovalRequestDate { get; set; }



    }
    }
}
