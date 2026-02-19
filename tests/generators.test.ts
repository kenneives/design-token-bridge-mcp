import { describe, it, expect } from "vitest";
import { generateMaterial3Theme } from "../src/tools/generate-material3.js";
import { generateSwiftUITheme } from "../src/tools/generate-swiftui.js";
import { generateTailwindConfig } from "../src/tools/generate-tailwind.js";
import { generateCSSVariables } from "../src/tools/generate-css.js";
import { validateContrast } from "../src/tools/validate-contrast.js";
import type { DesignTokens } from "../src/types/tokens.js";

const sampleTokens: DesignTokens = {
  colors: {
    primary: { value: "#6750A4", category: "primary" },
    "on-primary": { value: "#FFFFFF" },
    secondary: { value: "#625B71", category: "secondary" },
    surface: { value: "#FEF7FF", category: "surface" },
    background: { value: "#FFFFFF", category: "background" },
    error: { value: "#B3261E", category: "error" },
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
  },
};

describe("generateMaterial3Theme", () => {
  it("generates valid Kotlin with color scheme", () => {
    const output = generateMaterial3Theme(sampleTokens);
    expect(output).toContain("package com.example.ui.theme");
    expect(output).toContain("import androidx.compose.material3.*");
    expect(output).toContain("val LightColorScheme = lightColorScheme(");
    expect(output).toContain("Color(0xFF6750A4)");
  });

  it("generates typography", () => {
    const output = generateMaterial3Theme(sampleTokens);
    expect(output).toContain("val AppTypography = Typography(");
    expect(output).toContain("57.sp");
  });

  it("generates shapes from radii", () => {
    const output = generateMaterial3Theme(sampleTokens);
    expect(output).toContain("val AppShapes = Shapes(");
    expect(output).toContain("RoundedCornerShape(");
  });

  it("generates raw color constants", () => {
    const output = generateMaterial3Theme(sampleTokens);
    expect(output).toContain("val Primary = Color(0xFF6750A4)");
  });
});

describe("generateSwiftUITheme", () => {
  it("generates Color extensions", () => {
    const output = generateSwiftUITheme(sampleTokens);
    expect(output).toContain("import SwiftUI");
    expect(output).toContain("extension Color {");
    expect(output).toContain("static let primary");
  });

  it("generates typography structs", () => {
    const output = generateSwiftUITheme(sampleTokens);
    expect(output).toContain("struct AppTypography {");
    expect(output).toContain("Font.system(size: 57");
  });

  it("generates spacing", () => {
    const output = generateSwiftUITheme(sampleTokens);
    expect(output).toContain("struct AppSpacing {");
    expect(output).toContain("static let xs: CGFloat = 4");
  });

  it("generates shadow modifiers", () => {
    const output = generateSwiftUITheme(sampleTokens);
    expect(output).toContain("func lowShadow() -> some View");
  });

  it("includes Liquid Glass when requested", () => {
    const output = generateSwiftUITheme(sampleTokens, true);
    expect(output).toContain("@available(iOS 26.0, *)");
    expect(output).toContain(".glassEffect(.regular");
    expect(output).toContain("struct GlassCard");
  });

  it("omits Liquid Glass by default", () => {
    const output = generateSwiftUITheme(sampleTokens, false);
    expect(output).not.toContain("glassEffect");
  });
});

describe("generateTailwindConfig", () => {
  it("generates ESM config by default", () => {
    const output = generateTailwindConfig(sampleTokens);
    expect(output).toContain("export default");
    expect(output).not.toContain("module.exports");
  });

  it("generates CJS config when specified", () => {
    const output = generateTailwindConfig(sampleTokens, "cjs");
    expect(output).toContain("module.exports");
    expect(output).not.toContain("export default");
  });

  it("includes colors in extend block", () => {
    const output = generateTailwindConfig(sampleTokens);
    expect(output).toContain('"primary"');
    expect(output).toContain("#6750a4");
  });

  it("includes fontSize with rem values", () => {
    const output = generateTailwindConfig(sampleTokens);
    expect(output).toContain("display-large");
    expect(output).toContain("rem");
  });

  it("includes borderRadius", () => {
    const output = generateTailwindConfig(sampleTokens);
    expect(output).toContain("borderRadius");
    expect(output).toContain("8px");
  });

  it("includes boxShadow", () => {
    const output = generateTailwindConfig(sampleTokens);
    expect(output).toContain("boxShadow");
  });

  it("generates parseable JSON inside the config", () => {
    const output = generateTailwindConfig(sampleTokens);
    // Extract the JSON object from the export
    const jsonStr = output.replace(/\/\/.*\n/g, "").replace(/\/\*.*\*\/\n/g, "").replace("export default ", "").replace(";\n", "");
    expect(() => JSON.parse(jsonStr)).not.toThrow();
  });
});

describe("generateCSSVariables", () => {
  it("generates :root block with color vars", () => {
    const output = generateCSSVariables(sampleTokens);
    expect(output).toContain(":root {");
    expect(output).toContain("--color-primary: #6750a4;");
  });

  it("generates spacing vars", () => {
    const output = generateCSSVariables(sampleTokens);
    expect(output).toContain("--space-xs: 4px;");
    expect(output).toContain("--space-md: 16px;");
  });

  it("generates radius vars", () => {
    const output = generateCSSVariables(sampleTokens);
    expect(output).toContain("--radius-sm: 8px;");
  });

  it("generates typography vars", () => {
    const output = generateCSSVariables(sampleTokens);
    expect(output).toContain("--font-size-display-large: 57px;");
    expect(output).toContain("--line-height-display-large: 64px;");
  });

  it("generates shadow vars", () => {
    const output = generateCSSVariables(sampleTokens);
    expect(output).toContain("--shadow-low:");
  });

  it("generates motion vars", () => {
    const output = generateCSSVariables(sampleTokens);
    expect(output).toContain("--duration-fast: 150ms;");
    expect(output).toContain("--easing-fast: ease-out;");
  });

  it("generates dark mode block when dark tokens provided", () => {
    const dark: DesignTokens = {
      colors: { primary: { value: "#D0BCFF" }, surface: { value: "#1C1B1F" } },
    };
    const output = generateCSSVariables(sampleTokens, dark);
    expect(output).toContain("@media (prefers-color-scheme: dark)");
    expect(output).toContain('[data-theme="dark"]');
    expect(output).toContain("--color-primary: #d0bcff;");
  });
});

describe("validateContrast", () => {
  it("reports passing contrast for high-contrast pairs", () => {
    const tokens: DesignTokens = {
      colors: {
        primary: { value: "#000000" },
        "on-primary": { value: "#FFFFFF" },
      },
    };
    const report = validateContrast(tokens, "AA");
    expect(report.total).toBeGreaterThan(0);
    expect(report.passing).toBe(report.total);
    expect(report.results[0].ratio).toBeGreaterThan(20);
  });

  it("reports failing contrast for low-contrast pairs", () => {
    const tokens: DesignTokens = {
      colors: {
        primary: { value: "#CCCCCC" },
        "on-primary": { value: "#DDDDDD" },
      },
    };
    const report = validateContrast(tokens, "AA");
    expect(report.failing).toBeGreaterThan(0);
    expect(report.results[0].aa.normalText).toBe(false);
  });

  it("checks AAA level when requested", () => {
    const tokens: DesignTokens = {
      colors: {
        primary: { value: "#6750A4" },
        "on-primary": { value: "#FFFFFF" },
      },
    };
    const report = validateContrast(tokens, "AAA");
    expect(report.level).toBe("AAA");
    expect(report.results[0].aaa).toBeDefined();
  });

  it("returns empty report with fewer than 2 colors", () => {
    const tokens: DesignTokens = {
      colors: { primary: { value: "#000000" } },
    };
    const report = validateContrast(tokens);
    expect(report.total).toBe(0);
  });

  it("finds semantic on-* pairs", () => {
    const report = validateContrast(sampleTokens);
    const pairNames = report.results.map((r) => r.pair);
    expect(pairNames.some((p) => p.includes("on-primary"))).toBe(true);
  });
});
