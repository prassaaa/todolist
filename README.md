# DevTask Flow

A modern task management application built specifically for developer workflows.

![DevTask Flow](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-blue)

## ✨ Features

- 📊 **Real-time Dashboard** - Statistics overview with task counts by status
- 🎯 **Dual View Modes** - Switch between List View and Kanban Board View
- 🖱️ **Drag & Drop** - Drag tasks between columns in Board View
- ⚡ **Quick Add** - Create tasks instantly with Enter key
- 🏷️ **Smart Filtering** - Filter by status and priority
- 🎨 **Color-Coded Tags** - Visual tags for bug, feature, refactor, etc.
- ✍️ **Markdown Support** - Task descriptions support markdown with syntax highlighting
- 🌙 **Dark Mode** - Beautiful dark theme with toggle
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🔔 **Toast Notifications** - Feedback for all user actions
- 💾 **Archiving** - Soft delete with archive functionality

## 🛠️ Tech Stack

- **Framework:** React 19.2 + Vite 7.3
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4.1
- **Database:** Supabase (PostgreSQL)
- **State Management:** TanStack Query v5
- **Forms:** React Hook Form + Zod validation
- **UI Components:** Shadcn/UI (Radix UI based)
- **Icons:** Lucide React
- **Drag & Drop:** @dnd-kit
- **Markdown:** react-markdown + rehype-highlight
- **Notifications:** Sonner
- **Date Formatting:** date-fns

## 📁 Project Structure

```
src/
├── api/
│   └── tasks.ts                    # CRUD operations with Supabase
├── components/
│   ├── ui/                         # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── skeleton.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── tabs.tsx
│   ├── features/
│   │   ├── StatusBadge.tsx          # Status badge component
│   │   ├── PriorityIcon.tsx         # Priority badge component
│   │   ├── TaskCard.tsx             # Task card with markdown viewer
│   │   ├── TaskForm.tsx             # Create/Edit task form
│   │   ├── BoardView.tsx            # Kanban board (DnD)
│   │   ├── ListView.tsx             # Table list view
│   │   ├── QuickAdd.tsx            # Quick task creation
│   │   └── MarkdownViewer.tsx      # Markdown renderer with syntax highlight
│   ├── providers.tsx                # React Query provider
│   └── Dashboard.tsx               # Main dashboard component
├── hooks/
│   └── useTasks.ts                 # React Query custom hooks
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── query-client.ts             # React Query client
│   └── utils.ts                   # Utility functions
├── types/
│   └── task.ts                     # TypeScript type definitions
├── App.tsx                          # Root component
└── main.tsx                         # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works fine)
- Modern web browser

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd todolist
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup Supabase:**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the SQL from `supabase/schema.sql`
   - Execute the query to create the `tasks` table

4. **Configure environment variables:**

   Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

   You can find these values in your Supabase project under Settings > API.

5. **Run the development server:**
```bash
npm run dev
```

   The application will be available at [http://localhost:5173](http://localhost:5173)

## 📊 Database Schema

The application uses a single `tasks` table with the following structure:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'code_review', 'done')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Task Statuses

- **To Do** - New tasks waiting to be started
- **In Progress** - Tasks currently being worked on
- **Code Review** - Tasks awaiting review
- **Done** - Completed tasks

## 🔥 Task Priorities

- **Low** - Non-urgent tasks
- **Medium** - Normal priority tasks
- **High** - Urgent tasks
- **Critical** - Blocking/urgent tasks

## 🏷️ Task Tags

Pre-defined tags with color coding:

| Tag | Color |
|-----|--------|
| bug | Red |
| feature | Blue |
| refactor | Purple |
| bugfix | Orange |
| improvement | Green |
| documentation | Yellow |

## 💡 Usage

### Creating a Task

1. Click the "Create Task" button or use Quick Add input
2. Fill in the task details:
   - Title (required)
   - Description (supports markdown)
   - Status
   - Priority
   - Tags
3. Click "Create Task"

### Managing Tasks

**List View:**
- View all tasks in a table format
- Filter by status or priority
- Archive or delete tasks from dropdown menu
- Click on task to edit

**Board View:**
- Visual Kanban-style board
- Drag tasks between columns to change status
- Click on task to edit details

### Quick Add

- Type task title and press Enter
- Creates task with default settings (To Do, Medium priority)

## 🎨 Customization

### Theme

The app supports dark/light mode. Toggle using the button in the header.

### Fonts

The app uses:
- **Inter** - Primary font for UI text
- **Geist Mono** - Monospace font for code snippets

## 📱 Responsive Breakpoints

- **Mobile:** < 768px (1 column for board)
- **Tablet:** 768px - 1024px (2 columns for board)
- **Desktop:** > 1024px (4 columns for board)

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Project Configuration

- **Vite** - Build tool and dev server
- **TypeScript** - Type checking and compilation
- **ESLint** - Code linting
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## 🐛 Troubleshooting

### Supabase Connection Issues

If you see connection errors:

1. Verify `.env.local` exists in the root directory
2. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
3. Ensure your Supabase project is active
4. Check browser console for specific error messages

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

### Type Errors

Ensure all TypeScript files are compiling:
```bash
# Run type check
npx tsc --noEmit
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Other Platforms

The app works on any platform that supports Vite deployments:
- Netlify
- Cloudflare Pages
- AWS Amplify
- Railway
- Render

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Roadmap (Future Improvements)

- [ ] Real-time sync with Supabase subscriptions
- [ ] Task reordering within columns
- [ ] Search functionality
- [ ] Export to CSV/JSON
- [ ] Task due dates and reminders
- [ ] User authentication and multi-user support
- [ ] Task assignments and team collaboration
- [ ] Comments/notes on tasks
- [ ] Subtasks support
- [ ] Activity log/history
- [ ] Keyboard shortcuts

## 🙏 Credits

- **Shadcn/UI** - Beautiful UI components
- **Radix UI** - Unstyled, accessible component primitives
- **TanStack Query** - Powerful data fetching and state management
- **Supabase** - Open source Firebase alternative
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library

---

**Built with ❤️ for developers, by developers**
