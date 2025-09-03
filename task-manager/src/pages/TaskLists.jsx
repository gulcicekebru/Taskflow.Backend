// src/pages/TaskList.jsx
import React, { useEffect, useState } from 'react';
import TaskService from '../api/TaskService';
import { useNavigate } from 'react-router-dom';




const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState("");
    const [deletingTaskID, deleteTask] = useState("");
    const [changeState] = useState();
    
    
    const newTaskObj = {
        title: newTask,
        description: "",
        createdDate: new Date().toISOString(),
        assignedPerson : "",
        isCompleted: false
    };

   
    const handleAddTask = (e) => {
        e.preventDefault();
        TaskService.create(newTaskObj).then(res => {
            setTasks([...tasks, res.data]);
            setNewTask("");
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
        const taskToUpdate = tasks.find(t => t.id === id);
        if (taskToUpdate.isCompleted) {
            return;
        }

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
            <form onSubmit={handleAddTask}>
                <input
                    type="text"
                    placeholder="Task Name"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    required
                    style={{ width: "95%", padding: "10px", marginBottom: "10px" }}
                />
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px"
                    }}
                >
                    {"Create"}
                </button>
            </form>
            <form onSubmit={handleDeleteTask}>
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
                        width: "100%",
                        padding: "10px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px"
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
                                    border: "none",
                                    borderRadius: "5px"
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


