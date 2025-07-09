using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Models.Entities;

namespace BusinessService.Interfaces
{
    public interface ISpecialityService
    {
        public List<Speciality> SpecialityList();
    }
}
