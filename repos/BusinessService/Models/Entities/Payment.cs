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
            [Column("paymentId")]
            public Guid PaymentId { get; set; } 
            [Column("paymentType")]
            public string? PaymentType { get; set; }
        [ForeignKey("Tutor")]
        [Column("tutorFk")]
            public Guid? TutorFk { get; set; }
            [Column("learnerFk")]
        [ForeignKey("Learner")]
        public Guid? LearnerFk { get; set; }
            [Column("amount")]
            public decimal? Amount { get; set; }
            [Column("currency")]
            public string? Currency { get; set; }
            [Column("paymentStatus")]
            public string? PaymentStatus { get; set; }
            [Column("paymentDate")]
            public DateTime? PaymentDate { get; set; }
            [Column("gatewayRef")]
            public string? GatewayRef { get; set; }
            [Column("courseFk")]
            public Guid? CourseFk { get; set; }
            [Column("paymentProof")]
            public byte[]? PaymentProof { get; set; }

        public virtual Tutor Tutor { get; set; }
        public virtual Learner Learner { get; set; }


    }
}
