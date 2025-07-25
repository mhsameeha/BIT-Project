using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class SessionByTutorDto
    {
        public Guid SessionId { get; set; }

        public string SessionName { get; set; }
        public string LearnerName { get; set; }

        public string LearnerEmail { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public TimeSpan Duration { get; set; }
        public byte[]? LearnerProfPic { get; set; }

        public string SessionStatus { get; set; }

        public string SessionStatusInfo { get; set; }

        public decimal? Cost { get; set; }


        public bool? IsPaid { get; set; }

        public string SessionLink { get; set; }

        public string? RequestMessage { get; set; }

        public string? RejectionReason { get; set; }
    }
}
