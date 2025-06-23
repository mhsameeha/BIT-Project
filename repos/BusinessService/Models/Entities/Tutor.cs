using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

namespace BusinessService.Models.Entities
{
   
        public class Tutor
        {
            [Key]
            public Guid TutorId { get; set; }

        [ForeignKey("User")]
            public Guid UserFk { get; set; }
            //public  User User { get; set; }

            public string ? ApprovalStatus  { get; set; }
            public DateTime? ApprovalDate { get; set; }

            //public ICollection<Course> Courses { get; set; }
            //public ICollection<Enrollment> Enrollments { get; set; }
            //public ICollection<Session> Sessions { get; set; }
        }

    }

