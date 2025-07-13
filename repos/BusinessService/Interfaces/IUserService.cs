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
        public User addUser(UserDto newUser);
        public string SignIn(LoginDto currentUser);

        public GetUserProfileDto GetUserProfile();
        //public void Claims(LoginDto currentUser);
    }
}
