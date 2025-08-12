import logo from './logo.svg';
import './App.css';
import TaskList from './pages/TaskLists';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskLists from './pages/TaskLists';
function App() {
  return (
      <div className="App">
          <BrowserRouter>
              <Routes>
                  {/* in openings route to /tasks page  */}
                  <Route path="/" element={<Navigate to="/tasks" />} />

                  { /* Login */}
                  <Route path="/login" element={<LoginPage />} />

                  { /* Register */}
                  <Route path="/register" element={<RegisterPage />} />

                  { /* TaskList */}
                  <Route path="/tasks" element={<TaskLists />} />

              </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
