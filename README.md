# ChemManager

ChemManager is a comprehensive digital platform designed for chemistry coaching centers. It streamlines administrative tasks for tutors while providing an engaging, interactive learning experience for students.

## 🌟 Key Features

### For Tutors (Admin Console)

- **Assignment Publisher**: Create, publish, and manage tiered daily assignments (Levels 1-5).
- **Parent Communication Module**: Send structured updates and performance reports directly to parents.
- **Attendance & Fee Management**: Easily track student presence and manage fee records.
- **Interactive Teaching Tools**: Access presentation tools, 3D molecule viewers, and virtual labs to enhance classroom learning.

### For Students (Learning Portal)

- **Assignment Solver**: Access and solve daily tiered assignments with immediate feedback.
- **Mentorship Scheduling**: Book bi-weekly 15-minute 1-on-1 guidance sessions with mentors.
- **Recorded & Live Classes**: Catch up on missed lectures or review past concepts in a centralized gallery.
- **Weekly Study Planner**: Stay organized by breaking down assignments and study goals into manageable daily tasks.
- **Interactive Learning Tools**:
  - 🧪 **Virtual Labs**: Safely simulate chemical reactions and titration.
  - 🧬 **3D Molecule Viewer**: Inspect and interact with complex molecular structures in full 3D.
  - 🎨 **Organic Canvas**: Draw and visualize organic chemistry structures.
  - ⚛️ **Smart Periodic Table**: Explore element properties, electronegativity trends, state of matter at different temperatures, and more.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D Rendering**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

- `src/app/`: Next.js App Router pages (admin, student, auth, etc.)
- `src/components/`: Reusable UI components and feature modules
- `src/components/admin/`: Admin-specific components (AssignmentPublisher, ParentCommunication)
- `src/components/student/`: Student-specific components (AssignmentSolver, MentorshipScheduler, StudyPlanner)
- `src/types/`: TypeScript definitions

## 🎨 Design Philosophy

ChemManager uses a modern, dynamic, and premium aesthetic:

- **Glassmorphism**: Elegant translucent UI elements.
- **Subtle Gradients**: Curated color palettes with smooth transitions.
- **Micro-animations**: Enhanced user experience with interactive hover states and motion.

## 📄 License

This project is proprietary and confidential.
