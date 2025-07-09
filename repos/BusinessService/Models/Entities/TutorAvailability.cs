using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessService.Models.Entities
{

public class TutorAvailability
    {
        [Key]
        [Column("availabilityId")]
        public Guid AvailabilityId { get; set; }
        [Column("tutorFk")]
        public Guid? TutorFk { get; set; }
        [Column("availableDate")]
        public DateTime? AvailableDate { get; set; }
        [Column("timeslotFk")]
        public Guid? TimeslotFk { get; set; }
    }

}

