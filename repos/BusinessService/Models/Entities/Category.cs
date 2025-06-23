using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Models.Entities
{
    public class Category
    {
        [Key]
        public Guid CategoryId { get; set; }

        public required string CategoryName { get; set; }

        //public ICollection<Course> Courses { get; set; }
    }

}
