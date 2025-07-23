using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class SubContent
    {
        [Key]
        [Column("subContentId")]
        public Guid? SubContentId { get; set; } = Guid.NewGuid();

        [Column("subContentTitle")]
        public string? SubContentTitle { get; set; }

        [Column("subContentDescription")]
        public string? SubContentDescription { get; set; }
        [Column("contentFk")]
        public Guid? ContentId { get; set; }
        [ForeignKey("ContentId")]
        public CourseContent? CourseContent { get; set; }

        [Column("type")]
        public string? Type { get; set; }

        [Column("videoFile")]
        public byte[]? VideoFile { get; set; }

        [Column("documentFile")]
        public byte[]? DocumentFile { get; set; }
        [Column ("subContentOrder")]
        public int? SubContentOrder {  get; set; }

    }

   
}
