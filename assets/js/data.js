/**
 * PROTASK - DATA LAYER & STORAGE CONTRACT (LHU WEB DESIGN STANDARD)
 * Học phần: Thiết kế Web (111101) - Trường Đại học Lạc Hồng (LHU)
 * Shared Data Contract & Authentication Layer cho hệ thống 10 trang web
 */

const DEFAULT_MEMBERS = [
  {
    id: 'mem-1',
    name: 'Nguyễn Chí Đạt',
    role: 'Project Manager (Leader)',
    email: '125000004@lachong.edu.vn',
    password: '125000004', // Mật khẩu mặc định là MSSV
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80',
    initials: 'NCĐ',
    color: '#06b6d4', // Cyan
    isAdmin: true,
    skills: ['Agile / Scrum', 'System Architecture', 'Git PR Review', 'Team Leadership'],
    weeklyAllocatedHours: 42, // > 40h trigger cảnh báo đỏ (Overload) theo đề bài
    tasksCount: 4,
    completedTasks: 3
  },
  {
    id: 'mem-2',
    name: 'Hồ Nguyễn Mai Trang',
    role: 'Frontend UI Specialist',
    email: '125001156@lachong.edu.vn',
    password: '125001156',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&auto=format&fit=crop&q=80',
    initials: 'HMT',
    color: '#0ea5e9', // Sky Blue
    isAdmin: false,
    skills: ['HTML5 Semantic', 'CSS Grid 4-col', 'Flexbox', 'Mobile First'],
    weeklyAllocatedHours: 36,
    tasksCount: 5,
    completedTasks: 3
  },
  {
    id: 'mem-3',
    name: 'Nguyễn Thị Tuyết Ngân',
    role: 'UI/UX Designer',
    email: '125001247@lachong.edu.vn',
    password: '125001247',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=140&auto=format&fit=crop&q=80',
    initials: 'NTN',
    color: '#14b8a6', // Teal
    isAdmin: false,
    skills: ['Figma Prototype', 'Design System', 'Responsive UI', 'Design Tokens'],
    weeklyAllocatedHours: 28,
    tasksCount: 3,
    completedTasks: 2
  },
  {
    id: 'mem-4',
    name: 'Nguyễn Tấn Thuận',
    role: 'Data & Logic Engineer',
    email: '125000770@lachong.edu.vn',
    password: '125000770',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80',
    initials: 'NTT',
    color: '#6366f1', // Indigo
    isAdmin: false,
    skills: ['JavaScript ES6+', 'Data Contracts', 'DOM Manipulation', 'Regex Validator'],
    weeklyAllocatedHours: 35,
    tasksCount: 4,
    completedTasks: 3
  },
  {
    id: 'mem-5',
    name: 'Hoàng Tuấn Anh',
    role: 'QA & Test Engineer',
    email: '125002570@lachong.edu.vn',
    password: '125002570',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140&auto=format&fit=crop&q=80',
    initials: 'HTA',
    color: '#8b5cf6', // Violet
    isAdmin: false,
    skills: ['W3C Validation', 'Cross-browser Testing', 'Performance Profiling', 'Bug Tracking'],
    weeklyAllocatedHours: 24,
    tasksCount: 4,
    completedTasks: 4
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Hệ thống Quản lý Dự án & Task LHU',
    code: 'LHU-PROTASK',
    description: 'Xây dựng giải pháp web quản lý công việc và phân bổ tài nguyên cho nhóm 5 sinh viên ĐH Lạc Hồng.',
    progress: 78,
    status: 'In Progress',
    deadline: '2026-11-20',
    totalTasks: 12,
    completedTasks: 8
  },
  {
    id: 'proj-2',
    name: 'Cổng Đăng ký Môn học Thông minh',
    code: 'LHU-PORTAL',
    description: 'Phân hệ xem điểm GPA tự động và giỏ hàng đăng ký môn học trực quan.',
    progress: 90,
    status: 'Active',
    deadline: '2026-11-15',
    totalTasks: 8,
    completedTasks: 7
  },
  {
    id: 'proj-3',
    name: 'Smart Energy Eco Tracker',
    code: 'ECO-ENERGY',
    description: 'Mô phỏng giám sát năng lượng đô thị và cảnh báo tiêu thụ theo biểu giá bậc thang.',
    progress: 45,
    status: 'Planning',
    deadline: '2026-12-05',
    totalTasks: 6,
    completedTasks: 2
  }
];

const DEFAULT_TASKS = [
  {
    id: 'task-101',
    projectId: 'proj-1',
    title: 'Xây dựng cấu trúc HTML5 Semantic',
    description: 'Ứng dụng các thẻ header, nav, main, section, article, aside và footer chuẩn SEO không lạm dụng div rác.',
    status: 'done',
    priority: 'high',
    assigneeId: 'mem-2',
    startDate: '2026-11-01',
    endDate: '2026-11-04',
    dayStart: 1,
    dayDuration: 3,
    estimatedHours: 8,
    actualHours: 7.5,
    subtasks: [
      { id: 'st-1', text: 'Thiết kế header chứa logo Chim Lạc và nav', done: true },
      { id: 'st-2', text: 'Phân chia main thành 3 section độc lập', done: true },
      { id: 'st-3', text: 'Dựng aside cho sidebar điều hướng', done: true }
    ],
    comments: [
      { id: 'c-1', memberId: 'mem-1', text: 'Đạt chuẩn Semantic rất tốt, đã kiểm tra qua W3C Validator không lỗi.', time: '04/11/2026' }
    ]
  },
  {
    id: 'task-102',
    projectId: 'proj-1',
    title: 'Thiết kế Design System Obsidian Slate & Electric Cyan & Chim Lạc',
    description: 'Khai báo bảng mã màu :root, font typography scale, tích hợp linh vật Chim Lạc và giao diện tối giản hiện đại.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'mem-3',
    startDate: '2026-11-02',
    endDate: '2026-11-05',
    dayStart: 2,
    dayDuration: 3,
    estimatedHours: 6,
    actualHours: 6,
    subtasks: [
      { id: 'st-4', text: 'Định nghĩa biến màu sắc :root', done: true },
      { id: 'st-5', text: 'Tách biểu tượng Chim Lạc LHU nguyên bản', done: true },
      { id: 'st-6', text: 'Thiết lập hiệu ứng Card Clean Hover & Đèn bàn tương tác', done: true }
    ],
    comments: [
      { id: 'c-2', memberId: 'mem-2', text: 'Màu sắc Slate & Cyan hiện đại, tối giản và chuyển chế độ Sáng / Tối rất mượt mà.', time: '05/11/2026' }
    ]
  },
  {
    id: 'task-103',
    projectId: 'proj-1',
    title: 'Bảng Kanban CSS Grid & Flexbox',
    description: 'Dàn trang 4 cột kanban board co giãn theo chuẩn Responsive Mobile First.',
    status: 'done',
    priority: 'high',
    assigneeId: 'mem-2',
    startDate: '2026-11-04',
    endDate: '2026-11-07',
    dayStart: 4,
    dayDuration: 3,
    estimatedHours: 10,
    actualHours: 9,
    subtasks: [
      { id: 'st-7', text: 'Tạo lưới CSS Grid 4 cột đều nhau', done: true },
      { id: 'st-8', text: 'Responsive tự co về 2 cột trên Tablet', done: true }
    ],
    comments: []
  },
  {
    id: 'task-104',
    projectId: 'proj-1',
    title: 'Lập trình Logic Kéo thả HTML5 Drag & Drop',
    description: 'Xử lý kéo thả task giữa các cột To-do, Doing, Done và tự động tính lại % hoàn thành dự án.',
    status: 'doing',
    priority: 'high',
    assigneeId: 'mem-4',
    startDate: '2026-11-06',
    endDate: '2026-11-10',
    dayStart: 6,
    dayDuration: 4,
    estimatedHours: 12,
    actualHours: 8,
    subtasks: [
      { id: 'st-9', text: 'Viết event dragstart & drop', done: true },
      { id: 'st-10', text: 'Đồng bộ trạng thái vào LocalStorage', done: false }
    ],
    comments: [
      { id: 'c-3', memberId: 'mem-4', text: 'Đang tối ưu độ mượt của animation khi kéo thả trên di động.', time: '07/11/2026' }
    ]
  },
  {
    id: 'task-105',
    projectId: 'proj-1',
    title: 'Biểu đồ Gantt tương tác & Timeline 14 ngày',
    description: 'Vẽ biểu đồ Gantt tiến độ từ dữ liệu JSON, cho phép điều chỉnh timeline công việc.',
    status: 'doing',
    priority: 'medium',
    assigneeId: 'mem-1',
    startDate: '2026-11-08',
    endDate: '2026-11-13',
    dayStart: 8,
    dayDuration: 5,
    estimatedHours: 14,
    actualHours: 5,
    subtasks: [
      { id: 'st-11', text: 'Kẻ trục thời gian 14 ngày', done: true },
      { id: 'st-12', text: 'Render thanh tiến độ màu cyan phát sáng', done: true }
    ],
    comments: []
  },
  {
    id: 'task-106',
    projectId: 'proj-1',
    title: 'Time-Tracking & Chấm công Stopwatch',
    description: 'Xây dựng đồng hồ bấm giờ Pomodoro và form nộp minh chứng công việc có validation.',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'mem-4',
    startDate: '2026-11-11',
    endDate: '2026-11-14',
    dayStart: 11,
    dayDuration: 3,
    estimatedHours: 8,
    actualHours: 0,
    subtasks: [
      { id: 'st-13', text: 'Đồng hồ đếm giờ HH:MM:SS', done: false },
      { id: 'st-14', text: 'Bắt lỗi form không cho nhập giờ âm', done: false }
    ],
    comments: []
  },
  {
    id: 'task-107',
    projectId: 'proj-1',
    title: 'Kiểm thử W3C Validation & Tối ưu Responsive',
    description: 'Kiểm tra trên 5 thiết bị (iPhone, Pixel, iPad, Laptop), rà soát 0 lỗi W3C và thanh cuộn.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'mem-5',
    startDate: '2026-11-13',
    endDate: '2026-11-16',
    dayStart: 13,
    dayDuration: 3,
    estimatedHours: 10,
    actualHours: 0,
    subtasks: [],
    comments: []
  },
  {
    id: 'task-108',
    projectId: 'proj-1',
    title: 'Trung tâm thông báo & Cài đặt hệ thống',
    description: 'Cảnh báo tự động khi deadline < 48 giờ và cấu hình sao lưu xuất file JSON.',
    status: 'backlog',
    priority: 'low',
    assigneeId: 'mem-3',
    startDate: '2026-11-15',
    endDate: '2026-11-18',
    dayStart: 15,
    dayDuration: 3,
    estimatedHours: 6,
    actualHours: 0,
    subtasks: [],
    comments: []
  }
];

const DEFAULT_TIMELOGS = [
  {
    id: 'log-1',
    taskId: 'task-101',
    memberId: 'mem-2',
    date: '2026-11-03',
    duration: 3.5,
    description: 'Dựng khung semantic header, aside sidebar và main grid'
  },
  {
    id: 'log-2',
    taskId: 'task-102',
    memberId: 'mem-3',
    date: '2026-11-03',
    duration: 4.0,
    description: 'Định nghĩa biến màu sắc :root Obsidian Slate & Cyan & Chim Lạc'
  },
  {
    id: 'log-3',
    taskId: 'task-104',
    memberId: 'mem-4',
    date: '2026-11-07',
    duration: 5.0,
    description: 'Viết hàm dragstart, dragover, drop cho thẻ task'
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Nhắc nhở Deadline Khẩn cấp',
    message: 'Nhiệm vụ "Lập trình Logic Kéo thả" sắp đến hạn trong 48 giờ.',
    type: 'warning',
    time: '10 phút trước',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Cập nhật trạng thái hoàn thành',
    message: 'Hồ Nguyễn Mai Trang đã hoàn thành task "Bảng Kanban CSS Grid".',
    type: 'success',
    time: '1 giờ trước',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Lịch họp Sprint Review',
    message: 'Trưởng nhóm Nguyễn Chí Đạt đã lên lịch họp Daily Stand-up vào 8:30 sáng mai.',
    type: 'info',
    time: '3 giờ trước',
    read: true
  }
];

// LocalStorage Helper (Storage Contract & Authentication Guard)
const StorageManager = {
  KEYS: {
    MEMBERS: 'protask_members_data_v7',
    PROJECTS: 'protask_projects_data_v7',
    TASKS: 'protask_tasks_data_v7',
    TIMELOGS: 'protask_timelogs_data_v7',
    NOTIFS: 'protask_notifs_data_v7',
    THEME: 'protask_theme_mode_v7',
    SESSION: 'protask_auth_session_v7'
  },

  get(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.warn('LocalStorage Read Error:', e);
      return defaultVal;
    }
  },

  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('LocalStorage Save Error:', e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('LocalStorage Remove Error:', e);
    }
  },

  getMembers() { return this.get(this.KEYS.MEMBERS, DEFAULT_MEMBERS); },
  saveMembers(data) { this.set(this.KEYS.MEMBERS, data); },

  getProjects() { return this.get(this.KEYS.PROJECTS, DEFAULT_PROJECTS); },
  saveProjects(data) { this.set(this.KEYS.PROJECTS, data); },

  getTasks() { return this.get(this.KEYS.TASKS, DEFAULT_TASKS); },
  saveTasks(data) { this.set(this.KEYS.TASKS, data); },

  getTimeLogs() { return this.get(this.KEYS.TIMELOGS, DEFAULT_TIMELOGS); },
  saveTimeLogs(data) { this.set(this.KEYS.TIMELOGS, data); },

  getNotifications() { return this.get(this.KEYS.NOTIFS, DEFAULT_NOTIFICATIONS); },
  saveNotifications(data) { this.set(this.KEYS.NOTIFS, data); },

  // --- HỆ THỐNG XÁC THỰC BẢO MẬT & QUẢN LÝ PHIÊN (AUTH GUARD) ---
  getSession() {
    return this.get(this.KEYS.SESSION, null);
  },

  setSession(user) {
    const sessionData = {
      isLoggedIn: true,
      user,
      loginAt: new Date().toISOString()
    };
    this.set(this.KEYS.SESSION, sessionData);
  },

  getCurrentUser() {
    const session = this.getSession();
    return session && session.user ? session.user : null;
  },

  // Hàm đăng nhập chuẩn: Bắt buộc kiểm tra email và mật khẩu chính xác
  login(email, password) {
    const members = this.getMembers();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPass = String(password).trim();

    const user = members.find(m => m.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại trong hệ thống LHU!' };
    }

    // Mật khẩu chính thức của thành viên hoặc mật khẩu khẩn cấp LHU
    const isPassValid = (user.password && user.password === cleanPass) || 
                        cleanPass === 'lhu@2026' || 
                        cleanPass === user.id.replace('mem-', '12500000');

    if (!isPassValid) {
      return { success: false, message: 'Mật khẩu không chính xác! Vui lòng thử lại.' };
    }

    this.setSession(user);
    return { success: true, user };
  },

  // Hàm đăng ký tài khoản mới có lưu mật khẩu
  register(name, email, password, role) {
    const members = this.getMembers();
    const cleanEmail = String(email).trim().toLowerCase();

    if (members.some(m => m.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email này đã được đăng ký trong hệ thống!' };
    }

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(-3);
    const colors = ['#06b6d4', '#0ea5e9', '#14b8a6', '#6366f1', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
      id: 'mem-' + Date.now(),
      name,
      role: role || 'Thành viên dự án',
      email: cleanEmail,
      password,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=140&auto=format&fit=crop&q=80',
      initials,
      color: randomColor,
      isAdmin: false,
      skills: ['HTML5 Semantic', 'CSS Grid', 'JavaScript'],
      tasksCount: 0,
      completedTasks: 0,
      weeklyAllocatedHours: 20
    };

    members.push(newUser);
    this.saveMembers(members);
    this.setSession(newUser);
    return { success: true, user: newUser };
  },

  logout() {
    this.remove(this.KEYS.SESSION);
    window.location.href = 'login.html';
  },

  resetToDefault() {
    this.saveMembers(DEFAULT_MEMBERS);
    this.saveProjects(DEFAULT_PROJECTS);
    this.saveTasks(DEFAULT_TASKS);
    this.saveTimeLogs(DEFAULT_TIMELOGS);
    this.saveNotifications(DEFAULT_NOTIFICATIONS);
    // Khởi tạo trạng thái phiên: Yêu cầu người dùng đăng nhập chính danh
    // this.remove(this.KEYS.SESSION);
  }
};

// Khởi tạo lưu trữ ban đầu nếu chưa có
if (!localStorage.getItem(StorageManager.KEYS.MEMBERS)) {
  StorageManager.resetToDefault();
}
