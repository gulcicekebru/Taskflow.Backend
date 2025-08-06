using Microsoft.AspNetCore.Mvc;
using TaskFlow.API.Models;
using TaskFlow.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

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
        [Authorize]
        public async Task<ActionResult<List<TaskItem>>> GetTasks()
        {
            var tasks = await _context.Tasks.ToListAsync();
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

        [HttpPut("{id}")]
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
    }
}
