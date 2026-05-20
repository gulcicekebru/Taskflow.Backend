// src/pages/TaskList.jsx
import React, { useEffect, useState } from 'react';
import TaskService from '../api/TaskService';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/my-logo.png";
import "../styles/Topnav.css";
import "../styles/TaskList.css";




const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState("");
    const [description, setDescription] = useState("");
    const [assignedUserIds, setAssignedUserIds] = useState([]);
    const [deletingTaskID, deleteTask] = useState("");
    const [users, setUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [assigneeFilter, setAssigneeFilter] = useState("");

    
    
    const newTaskObj = {
        title: newTask,
        description: description,
        assignedUserIds: assignedUserIds
    };

   
    const handleAddTask = (e) => {
        e.preventDefault();
        TaskService.create(newTaskObj).then(res => {
            setTasks([...tasks, res.data]);
            setNewTask("");
            setDescription("");
            setAssignedUserIds([]);
        })
            .catch(err => console.error("Görev eklenemedi", err));
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();

        if (assigneeFilter) {
            TaskService.getByAssignee(assigneeFilter)
                .then(res => setTasks(res.data))
                .catch(err => console.error("Filtre uygulanamadı", err));
        } else {
            TaskService.getAll()
                .then(res => setTasks(res.data))
                .catch(err => console.error("Görevler alınamadı", err));
        }
    };

    const handleDeleteTask = (e) => {
        e.preventDefault();
        TaskService.delete(deletingTaskID).then(res => {
            setTasks(tasks.filter(task => task.id !== parseInt(deletingTaskID)));
            deleteTask("");
        })
            .catch(err => console.error("Görev silinemedi", err));
    };

    const handleToggleTaskState = (id) => {

        TaskService.completeTask(id).then(res => {
            setTasks(tasks.map(task => task.id === id ? { ...task, isCompleted: !task.isCompleted} : task));
            
        })
            .catch(err => console.error("Görev durumu değiştirilemedi", err));
    };

    useEffect(() => {
        TaskService.getAll()
            .then((res) => {
                setTasks(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Görevler alınamadı:', err);
                setLoading(false);
            });
        TaskService.getUsers()
            .then(res => setUsers(res.data))
            .catch(err => console.error("Kullanıcılar alınamadı", err));
    }, []);




    const navigate = useNavigate();


    const handleLogout =  () => {
        var existedToken = localStorage.getItem("token");
        if (existedToken) {
            localStorage.removeItem("token");
            navigate('/login');
        }
        
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="topnav">
                <a href="#home">Home</a>
                <a className="active" href="#task">Tasks</a>
            </div>
            <div className="create-div">
                <div className="filters-div">
                <h2 className="headers">Create New Task</h2>
                <form onSubmit={handleAddTask}>
                    <label htmlFor="taskName">Task Name</label>
                    <input
                        type="text"
                        placeholder="Enter task name"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        required
                        style={{ width: "95%", padding: "10px", marginBottom: "20px" }}
                    />
                    <label htmlFor="description">Description</label>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: "95%",
                            padding: "10px",
                            marginBottom: "10px",
                            minHeight: "80px", 
                            resize: "vertical"   
                        }}
                    />
                        <label htmlFor="assignedUserIds">Assignees</label>
                        <select
                            id="assignedUserIds"
                            multiple
                            value={assignedUserIds.map(String)}
                            onChange={(e) => {
                                const selectedIds = Array.from(
                                    e.target.selectedOptions,
                                    option => Number(option.value)
                                );
                                setAssignedUserIds(selectedIds);
                            }}
                            style={{ width: "95%", padding: "10px", marginBottom: "20px" }}
                        >
                            {Array.isArray(users) &&
                                users.map((user) =>
                                    user?.id && user?.username ? (
                                        <option key={user.id} value={user.id}>
                                            {user.username}
                                        </option>
                                    ) : null
                                )}
                        </select>

                    <button
                        type="submit"
                        style={{
                            width: "95%",
                            padding: "20px",
                            background: "#4CAF50",
                            color: "white",
                            border: "1px solid black",
                            borderRadius: "10px",
                            marginBottom: "10px"
                        }}
                    >
                        {"Create"}
                    </button>
                </form>
            </div>

            <div className="create-div-child">
                <h2 className="headers">Filter Tasks</h2>
                    <form onSubmit={handleApplyFilters}>
                    <label htmlFor="status">Status</label>
                    <input
                        type="text"
                        placeholder="Enter status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: "95%", padding: "10px", marginBottom: "20px" }}
                    />
                        <label htmlFor="assignee">Assigneee</label>
                        <select id="assignee" className="w-full border p-2 mb-3" value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)}
                        >
                        <option value="">All</option>
                        {Array.isArray(users) &&
                            users.map((user) =>
                                user?.id && user?.username ? (
                                    <option key={user.id} value={user.username}>
                                        {user.username}
                                    </option>
                                ) : null
                            )
                        }
                    </select>

                    <button
                        type="submit"
                        style={{
                            width: "45%",
                            padding: "20px",
                            background: "white",
                            color: "black",
                            border: "1px solid black",
                            borderRadius: "10px",
                            marginBottom: "10px"
                            
                        }}
                    >
                        {"Apply Filters"}
                    </button>
                    <button
                        type="submit"
                        style={{
                            width: "45%",
                            padding: "20px",
                            background: "white",
                            color: "black",
                            border: "1px solid black",
                            borderRadius: "10px",
                            marginBottom: "10px"
                        }}
                    >
                        {"Clear Filters"}
                    </button>
                </form>
                </div>
            </div>
            
            <form onSubmit={handleDeleteTask}>
                <h2>Görev Silme</h2>
                <input
                    type="number"
                    placeholder="Task ID"
                    value={deletingTaskID}
                    onChange={(e) => deleteTask(e.target.value)}
                    required
                    style={{ width: "95%", padding: "10px", marginBottom: "10px" }}
                />
                <button
                    type="submit"
                    style={{
                        width: "95%",
                        padding: "20px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        marginBottom: "10px"
                    }}
                >
                    {"Delete"}
                </button>
            </form>
            <h2>Görev Listesi</h2>
            {tasks.length === 0 ? (
                <p>Hiç görev yok.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.title}</strong> - {task.isCompleted ? 'Tamamlandı' : 'Devam ediyor'}
                            <button onClick={() => handleToggleTaskState(task.id)}
                                type="button"
                                style={{
                                    width: "25%",
                                    padding: "10px",
                                    background: "#4CAF50",
                                    color: "white",
                                    border: "10",
                                    borderRadius: "5px",
                                    marginBottom: "10px"
                                }}
                            >
                                {"Update State"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div>
                <button onClick={handleLogout}
                    type="button"
                    style={{
                        width: "100%",
                        padding: "10px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px"
                    }}
                >
                    {"Logout"}
                </button>
            </div>
        </div>
    );
};

export default TaskList;


