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
        [Column("contentId")]
        public Guid ContentId { get; set; }
        [Column("courseFk")]
        public Guid CourseFk { get; set; }
        [Column("title")]
        public string? Title { get; set; }
        [Column("description")]
        public string? Description { get; set; }
        [Column("duration")]
        public TimeSpan? Duration { get; set; }
        [Column("sortOrder")]
        public int SortOrder { get; set; }
        [Column("isActive")]
        public bool IsActive { get; set; }
        [Column("createdDate")]
        public DateTime CreatedDate { get; set; }
        [Column("updatedDate")]
        public DateTime UpdatedDate { get; set; }
        [Column("subContent")]
        public string? SubContent { get; set; }
        [Column("tags")]
        public string? Tags { get; set; }
    }
}
