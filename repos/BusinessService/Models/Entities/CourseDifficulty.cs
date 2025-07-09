using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{


public class CourseDifficulty
    {
        [Key]
        public Guid CourseDifficultyId { get; set; }

        public string? CourseDifficultyName { get; set; }

  
    }

}
