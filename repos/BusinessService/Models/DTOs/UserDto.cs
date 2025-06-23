using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public required string FirstName { get; set; }
        public required string LastName { get; set; }

        public required DateTime DOB { get; set; }

        [EmailAddress]
        public required string Email { get; set; }

        public required string Password { get; set; }
        public required string Role { get; set; }

    }
}
