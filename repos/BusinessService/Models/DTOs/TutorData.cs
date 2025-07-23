using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class TutorData

    {

        public string? Name { get; set; }
        public DateTime? Dob { get; set; }

        [EmailAddress]
        public required string Email { get; set; }

        public byte[]? TutorProfPic { get; set; }
        public string? TutorDescription { get; set; }
        public decimal? TutorRate { get; set; }
        public decimal? Rating { get; set; }

        public int SessionsCompleted { get; set; }

        public string? Status { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public string? Experience { get; set; }
        public string? Education { get; set; }

        public Guid UserFk { get; set; }
        public string[]? Language { get; set; }

        public string? AllDay { get; set; }

        public List<TutorAvailabilityDto>? Availability { get; set; }

    }
    public class TutorAvailabilityDto
        {public string Day { get; set; }

        public ICollection<TutorTimeSlot>? TimeSlots { get; set; }
    }


    
}
