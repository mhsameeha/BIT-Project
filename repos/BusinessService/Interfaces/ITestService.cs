using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;
using BusinessService.Services;

namespace BusinessService.Interfaces
{
    public interface ITestService
    {
        TestEntity addTest(TestEntity newEntity, TestEntity entity);

        bool SignIn(User currentUser);
        string GenerateToken(User currentUser);
    }
}
