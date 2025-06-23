using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class LoginResponseDto
    {
        public Guid UserId { get; set; }
        public required string Role { get; set; }

        public long currentUser { get; set; }



    }
}
