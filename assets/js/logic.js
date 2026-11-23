/**
 * PROTASK - BUSINESS LOGIC & DATA TRANSFORMATIONS (LHU WEB DESIGN STANDARD)
 * Học phần: Thiết kế Web (111101) - Trường Đại học Lạc Hồng (LHU)
 * Module: logic.js (Pure Functions không thao tác trực tiếp với DOM)
 */

const TaskLogic = {
  /**
   * Tính phần trăm hoàn thành của một dự án
   * @param {Array} tasks - Danh sách nhiệm vụ
   * @param {string} projectId - ID dự án (tùy chọn)
   * @returns {number} Phần trăm làm tròn (0-100)
   */
  calculateProgress(tasks = [], projectId = null) {
    const targetTasks = projectId ? tasks.filter(t => t.projectId === projectId) : tasks;
    if (!targetTasks || targetTasks.length === 0) return 0;
    const completed = targetTasks.filter(t => t.status === 'done').length;
    return Math.round((completed / targetTasks.length) * 100);
  },

  /**
   * Thống kê số lượng theo trạng thái
   */
  getStats(tasks = []) {
    return {
      total: tasks.length,
      backlog: tasks.filter(t => t.status === 'backlog').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      doing: tasks.filter(t => t.status === 'doing').length,
      done: tasks.filter(t => t.status === 'done').length
    };
  },

  /**
   * Thống kê theo độ ưu tiên
   */
  getPriorityStats(tasks = []) {
    return {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };
  },

  /**
   * Tính tổng số giờ làm việc thực tế từ time logs (Tuần 12 Array Reduce)
   */
  calculateTotalHours(logs = []) {
    return logs.reduce((sum, item) => sum + (Number(item.duration) || 0), 0);
  },

  /**
   * Thống kê khối lượng công việc (Workload) của từng thành viên
   */
  getMemberWorkload(tasks = [], memberId) {
    const memberTasks = tasks.filter(t => t.assigneeId === memberId);
    const completed = memberTasks.filter(t => t.status === 'done').length;
    const totalEstHours = memberTasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);
    const totalActHours = memberTasks.reduce((sum, t) => sum + (Number(t.actualHours) || 0), 0);
    const percent = memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0;

    return {
      totalTasks: memberTasks.length,
      completedTasks: completed,
      pendingTasks: memberTasks.length - completed,
      percent,
      totalEstHours,
      totalActHours
    };
  },

  /**
   * Tính toán ma trận phân bổ tài nguyên & Cảnh báo quá tải (Trang 7: Heatmap)
   * Yêu cầu đề bài: Cảnh báo đỏ nếu một người bị gán > 40 giờ/tuần
   */
  calculateResourceAllocation(members = [], tasks = []) {
    return members.map(member => {
      const memberTasks = tasks.filter(t => t.assigneeId === member.id);
      const weeklyHours = member.weeklyAllocatedHours || 
        memberTasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);
      
      const isOverloaded = weeklyHours > 40;
      const isOptimal = weeklyHours >= 30 && weeklyHours <= 40;
      const isUnderAllocated = weeklyHours < 20;

      let status = 'normal';
      let statusLabel = 'Tối ưu';
      if (isOverloaded) {
        status = 'overloaded'; // Kích hoạt Cảnh Báo Đỏ
        statusLabel = 'Quá tải (>40h)';
      } else if (isOptimal) {
        status = 'optimal';
        statusLabel = 'Chuẩn (30-40h)';
      } else if (isUnderAllocated) {
        status = 'under';
        statusLabel = 'Thấp (<20h)';
      }

      return {
        member,
        totalTasks: memberTasks.length,
        weeklyHours,
        isOverloaded,
        status,
        statusLabel,
        dailyHours: [
          Math.round(weeklyHours * 0.22),
          Math.round(weeklyHours * 0.24),
          Math.round(weeklyHours * 0.20),
          Math.round(weeklyHours * 0.18),
          Math.round(weeklyHours * 0.16)
        ]
      };
    });
  },

  /**
   * Kiểm tra tình trạng deadline
   * @returns { 'overdue' | 'urgent' | 'normal' }
   */
  checkDeadlineStatus(dateString) {
    if (!dateString) return 'normal';
    const now = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 2) return 'urgent';
    return 'normal';
  },

  /**
   * Tạo lưới lịch tháng (Trang 6: Calendar View - CSS Grid 7 cột)
   */
  generateCalendarMonth(year = 2026, month = 10, tasks = []) {
    // month: 0-indexed (10 = Tháng 11)
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Ngày trong tuần của ngày 1 (0: CN, 1: T2, ...) -> chuyển sang T2 làm ngày đầu (0: T2, ..., 6: CN)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days = [];

    // Các ô trống tháng trước
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false, tasks: [] });
    }

    // Các ngày trong tháng
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.endDate === dateStr || t.startDate === dateStr);
      const isToday = (d === 9 && month === 10 && year === 2026); // Mốc ngày hiện tại của đồ án

      days.push({
        dayNumber: d,
        dateString: dateStr,
        isCurrentMonth: true,
        isToday,
        tasks: dayTasks
      });
    }

    return days;
  },

  /**
   * Bộ lọc dữ liệu đa tiêu chí (Tuần 12 Array Filter & Map)
   */
  filterTasks(tasks = [], { query = '', status = '', priority = '', assigneeId = '' } = {}) {
    return tasks.filter(task => {
      const matchQuery = !query || 
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase());

      const matchStatus = !status || status === 'all' || task.status === status;
      const matchPriority = !priority || priority === 'all' || task.priority === priority;
      const matchAssignee = !assigneeId || assigneeId === 'all' || task.assigneeId === assigneeId;

      return matchQuery && matchStatus && matchPriority && matchAssignee;
    });
  },

  /**
   * Kiểm tra định dạng Email ĐH Lạc Hồng (Tuần 11 Regex)
   * Chấp nhận đuôi @lachong.edu.vn và @lhu.edu.vn
   */
  validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@(lachong\.edu\.vn|lhu\.edu\.vn|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/i;
    return regex.test(String(email).trim().toLowerCase());
  },

  /**
   * Kiểm tra mật khẩu (độ dài >= 6)
   */
  validatePassword(password) {
    return typeof password === 'string' && password.trim().length >= 6;
  },

  /**
   * Kiểm tra định dạng URL (Tuần 11)
   */
  validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  },

  /**
   * Format số giờ
   */
  formatHours(num) {
    return `${Number(num).toFixed(1)}h`;
  }
};
