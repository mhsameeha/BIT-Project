using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.DTOs;

namespace BusinessService.Interfaces
{
    public interface ITutorAvailabilityService
    {

        public string SaveTutorAvailabilty(TutorAvailabilitySettingsDto tutorAvailability, string email);
        public TutorAvailabilitySettingsDto GetTutorAvailability(string email);
    }
}
