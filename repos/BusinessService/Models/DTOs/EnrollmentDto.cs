using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class EnrollmentDto
    {
        public string? CourseName { get; set; }
        public Guid EnrollmentId { get; set; }
        public Guid CourseId { get; set; }
        public string? EnrollmentStatus { get; set; }
        public DateTime EnrolledDate { get; set; }
        public bool IsPaid { get; set; }
        public string? PaymentStatus { get; set; }
    }
}
