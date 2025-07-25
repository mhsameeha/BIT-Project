using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.DTOs;

namespace BusinessService.Interfaces
{
    public interface IAdminService
    {
        public AdminDashboardDto GetAdminDashboardData();

        public string ApproveTutorApplication(Guid tutorId);

        public string RejectTutorApplication(Guid tutorId);

        public List<PaymentApprovalDto> GetPaymentApprovals();

        public string GetPaymentStatus(Guid paymentId, string status);

        byte[]? GetPaymentProofFile(Guid paymentId);
        
        List<MonthlyEarningsDto> GetMonthlyEarnings(DateTime startDate, DateTime endDate);
    }
}
