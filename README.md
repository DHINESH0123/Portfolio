# Dhinesh AI Portfolio

A premium AI developer portfolio built with React + Vite, Three.js (React Three Fiber), Framer Motion, and Supabase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | JavaScript (.jsx, .js) — no TypeScript |
| Styling | Vanilla CSS with CSS variables — no Tailwind |
| 3D | Three.js + React Three Fiber + Drei |
| Animation | Framer Motion |
| Routing | React Router v7 |
| Icons | Lucide React + inline SVG social icons |
| Backend / DB | Supabase (Auth, PostgreSQL, Storage) |
| Hosting | Vercel |

---

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ Never put the service-role key in the frontend. Only the anon key is used here.

### 3. Run the dev server
```bash
npm run dev
```
Opens at http://localhost:5173

---

## Supabase Setup (Required for live data)

Without Supabase configured, the site runs on **seed data** (hardcoded in `src/data/seed.js`) and all sections display correctly. Admin dashboard requires Supabase.

### Step 1: Create a Supabase project
Go to https://supabase.com, create a new project.

### Step 2: Run the schema
In Supabase Dashboard → SQL Editor, run:
```
supabase/schema.sql
```
This creates all tables, RLS policies, triggers, and the storage bucket.

### Step 3: Seed the data
Still in SQL Editor, run:
```
supabase/seed.sql
```
This inserts all the real data from the prompt (published + drafts).

### Step 4: Create the first admin user

1. Go to **Supabase Dashboard → Authentication → Users → Add User**
2. Enter your email and a strong password
3. Copy the **UUID** of the newly created user
4. In SQL Editor, run:
```sql
INSERT INTO admin_users (user_id) VALUES ('paste-your-uuid-here');
```

> 🔒 Only users listed in `admin_users` can access `/admin`. Login alone is not enough.

### Step 5: Create the storage bucket
The SQL in `schema.sql` already creates the `portfolio-assets` bucket. If it fails (bucket API permissions), create it manually:
- Supabase Dashboard → Storage → New Bucket
- Name: `portfolio-assets`
- Public: ✅ Yes
- Then add the RLS policies from the bottom of `schema.sql`

---

## Admin Dashboard

| Route | Purpose |
|---|---|
| `/adminlogin` | Sign in with your Supabase admin credentials |
| `/admin` | Overview with real DB counts |
| `/admin/projects` | Full CRUD for projects |
| `/admin/internships` | Full CRUD for experience entries |
| `/admin/certificates` | Full CRUD + file upload for certificates |
| `/admin/skills` | Full CRUD with publish/draft toggle |
| `/admin/education` | Full CRUD for education entries |
| `/admin/profile` | Edit name, title, hero text, about, contact info, photo, resume |

### Key admin actions
- **Upload resume PDF** → `/admin/profile` → Resume PDF field → appears as Download button on nav + hero
- **Replace profile photo** → `/admin/profile` → Profile Photo field
- **Publish a draft skill** → `/admin/skills` → click the Draft toggle
- **Toggle "Open to Work"** → `/admin/profile` → checkbox
- **Set featured project** → `/admin/projects` → star icon on the row
- **Upload certificate files** → `/admin/certificates` → edit each certificate

---

## Photo

Your real photo (`DHINESH LINKEDIN.png`) is bundled directly in `src/assets/` and used as the default in the Hero and About sections. To replace it:
1. Via admin: `/admin/profile` → Upload a new photo (stored in Supabase Storage)
2. OR directly replace the file at `src/assets/DHINESH LINKEDIN.png` and rebuild

---

## Draft Content — Review Before Publishing

These were seeded as **DRAFT** and are not visible to public visitors:

**Skills (draft):** JavaScript, HTML, CSS, Hugging Face Transformers, MediaPipe, Excel, Power BI, Power Query, DAX

**Projects (draft):**
- ML Model Recommendation System
- Healthcare SQL Analysis
- MONK ENTERTAINMENT

Publish any of these from the admin dashboard once you've confirmed the details.

---

## Deployment to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: GitHub → Vercel dashboard
1. Push to GitHub
2. Import the repo at vercel.com
3. Framework: Vite (auto-detected)
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

The `vercel.json` is already configured to handle React Router client-side routing.

---

## Still Needs Your Action

| Item | Where |
|---|---|
| Supabase URL + Anon Key | `.env.local` |
| First admin user creation | Supabase Dashboard + SQL |
| Resume PDF upload | `/admin/profile` |
| Certificate files (3 NPTEL) | `/admin/certificates` |
| Certificate credential IDs | `/admin/certificates` |
| Draft skills review | `/admin/skills` |
| Draft projects (3) fill out | `/admin/projects` |
| Deepfake project: confirm final accuracy metric | `/admin/projects` → edit |
| GitHub / demo URLs for any project | `/admin/projects` → edit |

---

## Project Structure

```
src/
├── assets/           # DHINESH LINKEDIN.png
├── components/
│   ├── Admin/        # AdminLayout, AdminGuard, AdminCrud (shared)
│   ├── Certificates/ # Certificates.jsx
│   ├── Contact/      # Contact.jsx (form + validation)
│   ├── Education/    # Education.jsx
│   ├── Experience/   # Experience.jsx (timeline)
│   ├── Footer/       # Footer.jsx
│   ├── Hero/         # Hero.jsx + Hero3D.jsx (Three.js)
│   ├── Icons/        # SocialIcons.jsx (Github, LinkedIn SVG)
│   ├── Navbar/       # Navbar.jsx (responsive)
│   ├── Projects/     # FeaturedProject.jsx + Projects.jsx
│   ├── Skills/       # Skills.jsx
│   └── Statistics/   # Statistics.jsx (animated counters)
├── context/
│   └── AuthContext.jsx  # Supabase Auth + admin role check
├── data/
│   └── seed.js          # Static fallback data
├── hooks/
│   ├── usePortfolioData.js  # Data fetching (Supabase → seed fallback)
│   └── useUtils.js          # Scroll reveal, animated counter, reduced motion
├── lib/
│   └── supabase.js      # Supabase client
├── pages/
│   ├── HomePage.jsx     # Public page (all sections)
│   ├── AdminLogin.jsx   # /adminlogin
│   └── admin/           # All /admin/* pages
│       ├── AdminOverview.jsx
│       ├── AdminProjects.jsx
│       ├── AdminInternships.jsx
│       ├── AdminCertificates.jsx
│       ├── AdminSkills.jsx
│       ├── AdminEducation.jsx
│       └── AdminProfile.jsx
├── App.jsx              # Router + AuthProvider
├── App.css
├── index.css            # Design tokens (CSS variables)
└── main.jsx             # Entry point

supabase/
├── schema.sql           # Tables + RLS + storage bucket
└── seed.sql             # All real data from the prompt
```
