using System.ComponentModel.DataAnnotations;

namespace SpendSmart.Models
{
    public class Learners
    {
        [Key]
        public int learnerId { get; set; }
        required
        public String firstName { get; set; }
        required

        public String lastName { get; set; }
        required

        public String email { get; set; }
        required

        public String password { get; set; }


    }
}
