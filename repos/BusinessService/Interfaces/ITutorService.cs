using BusinessService.Models.DTOs;

namespace BusinessService.Interfaces
{
    public interface ITutorService
    {
        public List<SessionDto> UpcomingSessions(string email);
        public List<TutorDto> GetAllTutors();

        public Task<PaginatedCoursesDto> GetCoursesByTutor(string email, int page, int pageSize );

        public TutorProfileDataDto GetTutorProfileData(string email);

        public List<NewStudentsDto> GetNewStudents(string email);

    }
}
