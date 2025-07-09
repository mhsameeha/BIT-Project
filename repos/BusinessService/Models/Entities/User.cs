using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{


public class User
    {
        [Key]
        [Column("userId")]
        public Guid UserId { get; set; }

        [Column("firstName")]
        public string? FirstName { get; set; }
        [Column("lastName")]
        public string? LastName { get; set; }
        [Column("email")]
        public string? Email { get; set; }
        [Column("dob")]
        public DateTime? Dob { get; set; }
        [Column("password")]
        public string? Password { get; set; }
        [Column("role")]
        public string? Role { get; set; }
        [Column("createdDate")]
        public DateTime? CreatedDate { get; set; }
        [Column("isActive")]
        public bool IsActive { get; set; } = true;
        [Column("isDeleted")]
        public bool? IsDeleted { get; set; }

    }



}

