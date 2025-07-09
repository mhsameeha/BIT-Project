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
        public string? CourseDifficulty { get; set; }
        public string? CategoryName { get; set; }
        public decimal? Price { get; set; }

        public string? Title { get; set; }
        public string? Introduction { get; set; }
        public DateTime? UpdatedDate { get; set; }


        //aggregate functions
        public TimeSpan Duration { get; set; }
        public decimal? Rating { get; set; }

        public int EnrolledStudents { get; set; }

        public int ReviewCount { get; set; }

        public int Sections { get; set; }
    
    }
}
