import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    return () => subscription.unsubscribe();
  }, []);

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content, isDone: false });
    }
  }

  function editTodo(id: string, currentContent: string) {
    const newContent = window.prompt("Edit todo content", currentContent);
    if (newContent) {
      client.models.Todo.update({ id, content: newContent });
    }
  }

  function toggleTodoStatus(id: string, currentStatus: boolean) {
    client.models.Todo.update({ id, isDone: !currentStatus });
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <button onClick={signOut}>Sign out</button>
          <h1>{user?.username}'s todos</h1>

          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
                <input 
                  type="checkbox" 
                  checked={todo.isDone || false} 
                  onChange={() => toggleTodoStatus(todo.id, todo.isDone || false)} 
                />
                {todo.content}
                <button onClick={() => editTodo(todo.id, todo.content || '')}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
