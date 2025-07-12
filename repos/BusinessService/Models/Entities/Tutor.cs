using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

namespace BusinessService.Models.Entities
{

    public class Tutor
    {
        [Key]
        [Column("tutorId")]

        public Guid TutorId { get; set; }
        [Column("tutorDescription")]
        public string? TutorDescription { get; set; }
        [Column("tutorRate")]
        public decimal TutorRate { get; set; }
        [Column("status")]
        public string? Status { get; set; }
        [Column("approvedDate")]
        public DateTime? ApprovedDate { get; set; }
        [Column("approvalRequestDate")]
        public DateTime? ApprovalRequestDate { get; set; }
        [Column("tutorProfPic")]
        public string? TutorProfPic { get; set; }
        [Column("experience")]
        public string? Experience { get; set; }
        [Column("education")]
        public string? Education { get; set; }
        [Column("userFk")]
        public Guid UserFk { get; set; }
        [Column("language")]
        public string? Language {get; set;}


    }
}

