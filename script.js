document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const categorySelect = document.getElementById('categorySelect');
  const prioritySelect = document.getElementById('prioritySelect');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
  let currentFilter = 'all';

  // Theme Switcher
  themeToggleBtn.addEventListener('click', () => {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });

  function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = '';
    const query = searchInput.value.toLowerCase().trim();

    const filtered = tasks.filter(task => {
      const matchFilter = 
        currentFilter === 'all' || 
        (currentFilter === 'completed' && task.completed) ||
        (currentFilter === 'active' && !task.completed);
      const matchSearch = task.text.toLowerCase().includes(query);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      filtered.forEach((task) => {
        const actualIndex = tasks.indexOf(task);
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
          <div class="task-left">
            <div class="checkbox"><i class="fa-solid fa-check"></i></div>
            <div class="task-details">
              <span class="task-title">${escapeHtml(task.text)}</span>
              <div class="meta-tags">
                <span class="tag tag-cat">${task.category}</span>
                <span class="tag tag-${task.priority}">${task.priority}</span>
              </div>
            </div>
          </div>
          <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
        `;

        li.querySelector('.task-left').addEventListener('click', () => {
          tasks[actualIndex].completed = !tasks[actualIndex].completed;
          saveTasks();
          renderTasks();
        });

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          tasks.splice(actualIndex, 1);
          saveTasks();
          renderTasks();
        });

        taskList.appendChild(li);
      });
    }

    // Update Progress Bar
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBar.style.width = `${pct}%`;
    progressPercent.textContent = `${pct}% Completed (${completed}/${total})`;
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
      text,
      category: categorySelect.value,
      priority: prioritySelect.value,
      completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  searchInput.addEventListener('input', renderTasks);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderTasks();
    });
  });

  renderTasks();
});
