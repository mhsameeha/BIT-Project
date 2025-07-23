using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class CourseDetailsDto
    {
        public Guid CourseId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Introduction { get; set; }
        public decimal Price { get; set; }
        public string? Currency { get; set; }
        public bool? IsEnabled { get; set; }
        public byte[]? CourseImage { get; set; }
        public List<string>? Tags { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        // Related entity data
        public string? CategoryName { get; set; }
        public string? CourseDifficultyName { get; set; }
        public string? LanguageName { get; set; } //separate keyless tables is there for this
        
        // Tutor information
        public string? TutorFirstName { get; set; }
        public string? TutorLastName { get; set; }
        public string? TutorEmail { get; set; }
        public Guid? TutorFk { get; set; }

        public string? TutorProfPic { get; set; }
        public string? TutorDescription { get; set; }
        public List<Experience>? TutorExperience { get; set; }
        public List<Education>? TutorEducation { get; set; }

        // Course statistics
        public int EnrolledStudents { get; set; }
        public decimal AverageRating { get; set; }
        public int ReviewCount { get; set; }

        // Course content
        public List<CourseDetailsContentDto> CourseContent { get; set; } = new List<CourseDetailsContentDto>();
        
        // Course reviews
        public List<CourseReviewDto> Reviews { get; set; } = new List<CourseReviewDto>();
    }

    public class CourseDetailsContentDto
    {
        public Guid ContentId { get; set; }
        public string? ContentTitle { get; set; }
        public string? ContentDescription { get; set; }
        public string? ContentDuration { get; set; }
        public int ContentSortOrder { get; set; }
        public List<CourseDetailsSubContentDto> SubContent { get; set; } = new List<CourseDetailsSubContentDto>();
    }

    public class CourseDetailsSubContentDto
    {
        public Guid SubContentId { get; set; }
        public string? SubContentTitle { get; set; }
        public string? SubContentDescription { get; set; }
        public string? Type { get; set; }
        public int SubContentOrder { get; set; }
    }

    public class CourseReviewDto
    {
        public Guid CourseReviewId { get; set; }
        public string? Review { get; set; }
        public decimal? Rating { get; set; }
        public DateTime? ReviewDate { get; set; }
        
        // Learner information
        public string? LearnerFirstName { get; set; }
        public string? LearnerLastName { get; set; }
        public string? LearnerEmail { get; set; }
        public string? LearnerProfilePic { get; set; }
    }
}
