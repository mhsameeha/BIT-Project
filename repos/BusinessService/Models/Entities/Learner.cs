using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BusinessService.Models.Entities
{

public class Learner
    {
        [Key]
        [Column("learnerId")]
        public Guid LearnerId { get; set; }
        [Column("learnerProfPic")]
        public string? LearnerProfPic { get; set; }
        [Column("UserFk")]
        public Guid UserFk { get; set; }
    }

}

