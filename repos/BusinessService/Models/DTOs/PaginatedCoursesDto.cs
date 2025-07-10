using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Models.DTOs
{
    public class PaginatedCoursesDto
    {
        public int TotalItems { get; set; }
        public int Page { get; set; }

        public int PageSize { get; set; }

        public IEnumerable<CourseDetailDto> Courses { get; set; } = new List<CourseDetailDto>();

    }
}
