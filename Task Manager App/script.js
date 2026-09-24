const initialTasks = [
  { id: 1, title: 'Design homepage hero', priority: 'High', completed: false },
  { id: 2, title: 'Review landing page copy', priority: 'Medium', completed: true },
  { id: 3, title: 'Prepare client presentation', priority: 'High', completed: false },
  { id: 4, title: 'Upload project assets', priority: 'Low', completed: false },
];

let tasks = [...initialTasks];
let activeFilter = 'all';

const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const progressValue = document.getElementById('progressValue');
const filterButtons = document.querySelectorAll('.filter-btn');
const navLinks = document.querySelectorAll('.side-nav a');
const panels = document.querySelectorAll('.page-panel');
const pageTitle = document.getElementById('pageTitle');

const navTitles = {
  dashboard: 'Project task board',
  tasks: 'Task overview',
  calendar: 'Weekly calendar',
  projects: 'Active projects',
  settings: 'Workspace settings',
};

function getFilteredTasks() {
  if (activeFilter === 'completed') {
    return tasks.filter((task) => task.completed);
  }

  if (activeFilter === 'pending') {
    return tasks.filter((task) => !task.completed);
  }

  return tasks;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  if (!taskList) return;

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<li class="task-item"><span class="task-label">No tasks in this view.</span></li>';
  } else {
    taskList.innerHTML = filteredTasks
      .map(
        (task) => `
          <li class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-item left">
              <button class="task-check" data-id="${task.id}" aria-label="Mark task complete"></button>
              <span class="task-label">${task.title}</span>
            </div>
            <div class="task-meta">
              <span class="priority-pill ${task.priority.toLowerCase()}">${task.priority}</span>
              <button class="task-delete" data-id="${task.id}" aria-label="Delete task">×</button>
            </div>
          </li>
        `
      )
      .join('');
  }

  const allTaskCount = tasks.length;
  const finishedCount = tasks.filter((task) => task.completed).length;
  const openCount = allTaskCount - finishedCount;
  const percent = allTaskCount ? Math.round((finishedCount / allTaskCount) * 100) : 0;

  if (totalCount) totalCount.textContent = allTaskCount;
  if (completedCount) completedCount.textContent = finishedCount;
  if (pendingCount) pendingCount.textContent = openCount;
  if (progressValue) progressValue.textContent = `${percent}%`;
}

function addTask(title) {
  if (!title.trim()) return;

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    priority: 'Medium',
    completed: false,
  };

  tasks.unshift(newTask);
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
}

if (taskForm) {
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addTask(taskInput.value);
    taskForm.reset();
    taskInput.focus();
  });
}

if (taskList) {
  taskList.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('task-check')) {
      const id = Number(target.dataset.id);
      toggleTask(id);
    }

    if (target.classList.contains('task-delete')) {
      const id = Number(target.dataset.id);
      deleteTask(id);
    }
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderTasks();
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = link.dataset.nav;

    navLinks.forEach((item) => item.classList.toggle('active', item === link));
    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.view === target);
    });

    if (pageTitle && navTitles[target]) {
      pageTitle.textContent = navTitles[target];
    }
  });
});

renderTasks();
