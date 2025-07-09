using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{

        public class Payment
        {
            [Key]
            public Guid PaymentId { get; set; } 


            public string? PaymentType { get; set; }

            public Guid? TutorFk { get; set; }
            public Guid? LearnerFk { get; set; }

     
            public decimal? Amount { get; set; }


            public string? Currency { get; set; }


            public string? PaymentStatus { get; set; }

            public DateTime? PaymentDate { get; set; }

            public string? GatewayRef { get; set; }

            public Guid? CourseFk { get; set; }

       
    }
}
