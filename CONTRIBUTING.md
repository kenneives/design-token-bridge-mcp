# Contributing to design-token-bridge-mcp

Thanks for your interest in contributing! This project bridges design tokens across platforms via the Model Context Protocol.

## Development Setup

```bash
git clone https://github.com/kenneives/design-token-bridge-mcp.git
cd design-token-bridge-mcp
npm install
npm run build
```

## Running Tests

```bash
# Unit tests (91 tests)
npm test

# Playwright visual tests (31 tests, requires Chromium)
npx playwright install chromium
npm run test:e2e
```

## Project Structure

```
src/
  index.ts              # MCP server entry point, tool registration
  types/tokens.ts       # Universal token TypeScript interfaces
  schemas/              # Zod validation schemas
  tools/
    extract-tailwind.ts # Tailwind config -> universal tokens
    extract-css.ts      # CSS variables -> universal tokens
    extract-figma.ts    # Figma variables -> universal tokens
    extract-dtcg.ts     # W3C DTCG JSON -> universal tokens
    generate-material3.ts  # Universal tokens -> Kotlin/Compose
    generate-swiftui.ts    # Universal tokens -> Swift/SwiftUI
    generate-tailwind.ts   # Universal tokens -> tailwind.config.js
    generate-css.ts        # Universal tokens -> CSS custom properties
    validate-contrast.ts   # WCAG contrast checking
  utils/
    token-validator.ts  # Schema validation + sanitization
tests/
  *.test.ts             # Vitest unit tests
  *.spec.ts             # Playwright visual tests
examples/
  qt-games/             # Example landing page built with generated tokens
```

## Adding a New Extractor

1. Create `src/tools/extract-yourformat.ts`
2. Export a function that takes string input and returns `DesignTokens`
3. Register the tool in `src/index.ts` using `server.registerTool()`
4. Add tests in `tests/extract-yourformat.test.ts`
5. Run `npm test` to verify

## Adding a New Generator

1. Create `src/tools/generate-yourplatform.ts`
2. Export a function that takes `DesignTokens` and returns a string
3. Register the tool in `src/index.ts` — use `parseTokensFromString()` to validate input
4. Add tests in `tests/generators.test.ts` or a new test file
5. Run `npm test` to verify

## Pull Request Process

1. Fork the repo and create a feature branch
2. Make your changes with tests
3. Run `npm test` and `npm run build` — both must pass
4. Open a PR with a clear description of what changed and why

## Code Style

- TypeScript strict mode
- No external dependencies beyond `@modelcontextprotocol/sdk` and `zod` for core functionality
- Prefer pure functions over classes
- All MCP tool handlers should catch errors and return them as `{ error: "..." }` content

## Reporting Issues

Open an issue at https://github.com/kenneives/design-token-bridge-mcp/issues with:
- What you expected
- What happened instead
- Steps to reproduce
- Your Node.js version and OS
