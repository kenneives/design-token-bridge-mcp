# Figma Free Tier Setup Guide

## Sign Up

1. Go to [figma.com](https://www.figma.com)
2. Click **Get started for free**
3. Sign up with Google or email
4. You're on the **Starter (Free)** plan

## What You Get (Free Tier)

- Unlimited personal files
- 3 Figma files + 3 FigJam files in team projects
- **Remote MCP server**: 6 tool calls/month (very limited)
- Mobile app access
- Plugins and widgets

## What You Don't Get

- **Desktop MCP server** — requires paid plan
- Only **6 MCP calls/month** (vs 200/day on Professional)
- No team libraries
- No branching/merging

## Free Tier MCP Setup

Even on free, you can connect Figma's remote MCP server to Claude Code.

### Step 1: Configure Claude Code

Add Figma's remote MCP to your Claude Code settings:

**Option A: Claude Code CLI**
```bash
claude mcp add figma --transport streamable-http --url https://mcp.figma.com/mcp
```

**Option B: Manual config** (edit `~/.claude/settings.json` or project `.mcp.json`):
```json
{
  "mcpServers": {
    "figma": {
      "type": "streamable-http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

### Step 2: Authenticate

1. Restart Claude Code (or run `/mcp` to reload servers)
2. The first time you use a Figma MCP tool, it will prompt you to authenticate via browser
3. Log in to your Figma account and authorize Claude Code

### Step 3: Verify

Ask Claude Code:
```
Use the Figma MCP to list my recent files
```

If it returns your files, you're connected.

## Free Tier Limitations & Workarounds

**6 calls/month** means you need to be strategic:

- **Use calls for reading design tokens** (get_variables, get_design_context) — not browsing
- **Export variables manually** as a backup:
  1. In Figma, go to your file → Local Variables panel
  2. Use a plugin like "Variables Export" to export as JSON
  3. Feed that JSON to our MCP's `extract_tokens_from_figma_variables` tool
- **Batch your needs** — plan what you need before making a call

## Upgrading to Professional (Optional, $12/mo Dev seat)

Professional unlocks:
- **200 MCP tool calls/day** (vs 6/month)
- **Desktop MCP server** for richer integration
- Team libraries
- Branching and merging

To install the desktop MCP (paid only):
```bash
claude plugin install figma@claude-plugins-official
```
