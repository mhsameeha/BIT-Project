using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class Course
    {
        [Key]

        public Guid CourseId { get; set; }

        public Guid TutorFk { get; set; }
        public decimal? Price { get; set; }

        public string? Title { get; set; }
        public string? Introduction { get; set; }
        public string? Description { get; set; }

        public Guid CourseDifficultyFk { get; set; }
        public Guid? CategoryFk { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? PublishedDate { get; set; }

        public bool IsEnabled { get; set; } = false;
        public byte CourseImage {  get; set; }
        public Guid LanguageFk { get; set; }

        }


        }
