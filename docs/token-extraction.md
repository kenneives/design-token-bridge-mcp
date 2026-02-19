# Manual Token Extraction Guide

When using free tiers (no API access), you'll extract design tokens manually from v0 output. This guide walks through the process.

## From v0 Output

### Step 1: Get the Generated Code

After v0 generates your design, click the **Code** tab and copy the full component.

### Step 2: Identify Design Values

Look through the Tailwind classes and inline styles for:

| What to Find | Where to Look | Example |
|---|---|---|
| Colors | `bg-*`, `text-*`, hex values in `style=` | `bg-purple-600`, `#6750A4` |
| Typography | `text-*`, `font-*`, custom fonts | `text-4xl font-bold` |
| Spacing | `p-*`, `m-*`, `gap-*`, `space-*` | `p-8`, `gap-6` |
| Border radius | `rounded-*` | `rounded-2xl` |
| Shadows | `shadow-*` | `shadow-lg` |

### Step 3: Map to Tailwind Defaults

If v0 uses standard Tailwind classes (not custom values), reference the defaults:

| Class | Size (px) |
|---|---|
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |
| `text-3xl` | 30px |
| `text-4xl` | 36px |
| `text-5xl` | 48px |
| `rounded-sm` | 2px |
| `rounded` | 4px |
| `rounded-md` | 6px |
| `rounded-lg` | 8px |
| `rounded-xl` | 12px |
| `rounded-2xl` | 16px |

### Step 4: Create Universal Token JSON

Build a JSON file following the universal token schema:

```json
{
  "colors": {
    "primary": { "value": "#7C3AED", "category": "primary" },
    "primary-light": { "value": "#A78BFA" },
    "secondary": { "value": "#10B981", "category": "secondary" },
    "background": { "value": "#0F172A", "category": "background" },
    "surface": { "value": "#1E293B", "category": "surface" },
    "text": { "value": "#F8FAFC" },
    "text-muted": { "value": "#94A3B8" }
  },
  "typography": {
    "display-large": { "fontSize": 48, "fontWeight": 700, "lineHeight": 56 },
    "heading": { "fontSize": 30, "fontWeight": 700, "lineHeight": 36 },
    "body": { "fontSize": 16, "fontWeight": 400, "lineHeight": 24 },
    "caption": { "fontSize": 14, "fontWeight": 400, "lineHeight": 20 }
  },
  "spacing": {
    "xs": 4, "sm": 8, "md": 16, "lg": 24, "xl": 32, "2xl": 48
  },
  "radii": {
    "sm": 4, "md": 8, "lg": 12, "xl": 16, "2xl": 24
  },
  "elevation": {
    "sm": {
      "shadowColor": "#000000",
      "shadowOffset": { "x": 0, "y": 1 },
      "shadowRadius": 3,
      "shadowOpacity": 0.1
    },
    "lg": {
      "shadowColor": "#000000",
      "shadowOffset": { "x": 0, "y": 10 },
      "shadowRadius": 25,
      "shadowOpacity": 0.15
    }
  }
}
```

### Step 5: Alternatively, Use the Tailwind Extractor

If v0 generated a `tailwind.config.js` or embedded one in the code, you can use the MCP directly:

```
Use the extract_tokens_from_tailwind tool with this config:
[paste the tailwind config here]
```

This automates Steps 2-4.

## From Figma (Manual Export)

If you've hit your 6 MCP calls/month limit:

1. Open your Figma file
2. Open the **Local Variables** panel (right sidebar)
3. Install the **"Design Tokens"** plugin from Figma Community
4. Export variables as JSON (DTCG format)
5. Use the MCP:
   ```
   Use the extract_tokens_from_json tool with this JSON:
   [paste the exported JSON]
   ```
