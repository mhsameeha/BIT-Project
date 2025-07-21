using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessService.Models.Entities
{
    public class TutorTimeSlot
    {
        [Key]
        [Column("timeslotId")]
        public Guid TimeslotId { get; set; }

        [Column("availabilityFk")]
        public Guid AvailabilityId { get; set; }

        [Column("starttime")]
        public string Starttime { get; set; }

        [Column("endtime")]
        public string Endtime { get; set; }

        // ✅ Properly defined navigation property with ForeignKey attribute
        [ForeignKey("AvailabilityId")]
        public TutorWeeklyAvailability? WeeklyAvailability { get; set; }


    }

}

