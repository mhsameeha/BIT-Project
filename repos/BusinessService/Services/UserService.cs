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

        public UserService(ApplicationDbContext context)
        {

            _context = context;
        }


        //register users to the system
        public string AddLearner(NewLearnerUserDto newLearner)

        {
            if (newLearner == null) return "Unable to add User";

            var user = new User
            {
                UserId = Guid.NewGuid(),
                FirstName = newLearner.FirstName,
                LastName = newLearner.LastName,
                Dob = newLearner.Dob,
                Email = newLearner.Email,
                Role = newLearner.Role,
                Password = BCrypt.Net.BCrypt.HashPassword(newLearner.Password),
                CreatedDate = DateTime.Now,

            };
            _context.Add(user);
            _context.SaveChanges();

                var newlearner = new Learner
                {

                    UserFk = user.UserId
                };
                _context.Add(newlearner);
                _context.SaveChanges();

            return "added successfully";
        }

        public string AddTutor(NewTutorUserDto newTutor)

        {
            if (newTutor == null) return "Unable to add User";

            var userId = Guid.NewGuid();

            var checkEmail = _context.Users.FirstOrDefault(x => x.Email == newTutor.Email);
            if (checkEmail == null)
            {

                var user = new User
                {
                    UserId = userId,
                    FirstName = newTutor.FirstName,
                    LastName = newTutor.LastName,
                    Dob = DateTime.Now,
                    Email = newTutor.Email,
                    Role = newTutor.Role,
                    Password = BCrypt.Net.BCrypt.HashPassword(newTutor.Password),
                    CreatedDate = DateTime.Now,
                };

                var Tutor = new Tutor
                {
                    TutorId = Guid.NewGuid(),
                    TutorDescription = newTutor.TutorDescription,
                    TutorRate = newTutor.TutorRate,
                    ApprovalRequestDate = newTutor.ApprovalRequestDate,
                    Education = newTutor.Education,
                    Experience = newTutor.Experience,
                    Status = "Pending",
                    UserId = userId,
                    Language = newTutor.Language,
                    ApprovedDate = null,
                    TutorProfPic = null,



                };


                _context.Users.Add(user);
                _context.Tutors.Add(Tutor);
                _context.SaveChanges();

                return "Tutor Added Successfully";
            }

            return "Email Already Exists";
        }



        public GetUserProfileDto GetUserProfile(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
         
            if (user == null) return null;

            

            return new GetUserProfileDto
            {
                Id = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email  = user.Email,
            };
        }

        public string SignIn(LoginDto currentUser)
        {
            var user = _context.Users.SingleOrDefault(x => x.Email == currentUser.Email);
            Guid roleId = Guid.Empty; // Initialize with empty GUID

            if (user != null && user.Role == currentUser.Role && BCrypt.Net.BCrypt.Verify(currentUser.Password, user.Password))
            {
                List<Claim> claims = new List<Claim>
            {
                new Claim (ClaimTypes.Email, currentUser.Email),

                new Claim (ClaimTypes.NameIdentifier, user.UserId.ToString()),  

                new Claim(ClaimTypes.Name, user.FirstName + " " + user.LastName),

                new Claim(ClaimTypes.Role, user.Role),

            };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my-secret-is-this-tree-this" +
                    "0is-randombatehdhdtuasbkhcvsdugkahsdvjgsdvchftugdsdbfgusfgduybvgsdhfvgv"));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

                var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                    );

                var jwt = new JwtSecurityTokenHandler().WriteToken(token);
                return jwt;
            }

            return "Invalid Credential";
        }


    }



}

