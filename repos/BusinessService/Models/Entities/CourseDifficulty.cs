using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessService.Models.Entities
{


public class CourseDifficulty
    {
        [Key]
        [Column("courseDifficultyId")]
        public Guid CourseDifficultyId { get; set; }
        [Column("courseDifficultyName")]
        public string? CourseDifficultyName { get; set; }
    }

}
