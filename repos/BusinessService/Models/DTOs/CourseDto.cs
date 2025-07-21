using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class CourseDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Introduction { get; set; }
        public Guid? CategoryFk { get; set; } // or Guid if it should be
        public Guid? CourseDifficultyFk { get; set; }
        public decimal Price { get; set; }
        public string? Currency { get; set; }
        public bool? IsEnabled { get; set; }
        public List<string>? Tags { get; set; }
        public Guid? LanguageFk { get; set; }
        public byte[]? CourseImage { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public List<CourseContentDto> CourseContent { get; set; } = new List<CourseContentDto>();
    }

    public class CourseContentDto
    {
        public Guid ContentId { get; set; }
        public string ContentTitle { get; set; }
        public string? ContentDuration { get; set; }
        public string? ContentDescription { get; set; }
        public string? ContentSortOrder { get; set; }
        public List<SubContentDto> SubContent { get; set; } = new List<SubContentDto>();
    }

    public class SubContentDto
    {
        public Guid SubContentId { get; set; }
        public string? SubContentTitle { get; set; }
        public string? SubContentDescription { get; set; }
        public string? Type { get; set; }
        public string? SubContentOrder { get; set; }
    }
}


