using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;

namespace BusinessService.Services
{
    public class SessionService : ISessionService
    {
        private readonly ApplicationDbContext _context;

        SessionService(ApplicationDbContext context)
        {
            _context = context;
        }

      
    }
}
