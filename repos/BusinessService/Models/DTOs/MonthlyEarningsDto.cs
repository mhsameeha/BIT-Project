using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class MonthlyEarningsDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal SessionEarnings { get; set; }
        public decimal CourseEarnings { get; set; }
        public decimal TotalEarnings { get; set; }
        public int Year { get; set; }
        public int MonthNumber { get; set; }
    }
}
