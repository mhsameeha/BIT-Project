using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class CourseContent
    {
        [Key]
        public Guid CourseContentId { get; set; } = Guid.NewGuid();

        [MaxLength(255)]
        public required string CourseDescription { get; set; }

        [MaxLength(100)]
        public required string BriefIntro { get; set; }

        [MaxLength(255)]
        public string? Resources { get; set; }

        [MaxLength(255)]
        public string? CourseLink { get; set; }

        // Foreign key
        [ForeignKey("CourseId")]
        public Guid CourseId { get; set; }
        public Course? Course { get; set; }
    }
}
