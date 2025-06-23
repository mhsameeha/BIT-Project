using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Azure.Core;
using BCrypt.Net;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.Entities;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace BusinessService.Services
{
    public class TestService : ITestService
    {
        private readonly ApplicationDbContext _context;

        public TestService(ApplicationDbContext context)
        {
            _context = context;
        }
        public TestEntity addTest(TestEntity newEntity, TestEntity entity)
        {
            entity.FirstName = newEntity.FirstName;
            entity.LastName = newEntity.LastName;
            entity.Email = newEntity.Email;
            entity.Password = newEntity.Password;

            entity.Password = BCrypt.Net.BCrypt.HashPassword(entity.Password);
            _context.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public string GenerateToken(User currentUser)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim (ClaimTypes.Email, currentUser.Email)
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

        public bool SignIn(User currentUser)
        {
            //var removeCourse = courseSet.FirstOrDefault(x => x.Key == id);
            var entity = _context.TestEntities.SingleOrDefault(x => x.Email == currentUser.Email);

            if (entity != null && BCrypt.Net.BCrypt.Verify(currentUser.PasswordHash, entity.Password))
            {
                return true;
            }

            return false;

        }
    }

    //public class SignInResponse
    //{
    //    public bool IsSuccess { get; set; }
    //}
}



