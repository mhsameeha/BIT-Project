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
        public Guid? ContentId { get; set; } = Guid.NewGuid();

        [Column("courseFk")]
        public Guid CourseId { get; set; }
        [Column("contentTitle")]
        public required string ContentTitle { get; set; }
        [Column("contentDescription")]
        public string? ContentDescription { get; set; }
        [Column("contentDuration")]
        public string? ContentDuration { get; set; }
        [Column("contentSortOrder")]
        public int ContentSortOrder { get; set; }
        [Column("isActive")]
        public bool IsActive { get; set; }
        [Column("createdDate")]
        public DateTime? CreatedDate { get; set; }
        [Column("updatedDate")]
        public DateTime? UpdatedDate { get; set; }

        public ICollection<SubContent> SubContent { get; set; } = new List<SubContent>();

    }
}
