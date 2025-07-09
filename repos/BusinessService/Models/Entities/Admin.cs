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
        [Column("adminId")]
        public Guid AdminId { get; set; }

        [Column("userFk")]
        public Guid UserFk { get; set; }

}

}
