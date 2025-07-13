using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;

namespace BusinessService.Interfaces
{
    public interface ICourseService
    {
        //string GetCoursebyId(int id);
        //public IEnumerable<string> GetAllCourses();

        public Task<PaginatedCoursesDto> GetCoursesAsync(int page, int pageSize);
        public List<Category> GetCourseCategories();

        public List<CourseDifficulty> GetCourseDifficulties();

        public (Course, CourseContent) AddCourse(CourseDetailDto newCourse);

        //void DeleteCourse(int id);
    }
}
