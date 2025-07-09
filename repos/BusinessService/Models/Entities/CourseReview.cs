using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessService.Models.Entities
{
    public class CourseReview
    {
        [Key]
        [Column("courseReviewId")]
        public Guid CourseReviewId { get; set; }
        [Column("Review")]
        public string? Review { get; set; }
        [Column("learnerFk")]
        public Guid LearnerFk { get; set; }
        [Column("courseFk")]
        public Guid? CourseFk { get; set; }
        [Column("rating")]
        public decimal? Rating { get; set; }
    }

}

