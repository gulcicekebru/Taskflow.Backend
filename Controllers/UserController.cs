using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace TaskFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var username = User.Identity?.Name;
            return Ok(new
            {
                message = $"Welcome, {username}! 🎉",
                access = "You are authenticated ✅"
            });
           
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin-profile")]
        public IActionResult GetAdminProfile()
        {
            var username = User.Identity?.Name;
            return Ok(new
            {
                message = $"Welcome, {username}! 🎉",
                access = "You are authenticated ✅"
            });
        }
    }
}
