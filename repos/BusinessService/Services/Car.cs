using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Services
{
    public class Car : ICarService
    {
        public void Brake(int id)
        {
            // implmentastion of brake/
        }

        public virtual void Go(int id)
        {
           // real coding of go sshould be here
        }

        public void OpenDoors(int id)
        {
            throw new NotImplementedException();
        }

        public void Stop(int id)
        {
            throw new NotImplementedException();
        }
    }
}
