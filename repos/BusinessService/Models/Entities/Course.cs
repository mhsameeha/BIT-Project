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
        [Column("courseId")]
        public Guid CourseId { get; set; }

        [Column("tutorFk")]
        public Guid TutorFk { get; set; }
        [Column("price")]
        public decimal? Price { get; set; }
        [Column("title")]
        public string? Title { get; set; }
        [Column("introduction")]
        public string? Introduction { get; set; }
        [Column("description")]
        public string? Description { get; set; }
        [Column("courseDifficultyFk")]
        public Guid? CourseDifficultyFk { get; set; }
        [Column("categoryFk")]
        public Guid? CategoryFk { get; set; }
        [Column("createdDate")]
        public DateTime? CreatedDate { get; set; }
        [Column("updatedDate")]
        public DateTime? UpdatedDate { get; set; }
        [Column("publishedDate")]
        public DateTime? PublishedDate { get; set; }
        [Column("isEnabled")]
        public bool IsEnabled { get; set; } = false;
        [Column("courseImage")]
        public byte[]? CourseImage {  get; set; }
        [Column("languageFk")]
        public Guid LanguageFk { get; set; }
    }
}
