# design-token-bridge-mcp

An MCP server that translates design tokens between platforms. Extract tokens from Tailwind, CSS, Figma, or W3C DTCG format — then generate native themes for Material 3 (Kotlin), SwiftUI (with Liquid Glass), Tailwind, and CSS Variables.

Built for the **v0 → Figma → Claude Code** design pipeline.

```
┌──────────────┐     ┌──────────────┐     ┌────────────────────────┐
│  Tailwind     │     │              │     │  Material 3 (Kotlin)   │
│  CSS Vars     │────▶│  Universal   │────▶│  SwiftUI (Swift)       │
│  Figma Vars   │     │  Token       │     │  Tailwind Config       │
│  W3C DTCG     │     │  Schema      │     │  CSS Variables         │
└──────────────┘     └──────────────┘     └────────────────────────┘
    Extractors           Bridge              Generators
```

## Install

### From npm

```bash
npm install -g design-token-bridge-mcp
```

### From source

```bash
git clone https://github.com/kenneives/design-token-bridge-mcp.git
cd design-token-bridge-mcp
npm install && npm run build
```

## Configure with Claude Code

Add to your Claude Code MCP settings (`~/.claude/settings.json` or project `.mcp.json`):

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

Or if installed from source:

```json
{
  "mcpServers": {
    "design-token-bridge": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/design-token-bridge-mcp/build/index.js"]
    }
  }
}
```

## Tools (9 total)

### Extractors — Input → Universal Tokens

| Tool | Input | Description |
|------|-------|-------------|
| `extract_tokens_from_tailwind` | `tailwind.config.js` content | Parses colors, fontSize, spacing, borderRadius, boxShadow |
| `extract_tokens_from_css` | CSS file content | Extracts `--color-*`, `--space-*`, `--radius-*`, `--shadow-*` custom properties |
| `extract_tokens_from_figma_variables` | Figma Variables API JSON | Parses COLOR, FLOAT types, resolves aliases, handles multi-mode |
| `extract_tokens_from_json` | W3C DTCG format JSON | Parses `$value`/`$type`/`$description`, resolves `{aliases}`, handles groups |

### Generators — Universal Tokens → Output

| Tool | Output | Description |
|------|--------|-------------|
| `generate_material3_theme` | Kotlin (Jetpack Compose) | `lightColorScheme()`, `Typography`, `Shapes` with M3 naming |
| `generate_swiftui_theme` | Swift (SwiftUI) | Color extensions, Font structs, optional Liquid Glass (iOS 26+) |
| `generate_tailwind_config` | `tailwind.config.js` | Theme extend block with rem units, ESM or CJS |
| `generate_css_variables` | CSS custom properties | `:root` block with light/dark mode via `prefers-color-scheme` |

### Validation

| Tool | Description |
|------|-------------|
| `validate_contrast` | WCAG AA/AAA contrast checking for color pairs with pass/fail + ratios |

## Universal Token Schema

All tools speak this common format:

```json
{
  "colors": {
    "primary": { "value": "#6750A4", "description": "Brand primary", "category": "primary" }
  },
  "typography": {
    "display-large": { "fontSize": 57, "lineHeight": 64, "fontWeight": 400, "fontFamily": "Inter" }
  },
  "spacing": { "xs": 4, "sm": 8, "md": 16 },
  "radii": { "sm": 8, "md": 12, "lg": 16 },
  "elevation": {
    "low": {
      "shadowColor": "#000000",
      "shadowOffset": { "x": 0, "y": 2 },
      "shadowRadius": 4,
      "shadowOpacity": 0.1
    }
  },
  "motion": {
    "fast": { "duration": 150, "easing": "ease-out" }
  }
}
```

## Example: Full Pipeline

### 1. Extract tokens from a Tailwind config

```
Use extract_tokens_from_tailwind with the contents of my tailwind.config.js
```

### 2. Generate native themes from the extracted tokens

```
Take those tokens and run them through:
- generate_tailwind_config (for the web app)
- generate_material3_theme (for Android)
- generate_swiftui_theme with liquidGlass=true (for iOS)
- generate_css_variables (for a vanilla CSS fallback)
```

### 3. Validate accessibility

```
Run validate_contrast on those tokens at AAA level
```

## Example Output

See the [`examples/qt-games/`](./examples/qt-games/) directory for a complete responsive landing page built entirely from MCP-generated tokens, including:

- `qt-games-tokens.json` — extracted universal tokens
- `tailwind.config.js` — generated Tailwind config
- `variables.css` — generated CSS custom properties
- `contrast-report.json` — WCAG validation (AAA pass)
- `index.html` + `styles.css` — responsive landing page using the generated tokens

## v0 + Figma Free Tier Setup

This MCP works with free tiers of both v0 and Figma. See the setup guides:

- [v0 Setup Guide](./docs/v0-setup.md) — free tier signup, web UI workflow
- [Figma Setup Guide](./docs/figma-setup.md) — free tier MCP config (6 calls/month)
- [Claude Code Setup](./docs/claude-setup.md) — full pipeline configuration
- [Token Extraction Guide](./docs/token-extraction.md) — manual extraction when APIs aren't available

## Tech Stack

- TypeScript + Node.js
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) v1.x (stdio transport)
- [Zod](https://github.com/colinhacks/zod) for schema validation
- Zero heavyweight dependencies — no Babel, no PostCSS, no Style Dictionary

## Tests

```bash
# 91 unit tests
npm test

# 31 Playwright visual/responsive tests
npm run test:e2e
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, project structure, and PR guidelines.

## License

MIT — see [LICENSE](./LICENSE).
