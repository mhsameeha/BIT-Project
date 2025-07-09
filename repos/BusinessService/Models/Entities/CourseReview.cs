using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class CourseReview
    {
        [Key]
        public Guid CourseReviewId { get; set; }

        public string? Review { get; set; }

        public Guid LearnerFk { get; set; }
        public Guid? CourseFk { get; set; }

        public decimal? Rating { get; set; }

    }

}

