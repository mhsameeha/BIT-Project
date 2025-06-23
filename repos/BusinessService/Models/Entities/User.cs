using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class User
    {
            [Key]
            public Guid Id { get; set; }
            public required string FirstName { get; set; }

        public required string LastName { get; set; }
             public required DateTime DOB { get; set; }


        [EmailAddress]
            public required string Email { get; set; }

            public required string PasswordHash { get; set; }
            public required string Role { get; set; }

            public DateTime CreatedDate { get; set; }
            public bool IsActive { get; set; }
            public bool IsDeleted { get; set; }

           // public required LearnerProfile Learner { get; set; }
           // public required TutorProfile Tutor { get; set; }
           //public required AdminProfile Admin { get; set; }


    }
}
