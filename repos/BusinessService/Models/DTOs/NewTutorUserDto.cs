using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class NewTutorUserDto
    {


            public string? FirstName { get; set; }
            public string? LastName { get; set; }

            public DateTime? Dob { get; set; }

            [EmailAddress]
            public required string Email { get; set; }

            public required string Password { get; set; }
            public required string Role { get; set; }

            public NewTutorDto? NewTutor { get; set; }


        public class NewTutorDto
        {

            public string? TutorDescription { get; set; }
            public decimal? TutorRate { get; set; }

            public string? Status { get; set; }

            public DateTime? ApprovalRequestDate { get; set; }

            public string[]? Experience { get; set; }

            public string[]? Education { get; set; }
            public Guid UserFk { get; set; }
            public string[]? Language { get; set; }

        }
    }
}
