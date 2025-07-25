using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class SessionStatusDto
    {
        public Guid SessionId { get; set; }

        public string? SessionStatus { get; set; }

        public string? RejectionReason { get; set; }


    }
}
