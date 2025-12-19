# Decades Bar Training & Management Portal - Project Overview

This document provides a comprehensive overview of the Decades Bar project for LLMs and developers. It covers the concept, architecture, tech stack, and key features.

## 🌟 Concept & Mission
Decades Bar is a collaborative team management platform designed for a staff of 15-20 people. It serves as a unified hub for training, operational policies, and management tracking.

**Staff Perspective**: Access to training materials, drink recipes, uniform guides, and shift procedures.
**Management Perspective**: Tracking employee progress, managing maintenance tickets, organizing special events, and recording disciplinary actions.

---

## 🛠 Tech Stack
- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Real-time)
- **Styling**: [TailwindCSS 3.4](https://tailwindcss.com/) + Custom CSS Modules
- **State Management**: React Context (`AppContext`)
- **Visuals/Charts**: [Recharts](https://recharts.org/)
- **Icons/Images**: [Sharp](https://sharp.pixelplumbing.com/) (for optimization)

---

## 📁 Directory Structure
```text
/
├── public/                 # Static assets (icons, manifest)
├── scripts/                # Build and optimization scripts
├── sql/                    # Supabase schema and migrations
└── src/
    ├── app/                # Next.js App Router (pages & layouts)
    ├── components/         # Reusable UI components
    │   ├── sections/       # Feature-specific sections (Welcome, Training, etc.)
    │   └── ui/             # Common UI elements
    ├── contexts/           # React Context (AppContext for global state)
    ├── lib/                # Core logic, Supabase services, and utilities
    └── types/              # TypeScript interfaces and shared types
```

---

## 🗄 Database Schema (Supabase)
The project relies on several key tables in Supabase:
- `users`: Extends Supabase Auth with metadata (position, status, progress, acknowledgment).
- `user_progress`: Detailed tracking of section visits and completion (used for the progress system).
- `tasks`: Task management for staff and events.
- `maintenance_tickets`: Bug and facility issue tracking.
- `special_events`: Planning and coordination for bar events.
- `counseling_records`: HR-related disciplinary tracking.

---

## 🚀 Key Features & Implementations

### 📊 Progress Tracking System
Tracks staff training progress across various sections.
- **Logic**: Located in `src/lib/supabase-progress.ts`.
- **Mechanism**: Calculates progress based on time spent in sections vs. `SECTION_CONFIG` requirements.
- **Persistence**: Data stored in the `user_progress` table.
- **Real-time**: Uses Supabase Postgres Changes to update the UI instantly when progress is logged.

### 🛠 Maintenance Ticket System
Real-time facility management.
- **Logic**: `src/lib/supabase-maintenance.ts`.
- **Features**: Floor selection (2000s, 2010s, Hip Hop, Rooftop), priority levels, and status tracking.

### 🍹 Drink Recipes & Search
Quick access to cocktail specifications.
- **Logic**: `src/lib/supabase-cocktails.ts`.
- **Search**: Fuzzy search across titles and ingredients.

### 🔐 Authentication & Role-Based Access
- **Roles**: `Admin`, `Bartender`, `Trainee`.
- **Implementation**: Handled via Supabase Auth and reflected in `AppContext`.

---

### 🎨 Design System & Aesthetics
The application features a "Premium/Cinematic" aesthetic consistently applied across all sections.
- **Primary Theme**: Gold & Black (#D4AF37).
- **Core Visual Feature**: **Cinematic 3D Gold Text** (linear gradients + drop shadows) and the **"Outfit"** font.
- **Centralized Styling**: Utility file `src/lib/brand-styles.ts` exports common branding styles (`goldTextStyle`, `sectionHeaderStyle`, `cardHeaderStyle`) for consistent application.
- **UI Patterns**: Glassmorphism (blur backgrounds), subtle micro-animations, and consistent card layouts.

---

---

## 🛠 Tooling & Developer Experience (DX)

To maintain a high-quality development workflow, the following tools and guides are integrated into the project:

- **[MCP Setup Guide](file:///Users/riazahmed/Development/decades-bar-training/MCP_SETUP_GUIDE.md)**: Connect your AI assistant directly to Supabase, Postgres, and Vercel.
- **[IDE Extensions](file:///Users/riazahmed/Development/decades-bar-training/RECOMMENDED_EXTENSIONS.md)**: Recommended VS Code/Cursor extensions for this stack.
- **[Automated Testing](file:///Users/riazahmed/Development/decades-bar-training/tests/smoke.spec.ts)**: End-to-end testing powered by **Playwright**.
- **[Error Tracking](file:///Users/riazahmed/Development/decades-bar-training/SENTRY_INTEGRATION.md)**: Production monitoring and error capturing with **Sentry**.

---

## 🔄 Development Workflows & Context
To ensure seamless continuity for developers and AI assistants, this project uses a two-layered context system:

1.  **Structural Context (`PROJECT_OVERVIEW.md`)**: (This file) Provides the long-term project mission, architecture, tech stack, and core feature descriptions.
2.  **Active Session Context (`CURRENT_CONTEXT.md`)**: Tracks the current work-in-progress, recent technical decisions, and active roadblocks.

- **Development**: `npm run dev`
- **Context Management**: `npm run update-memory` (updates `CURRENT_CONTEXT.md` with your latest work).
- **Feature Addition**: 
  1. Define types in `src/types`.
  2. Implement Supabase service in `src/lib`.
  3. Create UI components in `src/components`.
  4. Use `AppContext` for state if needed.
