using TaskFlow.API.Models;

namespace TaskFlow.API.DTOs
{
    public class CreateTaskDto
    {
        public string Title { get; set; } 
        public string Description { get; set; } = string.Empty;
        public List<int> AssignedUserIds { get; set; } = new();
        
    }
}
