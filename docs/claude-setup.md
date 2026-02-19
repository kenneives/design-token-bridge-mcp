# Claude Code + design-token-bridge-mcp Setup

## Install the MCP Server

### Option A: From npm (after publishing)
```bash
npm install -g design-token-bridge-mcp
```

### Option B: From source (current)
```bash
git clone https://github.com/kenneives/design-token-bridge-mcp.git
cd design-token-bridge-mcp
npm install
npm run build
```

## Configure Claude Code

Add the MCP server to your Claude Code settings.

### From source:
```json
{
  "mcpServers": {
    "design-token-bridge": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/design-token-bridge-mcp/build/index.js"]
    }
  }
}
```

### From npm (after publishing):
```json
{
  "mcpServers": {
    "design-token-bridge": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "design-token-bridge-mcp"]
    }
  }
}
```

## Verify

Restart Claude Code, then ask:
```
List the tools from the design-token-bridge MCP
```

You should see 9 tools:
- `extract_tokens_from_tailwind`
- `extract_tokens_from_css`
- `extract_tokens_from_figma_variables`
- `extract_tokens_from_json`
- `generate_material3_theme`
- `generate_swiftui_theme`
- `generate_tailwind_config`
- `generate_css_variables`
- `validate_contrast`

## Full Pipeline Config (All MCPs Together)

For the complete v0 → Figma → design-token-bridge workflow:

```json
{
  "mcpServers": {
    "v0-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "v0-mcp"],
      "env": { "V0_API_KEY": "your_v0_api_key" }
    },
    "figma": {
      "type": "streamable-http",
      "url": "https://mcp.figma.com/mcp"
    },
    "design-token-bridge": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/design-token-bridge-mcp/build/index.js"]
    }
  }
}
```

**Note:** v0 MCP requires Premium ($20/mo). Figma MCP works on free (6 calls/month) but is practical on Professional ($12/mo, 200 calls/day). The design-token-bridge-mcp is free and unlimited.
