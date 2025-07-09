using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class Session
    {
        [Key]

        public Guid SessionId { get; set; }

        public string? SessionName { get; set; }
        public string? SessionLink { get; set; }

        public Guid? LearnerFk { get; set; }
        public Guid? TutorFk { get; set; }

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? AdditionalInfo { get; set; }

        public string? SessionStatus { get; set; }
        public string? SessionStatusInfo { get; set; }




    }

}