import { describe, it, expect } from "vitest";
import { extractTokensFromTailwind } from "../src/tools/extract-tailwind.js";

describe("extractTokensFromTailwind", () => {
  it("extracts colors from a basic CJS config", () => {
    const config = `
module.exports = {
  theme: {
    colors: {
      primary: '#6750A4',
      secondary: '#625B71',
      surface: '#FEF7FF',
    }
  }
}`;
    const tokens = extractTokensFromTailwind(config);
    expect(tokens.colors).toBeDefined();
    expect(tokens.colors!.primary.value).toBe("#6750A4");
    expect(tokens.colors!.secondary.value).toBe("#625B71");
    expect(tokens.colors!.surface.value).toBe("#FEF7FF");
  });

  it("extracts nested colors (gray.50, gray.100, etc.)", () => {
    const config = `
module.exports = {
  theme: {
    colors: {
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        900: '#111827',
      }
    }
  }
}`;
    const tokens = extractTokensFromTailwind(config);
    expect(tokens.colors!["gray-50"].value).toBe("#F9FAFB");
    expect(tokens.colors!["gray-100"].value).toBe("#F3F4F6");
    expect(tokens.colors!["gray-900"].value).toBe("#111827");
  });

  it("extracts from theme.extend", () => {
    const config = `
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#FF6B35',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
      }
    }
  }
}`;
    const tokens = extractTokensFromTailwind(config);
    expect(tokens.colors!.brand.value).toBe("#FF6B35");
    expect(tokens.spacing!["72"]).toBe(288); // 18rem * 16
    expect(tokens.spacing!["84"]).toBe(336); // 21rem * 16
  });

  it("extracts fontSize with line height options", () => {
    const config = `
module.exports = {
  theme: {
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],
      'sm': ['0.875rem', '1.25rem'],
      'base': '1rem',
      'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
    }
  }
}`;
    const tokens = extractTokensFromTailwind(config);
    expect(tokens.typography).toBeDefined();
    expect(tokens.typography!.xs.fontSize).toBe(12); // 0.75rem * 16
    expect(tokens.typography!.xs.lineHeight).toBe(16); // 1rem * 16
    expect(tokens.typography!.sm.fontSize).toBe(14); // 0.875rem * 16
    expect(tokens.typography!.sm.lineHeight).toBe(20); // 1.25rem * 16
    expect(tokens.typography!.base.fontSize).toBe(16); // 1rem * 16
    expect(tokens.typography!.lg.fontSize).toBe(18); // 1.125rem * 16
  });

  it("extracts borderRadius as radii", () => {
    const config = `
module.exports = {
  theme: {
    borderRadius: {
      'sm': '4px',
      'md': '8px',
      'lg': '12px',
      'full': '9999px',
    }
  }
}`;
    const tokens = extractTokensFromTailwind(config);
    expect(tokens.radii).toBeDefined();
    expect(tokens.radii!.sm).toBe(4);
    expect(tokens.radii!.md).toBe(8);
    expect(tokens.radii!.lg).toBe(12);
    expect(tokens.radii!.full).toBe(9999);
  });

  it("extracts boxShadow as elevation", () => {
    const config = `
module.exports = {
  theme: {
    boxShadow: {
      'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
      'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
    }
  }
}`;
    const tokens = extractTokensFromTailwind(config);
    expect(tokens.elevation).toBeDefined();
    expect(tokens.elevation!.sm.shadowOffset.y).toBe(1);
    expect(tokens.elevation!.sm.shadowRadius).toBe(2);
    expect(tokens.elevation!.sm.shadowOpacity).toBe(0.05);
    expect(tokens.elevation!.md.shadowOffset.y).toBe(4);
  });

  it("handles ESM export default syntax", () => {
    const config = `
export default {
  theme: {
    colors: {
      primary: '#1E40AF',
    }
  }
}`;
    const tokens = extractTokensFromTailwind(config);
    expect(tokens.colors!.primary.value).toBe("#1E40AF");
  });

  it("handles fontFamily extraction", () => {
    const config = `
module.exports = {
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    }
  }
}`;
    const tokens = extractTokensFromTailwind(config);
    expect(tokens.typography).toBeDefined();
    expect(tokens.typography!["font-sans"].fontFamily).toBe("Inter");
    expect(tokens.typography!["font-mono"].fontFamily).toBe("Fira Code");
  });

  it("throws on empty/unparseable config", () => {
    expect(() => extractTokensFromTailwind("")).toThrow();
  });

  it("handles numeric spacing values", () => {
    const config = `
module.exports = {
  theme: {
    spacing: {
      'px': '1px',
      '0': '0px',
      '1': '0.25rem',
      '2': '0.5rem',
      '4': '1rem',
    }
  }
}`;
    const tokens = extractTokensFromTailwind(config);
    expect(tokens.spacing!.px).toBe(1);
    expect(tokens.spacing!["0"]).toBe(0);
    expect(tokens.spacing!["1"]).toBe(4);   // 0.25rem * 16
    expect(tokens.spacing!["2"]).toBe(8);   // 0.5rem * 16
    expect(tokens.spacing!["4"]).toBe(16);  // 1rem * 16
  });
});
