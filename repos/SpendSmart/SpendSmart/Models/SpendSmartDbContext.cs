using Microsoft.EntityFrameworkCore;

namespace SpendSmart.Models
{
    public class SpendSmartDbContext : DbContext
    {
        public DbSet<Learners> Learners { get; set; }

        public SpendSmartDbContext(DbContextOptions<SpendSmartDbContext> options)
            : base(options) 
        {
        
        }
    }
}
