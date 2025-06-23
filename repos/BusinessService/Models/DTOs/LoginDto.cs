using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class LoginDto
    {
        [EmailAddress]
        public required string Email { get; set; }

        public required string Password { get; set; }
    }
}
