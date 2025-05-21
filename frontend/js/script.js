// API Configuration - Change this to match your backend URL
const API_BASE_URL = 'http://localhost:3000';

// DOM Elements
const authSection = document.getElementById('auth-section');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const todoSection = document.getElementById('todo-section');
const userInfo = document.getElementById('user-info');
const usernameDisplay = document.getElementById('username-display');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const todoError = document.getElementById('todo-error');
const themeToggle = document.getElementById('theme-toggle');

// Theme Management
function initTheme() {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
}

// Toggle theme
function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme
initTheme();

// Theme toggle event listener
themeToggle.addEventListener('change', toggleTheme);

// Auth toggle links
document.getElementById('show-signup').addEventListener('click', function(e) {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', function(e) {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Logout button
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    showAuthForms();
});

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
        usernameDisplay.textContent = username;
        showTodoSection();
        fetchTodos();
    } else {
        // Clear any existing auth data
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        showAuthForms();
    }
}

// Show auth forms and hide todo section
function showAuthForms() {
    authSection.classList.remove('hidden');
    todoSection.classList.add('hidden');
    userInfo.classList.add('hidden');
    clearErrors();
}

// Show todo section and hide auth forms
function showTodoSection() {
    authSection.classList.add('hidden');
    todoSection.classList.remove('hidden');
    userInfo.classList.remove('hidden');
    clearErrors();
}

// Clear all error messages
function clearErrors() {
    loginError.textContent = '';
    signupError.textContent = '';
    todoError.textContent = '';
}

// Format date for displaying
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    // For tasks created today, just show the time
    if (isToday) {
        return `Today at ${date.toLocaleTimeString('en-US', options)}`;
    }

    // For tasks from yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${date.toLocaleTimeString('en-US', options)}`;
    }

    // For older tasks, show the full date
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}

// Handle login form submission
document.getElementById('login').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    loginUser(username, password);
});

// Handle signup form submission
document.getElementById('signup').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    signupUser(username, password);
});

// Handle todo form submission
document.getElementById('todo-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = todoInput.value.trim();
    if (title) {
        addTodo(title);
        todoInput.value = '';
    }
});

// API Calls

// Login user
async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to login');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);

        showTodoSection();
        fetchTodos();
    } catch (error) {
        loginError.textContent = error.message;
        console.error('Login error:', error);
    }
}

// Signup user
async function signupUser(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to sign up');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);

        showTodoSection();
        fetchTodos();
    } catch (error) {
        signupError.textContent = error.message;
        console.error('Signup error:', error);
    }
}

// Fetch all todos
async function fetchTodos() {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            showAuthForms();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/todo`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Unauthorized - token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                showAuthForms();
                return;
            }

            const data = await response.json();
            throw new Error(data.message || 'Failed to fetch todos');
        }

        const data = await response.json();
        renderTodos(data.todos || []);
    } catch (error) {
        todoError.textContent = error.message;
        console.error('Fetch todos error:', error);
    }
}

// Add a new todo
async function addTodo(title) {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            showAuthForms();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/todo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to add todo');
        }

        // Refresh todos
        fetchTodos();
    } catch (error) {
        todoError.textContent = error.message;
        console.error('Add todo error:', error);
    }
}

// Toggle todo completion status
async function toggleTodo(id, completed) {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            showAuthForms();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to update todo');
        }

        // Update UI without refetching all todos
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            if (completed) {
                todoItem.classList.add('completed');
            } else {
                todoItem.classList.remove('completed');
            }
        }
    } catch (error) {
        todoError.textContent = error.message;
        console.error('Update todo error:', error);
    }
}

// Delete a todo
async function deleteTodo(id) {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            showAuthForms();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete todo');
        }

        // Remove todo from UI
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.remove();
        }
    } catch (error) {
        todoError.textContent = error.message;
        console.error('Delete todo error:', error);
    }
}

// Render todos in the UI
function renderTodos(todos) {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No tasks yet. Add one above!';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.margin = '20px 0';
        emptyMessage.style.color = 'var(--text-secondary-color)';
        todoList.appendChild(emptyMessage);
        return;
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = todo._id;

        if (todo.completed) {
            li.classList.add('completed');
        }

        const leftDiv = document.createElement('div');
        leftDiv.className = 'todo-item-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', function() {
            toggleTodo(todo._id, this.checked);
        });

        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.title;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'todo-time';
        // Use the todo creation date or current date if not available
        const todoDate = todo.createdAt ? todo.createdAt : new Date().toISOString();
        timeSpan.textContent = formatDate(todoDate);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'todo-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
            deleteTodo(todo._id);
        });

        contentDiv.appendChild(span);
        contentDiv.appendChild(timeSpan);

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(contentDiv);

        actionsDiv.appendChild(deleteBtn);

        li.appendChild(leftDiv);
        li.appendChild(actionsDiv);

        todoList.appendChild(li);
    });
}

// Initialize the application
checkAuth();
