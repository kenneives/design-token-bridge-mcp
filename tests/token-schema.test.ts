import { describe, it, expect } from "vitest";
import {
  validateTokens,
  parseTokensFromString,
  normalizeHexColor,
  sanitizeTokens,
} from "../src/utils/token-validator.js";
import type { DesignTokens } from "../src/types/tokens.js";

describe("validateTokens", () => {
  it("accepts a valid full token set", () => {
    const tokens: DesignTokens = {
      colors: {
        primary: { value: "#6750A4", description: "Brand primary", category: "primary" },
        surface: { value: "#FEF7FF", category: "surface" },
      },
      typography: {
        "display-large": { fontSize: 57, lineHeight: 64, fontWeight: 400 },
        "body-medium": { fontSize: 14, lineHeight: 20, fontWeight: 400, fontFamily: "Roboto" },
      },
      spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
      radii: { sm: 8, md: 12, lg: 16, xl: 28 },
      elevation: {
        low: {
          shadowColor: "#000000",
          shadowOffset: { x: 0, y: 2 },
          shadowRadius: 4,
          shadowOpacity: 0.1,
        },
      },
      motion: {
        fast: { duration: 150, easing: "ease-out" },
        normal: { duration: 300, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      },
    };

    const result = validateTokens(tokens);
    expect(result.valid).toBe(true);
    expect(result.tokens).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it("accepts a minimal token set with only colors", () => {
    const result = validateTokens({
      colors: { primary: { value: "#FF0000" } },
    });
    expect(result.valid).toBe(true);
  });

  it("accepts 3-digit hex colors", () => {
    const result = validateTokens({
      colors: { accent: { value: "#F0A" } },
    });
    expect(result.valid).toBe(true);
  });

  it("accepts 8-digit hex colors (with alpha)", () => {
    const result = validateTokens({
      colors: { overlay: { value: "#00000080" } },
    });
    expect(result.valid).toBe(true);
  });

  it("rejects empty token object", () => {
    const result = validateTokens({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("(root): Token object must contain at least one token category");
  });

  it("rejects invalid hex color", () => {
    const result = validateTokens({
      colors: { bad: { value: "red" } },
    });
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain("colors.bad.value");
  });

  it("rejects negative fontSize", () => {
    const result = validateTokens({
      typography: { bad: { fontSize: -1 } },
    });
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain("fontSize must be positive");
  });

  it("rejects fontWeight out of range", () => {
    const result = validateTokens({
      typography: { bad: { fontSize: 16, fontWeight: 1001 } },
    });
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain("fontWeight maximum is 1000");
  });

  it("accepts CSS Fonts Level 4 fontWeight values (1-1000)", () => {
    const result = validateTokens({
      typography: { heading: { fontSize: 16, fontWeight: 450 } },
    });
    expect(result.valid).toBe(true);
  });

  it("rejects negative spacing", () => {
    const result = validateTokens({
      spacing: { bad: -4 },
    });
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain("spacing cannot be negative");
  });

  it("rejects negative radii", () => {
    const result = validateTokens({
      radii: { bad: -1 },
    });
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain("radii cannot be negative");
  });

  it("rejects shadowOpacity out of range", () => {
    const result = validateTokens({
      elevation: {
        bad: {
          shadowColor: "#000000",
          shadowOffset: { x: 0, y: 0 },
          shadowRadius: 4,
          shadowOpacity: 1.5,
        },
      },
    });
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain("shadowOpacity maximum is 1");
  });

  it("rejects negative motion duration", () => {
    const result = validateTokens({
      motion: { bad: { duration: -100, easing: "ease" } },
    });
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain("duration must be positive");
  });
});

describe("parseTokensFromString", () => {
  it("parses valid JSON string", () => {
    const json = JSON.stringify({ colors: { primary: { value: "#FF0000" } } });
    const result = parseTokensFromString(json);
    expect(result.valid).toBe(true);
  });

  it("rejects malformed JSON", () => {
    const result = parseTokensFromString("{not json}");
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain("Invalid JSON");
  });

  it("rejects valid JSON that fails schema", () => {
    const result = parseTokensFromString("{}");
    expect(result.valid).toBe(false);
  });
});

describe("normalizeHexColor", () => {
  it("expands 3-digit hex to 6-digit", () => {
    expect(normalizeHexColor("#F0A")).toBe("#FF00AA");
  });

  it("uppercases 6-digit hex", () => {
    expect(normalizeHexColor("#abcdef")).toBe("#ABCDEF");
  });

  it("leaves 8-digit hex uppercased", () => {
    expect(normalizeHexColor("#aabbcc80")).toBe("#AABBCC80");
  });
});

describe("sanitizeTokens", () => {
  it("normalizes hex colors in color tokens", () => {
    const tokens: DesignTokens = {
      colors: { accent: { value: "#f0a" } },
    };
    const sanitized = sanitizeTokens(tokens);
    expect(sanitized.colors!.accent.value).toBe("#FF00AA");
  });

  it("normalizes hex colors in elevation tokens", () => {
    const tokens: DesignTokens = {
      elevation: {
        low: {
          shadowColor: "#abc",
          shadowOffset: { x: 0, y: 2 },
          shadowRadius: 4,
          shadowOpacity: 0.5,
        },
      },
    };
    const sanitized = sanitizeTokens(tokens);
    expect(sanitized.elevation!.low.shadowColor).toBe("#AABBCC");
  });

  it("clamps shadowOpacity to 0-1", () => {
    const tokens: DesignTokens = {
      elevation: {
        test: {
          shadowColor: "#000000",
          shadowOffset: { x: 0, y: 0 },
          shadowRadius: 0,
          shadowOpacity: 2.5,
        },
      },
    };
    const sanitized = sanitizeTokens(tokens);
    expect(sanitized.elevation!.test.shadowOpacity).toBe(1);
  });

  it("passes through non-color tokens unchanged", () => {
    const tokens: DesignTokens = {
      spacing: { xs: 4, sm: 8 },
      radii: { sm: 8 },
    };
    const sanitized = sanitizeTokens(tokens);
    expect(sanitized.spacing).toEqual({ xs: 4, sm: 8 });
    expect(sanitized.radii).toEqual({ sm: 8 });
  });
});
