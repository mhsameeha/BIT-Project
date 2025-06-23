using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BusinessService.Models.Entities
{
    public class Learner
    {
        //[JsonIgnore]
            [Key]
            public Guid LearnerId { get; set; }

        [ForeignKey("User")]
        public Guid UserFk { get; set; }

       //public  User User { get; set; }

           
        

        //public string Status { get; set; } = "Active";
    }
}
