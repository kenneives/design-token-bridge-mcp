# design-token-bridge-mcp

## Project Overview
MCP server that translates design tokens between Tailwind, Figma, CSS, Material 3, SwiftUI, and CSS Variables.

## Publishing Checklist
When making code changes that affect the build output, you must republish:

1. **Bump version** in both `package.json` and `server.json` (keep in sync)
2. **Update version** in `src/index.ts` McpServer constructor to match
3. **Build**: `npm run build`
4. **Test**: `npm test` (all 91+ tests must pass)
5. **Publish to npm**: `npm publish` (uses granular access token configured via `npm config set`)
6. **Publish to MCP registry**: `npx @anthropic-ai/mcp-publisher@latest publish` (requires `mcp-publisher login github` first)
7. **Push to GitHub**: `git push origin main`

## Key Architecture
- Universal token schema (`src/schemas/universal-token-schema.ts`) is the canonical interchange format
- 4 extractors (Tailwind, CSS, Figma, DTCG) parse inputs into universal tokens
- 5 generators/validators (Material 3, SwiftUI, Tailwind, CSS vars, contrast) output from universal tokens
- All tool I/O uses Zod schemas for validation
- **No eval/Function** — Tailwind config extraction uses regex-only static analysis

## Testing
- `npm test` — vitest unit tests
- `npm run test:e2e` — Playwright visual tests (QT Games landing page)

## TODO
- **awesome-mcp-servers badge**: PR #2162 at punkpeye/awesome-mcp-servers is still OPEN. Once merged, add this badge to the top of README.md (after the title): `[![Awesome MCP Servers](https://img.shields.io/badge/Awesome-MCP%20Servers-blue)](https://github.com/punkpeye/awesome-mcp-servers)`. Check status: `gh pr view 2162 --repo punkpeye/awesome-mcp-servers --json state`
- **MCP registry publisher**: The CLI is now `mcp-publisher` (homebrew binary), NOT the old `@anthropic-ai/mcp-publisher` npm package. Update step 6 in Publishing Checklist above.

## Security Notes
- `.mcpregistry_*` tokens are in `.gitignore` — never commit these
- `.env` contains API keys — never commit
- Tailwind extractor intentionally avoids code execution (no eval, no new Function)
