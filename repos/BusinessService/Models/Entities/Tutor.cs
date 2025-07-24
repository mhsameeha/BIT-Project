using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BusinessService.Models.Entities
{

    public class Tutor
    {
        [Key]
        [Column("tutorId")]

        public Guid TutorId { get; set; }
        [Column("tutorDescription")]
        public string? TutorDescription { get; set; }
        [Column("tutorRate")]
        public decimal? TutorRate { get; set; }
        [Column("status")]
        public string? Status { get; set; }

        [Column("approvedDate")]
        public DateTime? ApprovedDate { get; set; }
        [Column("approvalRequestDate")]
        public DateTime? ApprovalRequestDate { get; set; }
        [Column("tutorProfPic")]
        public byte[]? TutorProfPic { get; set; }
        [Column("experience")]
        public string? ExperienceJson { get; set; }
        [NotMapped]
        public List<Experience>? Experience
        {
            get => string.IsNullOrEmpty(ExperienceJson)
        ? new List<Experience>()
        : JsonSerializer.Deserialize<List<Experience>>(ExperienceJson);
            set => ExperienceJson = JsonSerializer.Serialize(value);
        }
        [Column("education")]

        public string? EducationJson { get; set; }
        [NotMapped]
        public List<Education>? Education
        {
            get => string.IsNullOrEmpty(EducationJson)
        ? new List<Education>()
        : JsonSerializer.Deserialize<List<Education>>(EducationJson);
            set => EducationJson = JsonSerializer.Serialize(value);
        }
        [Column("userFk")]
        public Guid UserId { get; set; }
        [Column("language")]

        public string[]? Language { get; set; }

        public User Users { get; set; }
    }
    [Keyless]
    [NotMapped]
    [Owned]
    public class Experience
    {
        
        public string? Position { get; set; }
        public string? Company { get; set; }
        public string? TimePeriod { get; set; }
    }
    [Keyless]
    [NotMapped]
    [Owned]

    public class Education
    {
        public string? Qualification { get; set; }
        public string? Institute { get; set; }
        public string? GraduationDate { get; set; }
    }
    [Keyless]
    [NotMapped]
    [Owned]

    public class LanguageProf
    {
        public string? Name { get; set; }
        public string? Proficiency { get; set; }
    }
}

