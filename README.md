# Ryze AI — Deterministic UI Generator

An AI-powered agent that converts natural language UI descriptions into working UI code with live preview, using a **fixed, deterministic component library**. Think: Claude Code for UI — safe, reproducible, and debuggable.

![Architecture](https://img.shields.io/badge/Architecture-3_Step_Agent_Pipeline-6366f1) ![React](https://img.shields.io/badge/Frontend-React_+_Vite-61dafb) ![Node](https://img.shields.io/badge/Backend-Node.js_+_Express-339933) ![AI](https://img.shields.io/badge/AI-OpenAI_GPT--4o-00a67e)

---

## 🏗️ Architecture Overview

```
User Prompt → [Sanitizer] → [Planner] → [Generator] → [Validator] → [Explainer] → UI
                  ↓              ↓            ↓             ↓             ↓
              Injection      Structured    Valid JSX    Whitelist     Plain English
              Protection     JSON Plan     Code         Check        Explanation
```

### Three-Panel UI (Claude-Style)

| Panel | Description |
|-------|-------------|
| **Left — Chat** | User types natural language prompts. Displays 3-step agent reasoning. |
| **Right — Code/Preview** | Tabs between generated JSX code (editable) and live rendered preview. |
| **Top — Version Bar** | Shows version history with one-click rollback. |

### AI Agent Pipeline (3 Explicit Steps)

| Step | Agent | Input | Output |
|------|-------|-------|--------|
| 1 | **Planner** | User prompt + existing code | Structured JSON plan (layout, components, props) |
| 2 | **Generator** | JSON plan | Valid React/JSX code using only whitelisted components |
| 3 | **Explainer** | Plan + code | Plain English explanation of decisions |

Each step is a **separate LLM call** with a hard-coded prompt template. This is not a single call — the separation enables debugging, reproducibility, and explainability.

---

## 🧩 Component System Design

### Fixed Component Library (8 Components)

All UIs are composed **exclusively** from these 8 components. Component implementation and CSS are **immutable** — the AI cannot create new components, add inline styles, or modify classes.

| Component | Key Props |
|-----------|-----------|
| `Button` | variant (primary/secondary/danger/outline/ghost), size, icon, fullWidth |
| `Card` | title, subtitle, footer, variant (default/outlined/elevated), padding |
| `Input` | label, placeholder, type, error, helperText, icon |
| `Table` | columns, data, striped, hoverable, compact |
| `Modal` | isOpen, onClose, title, size (sm/md/lg), footer |
| `Sidebar` | items [{label, icon, active}], title, collapsed |
| `Navbar` | brand, items [{label, href, active}], actions |
| `Chart` | type (bar/line/pie), data [{label, value}], title, height |

### Determinism Guarantees

- ✅ Same component library for every generation
- ✅ CSS is in a single immutable file (`ui-components.css`)
- ✅ No inline styles allowed
- ✅ No AI-generated CSS classes
- ✅ No external UI libraries
- ❌ AI cannot create new components

### Layout System

Instead of inline styles, generated code uses **data attributes** for layout:

```jsx
<div data-layout="grid-2" data-gap="md" data-padding="lg">
  <Card title="Sales" />
  <Card title="Revenue" />
</div>
```

Available: `flex-row`, `flex-col`, `grid`, `grid-2`, `grid-3`, `sidebar-layout`

---

## 🤖 Agent Design & Prompts

All prompts are in `server/src/prompts/` — hard-coded templates visible in code:

| File | Purpose |
|------|---------|
| `planner.prompt.js` | Full component schemas, JSON output format, iteration awareness |
| `generator.prompt.js` | JSX generation rules, data-attribute layout system, code format |
| `explainer.prompt.js` | Plain English explanation guidelines |

### Prompt Separation

Each agent has a **system prompt** (immutable instructions) and a **user prompt** builder function that injects context. This separation is visible in the codebase.

---

## 🔒 Safety & Validation

| Protection | Implementation |
|------------|----------------|
| **Component Whitelist** | `whitelist.js` — rejects non-whitelisted `<Components>` |
| **Inline Style Ban** | Regex detection of `style={}` in generated code |
| **Dangerous Patterns** | Blocks `eval()`, `dangerouslySetInnerHTML`, `<script>`, DOM manipulation |
| **Prompt Injection** | `sanitizer.js` — detects "ignore previous instructions" patterns |
| **Error Boundary** | React ErrorBoundary wraps live preview to catch runtime errors |
| **Validation Retry** | If validation fails, the generator is called again with error feedback |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API key

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd ryze-ai-ui-generator

# 2. Install all dependencies
npm run install:all

# 3. Configure environment
# Edit .env and add either OpenAI OR Gemini API key
OPENAI_API_KEY=sk-your-key-here
# OR
GEMINI_API_KEY=AIzaSy...
```

The app runs on:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Git Setup (One-Click)
Double-click `setup_github.bat` in the project root to automatically install Git (if missing), initialize the repository, and push your code to GitHub.

### Free Tier (Gemini)
Don't have an OpenAI key? Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and set `GEMINI_API_KEY` in `.env`. The app will automatically switch to Gemini 1.5 Flash.

### Mock Mode (No API Key)
The app includes a powerful offline mode with pre-built templates. Try these prompts:


1. **"Create a board with columns for Todo, In Progress and Done"** (Kanban Board)
2. **"Design a product listing page with a table showing product name, price, and status"** (E-commerce)
3. **"Create a dashboard with a navbar, sidebar navigation, and cards showing sales statistics"** (Dashboard)
4. **"Login page..."**
5. **"Landing page..."**
6. **"Settings page..."**

### Usage - AI Mode (With API Key)
1. Type a UI description in the chat panel (e.g., "Create a dashboard with a navbar and two cards")
2. Watch the 3-step agent pipeline execute (Plan → Generate → Explain)
3. See the live preview update, view/edit the generated code
4. Iterate: "Add a table below the cards" — the AI modifies incrementally
5. Rollback: Click any version in the top bar to restore previous UI

---

## 📁 Project Structure

```
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── ui/             # 🔒 Fixed component library (IMMUTABLE)
│       │   │   ├── Button.jsx, Card.jsx, Input.jsx, Table.jsx
│       │   │   ├── Modal.jsx, Sidebar.jsx, Navbar.jsx, Chart.jsx
│       │   │   ├── index.js    # Registry, whitelist, schemas
│       │   │   └── ui-components.css
│       │   ├── chat/           # Chat panel
│       │   ├── editor/         # Code editor with syntax highlighting
│       │   └── preview/        # Live preview with error boundary
│       ├── App.jsx, App.css, main.jsx
│       └── VersionHistory.jsx
├── server/                     # Node.js + Express backend
│   └── src/
│       ├── agents/             # 3-step pipeline
│       │   ├── planner.js, generator.js, explainer.js
│       ├── prompts/            # Hard-coded prompt templates
│       ├── validation/         # Whitelist + sanitizer
│       └── store/              # In-memory version store
├── .env                        # API keys
└── README.md
```

---

## ⚠️ Known Limitations

1. **In-memory storage**: Version history resets on server restart (no database)
2. **Single session**: No multi-user support or authentication
3. **Code compilation**: Uses `new Function()` which is safer than `eval()` but not fully sandboxed
4. **Chart complexity**: SVG-based charts support basic bar/line/pie — not suitable for complex data visualization
5. **Layout system**: Data-attribute layout is limited compared to full CSS; complex nested layouts may not render perfectly
6. **LLM dependency**: Requires OpenAI API key and internet connection

---

## 🔮 What I'd Improve With More Time

1. **iframe sandbox** for preview rendering (true isolation, CSP headers)
2. **Persist versions** to SQLite or localStorage
3. **Diff view** showing code changes between versions
4. **Streaming responses** for real-time agent step updates
5. **More components**: Dropdown, Tabs, Badge, Avatar, Tooltip, Toast
6. **Undo/Redo** keyboard shortcuts (Ctrl+Z/Y)
7. **Template gallery** of pre-built UI patterns
8. **Multi-model support**: Switch between OpenAI, Anthropic, local models
9. **Collaborative editing**: WebSocket-based real-time collaboration
10. **Component visual catalog**: A browseable showcase of all available components and their variants

---

## 📊 Evaluation Criteria Mapping

| Area | Implementation |
|------|----------------|
| **Agent Design** | 3 separate LLM calls with hard-coded prompts (Planner → Generator → Explainer) |
| **Determinism** | Fixed 8-component library, immutable CSS, whitelist enforcement |
| **Iteration** | Existing code passed to planner/generator for incremental edits |
| **Explainability** | Step 3 (Explainer) provides plain-English reasoning shown in chat |
| **Engineering Judgment** | Data-attribute layout system, validation retry, error boundaries, prompt injection protection |
