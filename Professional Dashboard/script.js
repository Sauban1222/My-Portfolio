const members = [
  { name: 'Alicia Kim', role: 'Frontend Lead', tasks: 12, completed: 9, initials: 'AK', color: '#ff5b6d' },
  { name: 'Daniel Ross', role: 'Backend', tasks: 10, completed: 7, initials: 'DR', color: '#ff8e7a' },
  { name: 'Priya Shah', role: 'Product Designer', tasks: 9, completed: 8, initials: 'PS', color: '#ff7f50' },
  { name: 'Oliver Lee', role: 'QA Analyst', tasks: 8, completed: 6, initials: 'OL', color: '#a7283e' },
];

const tasks = [
  { title: 'Landing page redesign', status: 'Done', progress: 92, due: 'Completed' },
  { title: 'Client onboarding flow', status: 'In Progress', progress: 76, due: 'Due today' },
  { title: 'API integration testing', status: 'In Progress', progress: 64, due: 'Due tomorrow' },
  { title: 'Campaign dashboard setup', status: 'Done', progress: 88, due: 'Completed' },
];

const weeklyActivity = [62, 74, 68, 84, 91, 88, 96];
const navLabels = {
  overview: 'Team performance overview',
  tasks: 'Task management board',
  analytics: 'Analytics & performance',
  team: 'Team directory',
  settings: 'Workspace settings',
};

const pageTitleEl = document.getElementById('pageTitle');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const activeMembersEl = document.getElementById('activeMembers');
const productivityRateEl = document.getElementById('productivityRate');
const memberListEl = document.getElementById('memberList');
const taskSummaryListEl = document.getElementById('taskSummaryList');
const weeklyChartEl = document.getElementById('weeklyChart');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const panels = document.querySelectorAll('.page-panel');

const totalTasks = members.reduce((sum, member) => sum + member.tasks, 0);
const completedTasks = members.reduce((sum, member) => sum + member.completed, 0);
const productivityRate = Math.round((completedTasks / totalTasks) * 100);

if (totalTasksEl) totalTasksEl.textContent = totalTasks;
if (completedTasksEl) completedTasksEl.textContent = completedTasks;
if (activeMembersEl) activeMembersEl.textContent = members.length;
if (productivityRateEl) productivityRateEl.textContent = `${productivityRate}%`;

if (memberListEl) {
  memberListEl.innerHTML = members
    .map((member) => {
      const percent = Math.min(100, Math.round((member.completed / member.tasks) * 100));
      return `
        <div class="member-row">
          <div class="member-meta">
            <div class="member-avatar" style="background: linear-gradient(135deg, ${member.color}, #ffb0a3);">${member.initials}</div>
            <div>
              <div class="member-name">${member.name}</div>
              <div class="member-role">${member.role}</div>
            </div>
          </div>

          <div class="member-progress">
            <div class="bar"><span class="fill" style="width: ${percent}%"></span></div>
            <span class="value">${percent}%</span>
          </div>
        </div>
      `;
    })
    .join('');
}

if (taskSummaryListEl) {
  taskSummaryListEl.innerHTML = tasks
    .map((task) => {
      const tagClass = task.status === 'Done' ? 'tag-done' : 'tag-progress';
      return `
        <div class="task-row">
          <div class="task-row-top">
            <div>
              <strong>${task.title}</strong>
              <span>${task.due}</span>
            </div>
            <span class="mini-tag ${tagClass}">${task.status}</span>
          </div>
          <div class="task-bar"><span class="fill" style="width: ${task.progress}%"></span></div>
        </div>
      `;
    })
    .join('');
}

if (weeklyChartEl) {
  weeklyChartEl.innerHTML = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    .map((day, index) => {
      return `
        <div class="chart-col">
          <div class="chart-bar" style="height: ${weeklyActivity[index]}%"></div>
          <span>${day}</span>
        </div>
      `;
    })
    .join('');
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const target = link.dataset.nav;
    navLinks.forEach((item) => item.classList.toggle('active', item === link));
    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.view === target);
    });

    if (pageTitleEl && navLabels[target]) {
      pageTitleEl.textContent = navLabels[target];
    }
  });
});
