import React, { useState, useEffect } from 'react';
import "./Todolist.css";

const API_URL = 'https://6615754ab8b8e32ffc7b0405.mockapi.io/todos';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo = { text: inputValue, completed: false };
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo),
        });
        const createdTodo = await response.json();
        setTodos([...todos, createdTodo]);
        setInputValue('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const handleDelete = async (todoToDelete) => {
    try {
      await fetch(`${API_URL}/${todoToDelete.id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter((todo) => todo.id !== todoToDelete.id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setIsEditing(todo);
    setEditValue(todo.text);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = async (todo) => {
    if (editValue.trim()) {
      const updatedTodo = { ...todo, text: editValue };
      try {
        await fetch(`${API_URL}/${todo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTodo),
        });
        setTodos(todos.map((item) => (item.id === todo.id ? updatedTodo : item)));
        setIsEditing(null);
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  };

  const handleToggleComplete = async (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    try {
      await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      setTodos(todos.map((item) => (item.id === todo.id ? updatedTodo : item)));
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Add a new todo"
        />
        <button onClick={handleSubmit}>Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
            }}
          >
            {isEditing === todo ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={handleEditChange}
                  placeholder="Edit your todo"
                />
                <button onClick={() => handleEditSubmit(todo)}>Save</button>
              </>
            ) : (
              <>
                <span>{todo.text}</span>
                <button onClick={() => handleEdit(todo)}>Edit</button>
                <button onClick={() => handleDelete(todo)}>Delete</button>
                <button onClick={() => handleToggleComplete(todo)}>
                  {todo.completed ? '✓' : 'Mark as Done'}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
