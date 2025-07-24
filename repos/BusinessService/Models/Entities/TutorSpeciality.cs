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
    [PrimaryKey(nameof(TutorId), nameof(SpecialityId))]
    public class TutorSpeciality
        {
        [Column("tutorFk")]
            public Guid TutorId { get; set; }
        [Column("specialityFk")]
            public Guid SpecialityId { get; set; }
        [ForeignKey("TutorId")]
        public Tutor Tutor { get; set; }
        [ForeignKey("SpecialityId")]
        public Speciality Speciality { get; set; }

 
        }
    }

