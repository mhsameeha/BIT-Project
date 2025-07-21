using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Models.DTOs
{
    public class UpdateCourseDto
    {
        public string? Title { get; set; }
        public Guid? CourseDifficultyFk { get; set; }
        public Guid? CategoryFk { get; set; }
        public decimal Price { get; set; }
        public string? Introduction { get; set; }
        public string? Description { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? Currency { get; set; }
        public byte[]? CourseImage { get; set; }
        //aggregate functions
        public Guid? LanguageFk { get; set; }
        public bool? IsEnabled { get; set; }
        public List<string>? Tags { get; set; }
        public DateTime? CreatedDate { get; set; }


        public List<UpdateCourseContentDto> CourseContent { get; set; } = new List<UpdateCourseContentDto>();

    }

    public class UpdateCourseContentDto
    {
        public Guid? ContentId { get; set; }
        public Guid? CourseFk { get; set; }
        public string ContentTitle { get; set; }
        public int ContentSortOrder { get; set; }
        public string? ContentDuration { get; set; }
        public string? ContentDescription { get; set; }

    
        public List<UpdateSubContentDto> SubContent { get; set; } = new List<UpdateSubContentDto>();


    }

    public class UpdateSubContentDto
    {
        public Guid? SubContentId { get; set; }
        public Guid? ContentFk { get; set; }
        public string? SubContentTitle { get; set; }
        public string? SubContentDescription { get; set; }
        public string? Type { get; set; }
        public int? SubContentOrder { get; set; }

    }


}

