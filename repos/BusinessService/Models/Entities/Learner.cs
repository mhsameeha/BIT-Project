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
        public byte[]? LearnerProfPic { get; set; }
        [Column("UserFk")]
        public Guid UserFk { get; set; }
    }

}

