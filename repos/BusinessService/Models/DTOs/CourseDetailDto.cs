using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class CourseDetailDto
    {
        public Guid CourseId { get; set; }

        public string? CourseName { get; set; }
        public decimal Fee { get; set; }
        //public Guid TutorFk { get; set; }

        //public DateTime CreatedDate { get; set; }
        //public DateTime? UpdatedDate { get; set; }
        public DateTime? PublishedDate { get; set; }
        public required string CategoryName { get; set; }
        public required string CourseIntro { get; set; }


    }
}
