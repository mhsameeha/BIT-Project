using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{

public class TutorAvailability
    {
        [Key]
        public Guid AvailabilityId { get; set; }

        public Guid? TutorFk { get; set; }
        public DateTime? AvailableDate { get; set; }
        public Guid? TimeslotFk { get; set; }


    }

}

