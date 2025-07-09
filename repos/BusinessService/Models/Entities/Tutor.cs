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

        public Guid TutorId { get; set; }

        public string? TutorDescription { get; set; }

        public decimal? TutorRating { get; set; }
        public string? Status { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public DateTime? ApprovalRequestDate { get; set; }

        public string? TutorProfPic { get; set; }
        public string? Experience { get; set; }
        public string? Education { get; set; }
        public Guid UserFk { get; set; }
        public string? Language {get; set;}


    }
}

