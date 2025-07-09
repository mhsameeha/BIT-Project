using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessService.Models.Entities
{
    public class Timeslot
    {
        [Key]
        [Column("timeslotId")]
        public Guid TimeslotId { get; set; }
        [Column("times")]
        public TimeSpan? Time { get; set; }
        [Column("isActive")]
        public bool isActive { get; set; }
    }

}

