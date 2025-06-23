using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class Course
    {
        [Key]
        public Guid CourseId { get; set; }

        public required string CourseName { get; set; }
        public decimal Fee { get; set; }

        [ForeignKey("TutorProfile")]
        public Guid TutorFk { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? PublishedDate { get; set; }

        [ForeignKey("Category")]
        public Guid CategoryFk { get; set; }
        public Category? Category { get; set; }

        public required string Status { get; set; }

        //public ICollection<Enrollment> Enrollments { get; set; }
    }

}
