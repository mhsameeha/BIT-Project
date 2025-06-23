using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.DTOs;

namespace BusinessService.Interfaces
{
    public interface ICourseService
    {
        //string GetCoursebyId(int id);
        //public IEnumerable<string> GetAllCourses();

        public List<CourseDetailDto> GetCourseDetails();

       //AddCourseDto addCourse(AddCourseDto course);

        //void DeleteCourse(int id);
    }
}
