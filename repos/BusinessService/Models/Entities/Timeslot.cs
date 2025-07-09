using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class Timeslot
    {
        [Key]
        public Guid TimeslotId { get; set; }

        public TimeSpan? Time { get; set; }

        public bool isActive { get; set; }
    }

}

