using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class AvailabilityDto
    {

        public string Day { get; set; }

        public bool IsAvailable { get; set; }

        public bool AllDay { get; set; }

        public ICollection<TutorTimeSlot> TimeSlots { get; set; }
    }

    public class TutorTimeSlotDto
    {

        public string Starttime { get; set; }

        public string Endtime { get; set; }
    }

    public class TutorAvailabilitySettingsDto
    {
        public List<string> DisabledDates { get; set; }
        public List<AvailabilityDto> WeeklySchedule { get; set; }
    }
}
