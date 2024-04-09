import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  
  const fetchTodos = () => {
    fetch('https://playground.4geeks.com/todo')
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Failed to fetch todos');
        }
        return resp.json();
      })
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  };

  useEffect(() => {
    
    fetchTodos();
  }, []);

 
  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const updatedTodos = [...todos, { task: newTodo }];
      setTodos(updatedTodos);
      syncTodos(updatedTodos);
      setNewTodo('');
    }
  };

  
  const deleteTodo = todoId => {
    const updatedTodos = todos.filter((todo, index) => index !== todoId);
    setTodos(updatedTodos);
    syncTodos(updatedTodos);
  };

  
  const syncTodos = updatedTodos => {
    fetch('https://playground.4geeks.com/todo', {
      method: "PUT",
      body: JSON.stringify(updatedTodos),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Failed to sync todos');
        }
        return resp.json();
      })
      .then(data => console.log('Todos synced successfully:', data))
      .catch(error => console.error('Error syncing todos:', error));
  };

  
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-list-container">
      <h1 className="todo-list-title">Todo List</h1>
      <div className="input-container">
        <input
          className="todo-input"
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress} 
          placeholder="Add new todo"
        />
        <button className="add-button" onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-items">
        {todos.map((todo, index) => (
          <li key={index} className="todo-item">
            {todo.task}
            <button className="delete-button" onClick={() => deleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;



