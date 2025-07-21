using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class NewStudentsDto
    {
        public Guid LearnerId { get; set; }

        public string? LearnerName { get; set; }

        public string? CourseTitle { get; set; }

        public byte[]? LearnerProfPic { get; set; }

        public int? enrolledDay { get; set; }
    }
}
