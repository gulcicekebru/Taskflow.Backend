using Azure.Core;
using TaskFlow.API.Models;
using TaskFlow.API.Services;

namespace TaskFlow.API.Data
{
    public static class DbSeeder
    {
        public static void SeedAdminUser(DataContext context)
        {
            if(context.Users.Any(u => u.Username.ToLower() == "admin"))
            {
                return;
            }
            else
            {
                AuthHelper.CreatePasswordHash("admin1234", out byte[] hash, out byte[] salt);
                var user = new User
                {
                    Username = "Admin",
                    Role = "Admin",
                    PasswordHash = hash,
                    PasswordSalt = salt
                };
                context.Users.Add(user);
                context.SaveChanges();
            }

        }
    }
}
