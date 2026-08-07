document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const taskCount = document.getElementById('taskCount');

  // Load saved tasks from LocalStorage
  let tasks = JSON.parse(localStorage.getItem('my_todo_tasks')) || [];

  function saveTasks() {
    localStorage.setItem('my_todo_tasks', JSON.stringify(tasks));
  }

  function updateUI() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
          <div class="task-content">
            <div class="custom-checkbox"></div>
            <span class="task-text">${escapeHtml(task.text)}</span>
          </div>
          <button class="delete-btn" title="Delete Task">✕</button>
        `;

        // Toggle task completion
        li.querySelector('.task-content').addEventListener('click', () => {
          tasks[index].completed = !tasks[index].completed;
          saveTasks();
          updateUI();
        });

        // Delete task with animation
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          li.style.opacity = '0';
          li.style.transform = 'translateY(10px)';
          setTimeout(() => {
            tasks.splice(index, 1);
            saveTasks();
            updateUI();
          }, 200);
        });

        taskList.appendChild(li);
      });
    }

    // Update remaining task counter
    const activeCount = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'}`;
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({ text: text, completed: false });
    saveTasks();
    updateUI();
    taskInput.value = '';
    taskInput.focus();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // Event Listeners
  addBtn.addEventListener('click', addTask);

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Initial UI Render
  updateUI();
});
