using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessService.Services
{
    public class BMWCar : Car, ICarService 
    {
        public override void Go(int id)
        {
            Car car = new Car();
            // bwm specif implemtation carn
        }

    }
}
