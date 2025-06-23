using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Services
{
    public interface ICarService
    {
        void Go(int id);
        void Stop(int id);
        void Brake(int id);
        void OpenDoors(int id);



    }
}
