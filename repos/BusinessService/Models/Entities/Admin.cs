using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class Admin
    {
        [Key]
        public long AdminId { get; set; }

        [ForeignKey("User")]
        public Guid UserFk { get; set; }
        
        public required User User { get; set; }
    }

}
