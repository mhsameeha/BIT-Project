using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessService.Models.Entities
{
    public class Language
    {
        [Key]
        [Column("languageId")]
        public Guid LanguageId { get; set; }
        [Column("languages")]
        public string? Languages { get; set; }
        [Column("isActive")]
        public bool IsActive { get; set; }
    }
}
