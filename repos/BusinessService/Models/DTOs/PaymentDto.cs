using System;

namespace BusinessService.Models.DTOs
{
    public class PaymentDto
    {
        public Guid CourseId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "LKR";
        public string? TransactionReference { get; set; }
        public byte[]? PaymentProof { get; set; }
        public string PaymentType { get; set; } = "BankTransfer";
        public Guid TutorFk { get; set; }
    }

    public class PaymentResponseDto
    {
        public Guid PaymentId { get; set; }
        public Guid EnrollmentId { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public DateTime PaymentDate { get; set; }
        public string Message { get; set; } = "Payment submitted successfully. Your enrollment will be processed once payment is verified.";
    }
}
