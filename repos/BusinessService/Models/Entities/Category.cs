using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessService.Models.Entities
{
    public class Category
    {
        [Key]
        [Column("categoryId")]
        public Guid CategoryId { get; set; }

        [Column("categoryName")]
        public required string CategoryName { get; set; }

        //public ICollection<Course> Courses { get; set; }
    }

}
