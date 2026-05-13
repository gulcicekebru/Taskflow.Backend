namespace TaskFlow.API.Models
{
    public class TaskAssignment
    {
        public int Id { get; set; }
        public int TaskItemId {  get; set; }
        public int UserId { get; set; }
        public DateTime AssignedDate {  get; set; }
        

    }
}
