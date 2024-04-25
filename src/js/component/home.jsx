import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const fetchTodos = () => {
    fetch("https://playground.4geeks.com/todo/users/andres")
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Failed to fetch todos");
        }
        return resp.json();
      })
      .then((data) => {
        const todoObj = data.todos.reduce((a, v) => ({ ...a, [v.id]: v }), {});
        setTodos(todoObj);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = () => {
    if (!newTodo) return;
    fetch("https://playground.4geeks.com/todo/todos/andres", {
      method: "POST",
      body: JSON.stringify({
        label: newTodo,
        is_done: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Failed to sync todos");
        }
      })
      .then((data) => {
        fetchTodos();
        setNewTodo("");
      })
      .catch((error) => console.error("Error syncing todos:", error));
  };

  const deleteTodo = (todoId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Failed to sync todos");
        }
      })
      .then((data) => fetchTodos())
      .catch((error) => console.error("Error syncing todos:", error));
  };

  const updateTodo = (todoId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({
        label: todos[todoId].newValue,
        is_done: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Failed to sync todos");
        }
      })
      .then((data) => {
        fetchTodos();
      })
      .catch((error) => console.error("Error syncing todos:", error));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const changeTodo = (todoId, newInfo) => {
    setTodos((prev) => ({ ...prev, [todoId]: { ...prev[todoId], ...newInfo } }));
  };

  return (
    <div className="todo-list-container">
      <h1 className="todo-list-title">Todo List</h1>
      <div className="input-container">
        <input
          className="todo-input"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add new todo"
        />
        <button className="add-button" onClick={addTodo}>
          Add
        </button>
      </div>
      <ul className="todo-items">
        {Object.keys(todos).map((keyProp) => {
          const todo = todos[keyProp];
          const isEdit = todo.isEdit;
          return (
            <li key={keyProp} className="todo-item">
              {isEdit ? (
                <input
                  className="todo-input"
                  type="text"
                  value={todo?.newValue}
                  onChange={(e) =>
                    changeTodo(todo.id, { newValue: e.target.value })
                  }
                  placeholder="Edit Todo"
                />
              ) : (
                todo.label
              )}
              {!isEdit && (
                <button
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              )}
              {isEdit && (
                <button
                  className="delete-button"
                  onClick={() => {
                    changeTodo(todo.id, { isEdit: false, newValue: "" });
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                className="edit-button"
                onClick={() => {
                  if (isEdit) {
                    updateTodo(todo.id);
                    return;
                  }
                  changeTodo(todo.id, { isEdit: true, newValue: todo.label });
                }}
              >
                {isEdit ? "Save" : "Edit"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TodoList;
