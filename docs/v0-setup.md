# v0 Free Tier Setup Guide

## Sign Up

1. Go to [v0.dev](https://v0.dev)
2. Click **Sign Up** — you can use GitHub, Google, or email
3. You're automatically on the **Free plan** ($5/month in credits)

## What You Get (Free Tier)

- $5 in monthly credits (token-based — input + output tokens per generation)
- Deploy to Vercel
- Design Mode
- GitHub sync

## What You Don't Get

- **No API access** — the v0 MCP server requires Premium ($20/mo)
- **No Figma imports** — Premium only
- Credits run out fast with complex prompts

## Free Tier Workflow

Since there's no API on free, you use the **web UI** directly:

### Step 1: Generate a Design

1. Go to [v0.dev/chat](https://v0.dev/chat)
2. Describe your design in the prompt box:
   ```
   Create a modern landing page for a game studio called "QT Games".
   Use vibrant gaming colors, bold typography, hero section with CTA,
   game showcase grid, team section, and contact form.
   Mobile-first responsive design.
   ```
3. v0 generates a live preview with React/Tailwind code

### Step 2: Extract the Code

1. Click **Code** tab in the v0 preview to see the generated code
2. Copy the full component code
3. Look for the embedded Tailwind classes to identify the design tokens:
   - Colors: `bg-purple-600`, `text-white`, custom hex values
   - Typography: `text-4xl`, `font-bold`, font families
   - Spacing: `p-8`, `gap-6`, `space-y-4`
   - Radii: `rounded-lg`, `rounded-2xl`

### Step 3: Manual Token Extraction

Since we can't use the API, manually create a token JSON file from the v0 output.
See [token-extraction.md](./token-extraction.md) for the step-by-step process.

## Upgrading to Premium (Optional, $20/mo)

Premium unlocks:
- **API access** — enables the [v0 MCP server](https://github.com/hellolucky/v0-mcp) for Claude Code
- **Figma imports** — paste Figma designs into v0
- **$20/mo in credits** (4x free tier)

To set up the v0 MCP after upgrading:
1. Get your API key from v0 dashboard → Settings → API
2. Add to your Claude Code config:

```json
{
  "mcpServers": {
    "v0-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "v0-mcp"],
      "env": { "V0_API_KEY": "your_key_here" }
    }
  }
}
```
