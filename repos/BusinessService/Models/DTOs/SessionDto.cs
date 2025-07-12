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
        public Guid SessionId { get; set; }
        public  string? SessionName { get; set; }

        public string? LearnerProfPic { get; set; }
        public string? LearnerName { get; set; }
        //public required Learner Learner { get; set; }

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public decimal TutorRate { get; set; }

  

        
        
    }
}
