using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskFlow.API.Models;
using TaskFlow.API.Data;

namespace TaskFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {

        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

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


        [HttpGet("assignee/")]
        [Authorize]
        public IActionResult GetUsersToAssignee()
        {
            var users = _context.Users.Where(u => u.Role != "Admin")
                .Select(u => new { u.Id, u.Username })
                .ToList();


            return Ok(users);
        }

    }
}
