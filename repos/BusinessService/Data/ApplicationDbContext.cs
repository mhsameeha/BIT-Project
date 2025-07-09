using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BusinessService.Models.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace BusinessService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Learner> Learners { get; set; }
        public DbSet<Tutor> Tutors { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseContent> CourseContents { get; set; }

        public DbSet<CourseDifficulty> CourseDifficulties { get; set; }

        public DbSet<Language> Languages { get; set; }
        public DbSet<CourseReview> CourseReviews { get; set; }
        public DbSet<Timeslot> Timeslots { get; set; }
        public DbSet <TutorAvailability> TutorAvailabilities { get; set; }
        public DbSet <Speciality> Specialities { get; set; }
        public DbSet<TutorSpeciality> TutorSpecialities { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }


    }
    
}
