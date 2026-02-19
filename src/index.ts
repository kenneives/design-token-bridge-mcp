#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "design-token-bridge-mcp",
  version: "0.1.0",
});

// --- Extraction Tools (Inputs) ---

server.registerTool(
  "extract_tokens_from_tailwind",
  {
    description:
      "Parse a Tailwind config and extract theme values into universal design tokens",
    inputSchema: {
      config: z
        .string()
        .describe(
          "The contents of a tailwind.config.js or tailwind.config.ts file"
        ),
    },
  },
  async ({ config }) => {
    // TODO: Implement in task #3
    return {
      content: [
        { type: "text" as const, text: JSON.stringify({ error: "Not yet implemented" }) },
      ],
    };
  }
);

server.registerTool(
  "extract_tokens_from_css",
  {
    description:
      "Parse CSS custom properties (variables) and extract design tokens",
    inputSchema: {
      css: z.string().describe("The contents of a CSS file with custom properties"),
    },
  },
  async ({ css }) => {
    // TODO: Implement in task #4
    return {
      content: [
        { type: "text" as const, text: JSON.stringify({ error: "Not yet implemented" }) },
      ],
    };
  }
);

server.registerTool(
  "extract_tokens_from_figma_variables",
  {
    description:
      "Parse Figma variables export JSON and extract design tokens",
    inputSchema: {
      variables: z
        .string()
        .describe("Figma Variables REST API JSON export as a string"),
    },
  },
  async ({ variables }) => {
    // TODO: Implement in task #5
    return {
      content: [
        { type: "text" as const, text: JSON.stringify({ error: "Not yet implemented" }) },
      ],
    };
  }
);

server.registerTool(
  "extract_tokens_from_json",
  {
    description:
      "Parse W3C Design Tokens Community Group (DTCG) format JSON into universal tokens",
    inputSchema: {
      json: z.string().describe("W3C DTCG format JSON string"),
    },
  },
  async ({ json }) => {
    // TODO: Implement in task #6
    return {
      content: [
        { type: "text" as const, text: JSON.stringify({ error: "Not yet implemented" }) },
      ],
    };
  }
);

// --- Generation Tools (Outputs) ---

server.registerTool(
  "generate_material3_theme",
  {
    description:
      "Generate Kotlin Jetpack Compose Material 3 theme files from universal design tokens",
    inputSchema: {
      tokens: z.string().describe("Universal design tokens JSON string"),
    },
  },
  async ({ tokens }) => {
    // TODO: Implement in task #7
    return {
      content: [
        { type: "text" as const, text: JSON.stringify({ error: "Not yet implemented" }) },
      ],
    };
  }
);

server.registerTool(
  "generate_swiftui_theme",
  {
    description:
      "Generate SwiftUI theme files from universal design tokens, with optional Liquid Glass support",
    inputSchema: {
      tokens: z.string().describe("Universal design tokens JSON string"),
      liquidGlass: z
        .boolean()
        .optional()
        .default(false)
        .describe("Include iOS 26+ Liquid Glass modifiers"),
    },
  },
  async ({ tokens, liquidGlass }) => {
    // TODO: Implement in task #8
    return {
      content: [
        { type: "text" as const, text: JSON.stringify({ error: "Not yet implemented" }) },
      ],
    };
  }
);

server.registerTool(
  "generate_tailwind_config",
  {
    description:
      "Generate a tailwind.config.js theme from universal design tokens",
    inputSchema: {
      tokens: z.string().describe("Universal design tokens JSON string"),
      format: z
        .enum(["esm", "cjs"])
        .optional()
        .default("esm")
        .describe("Output format: ES modules or CommonJS"),
    },
  },
  async ({ tokens, format }) => {
    // TODO: Implement in task #9
    return {
      content: [
        { type: "text" as const, text: JSON.stringify({ error: "Not yet implemented" }) },
      ],
    };
  }
);

server.registerTool(
  "generate_css_variables",
  {
    description:
      "Generate CSS custom properties from universal design tokens with light/dark mode support",
    inputSchema: {
      tokens: z.string().describe("Universal design tokens JSON string"),
      darkTokens: z
        .string()
        .optional()
        .describe(
          "Optional dark mode universal design tokens JSON string"
        ),
    },
  },
  async ({ tokens, darkTokens }) => {
    // TODO: Implement in task #10
    return {
      content: [
        { type: "text" as const, text: JSON.stringify({ error: "Not yet implemented" }) },
      ],
    };
  }
);

server.registerTool(
  "validate_contrast",
  {
    description:
      "Check color combinations in design tokens for WCAG AA/AAA accessibility compliance",
    inputSchema: {
      tokens: z.string().describe("Universal design tokens JSON string"),
      level: z
        .enum(["AA", "AAA"])
        .optional()
        .default("AA")
        .describe("WCAG compliance level to check"),
    },
  },
  async ({ tokens, level }) => {
    // TODO: Implement in task #11
    return {
      content: [
        { type: "text" as const, text: JSON.stringify({ error: "Not yet implemented" }) },
      ],
    };
  }
);

// --- Start Server ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("design-token-bridge-mcp running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
