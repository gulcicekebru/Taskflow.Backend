// src/api/TaskService.js
import axios from './axios';

const TaskService = {
    getAll: () => axios.get('/Task'),
    getById: (id) => axios.get(`/Task/${id}`),
    create: (task) => axios.post('/Task', task),
    update: (id, task) => axios.put(`/Task/${id}`, task),
    delete: (id) => axios.delete(`/Task/${id}`),
    completeTask: (id) => axios.put(`/Task/${id}/complete`),
    getByAssignee: (assignedPerson) => axios.get('Task/assignee/{AssignedPerson}'),
    getUsers: () => axios.get(`/User/assignee`)
};

export default TaskService;
