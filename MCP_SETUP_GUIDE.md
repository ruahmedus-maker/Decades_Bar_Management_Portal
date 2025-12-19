# 🛠 Decades Bar - MCP Setup Guide

This guide explains how to connect your IDE (Cursor or VS Code) to the Recommended MCP Servers to give AI assistants direct access to your infrastructure.

## 🔗 1. Supabase MCP
Allows the AI to query your database, check RLS policies, and inspect schemas.

- **Server URL**: `npx -y @modelcontextprotocol/server-supabase`
- **Configuration** (Add to your IDE's MCP settings):
  ```json
  {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "your-project-url",
        "SUPABASE_API_KEY": "your-service-role-key"
      }
    }
  }
  ```
> [!IMPORTANT]
> Use the **Service Role Key** (not the Anon Key) to allow the AI to inspect system tables and manage policies.

---

## 🐘 2. Postgres MCP
Redundant but helpful for raw SQL execution and migrations.

- **Server URL**: `npx -y @modelcontextprotocol/server-postgres`
- **Configuration**:
  ```json
  {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://postgres:[password]@[db-host]:5432/postgres"]
    }
  }
  ```

---

## ☁️ 3. Vercel MCP
Allows the AI to check deployment logs and environment variables.

- **Server URL**: `npx -y @modelcontextprotocol/server-vercel`
- **Configuration**:
  ```json
  {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-vercel"],
      "env": {
        "VERCEL_TOKEN": "your-vercel-personal-access-token"
      }
    }
  }
  ```

---

## 🎯 Implementation Steps
1. **Generate Keys**: Grab your Supabase Service Role Key and Vercel Token.
2. **Settings**: Open your IDE's **MCP Settings** (In Cursor: `Settings > Cursor Settings > General > MCP`).
3. **Add Servers**: Click "Add Server" and paste the configurations above.
