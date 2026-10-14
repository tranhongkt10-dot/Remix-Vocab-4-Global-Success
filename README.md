# Vocab 4 – Global Success 🐰

Ứng dụng web hỗ trợ học sinh lớp 4 học từ vựng, phiên âm IPA, luyện tập chính tả và ngữ âm tiếng Anh chuẩn theo định hướng chương trình **Tiếng Anh 4 (Global Success)**.

---

## 🌟 Tính Năng Nổi Bật

1. **Bản đồ 20 Units học tập**:
   - Chia theo Học kỳ 1 (Unit 1–10) và Học kỳ 2 (Unit 11–20).
   - Thẻ từ vựng chi tiết: Từ tiếng Anh, phiên âm quốc tế IPA chuẩn, loại từ, nghĩa tiếng Việt chuẩn lứa tuổi, câu ví dụ và bản dịch.
   - Chế độ lật thẻ **Flashcard 3D** trực quan.
2. **Phát âm chuẩn bản xứ (Web Speech API)**:
   - Phát âm bằng giọng chuẩn tích hợp sẵn trong trình duyệt (hoàn toàn miễn phí).
   - Hỗ trợ 2 tốc độ: **1.0x (Chuẩn)** và **0.8x (Chậm nghe rõ ending sounds)**.
3. **Trung tâm 5 trò chơi & bài tập tương tác**:
   - 🔤 **Điền chữ cái còn thiếu** (Missing Letters).
   - 🔀 **Sắp xếp chữ cái thành từ đúng** (Word Unscramble).
   - 📄 **Trắc nghiệm nghĩa Anh ➔ Việt**.
   - 🇻🇳 **Trắc nghiệm nghĩa Việt ➔ Anh**.
   - 👂 **Luyện nghe và chọn đáp án**.
   - Hiển thị kết quả đúng/sai, điểm số, sao thưởng ⭐ và **bảng giải thích chi tiết đáp án**.
4. **Chuyên đề Ngữ âm & Trọng âm Lớp 4**:
   - Quy tắc đọc đuôi **-s / -es** (kèm mẹo nhớ: *"Thời phong kiến phương tây"*, *"Sóng gió chẳng sợ zì"*).
   - Quy tắc đọc đuôi **-ed** (kèm mẹo nhớ: *"Tiền đô"*, *"Chính phủ pháp..."*).
   - Quy tắc **Trọng âm từ 2 âm tiết** (Danh từ/Tính từ nhấn âm 1, Động từ nhấn âm 2).
   - Quy tắc **Trọng âm câu & Ngữ điệu** (Yes/No questions lên giọng, Wh- xuống giọng).
   - Bài tập trắc nghiệm phân loại âm có giải thích chi tiết.
5. **Trợ lý AI Thỏ Bác Học Bunny**:
   - Tích hợp mô hình **Gemini 2.5 Flash** qua máy chủ Express proxy an toàn (không để lộ khóa API ở client).
   - Chỉ gọi API khi học sinh chủ động gửi câu hỏi (giới hạn tối đa 100 ký tự).
   - Tích hợp bộ nhớ đệm `localStorage` giúp tiết kiệm 100% token cho các câu hỏi đã trả lời trước đó.
6. **Bảng vàng thành tích & Tiến độ học tập**:
   - Tự động lưu chuỗi ngày học 🔥, số sao ⭐, tỉ lệ % hoàn thành và bộ huy hiệu thành tích vào bộ nhớ trình duyệt (`localStorage`).

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React.
- **Backend & Tooling**: Express.js, Vite 8, tsx, Node.js.
- **Âm thanh**: Web Speech API (`SpeechSynthesis`) & Web Audio API (Synthesized SFX).
- **Trí tuệ nhân tạo**: `@google/genai` (Gemini 2.5 Flash).

---

## 📁 Cấu Trúc Thư Mục

```text
├── index.html              # Entry HTML
├── package.json            # Cấu hình dependencies và scripts
├── server.ts               # Express backend proxy (Gemini API & Vite middleware)
├── tsconfig.json           # Cấu hình TypeScript
├── vite.config.ts          # Cấu hình Vite & Tailwind
├── .env.example            # Mẫu biến môi trường
├── .gitignore              # Danh sách loại trừ khi đẩy lên Git
└── src/
    ├── main.tsx            # Entry React
    ├── App.tsx             # Điều hướng màn hình chính và trạng thái
    ├── index.css           # Cấu hình Tailwind CSS
    ├── types/              # Định nghĩa TypeScript Types
    ├── data/               # Dữ liệu từ vựng 20 Units và bài học ngữ âm
    ├── services/           # TTS Speech, AI Proxy Client, Local Storage Progress
    └── components/         # Các thành phần giao diện (Header, Home, Units, Games, Phonics...)
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.0.0 trở lên.
- **npm** (hoặc yarn / bun / pnpm).

### 2. Cài đặt các thư viện
```bash
npm install
```

### 3. Cấu hình biến môi trường
Sao chép tệp mẫu `.env.example` thành `.env`:
```bash
cp .env.example .env
```
Mở tệp `.env` và điền khóa Gemini API của bạn (lấy miễn phí tại [Google AI Studio](https://aistudio.google.com)):
```env
GEMINI_API_KEY="AIzaSy..."
```
*(Lưu ý: Nếu không điền khóa, ứng dụng vẫn chạy 100% đầy đủ các chức năng học từ vựng, mini-game, phát âm và chuyển sang dùng mẹo có sẵn của Thỏ Bunny mà không phát sinh lỗi).*

### 4. Chạy chế độ phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

### 5. Kiểm tra mã nguồn (Lint) & Đóng gói (Build)
- Kiểm tra kiểu dữ liệu TypeScript:
  ```bash
  npm run lint
  ```
- Đóng gói ứng dụng:
  ```bash
  npm run build
  ```
- Khởi chạy bản đóng gói:
  ```bash
  npm run start
  ```

---

## 🔒 Lưu Ý An Toàn & Bảo Mật Khi Đưa Lên GitHub

1. **Tuyệt đối không commit tệp `.env`**: Tệp `.env` đã được liệt kê trong `.gitignore` để không bao giờ bị đẩy lên GitHub.
2. **Không chỉnh sửa API Key trong code frontend**: Mọi cuộc gọi AI đều đi qua endpoint trung gian `/api/ai-assistant` trong `server.ts`.
3. **Dữ liệu chương trình**: Dữ liệu từ vựng và bài học được biên soạn định hướng theo chủ đề SGK Tiếng Anh 4 (Global Success) phục vụ mục đích học tập và rèn luyện.

---

## 📄 Bản Quyền
Dự án được xây dựng phục vụ cộng đồng học sinh, phụ huynh và giáo viên tiểu học. Giấy phép mã nguồn: **Apache-2.0**.
