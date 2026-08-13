document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    const prioritySelect = document.getElementById('prioritySelect');
    const tasksContainer = document.getElementById('tasksContainer');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Stats Elements
    const progressText = document.getElementById('progressText');
    const percentBadge = document.getElementById('percentBadge');
    const progressBarFill = document.getElementById('progressBarFill');

    // Modal Elements
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editTaskInput = document.getElementById('editTaskInput');
    const editCategorySelect = document.getElementById('editCategorySelect');
    const editPrioritySelect = document.getElementById('editPrioritySelect');

    let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
    let currentFilter = 'all';
    let editTaskId = null;

    // Save Tasks to LocalStorage
    const saveTasks = () => {
        localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
        updateStats();
    };

    // Show Toast Notification
    const showToast = (message) => {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-cyan)"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // Update Stats & Progress Bar
    const updateStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        progressText.innerText = `${completed} of ${total} tasks completed`;
        percentBadge.innerText = `${percentage}%`;
        progressBarFill.style.width = `${percentage}%`;
    };

    // Render Tasks
    const renderTasks = () => {
        const query = searchInput.value.toLowerCase();
        tasksContainer.innerHTML = '';

        let filteredTasks = tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(query);
            if (currentFilter === 'active') return matchesSearch && !task.completed;
            if (currentFilter === 'completed') return matchesSearch && task.completed;
            return matchesSearch;
        });

        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-clipboard-list"></i>
                    <p>No tasks found. Enjoy your day!</p>
                </div>
            `;
            return;
        }

        filteredTasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `task-item ${task.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="task-left">
                    <div class="custom-checkbox" onclick="toggleTask('${task.id}')">
                        ${task.completed ? '<i class="fa-solid fa-check"></i>' : ''}
                    </div>
                    <div class="task-info">
                        <span class="task-text">${escapeHTML(task.text)}</span>
                        <div class="task-tags">
                            <span class="tag tag-category">${task.category}</span>
                            <span class="tag tag-priority ${task.priority}">${task.priority}</span>
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn" onclick="openEditModal('${task.id}')" title="Edit Task">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteTask('${task.id}')" title="Delete Task">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            tasksContainer.appendChild(item);
        });
    };

    // Utility: Prevent XSS Attacks
    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    };

    // Add Task
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now().toString(),
            text,
            category: categorySelect.value,
            priority: prioritySelect.value,
            completed: false
        };

        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        showToast('Task added successfully!');
    });

    // Toggle Complete Status
    window.toggleTask = (id) => {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveTasks();
        renderTasks();
    };

    // Delete Task
    window.deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        showToast('Task deleted');
    };

    // Open Edit Modal
    window.openEditModal = (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        editTaskId = id;
        editTaskInput.value = task.text;
        editCategorySelect.value = task.category;
        editPrioritySelect.value = task.priority;
        editModal.classList.add('active');
    };

    // Close Modal
    const closeModal = () => {
        editModal.classList.remove('active');
        editTaskId = null;
    };
    closeModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);

    // Save Edit
    saveEditBtn.addEventListener('click', () => {
        const updatedText = editTaskInput.value.trim();
        if (!updatedText) return;

        tasks = tasks.map(t => t.id === editTaskId ? {
            ...t,
            text: updatedText,
            category: editCategorySelect.value,
            priority: editPrioritySelect.value
        } : t);

        saveTasks();
        renderTasks();
        closeModal();
        showToast('Task updated!');
    });

    // Filter Tabs
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Search Input
    searchInput.addEventListener('input', renderTasks);

    // Initial Load
    updateStats();
    renderTasks();
});
