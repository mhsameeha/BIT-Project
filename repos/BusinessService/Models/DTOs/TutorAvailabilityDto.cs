using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class TutorAvailabilityDto
    {
        public string Day { get; set; }
        public List<string> TimeSlots { get; set; } = new List<string>();
    }

    public class TutorDateAvailabilityDto
    {
        public DateTime Date { get; set; }
        public string DayOfWeek { get; set; }
        public List<string> TimeSlots { get; set; } = new List<string>();
    }

    public class TutorAvailabilityResponseDto
    {
        public Guid TutorId { get; set; }
        public List<TutorAvailabilityDto> Availability { get; set; } = new List<TutorAvailabilityDto>();
        public List<TutorDateAvailabilityDto> DateAvailability { get; set; } = new List<TutorDateAvailabilityDto>();
    }
}
