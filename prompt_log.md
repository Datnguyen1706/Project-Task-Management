# PHỤ LỤC 2: NHẬT KÝ ĐỒNG HÀNH CÙNG AI (PROMPT LOG)
> **Học phần:** Thiết kế Web (Mã học phần: 111101) – Trường Đại học Lạc Hồng (LHU)  
> **Tên nhóm:** Nhóm 05 - Đội ngũ Phát triển PROTASK LHU  
> **Lớp:** 22CT111  
> **Tên dự án:** PROTASK - Hệ thống Quản trị Dự án & Phân bổ Công việc Thông minh (Phân hệ 2.3.4)  
> **Quy mô:** Hệ thống 10 Trang Web Hoàn Chỉnh cho 5 Thành Viên  

---

## 👥 DANH SÁCH THÀNH VIÊN NHÓM & PHÂN CÔNG PHỤ TRÁCH
1. **Nguyễn Chí Đạt** (Leader / Project Manager) – Email: `125000004@lachong.edu.vn` – Phụ trách: `login.html`, `index.html`
2. **Hồ Nguyễn Mai Trang** (Frontend UI Specialist) – Email: `125001156@lachong.edu.vn` – Phụ trách: `kanban.html`, `task-detail.html`
3. **Nguyễn Thị Tuyết Ngân** (UI/UX Designer) – Email: `125001247@lachong.edu.vn` – Phụ trách: `gantt.html`, `calendar.html`
4. **Nguyễn Tấn Thuận** (Data & Logic Engineer) – Email: `125000770@lachong.edu.vn` – Phụ trách: `resources.html`, `reports.html`
5. **Hoàng Tuấn Anh** (QA & Test Engineer) – Email: `125002570@lachong.edu.vn` – Phụ trách: `members.html`, `settings.html`

---

## 1. THÔNG TIN CÔNG CỤ AI SỬ DỤNG
- **Công cụ AI chính:** Google Anti-Gravity AI (Gemini 3.8 Flash & Pro) kết hợp Claude 3.5 Sonnet
- **Công cụ hỗ trợ viết code (Extension):** Antigravity IDE Assistant, VS Code GitHub Copilot
- **Ngôn ngữ & Thư viện sử dụng:** HTML5 Semantic thuần, CSS3 (CSS Variables, CSS Grid, Flexbox, 3D Transforms, Keyframe Animations), Vanilla JavaScript ES6+ (Native Drag & Drop, LocalStorage, Regular Expressions).

---

## 2. NHẬT KÝ QUÁ TRÌNH THỰC HIỆN (CÁC PROMPT QUAN TRỌNG)

| Giai đoạn | Mục tiêu (Bạn muốn AI làm gì?) | Nội dung Prompt (Câu lệnh bạn đã dùng) | Kết quả & Tùy chỉnh (AI có làm đúng không? Bạn có sửa lại gì không?) |
|---|---|---|---|
| **Khởi tạo (Tuần 1 - 2)** | Dựng khung HTML5 Semantic cho toàn bộ 10 trang web của dự án. | *"Bạn là một chuyên gia UI/UX và Front-end Developer hàng đầu. Hãy phân tích đề tài Phân hệ 2.3.4 (Quản lý Dự án & Công việc) của ĐH Lạc Hồng và tạo ra cấu trúc khung 10 trang HTML5 chuẩn Semantic: `<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<time>`, `<footer>`. Mỗi trang phải có thẻ `<meta name='viewport'>`, `<meta name='description'>` chuẩn SEO. Tuyệt đối không dùng các thẻ lỗi thời như `<center>`, `<font>` và không lạm dụng `<div>` bừa bãi."* | **AI làm đúng 95%**. Khung HTML rất sạch sẽ. Nhóm đã bổ sung thêm thông tin định danh của 5 sinh viên trường ĐH Lạc Hồng vào phần Footer và Metadata. |
| **Giao diện & Màu sắc (Tuần 3 - 4)** | Thiết lập hệ màu độc bản: Nâu Espresso + Vàng Ánh Kim Hoàng Gia + Điểm nhấn Hổ Phách phát sáng. | *"Hãy xây dựng hệ thống CSS Variables tại `:root` trong style.css. Tôi không muốn các màu sắc xanh/xám thông thường dễ gây nhàm chán. Hãy tạo bảng màu quyền quý, khỏe khoắn với màu chủ đạo là Nâu cà phê đậm (Deep Espresso Mocha #1d130c, #291a11), màu Vàng Ánh Kim Hoàng Gia (#d4af37, metallic gradient) làm điểm tựa sang trọng. Đặc biệt, để tạo điểm nhấn hài hòa thu hút người xem dừng chân lại, hãy sử dụng màu Hổ Phách rực rỡ (Luminous Amber #f59e0b, #ff8c00) cho biểu tượng 'Viên Ngọc Hổ Phách' có animation nhịp thở phát sáng, các thanh progress bar và nút CTA chính."* | **AI làm đúng 100%**. Sự kết hợp giữa Nâu - Vàng Kim và Hổ Phách tạo nên một giao diện cực kỳ đẳng cấp, bề thế và lôi cuốn, hoàn toàn nổi bật so với các website thông thường. |
| **Giao diện Bố cục Grid (Tuần 3 - 4)** | Xây dựng bố cục CSS Grid 4 cột cho Kanban và CSS Grid 7 cột cho Calendar tháng. | *"Viết layout.css sử dụng CSS Grid hiện đại: (1) Bảng Kanban 4 cột (Backlog, To-Do, Doing, Done) có minmax linh hoạt, tự động co về 2 cột trên Tablet và 1 cột trên Mobile. (2) Trang Lịch công việc tháng dùng CSS Grid 7 cột đại diện cho Thứ 2 đến Chủ nhật, mỗi ô ngày có khả năng chứa các chip task hiển thị gọn gàng. Sử dụng `gap` thay cho margin truyền thống theo đúng giáo trình."* | **AI làm đúng 100%**. Cả hai bố cục Grid hiển thị chuẩn xác, không xuất hiện thanh cuộn ngang (Horizontal scroll) trên bất kỳ thiết bị nào. |
| **Hiệu ứng 3D & Chuyển động (Tuần 5)** | Thiết lập hiệu ứng 3D Card Hover Tilt, 3D Card Flip cho thẻ nhân sự và cuộn trang mượt mà không bị khựng. | *"Hãy tích hợp hiệu ứng 3D vào website: (1) Hiệu ứng 3D Hover Tilt trên các Card thống kê và Task card với `perspective: 1200px` và `transform: translate3d(0, -6px, 12px) rotateX(2deg) rotateY(-2deg)`. (2) Hiệu ứng 3D Card Flip (xoay 180 độ) cho thẻ nhân sự tại members.html theo đúng bài học Tuần 5. (3) Đảm bảo hiệu năng scrolling mượt mà 60fps không bị khựng lag bằng cách kích hoạt GPU Acceleration qua `will-change: transform`, `transform: translate3d(0,0,0)` và `backface-visibility: hidden` thay vì dùng các thuộc tính làm đơ trình duyệt như top/left."* | **AI làm đúng 100%**. Giao diện cuộn cực kỳ êm ái, các tương tác 3D nổi khối và bóng đổ ánh hổ phách mang lại cảm giác công nghệ cao cấp (Premium feel). |
| **Tính năng Kéo thả (Tuần 10)** | Lập trình kéo thả Native HTML5 Drag and Drop và đồng bộ trạng thái vào LocalStorage. | *"Viết mã JavaScript thuần (Vanilla JS) không dùng thư viện ngoài để xử lý kéo thả các thẻ công việc giữa các cột trong KanbanController. Khi thẻ được thả vào cột mới, hãy cập nhật trạng thái của task trong StorageManager, gọi hàm TaskLogic.calculateProgress() để tính lại % tiến độ của toàn dự án và hiển thị Toast thông báo màu hổ phách."* | **AI làm đúng 92%**. Nhóm đã tinh chỉnh thêm sự kiện click trực tiếp trên task để mở trang `task-detail.html?id=...` và nút Quick Move giúp người dùng di động vẫn đổi trạng thái dễ dàng. |
| **Tính năng Tài nguyên (Tuần 12)** | Tính toán Resource Heatmap và kích hoạt Cảnh Báo Đỏ nếu vượt 40 giờ/tuần. | *"Viết hàm TaskLogic.calculateResourceAllocation() sử dụng Array Filter và Reduce để tính tổng số giờ được gán trong tuần của 5 thành viên. Nếu có thành viên bị gán > 40 giờ/tuần, hãy kích hoạt trạng thái 'overloaded' và render một hộp Cảnh Báo Đỏ nổi bật lên đầu trang resources.html theo đúng yêu cầu đề bài."* | **AI làm đúng 100%**. Hàm logic chạy hoàn hảo, phát hiện chính xác Leader Nguyễn Chí Đạt đang có 42h/tuần và hiển thị cảnh báo đỏ trực quan. |
| **Tính năng Nhắc việc (Tuần 10 & 14)** | Xây dựng tiến trình nền tự động quét Deadline bằng `setInterval()`. | *"Trong SettingsController, hãy viết một hàm chạy nền sử dụng setInterval() chu kỳ 30 giây để quét mảng công việc trong StorageManager. Nếu phát hiện nhiệm vụ chưa hoàn thành có hạn chót dưới 48 giờ, hãy tự động kích hoạt UI.showToast() cảnh báo nhắc việc."* | **AI làm đúng 98%**. Tính năng hoạt động ổn định, mô phỏng đúng tính năng push notification qua ứng dụng. |
| **Tính năng Xác thực & Bảo mật (Tuần 11)** | Xây dựng hệ thống Đăng nhập / Đăng ký phân quyền, bắt buộc mật khẩu chính xác và bảo vệ tuyến đường (Route Guard). | *"Viết module AuthController cho trang login.html: kiểm tra form hợp lệ với Regex email đuôi @lachong.edu.vn, password bắt buộc chính xác theo tài khoản đã đăng ký (hoặc mật khẩu mặc định của 5 thành viên là MSSV / lhu@2026). Tuyệt đối không cho phép truy cập tự do nếu chưa có tài khoản. Xây dựng Route Guard App.checkAuth() tự động chuyển hướng về login.html nếu chưa có phiên đăng nhập hợp lệ. Bảng tài khoản mẫu hỗ trợ click tự động điền form để người dùng thấy rõ email & mật khẩu được dùng để đăng nhập."* | **AI làm đúng 100%**. Quy trình đăng nhập nghiêm ngặt, loại bỏ hoàn toàn link bypass khách, mô phỏng chuẩn xác hệ thống quản trị chuyên nghiệp. |
| **Nhận diện Chim Lạc & Hero 3D (Tuần 13)** | Tách logo Chim Lạc LHU nguyên bản không lấy chữ và tích hợp Hero Banner Volumetric Sunbeam từ video TikTok. | *"Từ ảnh logo Đại học Lạc Hồng, hãy tách riêng con Chim Lạc Origami vàng kim (bỏ hoàn toàn phần chữ 'ĐẠI HỌC LẠC HỒNG - KHÁT VỌNG DẪN ĐẦU', chỉ lấy hình con chim origami) để làm điểm nhấn nhận diện thương hiệu. Kết hợp cùng phong cách banner video TikTok: nền nâu espresso huyền bí, chùm tia sáng mặt trời hổ phách chiếu chéo (Volumetric Sunbeams), bụi than hồng lơ lửng và hiệu ứng chuột 3D Mouse Parallax trên con Chim Lạc."* | **AI làm đúng 100%**. Con Chim Lạc vàng kim origami hòa quyện tuyệt đẹp với phong cách nghệ thuật, tạo nên một Hero Banner đẳng cấp và mang đậm bản sắc Lạc Hồng. |
| **Thiết kế Tối Giản & Animation Mẫu (Tuần 14)** | Thay thế màu vàng bằng Obsidian Cyan, loại bỏ hiệu ứng 3D nghiêng ngả, tích hợp Animated Cards Opening & Đèn bàn tương tác. | *"Hãy cập nhật giao diện theo 2 video mẫu: (1) Loại bỏ hoàn toàn màu vàng/nâu, chuyển sang bảng màu tối giản cao cấp Dark Slate & Electric Cyan / Neon Teal. (2) Bỏ triệt để các hiệu ứng 3D card tilt/flip quay nghiêng lắc dọc gây khó chịu, giữ các thẻ phẳng ổn định. (3) Trang login.html thiết kế theo video 'Interactive Lamp Login' với chiếc đèn bàn tương tác có dây kéo bật/tắt chùm sáng và chuyển cảnh đăng nhập thành công mượt mà. (4) Trang index.html tích hợp 'Animated Cards Opening' trình diễn 5 phân hệ công việc với thanh điều khiển mượt mà. (5) Thêm hiệu ứng chuyển trang êm ái (Smooth Page Transitions 60fps) giữa 10 trang web."* | **AI làm đúng 100%**. Giao diện hoàn toàn lột xác, tối giản tinh tế, tốc độ chuyển trang mượt mà và không còn hiện tượng lắc nghiêng 3D. |
| **Đèn bàn lộ diện & Chế độ Sáng/Tối (Tuần 15)** | Hiện thực hóa hiệu ứng kéo dây bật đèn mới lộ form đăng nhập và sửa hoàn chỉnh bộ chuyển theme Dark/Light. | *"Trong video người ta làm trang login khi kéo hoặc thả dây đèn, đèn sáng lên thì trang đăng nhập mới lộ ra. Hãy sửa để ban đầu đèn tắt thì thẻ đăng nhập ẩn hoàn toàn trong bóng tối; kéo dây đèn thì đèn sáng phát âm thanh công tắc cơ học, nón sáng chiếu xuống và thẻ đăng nhập mượt mà hiện ra. Đồng thời sửa triệt để tính năng chuyển chế độ Sáng / Tối: trước đây bấm đổi không thay đổi được; hãy thiết lập 2 theme rõ rệt: Ban Đêm (Obsidian Slate) và Ban Ngày (Clean White Slate) với độ tương phản cao, đổi mượt mà tức thì trên toàn bộ 10 trang web."* | **AI làm đúng 100%**. Hiệu ứng kéo đèn lộ form đăng nhập chuẩn khớp video 2, phát click sound sống động. Bộ theme Sáng/Tối hoạt động tức thì, đồng bộ 100% trên cả 10 trang web không bị chớp giật. |
| **Sửa lỗi & Tối ưu (Debug)** | Sửa lỗi bố cục thẻ bị tràn chữ trên màn hình nhỏ và tối ưu W3C Validation. | *"Kiểm tra file layout.css và style.css: Một số tiêu đề task dài khiến thẻ bị đẩy chiều cao không đồng đều trên màn hình 375px. Hãy đề xuất giải pháp CSS kết hợp `-webkit-line-clamp: 2` và `overflow: hidden`. Đồng thời rà soát toàn bộ cú pháp HTML để đảm bảo 0 lỗi W3C."* | **AI làm đúng 100%**. Các thẻ task hiển thị gọn gàng, đều đặn và chuyên nghiệp trên mọi thiết bị di động. |

---

## 3. NHỮNG BÀI HỌC KINH NGHIỆM KHI DÙNG AI (AI-FIRST MINDSET)

- **Nguyên tắc "Prompt Engineering" then chốt mà nhóm đúc kết:**  
  1. *Định danh vai trò chuyên gia:* Bắt đầu bằng *"Bạn là chuyên gia thiết kế web UI/UX và lập trình viên Front-end chuẩn W3C..."* để AI sinh mã có chất lượng cao nhất.  
  2. *Đưa ra các ràng buộc kỹ thuật rõ ràng:* Quy định cụ thể: sử dụng HTML5 Semantic, CSS Variables cho màu Nâu - Vàng Kim - Hổ Phách, bố cục CSS Grid/Flexbox, không dùng thư viện ngoài nặng nề, chia tách module `data.js`, `logic.js`, `features.js`, `main.js`.  
  3. *Tư duy Phân rã bài toán (Decomposition):* Không yêu cầu AI làm toàn bộ website trong một câu lệnh duy nhất; thay vào đó, phân rã theo 4 giai đoạn chuẩn của giáo trình (Khung HTML -> Design System -> Bố cục Grid -> Tính năng JS -> Tối ưu hiệu năng).

- **Khó khăn khi làm việc với AI và cách khắc phục:**  
  - *Vấn đề:* Khi yêu cầu animation, AI thường sinh ra thuộc tính `top`, `left`, `margin` khiến trang bị khựng lag (layout repaint liên tục).  
  - *Cách khắc phục:* Nhóm đã ra lệnh cụ thể: *"Chỉ sử dụng `transform: translate3d()` và `opacity` để kích hoạt GPU Acceleration, giúp FPS duy trì ổn định ở mức 60fps không bị giật hình."*

- **Phương pháp nhóm kiểm tra độ chính xác của mã nguồn do AI sinh ra:**  
  - Sử dụng Chrome DevTools (F12) mở tab **Console** để đảm bảo không có bất kỳ lỗi JavaScript Uncaught TypeError hoặc SyntaxError nào.  
  - Dùng công cụ **Toggle Device Toolbar** để kiểm tra tính Responsive trên nhiều độ phân giải giả lập: iPhone 12/14 Pro (375px - 390px), iPad Air (820px), Laptop (1280px), Desktop (1440px+).  
  - Kiểm tra độ tương phản màu sắc (Color Contrast Accessibility) giữa chữ và nền để đảm bảo dễ đọc theo tiêu chuẩn WCAG.

---

## 4. CAM KẾT CỦA TOÀN THỂ NHÓM

- [x] Nhóm đã đọc, hiểu và làm chủ 100% cấu trúc mã nguồn do AI hỗ trợ xây dựng.
- [x] Đã tự tay tinh chỉnh toàn bộ hệ thống màu sắc Nâu Quý Tộc, Vàng Ánh Kim và Điểm Nhấn Hổ Phách để tạo dấu ấn độc bản, thu hút người dùng.
- [x] Dự án đáp ứng trọn vẹn 10 trang web theo đúng bảng phân tích nhiệm vụ Scrum của 5 thành viên trong học phần Thiết kế Web (Đại học Lạc Hồng).
