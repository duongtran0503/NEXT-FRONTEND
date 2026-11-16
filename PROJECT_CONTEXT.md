# PROJECT CONTEXT & ARCHITECTURE

## 1. Tổng quan dự án

- **Tên dự án:** [Điền tên dự án của bạn]
- **Mô tả ngắn gọn:** [Ví dụ: Web app quản lý công việc cá nhân / Nền tảng đọc truyện...]
- **Mục tiêu hiện tại:** [Ví dụ: Hoàn thiện luồng Authentication và trang Dashboard]

## 2. Tech Stack & Phiên bản đã cài đặt

- **Framework:** Next.js 16.4 (App Router, `src/` directory, Turbopack)
- **Ngôn ngữ:** TypeScript (Strict mode)
- **Styling & UI:** Tailwind CSS v4, shadcn/ui, Lucide React (Icons), Sonner (Toast notifications)
- **Form & Validation:** React Hook Form + Zod (`@hookform/resolvers`)
- **State & Data Fetching:** TanStack Query v5 (Server state / API caching), Zustand (Client global state)
- **Testing / Mocking:** MSW (Mock Service Worker)

## 3. Cấu trúc thư mục (`src/`)

```text
src/
├── app/                 # App Router (pages, layouts, loading, error)
├── components/
│   ├── ui/              # Các component gốc từ shadcn/ui
│   └── shared/          # Các component dùng chung (Navbar, Sidebar, Modal...)
├── features/            # Chia theo từng module tính năng (auth, dashboard, ...)
├── hooks/               # Custom React hooks (prefix: use...)
├── lib/                 # Cấu hình tiện ích (utils.ts, axios/fetch instance, zod schemas)
├── providers/           # Context & QueryClientProvider
├── services/            # Các hàm gọi API tách biệt khỏi UI
├── stores/              # Zustand stores
└── types/               # TypeScript interfaces & types dùng chung
```
