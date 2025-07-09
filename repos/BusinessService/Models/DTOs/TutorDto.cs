using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class TutorDto
    {
        public Guid TutorId { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? TutorName { get; set; }

        public string? Status { get; set; }
    }
}
