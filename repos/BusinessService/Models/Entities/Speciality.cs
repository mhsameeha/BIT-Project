using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessService.Models.Entities
{
 
        public class Speciality
        {
        [Key]
        [Column("specialityId")]
        public Guid SpecialityId { get; set; }
        [Column("speciality")]
        public string? SpecialityName { get; set; }
    }
}
