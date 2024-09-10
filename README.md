# Ticket Reservation System

## Link demo: [Ticket Reservation](https://web-ticket-reservation-system.onrender.com)
Thông tin đăng nhập nhanh:
- Email: test@gmail.com
- Password: 1234
- Email: test2@gmail.com
- Password: 1234

Thông tin để test phần thanh toán (Stripe sandbox):
- Số thẻ: 4242 4242 4242 4242
- Ngày hết hạn: 01/26 (hoặc bất kỳ ngày hợp lệ nào)
- Số CVC: 123


## Các chức năng của hệ thống đặt vé:
- **Hiển thị danh sách vé**:
  - Hệ thống hiển thị danh sách tất cả các vé có sẵn, bao gồm tên, giá và số lượng còn lại.
  - Hệ thống hiển thị vé nào đang có sẵn hoặc đã được đặt.
- **Đặt vé**:
  - Người dùng có thể đặt vé nếu nó còn khả dụng.
  - Khi vé được đặt, hệ thống sẽ cập nhật trạng thái khả dụng của vé và lưu thông tin đặt vé bao gồm tên người dùng và thời gian đặt.
- **Xác nhận đặt vé**:
  - Người dùng có thể hoàn tất thanh toán và xác nhận đặt vé trong 5 phút.
  - Khi vé được xác nhận (đã thanh toán), hệ thống cập nhật thời gian xác nhận và lưu trữ thông tin thanh toán.
- **Hủy vé**:
  - Người dùng có thể hủy đặt vé.
  - Khi vé bị hủy, hệ thống sẽ hoàn trả 90% giá vé cho người dùng và cập nhật lại trạng thái khả dụng của vé.
- **Tự động hủy đặt vé**:
  - Hệ thống sẽ tự động hủy các vé chưa được xác nhận thanh toán trong 5 phút.
    

## Công nghệ đã sử dụng
- **HTML**: Xây dựng cấu trúc cho các trang web.
- **CSS**: Tạo kiểu dáng cho ứng dụng.
- **JavaScript**: Thêm tính năng động cho các phần tử trên trang.
- **Node.js**: Viết mã phía máy chủ để xử lý logic ứng dụng.
- **Express.js**: Xây dựng máy chủ và quản lý các tuyến đường (routes).
- **MongoDB**: Quản lý cơ sở dữ liệu NoSQL.
- **EJS**: Công cụ template giúp nhúng JavaScript vào HTML.
- **Bootstrap**: Thư viện CSS để tạo giao diện responsive và hiện đại.
- **Mongoose**: ODM (Object Data Modeling) cho MongoDB trong Node.js.
- **Stripe API**: Xử lý thanh toán trực tuyến.
- **Node-cron**: Thiết lập và quản lý các công việc tự động (cron jobs) như hủy các đặt vé không thanh toán sau một khoảng thời gian.
