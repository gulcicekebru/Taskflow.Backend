// src/api/TaskService.js
import axios from './axios';

const TaskService = {
    getAll: () => axios.get('/Task'),
    getById: (id) => axios.get(`/Task/${id}`),
    create: (task) => axios.post('/Task', task),
    update: (id, task) => axios.put(`/Task/${id}`, task),
    delete: (id) => axios.delete(`/Task/${id}`),
};

export default TaskService;
