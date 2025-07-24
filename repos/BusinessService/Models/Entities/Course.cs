using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.DTOs;

namespace BusinessService.Models.Entities
{
    [Table("Courses")]
    public class Course
    {
        [Key]
        [Column("courseId")]
        public Guid CourseId { get; set; }

        [Column("tutorFk")]
        public Guid TutorId { get; set; }
        [Column("price")]
        public decimal Price { get; set; }
        [Column("title")]
        public string? Title { get; set; }
        [Column("introduction")]
        public string? Introduction { get; set; }
        [Column("description")]
        public string? Description { get; set; }
        [Column("courseDifficultyFk")]
        public Guid? CourseDifficultyId { get; set; }
        [Column("categoryFk")]
        public Guid? CategoryId { get; set; }
        [Column("createdDate")]
        public DateTime? CreatedDate { get; set; }
        [Column("updatedDate")]
        public DateTime? UpdatedDate { get; set; }
        [Column("publishedDate")]
        public DateTime? PublishedDate { get; set; }
        [Column("isEnabled")]
        public bool? IsEnabled { get; set; } = false;
        [Column("courseImage")]
        public byte[]? CourseImage {  get; set; }
        [Column("languageFk")]
        public Guid? LanguageFk { get; set; }
        [Column("tags")]
        public List<string>? Tags { get; set; }
        [Column("isDeleted")]
        public bool? IsDeleted { get; set; } = false;

        [Column("currency")]
        public string? Currency { get; set; }
        public Category? Category { get; set; }
        public CourseDifficulty? CourseDifficulty { get; set; }
        public ICollection<CourseContent> CourseContent { get; set; } = new List<CourseContent>();
        public List<Enrollment> Enrollment { get; set; }
    }
}
