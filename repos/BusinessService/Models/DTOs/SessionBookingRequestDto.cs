using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class SessionBookingRequestDto
    {
        public Guid TutorId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string SessionName { get; set; } = string.Empty;
        public decimal SessionFee { get; set; }
        public string? Currency { get; set; }
        public string? TransactionReference { get; set; }
        public IFormFile? PaymentProof { get; set; }
        public string? RequestMessage { get; set; }
    }

    public class SessionBookingResponseDto
    {
        public Guid SessionId { get; set; }
        public Guid PaymentId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string SessionStatus { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
    }
}
