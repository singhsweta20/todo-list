document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressPercentage = document.getElementById('progressPercentage');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateProgress();
    }

    function updateProgress() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        progressBar.style.width = `${percent}%`;
        progressPercentage.textContent = `${percent}%`;
        progressText.textContent = `${completed} of ${total} tasks completed`;
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const searchVal = searchInput.value.toLowerCase();

        const filtered = tasks.filter(task => {
            const matchesFilter = 
                currentFilter === 'all' ? true :
                currentFilter === 'active' ? !task.completed : task.completed;
            const matchesSearch = task.title.toLowerCase().includes(searchVal);
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
        } else {
            emptyState.classList.add('hidden');
            emptyState.classList.remove('flex');
        }

        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = `bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition-all ${task.completed ? 'opacity-70' : ''}`;

            const priorityColors = {
                Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                High: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            };

            li.innerHTML = `
                <div class="flex items-center gap-3 flex-1">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} class="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer">
                    <div class="flex flex-col">
                        <span class="text-sm text-slate-200 ${task.completed ? 'completed-text' : ''}">${escapeHtml(task.title)}</span>
                        <div class="flex gap-2 mt-1">
                            <span class="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">${task.category}</span>
                            <span class="text-[10px] font-medium px-2 py-0.5 rounded border ${priorityColors[task.priority]}">${task.priority}</span>
                        </div>
                    </div>
                </div>
                <button class="delete-btn text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors">
                    <i class="fa-regular fa-trash-can text-sm"></i>
                </button>
            `;

            // Checkbox event
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                if (task.completed && typeof confetti === 'function') {
                    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
                }
                saveTasks();
                renderTasks();
            });

            // Delete button event
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        });

        updateProgress();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Add Task Handler
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (!title) return;

        tasks.unshift({
            id: Date.now(),
            title,
            category: taskCategory.value,
            priority: taskPriority.value,
            completed: false
        });

        taskInput.value = '';
        saveTasks();
        renderTasks();
    });

    // Filter Buttons logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Search input logic
    searchInput.addEventListener('input', renderTasks);

    // Clear completed tasks logic
    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });

    // Initial render
    renderTasks();
});
