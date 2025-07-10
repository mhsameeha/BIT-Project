using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.Entities;

namespace BusinessService.Services
{
    public class SpecialityService : ISpecialityService
    {
        private readonly ApplicationDbContext _context;
        public SpecialityService(ApplicationDbContext context) {
        _context = context;
        }
        public List<Speciality> SpecialityList() { 
             var specialityList = _context.Specialities
                .OrderBy(s => s.SpecialityName)
                .ToList();
            return specialityList;
        }
    }
}
