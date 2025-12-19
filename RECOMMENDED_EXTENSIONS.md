# 🧩 Recommended IDE Extensions

For the best experience with the Decades Bar Portal codebase, we recommend these extensions:

## 🎨 Visuals & Style
- **Tailwind CSS IntelliSense**: Autocomplete and hover info for Tailwind classes. Essential for the "Cinematic 3D Gold" theme.
- **Color Highlight**: Visualizes CSS colors directly in your code.
- **ES7+ React/Redux/React-Native snippets**: Speed up component creation.

## 🏗 Infrastructure & Backend
- **PostgreSQL**: Explore your Supabase DB directly from the sidebar.
- **DotENV**: Syntax highlighting for `.env` files.

## 🛠 Code Quality
- **ESLint**: Real-time linting based on project rules.
- **Prettier**: Consistent code formatting.
- **GitLens**: Deep integration for Git history and blame.
- **Error Lens**: Displays errors directly on the line of code.

## 🤖 AI & Automation
- **Playwright Test for VS Code**: Run and debug E2E tests directly from the IDE.

---

## ⚙️ Recommended Settings (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["(?:twMerge|twJoin)\\(([^)]*)\\)", "'([^']*)'"]
  ]
}
```
