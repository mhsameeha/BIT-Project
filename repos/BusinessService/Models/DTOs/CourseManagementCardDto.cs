using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class CourseManagementCardDto
    {
        public int TotalNumberOfCourses { get; set; }
        public int TotalNumberOfEnabledCourse { get; set; }

        public int NumberofStudentsEnrolled { get; set; }

        public decimal AverageCourseRating { get; set; }
    }
}
