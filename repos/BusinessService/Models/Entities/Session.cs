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
        [Column("sessionId")]
        public Guid SessionId { get; set; }
        [Column("sessionName")]
        public string? SessionName { get; set; }
        [Column("sessionLink")]
        public string? SessionLink { get; set; }
        [Column("learnerFk")]
        public Guid? LearnerFk { get; set; }
        [Column("tutorFk")]
        public Guid? TutorFk { get; set; }
        [Column("startTime")]
        public DateTime? StartTime { get; set; }
        [Column("endTime")]
        public DateTime? EndTime { get; set; }
        [Column("additionalInfo")]
        public string? AdditionalInfo { get; set; }
        [Column("sessionStatus")]
        public string? SessionStatus { get; set; }
        [Column("sessionStatusInfo")]
        public string? SessionStatusInfo { get; set; }
    }

}