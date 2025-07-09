using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.DTOs;

namespace BusinessService.Interfaces
{
    public interface ITutorService
    {
        public List<SessionDto> UpcomingSessions(Guid tutorId);
        public List<TutorDto> getAllTutors();
    }
}
