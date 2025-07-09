using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class Enrollment
    {
        [Key]

        public Guid EnrollmentId { get; set; }

        public Guid? CourseFk { get; set; }
        public Guid? LearnerFk { get; set; }

        public bool IsPaid { get; set; } = false;

        public DateTime? EnrolledDate { get; set; }


        public string? EnrollmentStatus { get; set; }


    }

}

