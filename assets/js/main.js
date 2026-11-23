/**
 * PROTASK - APPLICATION ENTRY POINT & MAIN CONTROLLER (LHU WEB DESIGN STANDARD)
 * Kiến trúc UI: Obsidian Slate & Electric Cyan • Dark / Light Mode Switcher
 */

// Đồng bộ theme ngay khi script thực thi để tránh chớp giao diện (FOUT)
(function() {
  try {
    const key = 'protask_theme_mode_v7';
    const savedTheme = localStorage.getItem(key) || localStorage.getItem('protask_theme_mode_v6');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      if (document.body) document.body.classList.add('light-theme');
    }
  } catch (e) {}
})();

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    // 1. Kiểm tra phiên đăng nhập (Route Auth Guard)
    if (!this.checkAuth()) return;

    this.initTheme();
    this.initCurrentUser();
    this.initSidebar();
    this.initHeaderStats();
    this.initHeroBanner();
    this.initDashboard();
    this.initGlobalSearch();
    this.initPageTransitions();
  },

  // Hệ thống bảo vệ tuyến đường (Auth Guard): Chưa đăng nhập thì chuyển về login.html
  checkAuth() {
    const path = window.location.pathname.toLowerCase();
    const isLoginPage = path.endsWith('login.html');
    const session = StorageManager.getSession();

    if (!isLoginPage) {
      if (!session || !session.isLoggedIn || !session.user) {
        window.location.href = 'login.html';
        return false;
      }
    }
    return true;
  },

  // Đồng bộ User Session lên Header & Sidebar + xử lý Đăng xuất
  initCurrentUser() {
    const user = StorageManager.getCurrentUser();
    const avatarEl = document.querySelector('.user-mini-profile .avatar');
    const nameEl = document.querySelector('.user-mini-info h5');
    const roleEl = document.querySelector('.user-mini-info p');

    if (avatarEl && user) {
      avatarEl.textContent = user.initials || 'NCĐ';
      avatarEl.style.backgroundColor = user.color || '#06b6d4';
    }
    if (nameEl && user) {
      nameEl.textContent = user.name;
    }
    if (roleEl && user) {
      roleEl.textContent = user.role;
    }

    // Đăng xuất khi click vào nút hoặc profile
    document.querySelectorAll('.btn-logout-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống PROTASK LHU?')) {
          StorageManager.logout();
        }
      });
    });
  },

  // Khởi tạo hiệu ứng Hero Banner Animated Cards Opening (Video 1)
  initHeroBanner() {
    if (document.getElementById('heroCardsCarousel') && typeof AnimatedCardsHero !== 'undefined') {
      AnimatedCardsHero.init();
    }
  },

  // Khởi tạo và đồng bộ Dark / Light Mode
  initTheme() {
    const savedTheme = localStorage.getItem(StorageManager.KEYS.THEME) || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = (savedTheme === 'light') ? '🌙' : '☀️';
      themeToggleBtn.setAttribute('title', (savedTheme === 'light') ? 'Chuyển sang chế độ Tối (Dark Slate)' : 'Chuyển sang chế độ Sáng (Light Clean)');
      
      themeToggleBtn.addEventListener('click', () => {
        const isNowLight = document.body.classList.toggle('light-theme');
        const currentMode = isNowLight ? 'light' : 'dark';
        localStorage.setItem(StorageManager.KEYS.THEME, currentMode);
        themeToggleBtn.innerHTML = isNowLight ? '🌙' : '☀️';
        themeToggleBtn.setAttribute('title', isNowLight ? 'Chuyển sang chế độ Tối (Dark Slate)' : 'Chuyển sang chế độ Sáng (Light Clean)');
        UI.showToast(`Đã chuyển sang giao diện ${isNowLight ? 'Ban ngày (Light Mode - Nền sáng tinh gọn)' : 'Ban đêm (Dark Slate - Nền tối công nghệ)'}`, 'info');
      });
    }
  },

  // Phương thức thiết lập Theme trực tiếp từ Settings
  setTheme(mode) {
    if (mode === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem(StorageManager.KEYS.THEME, mode);
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = (mode === 'light') ? '🌙' : '☀️';
      themeToggleBtn.setAttribute('title', (mode === 'light') ? 'Chuyển sang chế độ Tối (Dark Slate)' : 'Chuyển sang chế độ Sáng (Light Clean)');
    }
    UI.showToast(`Đã kích hoạt giao diện ${mode === 'light' ? 'Ban ngày (Light Mode)' : 'Ban đêm (Dark Slate)'}`, 'info');
  },

  // Toggle Sidebar trên Mobile & Tablet
  initSidebar() {
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.app-sidebar');

    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('mobile-open');
      });

      // Đóng khi click ngoài màn hình
      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      });
    }
  },

  // Cập nhật số liệu trên Topbar
  initHeaderStats() {
    const notifs = StorageManager.getNotifications();
    const unreadCount = notifs.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }

    const notifBtn = document.getElementById('notif-dropdown-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        const notifList = notifs.map(n => `• [${n.time}] ${n.title}:\n  ${n.message}`).join('\n\n');
        alert(`🔔 TRUNG TÂM THÔNG BÁO TỰ ĐỘNG PROTASK (LHU):\n\n${notifList}`);
      });
    }
  },

  // Tìm kiếm toàn cục
  initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const val = searchInput.value.trim();
          if (val) {
            window.location.href = `kanban.html?search=${encodeURIComponent(val)}`;
          }
        }
      });
    }
  },

  // Hiệu ứng chuyển trang mượt mà (Smooth Page Transitions - Không bị khựng giật)
  initPageTransitions() {
    // Bắt sự kiện chuyển trang nội bộ để tạo hiệu ứng fade/slide êm ái
    document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="javascript"])').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:')) return;
        
        e.preventDefault();
        document.body.classList.add('page-leaving');
        setTimeout(() => {
          window.location.href = href;
        }, 160);
      });
    });
  },

  // Khởi tạo Dashboard Trang chủ (Trang 2: index.html)
  initDashboard() {
    const dashboardStatsContainer = document.getElementById('dashboard-stats-overview');
    if (!dashboardStatsContainer) return;

    const tasks = StorageManager.getTasks();
    const members = StorageManager.getMembers();
    const timeLogs = StorageManager.getTimeLogs();
    const projects = StorageManager.getProjects();

    const stats = TaskLogic.getStats(tasks);
    const overallProgress = TaskLogic.calculateProgress(tasks);
    const totalHours = TaskLogic.calculateTotalHours(timeLogs);

    // Cập nhật các thẻ KPI
    const totalTasksEl = document.getElementById('dash-stat-total');
    const doneTasksEl = document.getElementById('dash-stat-done');
    const progressEl = document.getElementById('dash-stat-progress');
    const hoursEl = document.getElementById('dash-stat-hours');

    if (totalTasksEl) totalTasksEl.textContent = stats.total;
    if (doneTasksEl) doneTasksEl.textContent = stats.done;
    if (progressEl) progressEl.textContent = `${overallProgress}%`;
    if (hoursEl) hoursEl.textContent = `${totalHours}h`;

    // Cập nhật vòng tròn tiến độ SVG (Donut Chart)
    const circleProgress = document.getElementById('dash-svg-progress');
    const circlePercentText = document.getElementById('dash-donut-percent');
    if (circleProgress) {
      const radius = 54;
      const circumference = 2 * Math.PI * radius;
      circleProgress.style.strokeDasharray = `${circumference} ${circumference}`;
      const offset = circumference - (overallProgress / 100) * circumference;
      circleProgress.style.strokeDashoffset = offset;
    }
    if (circlePercentText) {
      circlePercentText.textContent = `${overallProgress}%`;
    }

    // Danh sách nhiệm vụ khẩn cấp (Urgent Tasks)
    const urgentList = document.getElementById('dash-urgent-tasks-list');
    if (urgentList) {
      const urgentTasks = tasks.filter(t => t.status !== 'done').slice(0, 4);
      urgentList.innerHTML = urgentTasks.map(t => {
        const m = UI.getMemberInfo(t.assigneeId);
        const priorityBadge = t.priority === 'high' ? 'badge-high' : 'badge-medium';
        return `
          <div class="urgent-task-item card-clean">
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="badge ${priorityBadge}">${t.priority.toUpperCase()}</span>
              <div>
                <a href="task-detail.html?id=${t.id}" style="font-weight:700; color:var(--text-main); font-size:0.92rem;">${t.title}</a>
                <div style="font-size:0.75rem; color:var(--text-muted);">Hạn chót: ${t.endDate}</div>
              </div>
            </div>
            <div class="avatar avatar-sm" style="background:${m.color}">${m.initials}</div>
          </div>
        `;
      }).join('');
    }

    // Render danh sách tiến độ của 5 thành viên (Workload)
    const memberProgressContainer = document.getElementById('dash-members-workload');
    if (memberProgressContainer) {
      memberProgressContainer.innerHTML = members.map(m => {
        const wl = TaskLogic.getMemberWorkload(tasks, m.id);
        return `
          <div style="margin-bottom: 16px;">
            <div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:700; margin-bottom:4px;">
              <span>${m.name} (${m.role})</span>
              <span style="color:var(--primary);">${wl.percent}%</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill cyan" style="width: ${wl.percent}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
};
