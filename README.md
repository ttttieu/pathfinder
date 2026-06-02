# PathFinder MVP

> Giúp học sinh THPT hiểu tác động của việc chọn môn học đối với cơ hội ngành nghề tương lai.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (Postgres + Auth + RLS)
- **Deploy**: Vercel
- **Analytics**: PostHog (optional)

---

## Cài đặt local

### 1. Clone & cài dependencies

```bash
git clone https://github.com/your-org/pathfinder-mvp
cd pathfinder-mvp
npm install
```

### 2. Tạo project Supabase

1. Đăng ký tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Vào **Settings → API** → copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key

### 3. Cấu hình environment

```bash
cp .env.local.example .env.local
```

Điền vào `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_SECRET=mat-khau-admin-cua-ban
# CRM_WEBHOOK_URL=https://hook.make.com/xxx  # optional
```

### 4. Chạy migration Supabase

**Option A — Supabase CLI**
```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

**Option B — Paste thủ công**
1. Vào Supabase Dashboard → **SQL Editor**
2. Paste nội dung `supabase/migrations/20240101000000_init.sql`
3. Click **Run**

### 5. Chạy dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy lên Vercel

### Bước 1 — Push lên GitHub

```bash
git init
git add .
git commit -m "init pathfinder mvp"
git remote add origin https://github.com/your-org/pathfinder-mvp
git push -u origin main
```

### Bước 2 — Import vào Vercel

1. [vercel.com/new](https://vercel.com/new) → Import Git repository
2. Framework: **Next.js** (auto-detected)
3. Thêm **Environment Variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` |
| `ADMIN_SECRET` | `mat-khau-admin` |
| `CRM_WEBHOOK_URL` | _(optional)_ |

4. Click **Deploy** → done ✅

---

## API

### `POST /api/assessment`

Nhận kết quả đánh giá, lưu vào Supabase, trả về recommendation.

```json
// Request body
{
  "profile": {
    "email": "vanAn@gmail.com",
    "name": "Nguyễn Văn An",
    "grade": "11",
    "school": "THPT Lê Hồng Phong",
    "province": "TP. HCM"
  },
  "competencyScores": {
    "ANALYTICAL": 4, "TECHNICAL": 5, "CREATIVE": 3,
    "SOCIAL": 2, "ENTREPRENEURIAL": 3, "DESIGN": 2
  },
  "subjectScores": {
    "MATH": 5, "PHYSICS": 4, "INFORMATICS": 4, ...
  },
  "selectedElectives": ["PHYSICS", "INFORMATICS", "CHEMISTRY", "TECHNOLOGY"]
}

// Response
{
  "assessmentId": "uuid",
  "studentId": "uuid",
  "openPaths": ["Khoa học máy tính / CNTT", "AI / Khoa học dữ liệu", ...],
  "restrictedPaths": ["Y khoa", "Dược học", ...],
  "strengths": ["Kỹ thuật / Công nghệ", "Tư duy phân tích"],
  "insights": ["Vật lý + Tin học là tổ hợp mạnh cho CNTT và AI."]
}
```

### `GET /api/recommendation/:id`

Lấy kết quả đã lưu theo assessmentId.

### `GET /api/admin/leads`

Export toàn bộ leads dạng CSV. Yêu cầu header `x-admin-secret`.

---

## Admin Panel

Truy cập: `https://your-domain.com/admin`

Nhập `ADMIN_SECRET` để đăng nhập. Tính năng:
- Xem danh sách leads với stats theo lớp
- Filter và search
- Download CSV

---

## CRM Integration

Đặt `CRM_WEBHOOK_URL` để tự động push mỗi assessment lên CRM:

**Brevo (SendinBlue)**
```
https://api.brevo.com/v3/contacts  → dùng Make/Zapier để map fields
```

**HubSpot**
```
Dùng HubSpot Form Webhook URL từ Settings → Integrations → Webhooks
```

**Make / Zapier**
```
Tạo webhook scenario → nhận JSON → push vào bất kỳ CRM nào
```

Payload gửi đi:
```json
{
  "email": "...",
  "name": "...",
  "phone": "...",
  "grade": "Lớp 11",
  "subjects": "Toán, Ngữ văn, Ngoại ngữ, Lịch sử, Vật lý, Tin học, ...",
  "strengths": "Kỹ thuật / Công nghệ, Tư duy phân tích",
  "open_paths": "Khoa học máy tính, AI, ...",
  "narrow_paths": "Y khoa, Dược học",
  "tags": "open:CNTT, open:AI, narrow:Y khoa",
  "source": "PathFinder MVP",
  "created_at": "2024-07-01"
}
```

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── assessment/page.tsx       # 4-step assessment flow
│   ├── result/[id]/page.tsx      # Result + CRM card
│   ├── admin/page.tsx            # Admin panel
│   └── api/
│       ├── assessment/route.ts   # POST — save & recommend
│       ├── recommendation/[id]/  # GET — fetch result
│       └── admin/leads/          # GET — export CSV
├── components/
│   ├── steps/
│   │   ├── StepProfile.tsx
│   │   ├── StepCompetency.tsx
│   │   └── StepSubjects.tsx
│   ├── ui/ProgressBar.tsx
│   └── ResultCRMCard.tsx
└── lib/
    ├── knowledge-graph.ts        # Core engine + data
    ├── supabase.ts               # DB clients
    ├── crm.ts                    # CRM webhook helper
    └── schemas.ts                # Zod validation
```

---

## Roadmap V2

Sau khi có 200–500 học sinh sử dụng:

- [ ] **Career Explorer** — click vào ngành để xem công việc thực tế, mức lương, kỹ năng cần có
- [ ] **AI Reflection** — Claude đặt câu hỏi phản biện dựa trên lựa chọn (không đưa ra quyết định)
- [ ] **PostHog analytics** — funnel, drop-off, popular subject combos
- [ ] **Email automation** — gửi kết quả qua Brevo sau khi hoàn thành

---

## License

MIT
