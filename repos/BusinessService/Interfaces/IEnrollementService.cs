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

        public List<EnrollmentsByTutorDto> GetEnrollmentsByTutor(string email);
    }
}
