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

        [ForeignKey("Tutor")]
        public Guid TutorId { get; set; }
        public required Tutor Tutor { get; set; }

        [ForeignKey("Learner")]
        public Guid LearnerId { get; set; }
        public required Learner Learner { get; set; }

        public DateTime? SessionTime { get; set; }
        public TimeOnly? Duration { get; set; }

        public required string Status { get; set; }

        public required string SessionName { get; set; }
        public string? RecordingUrl { get; set; }
    }

}