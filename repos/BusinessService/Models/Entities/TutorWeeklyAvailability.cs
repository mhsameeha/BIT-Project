using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace BusinessService.Models.Entities
{

    public class TutorWeeklyAvailability
    {
        [Key]
        [Column("availabilityId")]
        public Guid AvailabilityId { get; set; }

        [Column("tutorFk")]
        public Guid? TutorId { get; set; }

        [Column("day")]
        public string Day { get; set; }

        [Column("isAvailable")]
        public bool IsAvailable { get; set; }

        [Column("allDay")]
        public bool AllDay { get; set; }

        // ✅ EF will understand this is the inverse of the FK in TutorTimeSlot
        public ICollection<TutorTimeSlot> TimeSlots { get; set; }
    }

}

