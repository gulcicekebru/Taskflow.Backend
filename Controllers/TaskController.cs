using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Linq;
using System.Security.Claims;
using TaskFlow.API.Data;
using TaskFlow.API.DTOs;
using TaskFlow.API.Models;
using TaskFlow.API.Services;

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

        [HttpGet("my/")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<List<TaskItem>>> GetMyTasks()
        {
            var assignee = User.FindFirst(ClaimTypes.Name)?.Value;

            var user = await _context.Users.Where(t => t.Username == assignee).FirstOrDefaultAsync();

            if (user == null) { return Unauthorized(); }

            var taskIds = await _context.TaskAssignments.Where(t => t.UserId == user.Id).Select(t=>t.TaskItemId).ToListAsync();
            var tasks = await _context.Tasks.Where(t=> taskIds.Contains(t.Id)).ToListAsync();

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
        public async Task<ActionResult<TaskItem>> CreateTask([FromBody]CreateTaskDto task)
        {
            if (string.IsNullOrWhiteSpace(task.Title))
            {
                return BadRequest("Title can not be empty.");
            }

            List<int> ids = task.AssignedUserIds?.Distinct().ToList() ?? new();

            if (ids.Any()) {
                int userCount=0;
                for (int i = 0; i < ids.Count; i++) {
                    var id = ids[i];
                    if(await _context.Users.AnyAsync(u => u.Id == id)) userCount++;

                }
                if (userCount != ids.Count)
                {
                    return BadRequest("One or more assigned users do not exist.");
                }
            }

            TaskItem taskItem = new TaskItem();
            taskItem.Title = task.Title;
            taskItem.Description = task.Description;
            taskItem.CreatedDate = DateTime.Now;
            taskItem.IsCompleted = false;
            taskItem.AssignedPerson = "";

            _context.Tasks.Add(taskItem);
            await _context.SaveChangesAsync();

            
            if(taskItem.Id != 0 ) {
                DateTime assignedDate = DateTime.Now;
                for (int i = 0; i < ids.Count; i++)
                {
                    TaskAssignment assignment = new TaskAssignment();
                    assignment.TaskItemId = taskItem.Id;
                    assignment.UserId = ids[i];
                    assignment.AssignedDate = assignedDate;
                    _context.TaskAssignments.Add(assignment);
                }
            }

            await _context.SaveChangesAsync();



            return CreatedAtAction(nameof(GetTasks), new { id = taskItem.Id }, taskItem);
        }

        [HttpPut("id/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateTask(int id, UpdateTaskDto updatedTask)
        {
            var existingTask = await _context.Tasks.FindAsync(id);

            if (existingTask == null) { return NotFound(); }

            if (string.IsNullOrWhiteSpace(updatedTask.Title))
            {
                return BadRequest("Title can not be empty.");
            }

            var newAssignedUsers = updatedTask.AssignedUserIds?.Distinct().ToList() ?? new();

            for (int i = 0; i < newAssignedUsers.Count; i++)
            {
                if (!await _context.Users.AnyAsync(t => t.Id == newAssignedUsers[i]))
                {
                    return BadRequest("One or more user ids are invalid.");
                }
            }

            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.IsCompleted = updatedTask.IsCompleted;
            var existingAssignments = await _context.TaskAssignments.Where(t => t.TaskItemId == id).ToListAsync();
            _context.TaskAssignments.RemoveRange(existingAssignments);

            var dateNow = DateTime.Now;
            for (int i = 0; i < newAssignedUsers.Count; i++)
            {
                var newTaskAssignment = new TaskAssignment();
                newTaskAssignment.TaskItemId = id;
                newTaskAssignment.UserId = newAssignedUsers[i];
                newTaskAssignment.AssignedDate = dateNow;
                _context.TaskAssignments.Add(newTaskAssignment);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/complete")]
        [Authorize(Roles = "User, Admin")]
        public async Task<ActionResult> CompleteTask(int id)
        {
            var existingTask = await _context.Tasks.FindAsync(id);

            if (existingTask == null) { return NotFound(); }

            if(existingTask.IsCompleted) { return BadRequest("Task is already completed."); }

            var canComplete = User.IsInRole("Admin");

            if (!canComplete)
            {
                var currentUser = User.FindFirst(ClaimTypes.Name)?.Value;

                if (currentUser == null) { return Unauthorized(); }

                var userId = await _context.Users.Where(t => t.Username == currentUser).Select(t => t.Id).SingleOrDefaultAsync();

                if (userId == 0) { return Unauthorized(); }

                canComplete = await _context.TaskAssignments.AnyAsync(t => t.TaskItemId == id && t.UserId == userId);
            }

            if (!canComplete)
            {
                return Forbid();
            }

            existingTask.IsCompleted = true;
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
        [HttpGet("assignee/{username}")]
        [Authorize]
        public async Task<ActionResult<List<TaskItem>>> GetTaskByAssignee(string username)
        {
            var user =  await _context.Users.Where(t => t.Username == username).FirstOrDefaultAsync();

            if (user == null) { return NotFound(); }

            var taskIds = await _context.TaskAssignments.Where(t => t.UserId == user.Id).Select(t => t.TaskItemId).ToListAsync();

            if (!taskIds.Any()) { return NotFound(); }

            var userTasks =  await _context.Tasks.Where(t => taskIds.Contains(t.Id)).ToListAsync();

            if (!userTasks.Any()) { return NotFound(); }

            return Ok(userTasks);
        }
    }
}
