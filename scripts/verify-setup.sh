#!/bin/bash
# Verify design-token-bridge-mcp is built and working

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== design-token-bridge-mcp Setup Verification ==="
echo ""

# Check Node.js version
echo -n "Node.js: "
NODE_VERSION=$(node --version 2>/dev/null || echo "NOT FOUND")
echo "$NODE_VERSION"
if [[ "$NODE_VERSION" == "NOT FOUND" ]]; then
  echo "  ERROR: Node.js is required (>=18). Install from https://nodejs.org"
  exit 1
fi

# Check build exists
echo -n "Build: "
if [[ -f "$PROJECT_DIR/build/index.js" ]]; then
  echo "OK (build/index.js exists)"
else
  echo "MISSING — run 'npm run build' first"
  exit 1
fi

# Test MCP server starts and lists tools
echo -n "MCP Server: "
TOOL_COUNT=$(printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"verify","version":"1.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' \
  | node "$PROJECT_DIR/build/index.js" 2>/dev/null \
  | tail -1 \
  | python3 -c "import sys,json; print(len(json.load(sys.stdin)['result']['tools']))" 2>/dev/null || echo "0")

if [[ "$TOOL_COUNT" == "9" ]]; then
  echo "OK (9 tools registered)"
else
  echo "FAILED (expected 9 tools, got $TOOL_COUNT)"
  exit 1
fi

# Quick extraction test
echo -n "Tool test: "
RESULT=$(printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"verify","version":"1.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"extract_tokens_from_css","arguments":{"css":":root { --color-test: #FF0000; }"}}}\n' \
  | node "$PROJECT_DIR/build/index.js" 2>/dev/null \
  | tail -1 \
  | python3 -c "import sys,json; d=json.load(sys.stdin); t=json.loads(d['result']['content'][0]['text']); print('OK' if 'colors' in t else 'FAIL')" 2>/dev/null || echo "FAIL")

echo "$RESULT (extract_tokens_from_css)"

echo ""
echo "=== All checks passed ==="
