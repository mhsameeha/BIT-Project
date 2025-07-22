using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class PaymentRequestDto
    {
        public Guid CourseId { get; set; }
        public decimal Amount { get; set; }
        public string? Currency { get; set; }
        public string? TransactionReference { get; set; }
        public IFormFile? PaymentProof { get; set; }
    }
}
