using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessService.Models.DTOs
{
    public class NewLearnerUserDto
    {

        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public  DateTime? Dob { get; set; }

        [EmailAddress]
        public required string Email { get; set; }

        public required string Password { get; set; }
        public required string Role { get; set; }


    }

   
}
