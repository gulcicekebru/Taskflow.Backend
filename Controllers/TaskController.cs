using Microsoft.AspNetCore.Mvc;
using TaskFlow.API.Models;
using TaskFlow.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using TaskFlow.API.Services;
using System.Security.Claims;

namespace TaskFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly DataContext _context;

        public TaskController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<List<TaskItem>>> GetTasks()
        {
            var tasks = await _context.Tasks.ToListAsync();
            return Ok(tasks);
        }

        [HttpGet("my/")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<List<TaskItem>>> GetMyTasks()
        {
            var assignee = User.FindFirst(ClaimTypes.Name)?.Value;
            var tasks = await _context.Tasks.Where(t=> t.AssignedPerson == assignee).ToListAsync();

            if (!tasks.Any()) { return NotFound(); }

            return Ok(tasks);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<TaskItem>> GetTasksById(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null) { return NotFound(); }

            return Ok(task);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TaskItem>> CreateTask([FromBody]TaskItem task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }

        [HttpPut("id/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateTask(int id, [FromBody] TaskItem updatedTask)
        {
            var existingTask = await _context.Tasks.FindAsync(id);

            if (existingTask == null) { return NotFound(); }

            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.AssignedPerson = updatedTask.AssignedPerson;
            existingTask.CreatedDate = updatedTask.CreatedDate;
            existingTask.IsCompleted = updatedTask.IsCompleted;
           
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/complete")]
        [Authorize(Roles = "User, Admin")]
        public async Task<ActionResult> CompleteTask(int id)
        {
            var existingTask = await _context.Tasks.FindAsync(id);
            var currentUser = User.FindFirst(ClaimTypes.Name)?.Value;

            if (existingTask == null) { return NotFound(); }
            
            if((string.Equals(existingTask.AssignedPerson, currentUser ,StringComparison.OrdinalIgnoreCase) || 
                User.IsInRole("Admin")) && !existingTask.IsCompleted)
            {
                existingTask.IsCompleted = true;
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return Forbid();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var existingTask = await _context.Tasks.FindAsync(id);

            if (existingTask == null) { return NotFound(); }

            _context.Tasks.Remove(existingTask);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Filter
        [HttpGet("completed/{IsCompleted}")]
        [Authorize]
        public async Task<ActionResult<List<TaskItem>>> GetTaskByCompletedInfo(bool IsCompleted)
        {
            var tasks = await _context.Tasks.Where(t => t.IsCompleted == IsCompleted).ToListAsync();

            if (!tasks.Any()) { return NotFound(); }

            return Ok(tasks);
        }

        //Filter assignedPerson
        [HttpGet("assignee/{AssignedPerson}")]
        [Authorize]
        public async Task<ActionResult<List<TaskItem>>> GetTaskByAssignee(string AssignedPerson)
        {
            var tasks = await _context.Tasks.Where(t => t.AssignedPerson == AssignedPerson).ToListAsync();

            if (!tasks.Any()) { return NotFound(); }

            return Ok(tasks);
        }
    }
}
