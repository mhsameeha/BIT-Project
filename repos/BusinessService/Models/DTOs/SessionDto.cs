using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class SessionDto
    {
        public required string SessionName { get; set; }

        public required string LearnerName { get; set; }
        //public required Learner Learner { get; set; }

        public DateTime? SessionTime { get; set; }
        public TimeOnly? Duration { get; set; }

       

        
        
    }
}
