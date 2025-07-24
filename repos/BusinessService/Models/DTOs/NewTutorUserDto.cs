using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class NewTutorUserDto
    {


            public string? FirstName { get; set; }
            public string? LastName { get; set; }

            public DateTime? Dob { get; set; }

            [EmailAddress]
            public required string Email { get; set; }

            public required string Password { get; set; }
            public required string Role { get; set; }

            public string? TutorDescription { get; set; }
            public decimal? TutorRate { get; set; }

            public string? Status { get; set; }

            public DateTime? ApprovalRequestDate { get; set; }

            public List<Experience>? Experience { get; set; }

            public List<Education>? Education { get; set; }
            public Guid UserFk { get; set; }
            public string[]? Language { get; set; }

        }
    }

