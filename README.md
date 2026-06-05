# ⚽ Hệ thống Quản lý và Đặt sân bóng đá trực tuyến (PitchMaster / PitchHub)

> **Môn học:** Thực hành lập trình Web
> **Nền tảng:** Web Application

## 📖 Giới thiệu dự án
Dự án "Xây dựng Web quản lý sân bóng" được thiết kế nhằm mục tiêu số hóa toàn bộ quy trình vận hành sân bãi, mang lại trải nghiệm đặt lịch tiện lợi cho khách hàng, đồng thời cung cấp công cụ quản trị thông minh, tối ưu cho chủ sân.
Hệ thống giải quyết triệt để các vấn đề thủ công truyền thống như: dễ trùng lịch đặt sân, khó quản lý kho dịch vụ đi kèm và thiếu chính xác trong việc thống kê doanh thu. Đặc biệt, hệ thống tích hợp **Trí tuệ nhân tạo (AI)** để tư vấn khách hàng và phân tích doanh thu cho quản trị viên.

---
## Tài khoản trải nghiệm admin/user
Tài khoản: admin@gmail.com
Mật khẩu: thuchanhlaptrinhweb

Tài khoản: tien@gmail.com
Mật khẩu: 123456

---

## 🛠 Công nghệ sử dụng

### Frontend (Giao diện người dùng)
*   **Ngôn ngữ:** TypeScript, HTML5, CSS3
*   **Framework/Thư viện:** React.js, UmiJS (@umijs/max)
*   **UI/UX:** Ant Design (antd & Pro-components), Tailwind CSS
*   **Quản lý State:** Redux Toolkit
*   **Công cụ khác:** Axios (Gọi API), Recharts (Vẽ biểu đồ), Socket.io Client (Real-time)

### Backend (Máy chủ & API)
*   **Ngôn ngữ:** TypeScript
*   **Môi trường:** Node.js
*   **Framework:** Express.js
*   **Database:** MySQL
*   **ORM:** Prisma Client
*   **Xác thực:** JWT (JSON Web Token), Bcrypt
*   **Công cụ khác:** node-cron (Chạy lịch tự động), Nodemailer (Gửi email), Socket.io Server, @google/genai (Tích hợp AI Gemini)

---

## 🌟 Các tính năng chính

### 👤 Dành cho Người dùng (Khách hàng)
1.  **Xác thực:** Đăng ký, Đăng nhập, cập nhật hồ sơ cá nhân và bảo mật.
2.  **Đặt sân:** Xem lịch trống dạng lưới trực quan, đặt sân và thanh toán tiền cọc (Chuyển khoản VietQR / Tiền mặt).
3.  **Lịch sử:** Quản lý lịch sử đặt sân, thống kê chi phí, số giờ chơi.
4.  **Cộng đồng (Forum):** Đăng bài tìm đối, cáp kèo, bình luận, thả tim tương tác theo thời gian thực.
5.  **Chatbot AI:** Trợ lý ảo tư vấn luật chơi, chiến thuật và hỗ trợ giải đáp thắc mắc.

### 👑 Dành cho Quản trị viên (Admin)
1.  **Dashboard thống kê:** Biểu đồ doanh thu trực quan, thống kê lượt đặt, tỷ lệ lấp đầy sân.
2.  **Quản lý Sân & Bảng giá:** Thêm/sửa sân, cấu hình giá động theo từng khung giờ linh hoạt.
3.  **Quản lý Dịch vụ:** Quản lý kho nước uống, áo bib, bóng đấu... và tự động cảnh báo sắp hết hàng.
4.  **Xử lý Đơn hàng:** Xem, duyệt, hoặc hủy đơn đặt sân từ hệ thống. Đặt lịch thủ công cho khách vãng lai.
5.  **Quản lý Người dùng & Diễn đàn:** Khóa tài khoản vi phạm, xóa bài đăng rác.
6.  **AI Phân tích Doanh thu:** Tương tác với AI để nhận đánh giá hiệu suất kinh doanh.
7.  **Báo cáo Tự động:** Tự động gửi email báo cáo (kèm file Excel) vào ngày mùng 1 hàng tháng.

---

## 🔄 Sơ đồ luồng hoạt động
![Sơ đồ luồng hoạt động của hệ thống](Frontend/public/Admin%20Booking%20Management-2026-05-29-085218.png)

---

## ⚙️ Hướng dẫn Cài đặt & Chạy dự án (Local Setup)

### Yêu cầu hệ thống:
*   Node.js (Phiên bản 18.x trở lên)
*   MySQL (Có thể dùng XAMPP, WAMP, hoặc Docker)
*   Git

### Bước 1: Clone dự án
```bash
git clone <đường-dẫn-repo-của-bạn>
cd Football-Management
```

### Bước 2: Thiết lập Backend
1. Di chuyển vào thư mục Backend:
   ```bash
   cd Backend
   ```
2. Cài đặt các gói thư viện:
   ```bash
   npm install
   ```
3. Cấu hình biến môi trường:
   * Copy file `.env.example` thành `.env`.
   * Cập nhật thông tin kết nối MySQL (`DATABASE_URL`), cấu hình JWT, Cloudinary, và API Key của Gemini.
4. Chạy Prisma migrations và tạo seed data (nếu có):
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
5. Khởi động server:
   ```bash
   npm run dev
   ```
   *Backend sẽ chạy tại: `http://localhost:3000`*

### Bước 3: Thiết lập Frontend
1. Mở một terminal mới, di chuyển vào thư mục Frontend:
   ```bash
   cd ../Frontend
   ```
2. Cài đặt các gói thư viện:
   ```bash
   npm install
   ```
3. Khởi động ứng dụng React:
   ```bash
   npm run dev
   ```
   *Frontend sẽ tự động mở tại: `http://localhost:8000` (hoặc port tương tự tùy cấu hình Umi)*

---

## 📖 Hướng dẫn sử dụng hệ thống (User Guide)

### 📌 Phần 1: Dành cho Khách hàng (User)

**1. Đăng ký & Đăng nhập**
*   Truy cập trang chủ, nhấn vào nút "Đăng nhập/Đăng ký".
*   Nếu chưa có tài khoản, điền đầy đủ thông tin (Tên, Email, SĐT, Mật khẩu) ở form Đăng ký.
*   Hệ thống có thanh đánh giá độ mạnh mật khẩu để bảo vệ bạn.

**2. Tìm và Đặt sân**
*   Vào mục **Đặt sân (Booking)**.
*   Sử dụng bộ lọc: Chọn ngày, khu vực, hoặc sân cụ thể.
*   Trên lưới thời gian: Các ô màu xám là giờ còn trống. Click vào khung giờ bạn muốn chơi.
*   Popup hiện lên: Chọn thêm dịch vụ (Nước, áo pitch...) nếu cần.
*   **Thanh toán:** Quét mã QR chuyển khoản tiền cọc, sau đó bấm xác nhận.
*   *Lưu ý:* Bạn có 15 phút để thanh toán, nếu không đơn sẽ tự động bị hủy.

**3. Giao lưu tìm đối (Forum)**
*   Vào mục **Diễn đàn / Tìm đối**.
*   Để đăng kèo mới: Bấm "Tạo bài viết", điền thông tin sân, trình độ, liên hệ.
*   Để nhận kèo: Tìm các bài đăng phù hợp, nhấn vào **Bình luận** để trao đổi trực tiếp với chủ bài đăng.

**4. Hỏi đáp với Trợ lý AI**
*   Nhấn vào biểu tượng Chatbot ở góc phải màn hình.
*   Nhập câu hỏi (VD: "Tư vấn cho tôi chiến thuật đá sân 7", "Luật penalty sân 5 như thế nào?"). AI sẽ phân tích và trả lời ngay lập tức.

---

### 📌 Phần 2: Dành cho Ban Quản trị (Admin)
*(Lưu ý: Bạn phải đăng nhập bằng tài khoản có Role là `admin`)*

**1. Xem Tổng quan Doanh thu (Dashboard)**
*   Ngay khi đăng nhập, hệ thống sẽ điều hướng vào Dashboard.
*   Tại đây bạn sẽ thấy biểu đồ doanh thu, số lượng đơn đặt sân thành công và các sân được đặt nhiều nhất.
*   Bạn có thể chat với **Trợ lý AI của Admin** ngay trên màn hình này: "Hãy phân tích doanh thu tháng này cho tôi", AI sẽ đọc dữ liệu và đưa ra gợi ý vận hành.

**2. Quản lý Lịch đặt (Xử lý đơn hàng)**
*   Vào mục **Quản lý Đặt sân**.
*   Hệ thống hiển thị lưới lịch tương tự bên User nhưng kèm thêm thông tin thanh toán (Màu đỏ: Chưa thanh toán, Xanh lá: Đã thanh toán).
*   Click vào các đơn màu đỏ/cam: Kiểm tra tiền trong tài khoản ngân hàng thực tế, nếu nhận được, bấm **"Duyệt đơn" (Approve)**. Nếu khách bùng, bấm **"Từ chối" (Reject)**.
*   **Đặt thủ công:** Có thể click vào ô trống để đặt hộ khách gọi điện tới.

**3. Cấu hình Sân và Giá sân**
*   Vào mục **Quản lý Sân bóng**.
*   Bạn có thể thêm sân mới, hoặc bấm vào nút Sửa.
*   Trong mục Sửa, bạn có thể **Thiết lập bảng giá theo khung giờ**. (VD: Đặt giá từ 17h00 - 20h00 là 500k/h, các giờ khác là 300k/h).

**4. Quản lý Kho dịch vụ**
*   Vào mục **Quản lý Dịch vụ**.
*   Theo dõi số lượng hàng tồn (cột Số lượng). Hệ thống sẽ bôi đỏ các món sắp hết.
*   Bấm Sửa để cập nhật lại số lượng khi bạn nhập thêm hàng mới vào kho.

**5. Kiểm duyệt Diễn đàn & Người dùng**
*   **Người dùng:** Vào "Quản lý User", bạn có thể khóa (BAN) tài khoản của những người thường xuyên đặt sân nhưng không đến.
*   **Diễn đàn:** Vào "Quản lý Bài đăng", kiểm duyệt và bấm "Xóa" với các bình luận/bài viết spam, quảng cáo không đúng mục đích.

---

## 👥 Tác giả (Thành viên nhóm)
1.  **Lê Văn Tiến** (Nhóm trưởng) - B24DCCC259
2.  **Khổng Anh Duy** - B24DCCC091
3.  **Đỗ Quốc Huy** - B24DCCC145
4.  **Nguyễn Tiến Đạt** - B24DCCC055

*Cảm ơn bạn đã quan tâm đến dự án của chúng tôi!*
