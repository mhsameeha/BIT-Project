using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.DTOs
{
    public class TutorDetailsDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }


        public DateTime? DOB { get; set; }

        public string Status { get; set; }

        public decimal? TutorRate { get; set; }

        public byte[] TutorProfPic { get; set; }
    }
}
