import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api';
import './TodoList.css';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setAdding(true);
    setError('');
    try {
      const todo = await createTodo(title);
      setTodos((prev) => [todo, ...prev]);
      setNewTitle('');
    } catch (err) {
      setError(err.message || 'Failed to add todo');
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const updated = await updateTodo(id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message || 'Failed to update todo');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete todo');
    }
  }

  if (loading) {
    return <div className="todo-loading">Loading todos…</div>;
  }

  return (
    <div className="todo-page">
      <h2 className="todo-heading">Your tasks</h2>

      <form onSubmit={handleAdd} className="todo-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="todo-input"
          disabled={adding}
        />
        <button type="submit" className="todo-add" disabled={adding || !newTitle.trim()}>
          Add
        </button>
      </form>

      {error && <div className="todo-error">{error}</div>}

      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="todo-empty">No tasks yet. Add one above.</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>
              <button
                type="button"
                className="todo-check"
                onClick={() => handleToggle(todo.id)}
                aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {todo.completed ? '✓' : ''}
              </button>
              <span className="todo-title">{todo.title}</span>
              <button
                type="button"
                className="todo-delete"
                onClick={() => handleDelete(todo.id)}
                aria-label="Delete"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
