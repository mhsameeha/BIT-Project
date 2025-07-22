using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;

namespace BusinessService.Interfaces
{
    public interface IUserService
    {
        public string AddLearner(NewLearnerUserDto newLearner);

        public string AddTutor(NewTutorUserDto newTutor);

        public string SignIn(LoginDto currentUser);

        public GetUserProfileDto GetUserProfile(string email);
        //public void Claims(LoginDto currentUser);
    }
}
