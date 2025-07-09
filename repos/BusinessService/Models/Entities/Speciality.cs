using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
 
        public class Speciality
        {
        [Key]
        public Guid SpecialityId { get; set; }


            public string? SpecialityName { get; set; }


        
    }
}
