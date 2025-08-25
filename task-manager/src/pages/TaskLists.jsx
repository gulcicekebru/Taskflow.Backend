// src/pages/TaskList.jsx
import React, { useEffect, useState } from 'react';
import TaskService from '../api/TaskService';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <h2>Görev Listesi</h2>
            {tasks.length === 0 ? (
                <p>Hiç görev yok.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.title}</strong> - {task.isCompleted ? 'Tamamlandı' : 'Devam ediyor'}
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


