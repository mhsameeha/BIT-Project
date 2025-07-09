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
        public Guid ContentId { get; set; }
        public Guid CourseFk { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }
        public TimeSpan? Duration { get; set; } 

        public int SortOrder { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime UpdatedDate { get; set; }

        public string? SubContent { get; set; }

        public string? Tags { get; set; }
    }
}
