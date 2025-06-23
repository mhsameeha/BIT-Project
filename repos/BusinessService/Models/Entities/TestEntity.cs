

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BusinessService.Models.Entities
{
    public class TestEntity
    {
        [Key]
        public int TestID { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }

        public required string Password { get; set; }

    }
}
