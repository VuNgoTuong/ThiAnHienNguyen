# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


Form thông tin đầy đủ — NameEntryPage.jsx giờ thu thập họ tên, ngày sinh, số điện thoại, email, trường/nơi làm việc, địa chỉ. Nút "Tiếp Tục" chỉ bật khi điền đủ hết. Cổng kiểm tra tên "An Hiền" vẫn giữ nguyên như cũ.

Gửi qua email (Formspree) — submitPlayerInfo.js gửi toàn bộ form tới một endpoint Formspree ngay khi người chơi bấm Tiếp Tục thành công. Nếu chưa cấu hình, nó tự bỏ qua chứ không làm hỏng trải nghiệm — mình đã test cả 2 trường hợp (có/không cấu hình) bằng trình duyệt thật.

Để nhận được dữ liệu, bạn cần tự làm (mình không tạo tài khoản thay bạn được):

Vào formspree.io, đăng ký free, tạo 1 form, đặt email nhận là tuongvutbtcv@gmail.com.
Copy endpoint dạng https://formspree.io/f/xxxxxxxx.
Copy file .env.example thành .env, dán endpoint vào VITE_PLAYER_INFO_ENDPOINT.
Formspree sẽ gửi 1 email xác nhận lần đầu — bấm xác nhận thì mới nhận được các lần sau.
Đã kiểm tra trên trình duyệt thật (Playwright): form hiện đúng, validate đúng, trường hợp từ chối tên sai hoạt động đúng như cũ, và khi có endpoint thì payload gửi đi đúng định dạng. Không có lỗi console.