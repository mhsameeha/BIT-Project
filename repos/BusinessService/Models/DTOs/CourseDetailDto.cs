using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class CourseDetailDto
    {
        [Key]

        public Guid CourseId { get; set; }

        public string? TutorName { get; set; }

        public Guid TutorFk { get; set; }
        public  string? CourseDifficulty { get; set; }
        public string? CategoryName { get; set; }
        public decimal? Price { get; set; }

        public string? Title { get; set; }
        public string? Introduction { get; set; }
        public string? Description { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public byte[]? CourseImage { get; set; }
        //aggregate functions
        public string? Duration { get; set; }
        public decimal? Rating { get; set; }

        public string? Language { get; set; }

        public int EnrolledStudents { get; set; }

        public int ReviewCount { get; set; }

        public int Sections { get; set; }
        public bool isEnabled { get; set; }
        public string? ContentTitle { get; set; }
        public string? ContentDescription { get; set; }

        public int SortOrder { get; set; }

        public string? contentDuration { get; set; }

        public string? SubContent { get; set; }
        public string? Tags { get; set; }








    }
}
