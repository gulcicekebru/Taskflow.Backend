using Microsoft.EntityFrameworkCore;
using TaskFlow.API.Models;


namespace TaskFlow.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) 
        {
        
        }

        public DbSet<User> Users { get; set; }

        public DbSet<TaskItem> Tasks { get; set; }
    }
}
