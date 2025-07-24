using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class EnrollmentsByTutorDto
    {
        public Guid EnrollmentId { get; set; }
        public string? LearnerName { get; set; }

        public byte[]? LearnerProfPic { get; set; }

        public Guid? CourseId { get; set; }

        public string? CourseName { get; set; }

        public decimal CoursePrice { get; set; }


        public DateTime? EnrolledDate { get; set; }

        public string? EnrollmentStatus { get; set; }
    }
}
