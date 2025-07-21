using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Services
{
    public class EnrollementService : IEnrollementService
    {
        private readonly ApplicationDbContext _context;
        public EnrollementService(ApplicationDbContext context)
        {
            _context = context;
        }
        public List<EnrollmentDto> GetEnrolledCourses(Guid learnerid)
        {
            var result = (from enrollement in _context.Enrollments
                          join course in _context.Courses on enrollement.CourseId equals course.CourseId
                          where enrollement.LearnerFk == learnerid
                          select new EnrollmentDto
                          {

                              courseName = course.Title
                          }).ToList();
            return result;
        }
    }
}
