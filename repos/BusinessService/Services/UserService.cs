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
        public User addUser(UserDto newUser)

        {
            var user = new User
            {
                UserId = Guid.NewGuid(),
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Dob = newUser.Dob,
                Email = newUser.Email,
                Role = newUser.Role,
                Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password),
                CreatedDate = DateTime.Now,

            };
            _context.Add(user);
            _context.SaveChanges();
            if (newUser.Role == "Learner")
            {
                var newlearner = new Learner
                {

                    UserFk = user.UserId
                };
                _context.Add(newlearner);
                _context.SaveChanges();
            }
            ;
            if (newUser.Role == "Tutor")
            {
                var newTutor = new Tutor
                {

                    UserFk = user.UserId,
                    Status = "Pending"
                };

                _context.Add(newTutor);
                _context.SaveChanges();
            }
                ;



            return user;
        }

        public string SignIn(LoginDto currentUser)
        {
            var user = _context.Users.SingleOrDefault(x => x.Email == currentUser.Email);

            if (user != null && BCrypt.Net.BCrypt.Verify(currentUser.Password, user.Password))
            {
                List<Claim> claims = new List<Claim>
            {
                new Claim (ClaimTypes.Email, currentUser.Email),

                new Claim (ClaimTypes.NameIdentifier, user.UserId.ToString()),

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

