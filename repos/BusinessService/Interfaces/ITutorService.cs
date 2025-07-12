using BusinessService.Models.DTOs;

namespace BusinessService.Interfaces
{
    public interface ITutorService
    {
        public List<SessionDto> UpcomingSessions(Guid tutorId);
        public List<TutorDto> GetAllTutors();

        public Task<PaginatedCoursesDto> TutorCourses(Guid tutorId, int page, int pageSize );
    }
}
