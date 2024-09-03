# Ticket Reservation System

## Link demo: [Ticket Reservation](https://web-ticket-reservation-system.onrender.com)
  - Email: test@gmail.com
  - Password: 1234

## API Endpoints
### **Đăng ký người dùng**
- **URL:** `/register`
- **Mô tả:**
  - **GET**: Render trang đăng ký người dùng.
  - **POST**: Xử lý việc gửi biểu mẫu đăng ký.

### **Đăng nhập**
- **URL:** `/login`
- **Mô tả:**
  - **GET**: Render trang đăng nhập.
  - **POST**: Xử lý việc gửi biểu mẫu đăng nhập.

### **Đăng xuất**
- **URL:** `/logout`
- **Mô tả:** **POST**: Xử lý yêu cầu đăng xuất của người dùng, xóa session.

### **Trang quản trị (Admin)**
- **URL:** `/admin`
- **Phương thức:** `GET` / `POST`
- **Mô tả:**
  - **GET**: Render trang quản trị để thêm vé.
  - **POST**: Xử lý việc tạo vé mới.

### **Trang chính (Home)**
- **URL:** `/`
- **Mô tả:**
  - **GET**: Render trang chính của ứng dụng.

### **Trang giỏ hàng**
- **URL:** `/tickets`
- **Mô tả:**
  - **POST**: Xử lý yêu cầu thêm vé mới vào giỏ.

### **Trang vé đã đặt**
- **URL:** `/bookings`
- **Mô tả:**
  - **GET**: Render trang hiển thị danh sách các vé đã đặt.
  - **POST**: Thực hiện chấp nhận thanh toán giỏ hàng.
  - **POST** `/bookings/:id/cancel`: Hủy một đặt vé.


## Công nghệ đã sử dụng:
- **HTML**: Cấu trúc các trang web
- **CSS**: Tạo kiểu cho ứng dụng
- **JavaScript**: Thêm hành vi động
- **Node.js**: Viết kịch bản phía máy chủ
- **Express.js**: Xây dựng máy chủ và xử lý các tuyến (router)
- **MongoDB**: Quản lý cơ sở dữ liệu
- **EJS**: Công cụ tạo template cho phép nhúng JS vào HTML

## Các chức năng của hệ thống đặt vé:
- **Hiển thị danh sách vé**:
  - Hệ thống cần hiển thị danh sách tất cả các vé có sẵn, bao gồm tên, giá và số lượng còn lại.
  - Hệ thống cần chỉ rõ vé nào đang có sẵn hoặc đã được đặt.
- **Đặt vé**:
  - Người dùng có thể đặt vé nếu nó còn khả dụng.
  - Khi vé được đặt, hệ thống cần cập nhật trạng thái khả dụng của vé và lưu thông tin đặt vé bao gồm tên người dùng và thời gian đặt.
- **Xác nhận đặt vé**:
  - Người dùng có thể hoàn tất thanh toán và xác nhận đặt vé trong 5 phút.
  - Khi vé được xác nhận (đã thanh toán), hệ thống cập nhật thời gian xác nhận và lưu trữ thông tin thanh toán.
- **Hủy vé**:
  - Người dùng có thể hủy đặt vé.
  - Khi vé bị hủy, hệ thống cần hoàn trả 90% giá vé cho người dùng và cập nhật lại trạng thái khả dụng của vé.
