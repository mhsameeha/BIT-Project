using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class TutorDashboardDataDto
    {
        public decimal MonthylCourseIncome { get; set; }
        public decimal MonthlySessionIncome { get; set; }

        public decimal MonthlyIncome { get; set; }

        public int NewStudents { get; set; }


    }
}
