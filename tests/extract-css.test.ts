import { describe, it, expect } from "vitest";
import { extractTokensFromCSS } from "../src/tools/extract-css.js";

describe("extractTokensFromCSS", () => {
  it("extracts color variables from :root", () => {
    const css = `
:root {
  --color-primary: #6750A4;
  --color-secondary: #625B71;
  --color-surface: #FEF7FF;
}`;
    const tokens = extractTokensFromCSS(css);
    expect(tokens.colors).toBeDefined();
    expect(tokens.colors!.primary.value).toBe("#6750A4");
    expect(tokens.colors!.secondary.value).toBe("#625B71");
  });

  it("extracts spacing variables", () => {
    const css = `
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --space-lg: 1.5rem;
}`;
    const tokens = extractTokensFromCSS(css);
    expect(tokens.spacing).toBeDefined();
    expect(tokens.spacing!.xs).toBe(4);
    expect(tokens.spacing!.sm).toBe(8);
    expect(tokens.spacing!.md).toBe(16);
    expect(tokens.spacing!.lg).toBe(24); // 1.5rem * 16
  });

  it("extracts radius variables", () => {
    const css = `
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --rounded-lg: 16px;
}`;
    const tokens = extractTokensFromCSS(css);
    expect(tokens.radii).toBeDefined();
    expect(tokens.radii!.sm).toBe(4);
    expect(tokens.radii!.md).toBe(8);
    expect(tokens.radii!.lg).toBe(16);
  });

  it("converts rgb colors to hex", () => {
    const css = `
:root {
  --color-accent: rgb(255, 107, 53);
  --color-overlay: rgba(0, 0, 0, 0.5);
}`;
    const tokens = extractTokensFromCSS(css);
    expect(tokens.colors!.accent.value).toBe("#FF6B35");
    expect(tokens.colors!.overlay.value).toBe("#000000");
  });

  it("converts hsl colors to hex", () => {
    const css = `
:root {
  --color-brand: hsl(210, 100%, 50%);
}`;
    const tokens = extractTokensFromCSS(css);
    expect(tokens.colors!.brand.value).toMatch(/^#[0-9A-F]{6}$/);
  });

  it("extracts shadow as elevation", () => {
    const css = `
:root {
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
}`;
    const tokens = extractTokensFromCSS(css);
    expect(tokens.elevation).toBeDefined();
    expect(tokens.elevation!.sm.shadowOffset.y).toBe(1);
    expect(tokens.elevation!.sm.shadowRadius).toBe(3);
    expect(tokens.elevation!.sm.shadowOpacity).toBe(0.12);
  });

  it("handles font variables", () => {
    const css = `
:root {
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
}`;
    const tokens = extractTokensFromCSS(css);
    expect(tokens.typography).toBeDefined();
  });

  it("ignores CSS comments", () => {
    const css = `
:root {
  /* Primary brand color */
  --color-primary: #FF0000;
  /* --color-disabled: #CCCCCC; */
}`;
    const tokens = extractTokensFromCSS(css);
    expect(Object.keys(tokens.colors!)).toHaveLength(1);
  });

  it("throws on CSS with no custom properties", () => {
    expect(() => extractTokensFromCSS("body { color: red; }")).toThrow(
      "No CSS custom properties found"
    );
  });
});
