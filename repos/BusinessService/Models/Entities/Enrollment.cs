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
        public Guid EnrolmentId { get; set; }

        [ForeignKey("LearnerProfile")]
        public Guid LearnerId { get; set; }
        public required Learner Learner { get; set; }

        [ForeignKey("Course")]
        public Guid CourseId { get; set; }
        public required Course Course { get; set; }

        [ForeignKey("TutorProfile")]
        public Guid TutorId { get; set; }
        public required Tutor Tutor { get; set; }

        public bool FeePayment { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public required string Status { get; set; }
    }

}
