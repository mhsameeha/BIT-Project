using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class AddCourseDto
    {
        public required string CourseName {get; set;}
        public required string CourseDescription {get; set;}
        public required decimal Price {get; set;}
        public required string Category {get; set;}


    }
}
