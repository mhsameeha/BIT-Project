using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;

namespace BusinessService.Interfaces
{
    public interface ICourseService
    {
        public UpdateCourseDto GetCoursebyId(Guid id);
        //public IEnumerable<string> GetAllCourses();

        public Task<PaginatedCoursesDto> GetCoursesAsync(int page, int pageSize);
        public List<Category> GetCourseCategories();
        public List<Language> GetCourseLanguages();

        public List<CourseDifficulty> GetCourseDifficulties();

        public string AddCourse(CourseDto newCourse, string email);
        public string UpdateCourse(UpdateCourseDto updatedCourse, string email, Guid courseId);


        public CourseManagementCardDto GetCourseManagementCardDetails(string email);

        //public string UpdateCourse(UpdateCourseDto updateCourse, string email);


       public void DeleteCourse(Guid id);
    }
}
