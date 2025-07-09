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
        [Column("enrollmentId")]
        public Guid EnrollmentId { get; set; }
        [Column("courseFk")]
        public Guid? CourseFk { get; set; }
        [Column("learnerFk")]
        public Guid? LearnerFk { get; set; }
        [Column("isPaid")]
        public bool IsPaid { get; set; } = false;
        [Column("enrolledDate")]
        public DateTime? EnrolledDate { get; set; }
        [Column("enrollmentStatus")]
        public string? EnrollmentStatus { get; set; }
    }

}

