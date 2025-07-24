using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class TutorDetailDto
    {
        public Guid TutorId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? TutorName { get; set; }
        public string? TutorDescription { get; set; }
        public decimal? TutorRate { get; set; }
        public string? Status { get; set; }
        public string? Experience { get; set; }
        public string? Education { get; set; }
        public string[]? Language { get; set; }
        public List<string> Specialities { get; set; } = new List<string>();
        public bool HasAvailableTimeSlots { get; set; }
    }
}
