using BusinessService.Models.DTOs;

namespace BusinessService.Interfaces
{
    public interface ITutorService
    {
        public List<SessionDto> UpcomingSessions(string email);
        public List<TutorDto> GetAllTutors();
        public List<TutorDetailDto> GetAvailableTutorsWithDetails();
        public TutorDetailDto GetTutorById(Guid tutorId);
        public object GetTutorAvailability(Guid tutorId);

        public Task<PaginatedCoursesDto> GetCoursesByTutor(string email, int page, int pageSize );

        public TutorDashboardDataDto GetTutorDashboardData(string email);

        public List<NewStudentsDto> GetNewStudents(string email);

        public TutorData GetTutorAccountDetails(string email);
        public TutorData GetTutorDataById(Guid tutorId);

   


    }
}
