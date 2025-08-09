import logo from './logo.svg';
import './App.css';
import TaskList from './pages/TaskLists';
import AuthPage from './pages/AuthPage';

function App() {
  return (
      <div className="App">
          <TaskList />
          <AuthPage/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
