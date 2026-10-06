import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const getTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    setTasks(data);
  };

  const saveTask = async () => {
    if (!title.trim()) return;

    const task = {
      title,
      description,
      completed: false,
    };

    if (editingId) {
      const currentTask = tasks.find((task) => task.id === editingId);

      await fetch(`${API_URL}/tasks/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          completed: currentTask.completed,
        }),
      });
    } else {
      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
    }

    setTitle("");
    setDescription("");
    setEditingId(null);
    getTasks();
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    getTasks();
  };

  const completeTask = async (task) => {
    await fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        completed: !task.completed,
      }),
    });

    getTasks();
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={saveTask}>
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </div>

      {tasks.map((task) => (
        <div className="task" key={task.id}>
          <div>
            <h3 className={task.completed ? "completed" : ""}>
              {task.title}
            </h3>
            <p>{task.description}</p>
          </div>

          <div className="actions">
            <button onClick={() => completeTask(task)}>
              {task.completed ? "Undo" : "Complete"}
            </button>

            <button onClick={() => editTask(task)}>
              Edit
            </button>

            <button onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;