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
    const [assignedPerson, setAssigneedPerson] = useState("");
    const [deletingTaskID, deleteTask] = useState("");
    const [users, setUsers] = useState([]);

    
    
    const newTaskObj = {
        title: newTask,
        description: description,
        createdDate: new Date().toISOString(),
        assignedPerson: assignedPerson,
        isCompleted: false
    };

   
    const handleAddTask = (e) => {
        e.preventDefault();
        TaskService.create(newTaskObj).then(res => {
            setTasks([...tasks, res.data]);
            setNewTask("");
            setDescription("");
            setAssigneedPerson("");
        })
            .catch(err => console.error("Görev eklenemedi", err));
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
                        required
                        style={{
                            width: "95%",
                            padding: "10px",
                            marginBottom: "10px",
                            minHeight: "80px", 
                            resize: "vertical"   
                        }}
                    />
                    <label htmlFor="assignedPerson" >Assignee Person</label>
                    <input
                        type="text"
                        placeholder="Enter assignee name"
                        value={assignedPerson}
                        onChange={(e) => setAssigneedPerson(e.target.value)}
                        required
                        style={{ width: "95%", padding: "10px", marginBottom: "20px" }}
                    />


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
                <form onSubmit={handleAddTask}>
                    <label htmlFor="status">Status</label>
                    <input
                        type="text"
                        placeholder="Enter status"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        required
                        style={{ width: "95%", padding: "10px", marginBottom: "20px" }}
                    />
                    <label htmlFor="assignee">Assigneee</label>
                    <select id="assignee" className="w-full border p-2 mb-3">
                        <option value="">All</option>
                        {Array.isArray(users) &&
                            users.map((user) =>
                                user?.id && user?.username ? (
                                    <option key={user.id} value={user.id}>
                                        {user.username}
                                    </option>
                                ) : null
                            )
                        }
                    </select>
                    <label htmlFor="dueDate" >Due Date Range</label>
                    <input
                        type="text"
                        placeholder="2024-07-01"
                        value={assignedPerson}
                        onChange={(e) => setAssigneedPerson(e.target.value)}
                        required
                        style={{ width: "95%", padding: "10px", marginBottom: "20px" }}
                    />


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


