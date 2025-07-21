using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class TutorDisabledDate
    {
        [Key]
        public Guid DisabledDateId { get; set; }
        [ForeignKey("Tutors")]
        [Column("tutorFk")]
        public Guid TutorId { get; set; }
        [Column("disabledDate")]
        public string DisabledDate { get; set; }


    }
}
