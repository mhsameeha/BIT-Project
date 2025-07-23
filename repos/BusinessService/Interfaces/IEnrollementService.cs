using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.DTOs;

namespace BusinessService.Interfaces
{
    public interface IEnrollementService
    {
        public List<EnrollmentDto> GetEnrolledCourses(Guid learnerid);
        public Task<PaymentResponseDto> ProcessPaymentAsync(PaymentDto paymentDto, string userEmail);
        public Task<List<EnrollmentDto>> GetEnrollmentsByLearnerEmailAsync(string userEmail);
        public Task<EnrollmentDto?> GetCourseEnrollmentStatusAsync(string userEmail, Guid courseId);
    }
}
