/**
 * PROTASK - DOM INTERACTION & FEATURE MODULES (LHU WEB DESIGN STANDARD)
 * Học phần: Thiết kế Web (111101) - Trường Đại học Lạc Hồng (LHU)
 * Quản lý tương tác DOM cho 10 Trang Web chuyên nghiệp
 */

const UI = {
  // Hiển thị thông báo Toast góc màn hình với ánh hào quang Hổ Phách
  showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠' : type === 'danger' ? '✕' : 'ℹ';
    toast.innerHTML = `
      <span style="font-weight:bold; font-size:1.15rem; color:var(--primary);">${icon}</span>
      <div style="flex:1">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate3d(100%, 0, 0)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  },

  // Mở / Đóng Modal
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  // Helper lấy thông tin Member
  getMemberInfo(memberId) {
    const members = StorageManager.getMembers();
    return members.find(m => m.id === memberId) || {
      name: 'Chưa phân bổ',
      initials: '?',
      color: '#06b6d4',
      role: 'Thành viên dự án',
      email: 'member@lachong.edu.vn'
    };
  }
};

/* ===================================================================
   1. KANBAN FEATURE CONTROLLER (Trang 3: kanban.html)
   =================================================================== */
const KanbanController = {
  init() {
    this.renderColumns();
    this.setupDragAndDrop();
    this.setupFilters();
  },

  renderColumns() {
    const tasks = StorageManager.getTasks();
    const query = document.getElementById('search-task-input')?.value || '';
    const priorityFilter = document.getElementById('filter-priority')?.value || '';
    const memberFilter = document.getElementById('filter-assignee')?.value || '';

    const filtered = TaskLogic.filterTasks(tasks, {
      query,
      priority: priorityFilter,
      assigneeId: memberFilter
    });

    const columns = ['backlog', 'todo', 'doing', 'done'];

    columns.forEach(col => {
      const container = document.getElementById(`kanban-list-${col}`);
      const countBadge = document.getElementById(`count-${col}`);
      if (!container) return;

      const colTasks = filtered.filter(t => t.status === col);
      if (countBadge) countBadge.textContent = colTasks.length;

      container.innerHTML = '';

      if (colTasks.length === 0) {
        container.innerHTML = `
          <div style="padding: 28px 12px; text-align: center; color: var(--text-light); font-size: 0.84rem; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
            Chưa có công việc nào
          </div>
        `;
        return;
      }

      colTasks.forEach(task => {
        const member = UI.getMemberInfo(task.assigneeId);
        const deadlineStatus = TaskLogic.checkDeadlineStatus(task.endDate);

        const card = document.createElement('article');
        card.className = 'task-card card-clean';
        card.setAttribute('draggable', 'true');
        card.dataset.taskId = task.id;

        const priorityClass = `badge-${task.priority}`;
        const priorityLabel = task.priority === 'high' ? 'Khẩn cấp' : task.priority === 'medium' ? 'Vừa' : 'Thấp';

        card.innerHTML = `
          <div class="task-card-header">
            <span class="badge ${priorityClass}">${priorityLabel}</span>
            <div style="display:flex; gap:6px;">
              <button class="btn-icon btn-sm" onclick="event.stopPropagation(); KanbanController.quickMoveTask('${task.id}')" title="Chuyển nhanh trạng thái">➔</button>
              <button class="btn-icon btn-sm" onclick="event.stopPropagation(); KanbanController.deleteTask('${task.id}')" title="Xóa task" style="color:var(--danger)">✕</button>
            </div>
          </div>
          <h4 class="task-title"><a href="task-detail.html?id=${task.id}" style="color:inherit;">${task.title}</a></h4>
          <p class="task-desc">${task.description || 'Không có mô tả chi tiết'}</p>
          <div class="task-footer">
            <div class="task-deadline ${deadlineStatus === 'urgent' ? 'urgent' : ''}">
              <span>📅</span>
              <time datetime="${task.endDate}">${task.endDate || 'Chưa định'}</time>
            </div>
            <a href="task-detail.html?id=${task.id}" title="Xem chi tiết & bình luận" style="display:flex; align-items:center; gap:8px;">
              <div class="avatar avatar-sm" style="background-color: ${member.color}" title="${member.name} (${member.role})">
                ${member.initials}
              </div>
            </a>
          </div>
        `;

        // Click vào thẻ mở trang Chi tiết Task (Trang 4)
        card.addEventListener('click', (e) => {
          if (!e.target.closest('button')) {
            window.location.href = `task-detail.html?id=${task.id}`;
          }
        });

        // Sự kiện kéo thả HTML5 Native Drag & Drop
        card.addEventListener('dragstart', (e) => {
          card.classList.add('dragging');
          e.dataTransfer.setData('text/plain', task.id);
          e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
        });

        container.appendChild(card);
      });
    });

    this.updateKanbanProgress();
  },

  updateKanbanProgress() {
    const tasks = StorageManager.getTasks();
    const percent = TaskLogic.calculateProgress(tasks);
    const progressEl = document.getElementById('project-progress-percent');
    const progressBar = document.getElementById('project-progress-bar');
    if (progressEl) progressEl.textContent = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;
  },

  setupDragAndDrop() {
    const columnContainers = document.querySelectorAll('.kanban-column');
    columnContainers.forEach(col => {
      const targetStatus = col.dataset.status;

      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('drag-over');
      });

      col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over');
      });

      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain');
        if (!taskId) return;

        KanbanController.updateTaskStatus(taskId, targetStatus);
      });
    });
  },

  updateTaskStatus(taskId, newStatus) {
    const tasks = StorageManager.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const oldStatus = tasks[taskIndex].status;
      if (oldStatus !== newStatus) {
        tasks[taskIndex].status = newStatus;
        StorageManager.saveTasks(tasks);
        this.renderColumns();
        UI.showToast(`Đã chuyển "${tasks[taskIndex].title}" sang cột ${newStatus.toUpperCase()}`);
        
        if (newStatus === 'done') {
          UI.showToast('🎉 Tuyệt vời! Bạn đã hoàn thành 1 task.', 'success');
        }
      }
    }
  },

  quickMoveTask(taskId) {
    const tasks = StorageManager.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const order = ['backlog', 'todo', 'doing', 'done'];
    const currentIndex = order.indexOf(task.status);
    const nextStatus = order[(currentIndex + 1) % order.length];

    this.updateTaskStatus(taskId, nextStatus);
  },

  deleteTask(taskId) {
    if (confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
      let tasks = StorageManager.getTasks();
      const deletedTask = tasks.find(t => t.id === taskId);
      tasks = tasks.filter(t => t.id !== taskId);
      StorageManager.saveTasks(tasks);
      this.renderColumns();
      UI.showToast(`Đã xóa nhiệm vụ "${deletedTask?.title || ''}"`, 'warning');
    }
  },

  addNewTask(formEl) {
    const title = formEl.title.value.trim();
    const description = formEl.description.value.trim();
    const priority = formEl.priority.value;
    const assigneeId = formEl.assigneeId.value;
    const endDate = formEl.endDate.value;
    const estimatedHours = Number(formEl.estimatedHours.value) || 4;

    if (!title) {
      alert('Vui lòng nhập tiêu đề nhiệm vụ!');
      formEl.title.focus();
      return;
    }

    const newTask = {
      id: 'task-' + Date.now(),
      projectId: 'proj-1',
      title,
      description,
      status: 'todo',
      priority,
      assigneeId,
      startDate: new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-11-20',
      dayStart: 4,
      dayDuration: 3,
      estimatedHours,
      actualHours: 0,
      subtasks: [
        { id: 'st-' + Date.now(), text: 'Nghiên cứu & thiết lập ban đầu', done: false }
      ],
      comments: []
    };

    const tasks = StorageManager.getTasks();
    tasks.unshift(newTask);
    StorageManager.saveTasks(tasks);

    UI.closeModal('add-task-modal');
    formEl.reset();
    this.renderColumns();
    UI.showToast(`Đã tạo nhiệm vụ mới: "${title}" thành công!`, 'success');
  },

  setupFilters() {
    const searchInput = document.getElementById('search-task-input');
    const prioritySelect = document.getElementById('filter-priority');
    const assigneeSelect = document.getElementById('filter-assignee');

    searchInput?.addEventListener('input', () => this.renderColumns());
    prioritySelect?.addEventListener('change', () => this.renderColumns());
    assigneeSelect?.addEventListener('change', () => this.renderColumns());
  }
};

/* ===================================================================
   2. TASK DETAIL & COMMENTS CONTROLLER (Trang 4: task-detail.html)
   =================================================================== */
const TaskDetailController = {
  currentTask: null,

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    const tasks = StorageManager.getTasks();

    this.currentTask = tasks.find(t => t.id === taskId) || tasks[0];
    if (this.currentTask) {
      this.renderDetail();
      this.setupSubtasks();
      this.setupComments();
    }
  },

  renderDetail() {
    const task = this.currentTask;
    const member = UI.getMemberInfo(task.assigneeId);

    // Tiêu đề & mô tả
    const titleEl = document.getElementById('detail-task-title');
    const descEl = document.getElementById('detail-task-desc');
    const priorityEl = document.getElementById('detail-task-priority');
    const statusSelect = document.getElementById('detail-task-status');
    const assigneeNameEl = document.getElementById('detail-assignee-name');
    const assigneeRoleEl = document.getElementById('detail-assignee-role');
    const assigneeAvatarEl = document.getElementById('detail-assignee-avatar');
    const datesEl = document.getElementById('detail-task-dates');
    const hoursEl = document.getElementById('detail-task-hours');

    if (titleEl) titleEl.textContent = task.title;
    if (descEl) descEl.textContent = task.description || 'Không có mô tả chi tiết.';
    if (priorityEl) {
      priorityEl.textContent = task.priority.toUpperCase();
      priorityEl.className = `badge badge-${task.priority}`;
    }
    if (statusSelect) {
      statusSelect.value = task.status;
      statusSelect.onchange = (e) => {
        task.status = e.target.value;
        this.saveTaskChanges();
        UI.showToast(`Đã đổi trạng thái sang ${task.status.toUpperCase()}`);
      };
    }
    if (assigneeNameEl) assigneeNameEl.textContent = member.name;
    if (assigneeRoleEl) assigneeRoleEl.textContent = member.role;
    if (assigneeAvatarEl) {
      assigneeAvatarEl.textContent = member.initials;
      assigneeAvatarEl.style.backgroundColor = member.color;
    }
    if (datesEl) datesEl.textContent = `${task.startDate || '2026-11-01'} đến ${task.endDate || '2026-11-15'}`;
    if (hoursEl) hoursEl.textContent = `Ước tính: ${task.estimatedHours}h | Thực tế: ${task.actualHours || 0}h`;

    this.renderSubtasksList();
    this.renderCommentsList();
  },

  saveTaskChanges() {
    let tasks = StorageManager.getTasks();
    const idx = tasks.findIndex(t => t.id === this.currentTask.id);
    if (idx !== -1) {
      tasks[idx] = this.currentTask;
      StorageManager.saveTasks(tasks);
    }
  },

  setupSubtasks() {
    const addSubtaskBtn = document.getElementById('add-subtask-btn');
    const subtaskInput = document.getElementById('new-subtask-input');

    addSubtaskBtn?.addEventListener('click', () => {
      const text = subtaskInput.value.trim();
      if (!text) return;
      if (!this.currentTask.subtasks) this.currentTask.subtasks = [];
      this.currentTask.subtasks.push({
        id: 'st-' + Date.now(),
        text,
        done: false
      });
      this.saveTaskChanges();
      subtaskInput.value = '';
      this.renderSubtasksList();
      UI.showToast('Đã thêm đầu việc con mới!');
    });
  },

  renderSubtasksList() {
    const listEl = document.getElementById('subtasks-list-container');
    if (!listEl) return;
    const subtasks = this.currentTask.subtasks || [];

    if (subtasks.length === 0) {
      listEl.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Chưa có đầu việc con nào.</p>';
      return;
    }

    listEl.innerHTML = subtasks.map((st, index) => `
      <div class="checklist-item">
        <input type="checkbox" id="st-${st.id}" ${st.done ? 'checked' : ''} onchange="TaskDetailController.toggleSubtask(${index})">
        <label for="st-${st.id}" style="${st.done ? 'text-decoration: line-through; color: var(--text-light);' : ''}">${st.text}</label>
      </div>
    `).join('');
  },

  toggleSubtask(index) {
    if (this.currentTask.subtasks && this.currentTask.subtasks[index]) {
      this.currentTask.subtasks[index].done = !this.currentTask.subtasks[index].done;
      this.saveTaskChanges();
      this.renderSubtasksList();
    }
  },

  setupComments() {
    const commentForm = document.getElementById('task-comment-form');
    commentForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('task-comment-input');
      const text = input.value.trim();
      if (!text) return;

      const currentUser = StorageManager.getCurrentUser();
      if (!this.currentTask.comments) this.currentTask.comments = [];
      this.currentTask.comments.push({
        id: 'c-' + Date.now(),
        memberId: currentUser.id,
        text,
        time: 'Vừa xong'
      });

      this.saveTaskChanges();
      input.value = '';
      this.renderCommentsList();
      UI.showToast('Đã gửi phản hồi thảo luận!', 'success');
    });
  },

  renderCommentsList() {
    const container = document.getElementById('comments-list-container');
    if (!container) return;
    const comments = this.currentTask.comments || [];

    if (comments.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Chưa có bình luận nào. Hãy bắt đầu thảo luận!</p>';
      return;
    }

    container.innerHTML = comments.map(c => {
      const member = UI.getMemberInfo(c.memberId);
      return `
        <div class="comment-bubble">
          <div class="avatar avatar-sm" style="background-color: ${member.color}">
            ${member.initials}
          </div>
          <div class="comment-bubble-body">
            <h5>
              ${member.name}
              <span style="font-size:0.75rem; color:var(--text-light); font-weight:normal;">• ${c.time}</span>
            </h5>
            <p>${c.text}</p>
          </div>
        </div>
      `;
    }).join('');
  }
};

/* ===================================================================
   3. GANTT CHART CONTROLLER (Trang 5: gantt.html)
   =================================================================== */
const GanttController = {
  init() {
    this.renderGantt();
  },

  renderGantt() {
    const container = document.getElementById('gantt-chart-body');
    if (!container) return;

    const tasks = StorageManager.getTasks();
    container.innerHTML = '';

    tasks.forEach(task => {
      const member = UI.getMemberInfo(task.assigneeId);
      const row = document.createElement('div');
      row.className = 'gantt-row';

      const startCol = Math.max(1, Math.min(task.dayStart || 1, 14));
      const duration = Math.max(1, Math.min(task.dayDuration || 3, 14 - startCol + 1));

      const barLeft = ((startCol - 1) / 14) * 100;
      const barWidth = (duration / 14) * 100;

      const statusColors = {
        done: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
        doing: 'linear-gradient(90deg, #06b6d4 0%, #0ea5e9 100%)',
        todo: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
        backlog: 'linear-gradient(90deg, #664f40 0%, #8c5d43 100%)'
      };

      row.innerHTML = `
        <div class="gantt-task-info">
          <div class="avatar avatar-sm" style="background-color: ${member.color}" title="${member.name}">${member.initials}</div>
          <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            <a href="task-detail.html?id=${task.id}" style="font-weight: 700; font-size: 0.85rem; color:var(--text-main);">${task.title}</a>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${task.endDate} (${task.estimatedHours}h)</div>
          </div>
        </div>
        <div class="gantt-bar-track">
          <div class="gantt-bar" style="left: ${barLeft}%; width: ${barWidth}%; background: ${statusColors[task.status] || statusColors.todo};" onclick="window.location.href='task-detail.html?id=${task.id}'">
            ${task.status.toUpperCase()} (${duration}d)
          </div>
        </div>
      `;

      container.appendChild(row);
    });
  }
};

/* ===================================================================
   4. CALENDAR CONTROLLER (Trang 6: calendar.html)
   =================================================================== */
const CalendarController = {
  currentMonth: 10, // Tháng 11 (0-indexed)
  currentYear: 2026,

  init() {
    this.renderCalendar();
    this.setupMonthNav();
  },

  renderCalendar() {
    const gridContainer = document.getElementById('calendar-month-grid');
    const monthTitle = document.getElementById('calendar-current-month-label');
    if (!gridContainer) return;

    if (monthTitle) {
      monthTitle.textContent = `Tháng ${this.currentMonth + 1} / ${this.currentYear}`;
    }

    const tasks = StorageManager.getTasks();
    const days = TaskLogic.generateCalendarMonth(this.currentYear, this.currentMonth, tasks);

    gridContainer.innerHTML = '';

    days.forEach(day => {
      const cell = document.createElement('div');
      cell.className = `calendar-cell ${day.isToday ? 'today' : ''} ${!day.isCurrentMonth ? 'other-month' : ''}`;

      if (!day.isCurrentMonth) {
        cell.style.opacity = '0.3';
        gridContainer.appendChild(cell);
        return;
      }

      cell.innerHTML = `
        <div class="calendar-cell-date" style="${day.isToday ? 'color: var(--primary); font-weight: 800;' : ''}">
          ${day.dayNumber} ${day.isToday ? '★ Hôm nay' : ''}
        </div>
        <div class="calendar-cell-tasks" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:3px;">
          ${day.tasks.map(t => `
            <div class="calendar-task-chip" onclick="window.location.href='task-detail.html?id=${t.id}'" title="${t.title} (${t.status})">
              ${t.priority === 'high' ? '🔥 ' : ''}${t.title}
            </div>
          `).join('')}
        </div>
      `;

      gridContainer.appendChild(cell);
    });
  },

  setupMonthNav() {
    const prevBtn = document.getElementById('cal-prev-month');
    const nextBtn = document.getElementById('cal-next-month');
    const todayBtn = document.getElementById('cal-today-btn');

    prevBtn?.addEventListener('click', () => {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.renderCalendar();
    });

    nextBtn?.addEventListener('click', () => {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.renderCalendar();
    });

    todayBtn?.addEventListener('click', () => {
      this.currentMonth = 10;
      this.currentYear = 2026;
      this.renderCalendar();
    });
  }
};

/* ===================================================================
   5. RESOURCE ALLOCATION HEATMAP (Trang 7: resources.html)
   =================================================================== */
const ResourceController = {
  init() {
    this.renderHeatmap();
  },

  renderHeatmap() {
    const tableBody = document.getElementById('resource-heatmap-body');
    const alertBox = document.getElementById('resource-overload-alert');
    if (!tableBody) return;

    const members = StorageManager.getMembers();
    const tasks = StorageManager.getTasks();
    const allocations = TaskLogic.calculateResourceAllocation(members, tasks);

    const overloadedMembers = allocations.filter(a => a.isOverloaded);

    // Cảnh báo đỏ nếu có người > 40 giờ/tuần
    if (alertBox) {
      if (overloadedMembers.length > 0) {
        alertBox.style.display = 'flex';
        alertBox.innerHTML = `
          <div style="font-size:1.6rem;">⚠️</div>
          <div>
            <strong>CẢNH BÁO PHÂN BỔ TÀI NGUYÊN (QUÁ TẢI):</strong> Có ${overloadedMembers.length} thành viên đang bị gán vượt quá 40 giờ/tuần (${overloadedMembers.map(o => o.member.name).join(', ')}). Cần điều phối lại trên Bảng Kanban!
          </div>
        `;
      } else {
        alertBox.style.display = 'none';
      }
    }

    tableBody.innerHTML = '';

    allocations.forEach(item => {
      const m = item.member;
      const statusBadge = item.isOverloaded 
        ? `<span class="badge badge-high" style="background:var(--danger); color:#fff;">Quá tải (${item.weeklyHours}h)</span>`
        : `<span class="badge badge-gold">${item.statusLabel} (${item.weeklyHours}h)</span>`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="avatar avatar-sm" style="background:${m.color}">${m.initials}</div>
            <div>
              <div style="font-weight:700;">${m.name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${m.role}</div>
            </div>
          </div>
        </td>
        <td><strong>${item.totalTasks} task</strong></td>
        <td>${item.dailyHours[0]}h</td>
        <td>${item.dailyHours[1]}h</td>
        <td>${item.dailyHours[2]}h</td>
        <td>${item.dailyHours[3]}h</td>
        <td>${item.dailyHours[4]}h</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.location.href='kanban.html?assignee=${m.id}'">
            Điều chuyển
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  }
};

/* ===================================================================
   6. REPORTS & TIME-TRACKING (Trang 8: reports.html)
   =================================================================== */
const ReportsController = {
  timerInterval: null,
  timerSeconds: 0,
  isTimerRunning: false,

  init() {
    this.renderTimeLogs();
    this.setupTimer();
  },

  setupTimer() {
    const display = document.getElementById('stopwatch-display');
    const startBtn = document.getElementById('timer-start-btn');
    const resetBtn = document.getElementById('timer-reset-btn');

    if (!display || !startBtn) return;

    startBtn.addEventListener('click', () => {
      if (this.isTimerRunning) {
        clearInterval(this.timerInterval);
        this.isTimerRunning = false;
        startBtn.textContent = '▶ Tiếp tục';
        startBtn.className = 'btn btn-primary';
      } else {
        this.isTimerRunning = true;
        startBtn.textContent = '⏸ Tạm dừng';
        startBtn.className = 'btn btn-danger';
        this.timerInterval = setInterval(() => {
          this.timerSeconds++;
          const hrs = String(Math.floor(this.timerSeconds / 3600)).padStart(2, '0');
          const mins = String(Math.floor((this.timerSeconds % 3600) / 60)).padStart(2, '0');
          const secs = String(this.timerSeconds % 60).padStart(2, '0');
          display.textContent = `${hrs}:${mins}:${secs}`;
        }, 1000);
      }
    });

    resetBtn?.addEventListener('click', () => {
      clearInterval(this.timerInterval);
      this.isTimerRunning = false;
      this.timerSeconds = 0;
      display.textContent = '00:00:00';
      if (startBtn) {
        startBtn.textContent = '▶ Bắt đầu';
        startBtn.className = 'btn btn-primary';
      }
    });
  },

  renderTimeLogs() {
    const tableBody = document.getElementById('timelogs-table-body');
    if (!tableBody) return;

    const logs = StorageManager.getTimeLogs();
    const tasks = StorageManager.getTasks();
    const members = StorageManager.getMembers();

    tableBody.innerHTML = '';

    logs.forEach(log => {
      const task = tasks.find(t => t.id === log.taskId) || { title: 'Công việc chung' };
      const member = members.find(m => m.id === log.memberId) || { name: 'Thành viên' };

      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-color)';
      tr.innerHTML = `
        <td style="padding: 14px 16px; font-weight:600;">${task.title}</td>
        <td style="padding: 14px 16px;">${member.name}</td>
        <td style="padding: 14px 16px; color: var(--text-muted);">${log.date}</td>
        <td style="padding: 14px 16px; font-weight:700; color:var(--primary);">${log.duration}h</td>
        <td style="padding: 14px 16px; font-size: 0.85rem; color: var(--text-muted);">${log.description}</td>
      `;
      tableBody.appendChild(tr);
    });

    const totalHoursEl = document.getElementById('report-total-hours');
    if (totalHoursEl) {
      totalHoursEl.textContent = `${TaskLogic.calculateTotalHours(logs)} giờ`;
    }
  },

  submitWorkReport(formEl) {
    const taskId = formEl.taskId.value;
    const repoUrl = formEl.repoUrl.value.trim();
    const hours = Number(formEl.duration.value);
    const notes = formEl.notes.value.trim();

    if (hours <= 0 || isNaN(hours)) {
      alert('Số giờ làm việc thực tế phải lớn hơn 0 và không được để số âm!');
      formEl.duration.focus();
      return;
    }

    if (repoUrl && !TaskLogic.validateURL(repoUrl)) {
      alert('Vui lòng nhập đường dẫn URL hợp lệ (VD: https://github.com/...)');
      formEl.repoUrl.focus();
      return;
    }

    const currentUser = StorageManager.getCurrentUser();
    const newLog = {
      id: 'log-' + Date.now(),
      taskId,
      memberId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      duration: hours,
      description: notes || `Đã nộp kết quả link: ${repoUrl}`
    };

    const logs = StorageManager.getTimeLogs();
    logs.unshift(newLog);
    StorageManager.saveTimeLogs(logs);

    formEl.reset();
    this.renderTimeLogs();
    UI.showToast('Đã nộp báo cáo tiến độ và lưu Time-tracking thành công!', 'success');
  }
};

/* ===================================================================
   7. MEMBERS 3D FLIP CARD CONTROLLER (Trang 9: members.html)
   =================================================================== */
const MembersController = {
  init() {
    this.renderMembers();
  },

  renderMembers() {
    const container = document.getElementById('members-list-grid');
    if (!container) return;

    const members = StorageManager.getMembers();
    const tasks = StorageManager.getTasks();

    container.innerHTML = '';

    members.forEach(member => {
      const workload = TaskLogic.getMemberWorkload(tasks, member.id);

      const card = document.createElement('div');
      card.className = 'flip-card';
      card.innerHTML = `
        <div class="flip-card-inner">
          <!-- MẶT TRƯỚC 3D -->
          <div class="flip-card-front card-clean">
            <div class="member-avatar-box">
              <img src="${member.avatar}" alt="${member.name}" class="avatar avatar-lg">
              <span class="member-status-indicator"></span>
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 2px;">${member.name}</h3>
            <span class="badge badge-gold" style="margin-bottom: 10px;">${member.role}</span>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">📧 ${member.email}</p>
            <div class="amber-pill-badge" style="margin-bottom: 14px;">
              <span>⚡ Tải tuần: ${member.weeklyAllocatedHours || 35}h</span>
            </div>
            <p style="font-size: 0.75rem; color: var(--primary); font-weight: 700;">Xem chi tiết năng lực & nhiệm vụ</p>
          </div>

          <!-- MẶT SAU 3D (FLIP) -->
          <div class="flip-card-back">
            <h4 style="font-size: 1rem; font-weight: 800; color: var(--primary); margin-bottom: 12px;">HỒ SƠ NĂNG LỰC</h4>
            <div style="width: 100%; text-align: left; background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md); margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700;">
                <span>Hiệu suất Task:</span>
                <span style="color: var(--primary);">${workload.percent}%</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill cyan" style="width: ${workload.percent}%"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.74rem; color: var(--text-muted); margin-top: 4px;">
                <span>Hoàn thành: ${workload.completedTasks}/${workload.totalTasks}</span>
                <span>Giờ làm: ${workload.totalActHours}h</span>
              </div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:5px; justify-content:center; margin-bottom:14px;">
              ${member.skills.map(s => `<span class="badge badge-role" style="font-size:0.68rem;">${s}</span>`).join('')}
            </div>
            <button class="btn btn-primary btn-sm" style="width:100%;" onclick="window.location.href='kanban.html?assignee=${member.id}'">
              Xem bảng việc
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  },

  addNewMember(formEl) {
    const name = formEl.name.value.trim();
    const role = formEl.role.value.trim();
    const email = formEl.email.value.trim();
    const skillsStr = formEl.skills.value.trim();

    if (!name || !email) {
      alert('Vui lòng điền họ tên và email!');
      return;
    }

    if (!TaskLogic.validateEmail(email)) {
      alert('Email không hợp lệ! Vui lòng nhập đúng định dạng (VD: example@lachong.edu.vn hoặc @lhu.edu.vn)');
      return;
    }

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(-3);
    const colors = ['#06b6d4', '#0ea5e9', '#14b8a6', '#6366f1', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember = {
      id: 'mem-' + Date.now(),
      name,
      role: role || 'Thành viên dự án',
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=140&auto=format&fit=crop&q=80',
      initials,
      color: randomColor,
      isAdmin: false,
      weeklyAllocatedHours: 25,
      skills: skillsStr ? skillsStr.split(',').map(s => s.trim()) : ['HTML5 Semantic', 'CSS Grid', 'JavaScript'],
      tasksCount: 0,
      completedTasks: 0
    };

    const members = StorageManager.getMembers();
    members.push(newMember);
    StorageManager.saveMembers(members);

    UI.closeModal('add-member-modal');
    formEl.reset();
    this.renderMembers();
    UI.showToast(`Đã thêm thành viên "${name}" thành công!`, 'success');
  }
};

/* ===================================================================
   8. SETTINGS & PUSH NOTIFICATIONS (Trang 10: settings.html)
   =================================================================== */
const SettingsController = {
  deadlineInterval: null,

  init() {
    this.setupDeadlineScanner();
    this.setupExportImport();
    this.setupProfileForm();
  },

  setupDeadlineScanner() {
    // Tự động quét deadline mỗi 30 giây bằng setInterval()
    if (this.deadlineInterval) clearInterval(this.deadlineInterval);

    this.deadlineInterval = setInterval(() => {
      const tasks = StorageManager.getTasks();
      const urgentTasks = tasks.filter(t => t.status !== 'done' && TaskLogic.checkDeadlineStatus(t.endDate) === 'urgent');

      if (urgentTasks.length > 0) {
        UI.showToast(`🔔 CẢNH BÁO TỰ ĐỘNG: Có ${urgentTasks.length} nhiệm vụ sắp đến hạn trong 48h!`, 'warning');
      }
    }, 30000);
  },

  setupExportImport() {
    const exportBtn = document.getElementById('export-json-btn');
    const resetBtn = document.getElementById('reset-data-btn');

    exportBtn?.addEventListener('click', () => {
      const data = {
        members: StorageManager.getMembers(),
        projects: StorageManager.getProjects(),
        tasks: StorageManager.getTasks(),
        timelogs: StorageManager.getTimeLogs(),
        notifications: StorageManager.getNotifications()
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `protask_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      UI.showToast('Đã xuất sao lưu dữ liệu JSON thành công!', 'success');
    });

    resetBtn?.addEventListener('click', () => {
      if (confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu của nhóm LHU? Thao tác này không thể hoàn tác.')) {
        StorageManager.resetToDefault();
        UI.showToast('Đã thiết lập lại dữ liệu mẫu gốc.', 'info');
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  },

  setupProfileForm() {
    const form = document.getElementById('profile-settings-form');
    if (!form) return;

    const user = StorageManager.getCurrentUser();
    if (form.name) form.name.value = user.name;
    if (form.email) form.email.value = user.email;
    if (form.role) form.role.value = user.role;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      user.name = form.name.value.trim();
      user.email = form.email.value.trim();
      user.role = form.role.value.trim();

      StorageManager.setCurrentUser(user);
      UI.showToast('Đã lưu thông tin hồ sơ thành công!', 'success');
    });
  }
};

/* ===================================================================
   9. AUTHENTICATION CONTROLLER (Trang 1: login.html)
   =================================================================== */
const AuthController = {
  init() {
    this.setupAuthTabs();
    this.setupLoginForm();
    this.setupRegisterForm();
    this.setupQuickLogin();
    this.setupPasswordToggle();
  },

  setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const passInput = document.getElementById('login-password');
    toggleBtn?.addEventListener('click', () => {
      if (!passInput) return;
      const isPass = passInput.getAttribute('type') === 'password';
      passInput.setAttribute('type', isPass ? 'text' : 'password');
      toggleBtn.innerHTML = isPass ? 
        `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` : 
        `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  },

  setupAuthTabs() {
    const tabLogin = document.getElementById('tab-login-btn');
    const tabRegister = document.getElementById('tab-register-btn');
    const formLogin = document.getElementById('auth-login-form');
    const formRegister = document.getElementById('auth-register-form');

    tabLogin?.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.style.display = 'block';
      formRegister.style.display = 'none';
    });

    tabRegister?.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.style.display = 'block';
      formLogin.style.display = 'none';
    });
  },

  setupLoginForm() {
    const form = document.getElementById('auth-login-form');
    const alertBox = document.getElementById('login-alert-box');
    const successState = document.getElementById('authSuccessState');
    const testAccountsBox = document.getElementById('testAccountsBox');
    const pillTabs = document.querySelector('.auth-pill-tabs');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value;

      if (alertBox) {
        alertBox.style.display = 'none';
        alertBox.textContent = '';
      }

      if (!TaskLogic.validateEmail(email)) {
        this.showLoginAlert('Email không đúng định dạng (@lachong.edu.vn hoặc @lhu.edu.vn)!');
        return;
      }
      if (!TaskLogic.validatePassword(password)) {
        this.showLoginAlert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
      }

      // Xác thực tài khoản và mật khẩu thông qua StorageManager
      const result = StorageManager.login(email, password);

      if (!result.success) {
        this.showLoginAlert(result.message);
        UI.showToast(result.message, 'danger');
        return;
      }

      // Hiệu ứng đăng nhập thành công mượt mà (Video 2)
      if (form && successState) {
        form.style.display = 'none';
        if (testAccountsBox) testAccountsBox.style.display = 'none';
        if (pillTabs) pillTabs.style.display = 'none';
        successState.style.display = 'block';
      }

      UI.showToast(`Chào mừng ${result.user.name} đã đăng nhập!`, 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);
    });
  },

  showLoginAlert(msg) {
    let alertBox = document.getElementById('login-alert-box');
    if (!alertBox) {
      alertBox = document.createElement('div');
      alertBox.id = 'login-alert-box';
      alertBox.style.background = 'rgba(244, 63, 94, 0.15)';
      alertBox.style.border = '1px solid var(--danger)';
      alertBox.style.color = '#fecdd3';
      alertBox.style.padding = '10px 14px';
      alertBox.style.borderRadius = 'var(--radius-md)';
      alertBox.style.fontSize = '0.84rem';
      alertBox.style.marginBottom = '18px';
      const form = document.getElementById('auth-login-form');
      form?.parentNode.insertBefore(alertBox, form);
    }
    alertBox.textContent = `⚠️ ${msg}`;
    alertBox.style.display = 'block';
  },

  setupRegisterForm() {
    const form = document.getElementById('auth-register-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;
      const role = form.role ? form.role.value : 'Thành viên dự án';

      if (!name) {
        alert('Vui lòng nhập họ và tên!');
        return;
      }
      if (!TaskLogic.validateEmail(email)) {
        alert('Email phải có đuôi @lachong.edu.vn hoặc @lhu.edu.vn');
        return;
      }
      if (!TaskLogic.validatePassword(password)) {
        alert('Mật khẩu tối thiểu 6 ký tự!');
        return;
      }

      const result = StorageManager.register(name, email, password, role);
      if (!result.success) {
        alert(result.message);
        return;
      }

      UI.showToast(`Đăng ký tài khoản thành công cho ${result.user.name}! Đang chuyển hướng...`, 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    });
  },

  setupQuickLogin() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const alertBox = document.getElementById('login-alert-box');

    const fillCredentials = (email, pass, label) => {
      if (emailInput && passwordInput) {
        emailInput.value = email;
        passwordInput.value = pass;
        emailInput.focus();
        if (alertBox) alertBox.style.display = 'none';

        // Viền cyan sáng khi điền mẫu
        emailInput.style.borderColor = 'var(--primary)';
        passwordInput.style.borderColor = 'var(--primary)';
        setTimeout(() => {
          emailInput.style.borderColor = '';
          passwordInput.style.borderColor = '';
        }, 1200);

        UI.showToast(`Đã điền ${label}. Nhấn "Đăng Nhập Hệ Thống" để xác thực!`, 'info');
      }
    };

    // Hỗ trợ click vào bất kỳ hàng tài khoản mẫu nào trong bảng demo
    document.querySelectorAll('.credential-fill-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        // Tự động bật đèn nếu đèn đang tắt
        if (!LampController.isOn) {
          const lampToggle = document.getElementById('lampToggleBtn') || document.getElementById('lampPullString');
          lampToggle?.click();
        }
        const email = pill.getAttribute('data-email');
        const pass = pill.getAttribute('data-pass');
        const role = pill.getAttribute('data-role');
        fillCredentials(email, pass, role);
      });
    });
  }
};

/* ===================================================================
   10. INTERACTIVE LAMP CONTROLLER (Trang 1: login.html - Video 2)
   =================================================================== */
const LampController = {
  isOn: false,
  playClickSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(this.isOn ? 750 : 380, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio context may require prior user interaction
    }
  },
  init() {
    const lampPull = document.getElementById('lampPullString');
    const lampToggleBtn = document.getElementById('lampToggleBtn');
    const lampContainer = document.getElementById('deskLampContainer');

    const toggleLamp = () => {
      this.isOn = !this.isOn;
      document.body.setAttribute('data-lamp-on', this.isOn ? 'true' : 'false');
      
      const lightBeam = document.getElementById('lampLightBeam');
      const bulb = document.getElementById('lampBulbEl');
      const bulbCore = document.getElementById('lampBulbCore');
      const hint = document.getElementById('lampHintText');

      if (lightBeam) lightBeam.style.opacity = this.isOn ? '1' : '0';
      if (bulb) {
        bulb.setAttribute('fill', this.isOn ? '#38bdf8' : '#1e293b');
        bulb.style.filter = this.isOn ? 'url(#lampBulbGlow)' : 'none';
      }
      if (bulbCore) {
        bulbCore.setAttribute('fill', this.isOn ? '#ffffff' : '#334155');
      }
      if (hint) {
        hint.textContent = this.isOn ? 'Đèn đang BẬT • Bấm hoặc kéo dây để tắt' : 'Kéo dây đèn để bật sáng & đăng nhập';
      }

      // Âm thanh cơ học công tắc đèn
      this.playClickSound();

      // Hiệu ứng kéo dây nảy nhẹ nảy lại theo vật lý
      if (lampPull) {
        lampPull.style.transition = 'transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1)';
        lampPull.style.transform = 'translateY(22px)';
        setTimeout(() => {
          lampPull.style.transform = 'translateY(0)';
        }, 180);
      }

      if (this.isOn) {
        UI.showToast('💡 Đèn đã bật! Form đăng nhập đã hiển thị, hãy điền tài khoản.', 'info');
        // Tự động focus vào ô email sau khi thẻ xuất hiện
        setTimeout(() => {
          document.getElementById('login-email')?.focus();
        }, 350);
      } else {
        UI.showToast('🌙 Đèn đã tắt. Không gian tối giản được kích hoạt.', 'info');
      }
    };

    lampPull?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLamp();
    });
    lampToggleBtn?.addEventListener('click', toggleLamp);
    lampContainer?.addEventListener('click', (e) => {
      toggleLamp();
    });
  }
};

/* ===================================================================
   11. ANIMATED CARDS OPENING HERO (Trang 2: index.html - Video 1)
   =================================================================== */
const AnimatedCardsHero = {
  currentIndex: 0,
  modules: [
    {
      id: 'kanban',
      num: '01',
      tag: 'PHÂN HỆ 2.3.4 • SPRINT 2',
      title: 'BẢNG VIỆC KANBAN TƯƠNG TÁC',
      desc: 'Bố cục CSS Grid 4 cột (Backlog, To-do, Doing, Done) kết hợp kéo thả HTML5 Native Drag & Drop mượt mà 60fps, tự động tính % hoàn thành toàn bộ dự án.',
      link: 'kanban.html',
      badge: 'Sprint 2 Active',
      icon: '📋'
    },
    {
      id: 'gantt',
      num: '02',
      tag: 'LỊCH TRÌNH TIẾN ĐỘ',
      title: 'BIỂU ĐỒ GANTT TIMELINE 14 NGÀY',
      desc: 'Theo dõi tiến trình công việc theo trục thời gian thực của Sprint 2, trực quan hóa tiến độ bằng thanh gradient thanh lịch và kiểm soát mốc hoàn thành.',
      link: 'gantt.html',
      badge: '14 Ngày Sprint',
      icon: '📈'
    },
    {
      id: 'resources',
      num: '03',
      tag: 'ĐIỀU PHỐI TÀI NGUYÊN',
      title: 'BIỂU ĐỒ NHIỆT & CẢNH BÁO QUÁ TẢI',
      desc: 'Phân tích phân bổ giờ làm từ T2 đến T6 của 5 thành viên, tự động kích hoạt cảnh báo đỏ nổi bật khi phát hiện thành viên vượt quá ngưỡng 40h/tuần.',
      link: 'resources.html',
      badge: 'Cảnh Báo Đỏ > 40h',
      icon: '🔥'
    },
    {
      id: 'calendar',
      num: '04',
      tag: 'LỊCH HỌP & SỰ KIỆN',
      title: 'LỊCH CÔNG VIỆC THÁNG CSS GRID',
      desc: 'Lưới CSS Grid 7 cột chuẩn Thứ 2 đến Chủ nhật, tự động ánh xạ deadline các đầu việc, hỗ trợ chuyển đổi tháng và gắn nhãn mức độ ưu tiên.',
      link: 'calendar.html',
      badge: 'CSS Grid 7 Cột',
      icon: '📅'
    },
    {
      id: 'reports',
      num: '05',
      tag: 'CHẤM CÔNG & NĂNG SUẤT',
      title: 'BÁO CÁO TIẾN ĐỘ & STOPWATCH',
      desc: 'Đồng hồ bấm giờ Pomodoro thời gian thực, form nộp kết quả công việc kiểm tra URL bằng Regex và mảng nhật ký ghi nhận giờ làm thực tế.',
      link: 'reports.html',
      badge: 'Stopwatch Realtime',
      icon: '⏱️'
    }
  ],

  init() {
    this.renderCards();
    this.setupListeners();
    this.updateActiveModule(0);
  },

  renderCards() {
    const carousel = document.getElementById('heroCardsCarousel');
    if (!carousel) return;
    carousel.innerHTML = this.modules.map((m, idx) => `
      <div class="opening-card ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <div class="opening-card-icon">${m.icon}</div>
        <div class="opening-card-meta">
          <div class="opening-card-num">${m.num} / 05</div>
          <div class="opening-card-title">${m.title.split(' ')[0]} ${m.title.split(' ')[1] || ''}</div>
          <div class="opening-card-sub">${m.badge}</div>
        </div>
      </div>
    `).join('');
  },

  setupListeners() {
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    const carousel = document.getElementById('heroCardsCarousel');

    prevBtn?.addEventListener('click', () => {
      let next = this.currentIndex - 1;
      if (next < 0) next = this.modules.length - 1;
      this.updateActiveModule(next);
    });

    nextBtn?.addEventListener('click', () => {
      let next = (this.currentIndex + 1) % this.modules.length;
      this.updateActiveModule(next);
    });

    carousel?.addEventListener('click', (e) => {
      const card = e.target.closest('.opening-card');
      if (card) {
        const idx = parseInt(card.dataset.index, 10);
        this.updateActiveModule(idx);
      }
    });
  },

  updateActiveModule(idx) {
    this.currentIndex = idx;
    const m = this.modules[idx];
    if (!m) return;

    // Cập nhật text trái
    const tagEl = document.getElementById('heroModuleTag');
    const titleEl = document.getElementById('heroModuleTitle');
    const descEl = document.getElementById('heroModuleDesc');
    const linkEl = document.getElementById('heroModuleLink');
    const progressFill = document.getElementById('heroProgressFill');
    const counterEl = document.getElementById('heroCounterEl');

    if (tagEl) tagEl.textContent = m.tag;
    if (titleEl) {
      titleEl.style.opacity = '0';
      titleEl.style.transform = 'translateY(6px)';
      setTimeout(() => {
        titleEl.textContent = m.title;
        titleEl.style.opacity = '1';
        titleEl.style.transform = 'translateY(0)';
      }, 150);
    }
    if (descEl) {
      descEl.style.opacity = '0';
      setTimeout(() => {
        descEl.textContent = m.desc;
        descEl.style.opacity = '1';
      }, 150);
    }
    if (linkEl) {
      linkEl.href = m.link;
    }

    // Cập nhật thanh tiến độ và số đếm
    if (progressFill) {
      progressFill.style.width = `${((idx + 1) / this.modules.length) * 100}%`;
    }
    if (counterEl) {
      counterEl.innerHTML = `<strong>${m.num}</strong> / 05`;
    }

    // Cập nhật class active trên các card
    document.querySelectorAll('.opening-card').forEach((card, i) => {
      card.classList.toggle('active', i === idx);
    });
  }
};
