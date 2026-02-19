# 📋 ChemMastery - Complete File Structure Guide

A comprehensive reference of every file and folder in the project with their purposes.

---

## 📦 **Root Level Files**

| File                   | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `package.json`         | Project dependencies, scripts (dev, build, start, lint), and metadata |
| `tsconfig.json`        | TypeScript configuration                                              |
| `next.config.mjs`      | Next.js configuration (routing, optimization, etc.)                   |
| `tailwind.config.ts`   | Tailwind CSS configuration for styling                                |
| `postcss.config.mjs`   | PostCSS configuration for CSS processing                              |
| `next-env.d.ts`        | Next.js TypeScript type definitions                                   |
| `README.md`            | Project overview and setup instructions                               |
| `API_DOCUMENTATION.md` | API endpoints and usage documentation                                 |
| `ENVIRONMENT_SETUP.md` | Environment setup instructions                                        |

---

## 🔐 **Root `/src` Folder** - Main Application Code

### Core Authentication Files

| File             | Purpose                                                                         |
| ---------------- | ------------------------------------------------------------------------------- |
| `auth.ts`        | NextAuth authentication setup with mock users (Student, Teacher, Admin, Parent) |
| `auth.config.ts` | Authentication configuration (providers, callbacks, pages)                      |
| `middleware.ts`  | NextAuth middleware for route protection                                        |

### Main Directories

- **`app/`** - Next.js app router pages and layouts
- **`components/`** - Reusable React components
- **`data/`** - Chemistry databases and constants
- **`types/`** - TypeScript type definitions
- **`lib/`** - Utility functions
- **`hooks/`** - Custom React hooks
- **`actions/`** - Server actions
- **`utils/`** - General utility functions

---

## 🖼️ **`/src/app`** - Pages & Routes

### Root Layout & Page

| File          | Purpose                                                |
| ------------- | ------------------------------------------------------ |
| `layout.tsx`  | Main app layout wrapper (navigation, session provider) |
| `page.tsx`    | Home page (/)                                          |
| `globals.css` | Global CSS styles                                      |

### Auth Routes: `(auth)/`

```
(auth)/
├── login/page.tsx         → Login page (/login)
└── register/page.tsx      → Registration page (/register)
```

- User authentication pages with role selection
- Handles login/register form submissions

### Student Routes: `student/`

```
student/
├── page.tsx               → Student dashboard home
├── actions.ts             → Server actions for student features
├── profile/
│   └── page.tsx          → Student profile & statistics
├── forum/
│   └── page.tsx          → Doubt forum (Q&A)
└── modules/
    └── acid-base-titration/
        └── page.tsx      → Chemistry module content
```

- **actions.ts**: Server-side functions for database operations
- **profile**: View grades, streaks, progress
- **forum**: Ask/answer chemistry questions
- **modules**: Interactive chemistry lessons

### Admin Routes: `admin/`

```
admin/
└── page.tsx               → Admin dashboard (attendance, fees, scheduling)
```

- Teachers/admins manage batches, fees, attendance

### Parent Routes: `parent/`

```
parent/
└── page.tsx               → Parent portal (view child's progress)
```

### API Routes: `api/`

```
api/
└── auth/
    └── [...nextauth]/
        └── route.ts      → NextAuth API endpoints
```

- Handles authentication API calls

### Assets: `fonts/`

- Custom fonts directory

---

## 🧩 **`/src/components`** - React Components

### Top-Level Chemistry Tools (Page Importable)

| Component            | Purpose                                                       | Lines |
| -------------------- | ------------------------------------------------------------- | ----- |
| `ChemistryLab.tsx`   | Interactive beaker mixing lab with reactions, temperature, pH | 475   |
| `MoleculeViewer.tsx` | 3D molecule visualization (Three.js)                          | 313   |
| `PeriodicTable.tsx`  | Interactive periodic table with 4 view modes                  | 368   |
| `OrganicCanvas.tsx`  | Organic molecule drawing tool with bonds                      | 332   |
| `ErrorBoundary.tsx`  | Error handling wrapper component                              | -     |
| `molecularData.ts`   | Database of molecules and element properties                  | -     |

### Admin Components: `admin/`

| Component             | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `AttendanceTable.tsx` | QR code scanning, mark attendance (present/absent/pending) |
| `BatchScheduler.tsx`  | Create/manage class schedules and batches                  |
| `FeeManager.tsx`      | Fee collection and payment tracking                        |
| `Modals.tsx`          | Reusable modal dialogs for forms                           |

### Auth Components: `auth/`

| Component                  | Purpose                                |
| -------------------------- | -------------------------------------- |
| `AuthPage.tsx`             | Login/Register form with role selector |
| `AuthorizedComponents.tsx` | Role-based access control wrapper      |

### Dashboard Components: `dashboard/`

| Component            | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `DailyChallenge.tsx` | Daily chemistry quiz with 3 difficulty levels |
| `Leaderboard.tsx`    | Student rankings and scores                   |
| `UpcomingEvents.tsx` | Upcoming classes/events notifications         |

### Lab Instruments: `lab/`

| Component         | Purpose                             |
| ----------------- | ----------------------------------- |
| `PHMeter.tsx`     | pH scale measurement display (0-14) |
| `Thermometer.tsx` | Temperature display (0-100°C)       |

### Parent Components: `parent/`

| Component           | Purpose                                 |
| ------------------- | --------------------------------------- |
| `ProgressChart.tsx` | Graph visualization of student progress |
| `PTMScheduler.tsx`  | Schedule Parent-Teacher Meetings        |

### Student Components: `student/`

| Component        | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `DoubtForum.tsx` | Forum for asking/answering chemistry questions |

### Providers: `providers/`

| Component             | Purpose                           |
| --------------------- | --------------------------------- |
| `SessionProvider.tsx` | NextAuth session context provider |

---

## 📊 **`/src/data`** - Chemistry Databases & Constants

| File                     | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `reaction-database.ts`   | Chemical reactions, mixing rules, color calculations |
| `periodic-table-data.ts` | Element data (atomic number, mass, category, etc.)   |

---

## 🎯 **`/src/types`** - TypeScript Type Definitions

| File             | Purpose                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `index.ts`       | Main types: User, StudentStats, Resource, Chemical, ReactionResult |
| `next-auth.d.ts` | NextAuth custom type extensions                                    |

---

## 🔨 **`/src/lib`** - Utility Functions

| File            | Purpose                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `ui.ts`         | UI helper functions (className merging with `clsx` & `tailwind-merge`) |
| `validation.ts` | Form validation schemas (email, password, etc.) using Zod              |

---

## 🪝 **`/src/hooks`** - Custom React Hooks

| File              | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `useFeeStatus.ts` | Custom hook for fee payment status checking |

---

## ⚙️ **`/src/actions`** - Server Actions

| File      | Purpose                                                        |
| --------- | -------------------------------------------------------------- |
| `auth.ts` | Server-side authentication functions (login, register, logout) |

---

## 📦 **`/supabase`** - Database

| File         | Purpose                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `schema.sql` | Database setup schema for Supabase (users, courses, attendance, fees, etc.) |

---

## 🎨 **Design & Tech Stack**

### Frontend Stack

- **Framework**: Next.js 14.2 (React 18)
- **Styling**: Tailwind CSS + PostCSS
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Validation**: Zod
- **Authentication**: NextAuth 5.0

### Key Libraries

- `canvas-confetti` - Celebration effects
- `recharts` - Data visualization charts
- `@react-three/drei` - 3D helpers
- `@react-three/postprocessing` - Post-processing effects

---

## 🗺️ **User Role Routes Map**

```
STUDENT (student/)
├── Dashboard (page.tsx)
├── Profile (profile/page.tsx)
├── Chemistry Modules (modules/acid-base-titration/)
├── Doubt Forum (forum/page.tsx)
└── Tools (tools/)
    ├── Chemistry Lab
    ├── Molecule Viewer
    ├── Organic Canvas
    └── Periodic Table

TEACHER (admin/)
├── Dashboard (page.tsx)
├── Attendance Tracking
├── Fee Management
└── Batch Scheduling

PARENT (parent/)
├── Dashboard (page.tsx)
├── Child's Progress
├── Upcoming Events
└── PTM Scheduling

PUBLIC
├── Home (/)
├── Login (/login)
└── Register (/register)
```

---

## 🔄 **Data Flow**

```
User Action
    ↓
Page Component (app/*)
    ↓
Server Action (actions/*.ts) OR API Route (api/*)
    ↓
Database (Supabase) OR Mock Data
    ↓
State Update (Zustand/React State)
    ↓
Re-render Components (components/*)
```

---

## 📝 **Quick File Lookup by Feature**

### User Registration & Login

- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/components/auth/AuthPage.tsx`
- `src/auth.ts`
- `src/actions/auth.ts`

### Student Dashboard

- `src/app/student/page.tsx`
- `src/components/dashboard/DailyChallenge.tsx`
- `src/components/dashboard/Leaderboard.tsx`

### Chemistry Tools

- `src/components/ChemistryLab.tsx`
- `src/components/MoleculeViewer.tsx`
- `src/components/PeriodicTable.tsx`
- `src/components/OrganicCanvas.tsx`

### Admin Features

- `src/app/admin/page.tsx`
- `src/components/admin/*.tsx`

### Forum/Q&A

- `src/app/student/forum/page.tsx`
- `src/components/student/DoubtForum.tsx`

### Database Setup

- `supabase/schema.sql`

---

## 🚀 **Getting Started Commands**

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint checks
```

---

This guide should help you navigate the entire project structure! 🎯
