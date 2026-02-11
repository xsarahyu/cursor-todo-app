const API = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('todo_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function register({ email, password, name }) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function getTodos() {
  const res = await fetch(`${API}/todos`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load todos');
  return res.json();
}

export async function createTodo(title) {
  const res = await fetch(`${API}/todos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create todo');
  return data;
}

export async function updateTodo(id, updates) {
  const res = await fetch(`${API}/todos/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update todo');
  return data;
}

export async function deleteTodo(id) {
  const res = await fetch(`${API}/todos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete todo');
}
