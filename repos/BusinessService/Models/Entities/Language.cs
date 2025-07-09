using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class Language
    {
        [Key]
        public Guid LanguageId { get; set; }

        public string? Languages { get; set; }

        public bool IsActive { get; set; }
    }
}
