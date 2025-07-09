using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Models.Entities
{
    [PrimaryKey(nameof(TutorFk), nameof(SpecialityFk))]
    public class TutorSpeciality
        {
    
            public Guid TutorFk { get; set; }
            public Guid SpecialityFk { get; set; }

 
        }
    }

