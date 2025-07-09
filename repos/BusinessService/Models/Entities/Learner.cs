using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BusinessService.Models.Entities
{

public class Learner
    {
        [Key]
        public Guid LearnerId { get; set; }

        public string? LearnerProfPic { get; set; }

        public Guid UserFk { get; set; }

    }

}

