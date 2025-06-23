using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using Microsoft.IdentityModel.Tokens;

namespace BusinessService.Services
{
    public class UserService : IUserService

    {
        
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context) {

            _context = context;
        }



    public User addUser( UserDto newUser)
            
        {
            var user = new User {
                Id = Guid.NewGuid(),
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                DOB = newUser.DOB,
                Email = newUser.Email,
                Role = newUser.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(newUser.Password),
                CreatedDate = DateTime.Now,

                };
            _context.Add(user);
            _context.SaveChanges();
            if (newUser.Role == "Learner") {
                var newlearner = new Learner
                {

                    UserFk = user.Id
                };
                _context.Add(newlearner);
                _context.SaveChanges();
                };
                if (newUser.Role == "Tutor")
                {
                var newTutor = new Tutor
                {

                    UserFk = user.Id,
                    ApprovalStatus = "Pending"
                };

                _context.Add(newTutor);
                _context.SaveChanges();
            }
            ;

                
            
            return user;
        }

        public string GenerateToken(LoginDto currentUser)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim (ClaimTypes.Email, currentUser.Email),
       
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my-secret-is-this-tree-this0is-randombatehdhdtuasbkhcvsdugkahsdvjgsdvchftugdsdbfgusfgduybvgsdhfvgv"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

 

        //public void Claims(LoginDto currentUser)
        //{
        //    var user = _context.Users.SingleOrDefault(x => x.Email == currentUser.Email);
        //    var learner = _context.Learners.SingleOrDefault(x => x.UserFk == user.Id);
        //    var tutor = _context.Tutors.SingleOrDefault(x => x.UserFk == user.Id);
        //    var admin = _context.Admins.SingleOrDefault(x => x.UserFk == user.Id);

        //    List<Claim> Claims;


        //    if (user != null && BCrypt.Net.BCrypt.Verify(currentUser.Password, user.PasswordHash))
        //    {
        //        if (user.Role == "Learner" && learner != null)
        //        {
        //            Claims = new List<Claim>
        //        {
        //             new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        //             new Claim(ClaimTypes.Role, user.Role),
        //            new Claim(ClaimTypes.NameIdentifier, learner.LearnerId.ToString())


        //        };
        //        }
        //            if (user.Role == "Tutor" && tutor != null)
        //            {
        //                Claims = new List<Claim>
        //        {
        //             new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        //             new Claim(ClaimTypes.Role, user.Role),
        //            new Claim(ClaimTypes.NameIdentifier, tutor.TutorId.ToString())

        //        };


        //            }
        //            if (user.Role == "Admin" && admin != null)
        //            {
        //                Claims = new List<Claim>
        //        {
        //             new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        //             new Claim(ClaimTypes.Role, user.Role),
        //            new Claim(ClaimTypes.NameIdentifier, admin.AdminId.ToString())

        //        };


        //            }
        //        } 
        //    }
                

        public bool SignIn(LoginDto currentUser)
        {
            var user = _context.Users.SingleOrDefault(x => x.Email == currentUser.Email);

            if (user != null && BCrypt.Net.BCrypt.Verify(currentUser.Password, user.PasswordHash))
            {
                return true;
            }

            return false;

        }
        }



}

