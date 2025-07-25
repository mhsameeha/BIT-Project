using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
        public class PaymentApprovalDto
        {
    
            public Guid PaymentId { get; set; } 
            public string? PaymentType { get; set; }
            public string? LearnerName { get; set; }
            public string? Status { get; set; }
            public DateTime? PaymentDate { get; set; }
            public string? ReferenceNo { get; set; }
            public byte[]? PaymentProof { get; set; }

    }
}
