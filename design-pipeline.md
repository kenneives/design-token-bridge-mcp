# Cross-Platform Design Pipeline: v0 → Figma → Claude Code → Native Apps

## Your Questions Answered

### Is Figma better at setting design language than v0?

**Yes, significantly — but they serve different roles.**

v0 is great at *generating* visual directions quickly. You describe a vibe ("dark glassmorphism SaaS dashboard" or "warm minimalist e-commerce") and it produces polished web UI fast. But it generates *implementations*, not *systems*.

Figma is where you build the actual **design system** — the reusable tokens, variables, and component libraries that define your brand across platforms. Figma gives you:

- **Design tokens**: Named color palettes, typography scales, spacing systems, corner radii
- **Variables**: Semantic values that map across light/dark modes and platforms
- **Component libraries**: Reusable atoms (buttons, inputs) → molecules (cards, nav bars) → organisms (headers, hero sections)
- **Multi-platform awareness**: The same design system can have platform-specific expressions (web, iOS, Android)

**The ideal split**: Use v0 for rapid visual exploration and inspiration → codify the design language in Figma → let Figma's MCP feed that system to Claude Code for native implementation.

---

### Pricing Breakdown

#### v0 by Vercel

| Plan | Cost | What You Get |
|------|------|-------------|
| **Free** | $0/mo | $5 in monthly credits, deploy to Vercel, Design Mode, GitHub sync |
| **Premium** | $20/mo | $20 in monthly credits, buy more anytime, Figma imports, v0 API access |
| **Team** | $30/user/mo | Shared credits, centralized billing, team collaboration, API |
| **Student** | $4.99/mo | Discounted access for students |

- Credits are token-based (input + output tokens consumed per generation)
- Free plan hits limits fast with serious usage
- **For your workflow**: Premium at $20/mo is the minimum to get API access (needed for the v0 MCP server)

#### Figma

| Plan | Cost | MCP Access |
|------|------|-----------|
| **Starter (Free)** | $0 | Remote MCP: 6 tool calls/month (basically useless) |
| **Professional** | $16/mo per Full seat, $12/mo per Dev seat | 200 tool calls/day |
| **Organization** | $55/mo per seat | 200 tool calls/day + SSO, admin controls |
| **Enterprise** | $90/mo per seat | 600 tool calls/day |

- **Remote MCP server** is available on all plans (including free)
- **Desktop MCP server** requires a Dev or Full seat on a paid plan
- **For your workflow**: Professional with a single Dev seat ($12/mo) gets you 200 MCP tool calls/day, which is plenty for solo work

#### Total Minimum Cost: ~$32/month
- v0 Premium: $20/mo
- Figma Professional (Dev seat): $12/mo
- Claude Code: Already covered by your Anthropic subscription

---

### What Would a Translation MCP Look Like?

The gap in the current ecosystem is a **Design Token Translation MCP** — something that takes a web-first design language (from v0 or Figma's web tokens) and generates platform-native theme files. Here's what it would need to do:

#### Concept: `design-token-bridge-mcp`

**Input**: A universal design token format (JSON, Figma variables, or v0's Tailwind config)

**Output**: Platform-native theme implementations:

**For Android (Material 3 / Jetpack Compose):**
```kotlin
// Generated Theme.kt
val LightColorScheme = lightColorScheme(
    primary = Color(0xFF6750A4),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFEADDFF),
    surface = Color(0xFFFEF7FF),
    // ... mapped from design tokens
)

val AppTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 57.sp,
        lineHeight = 64.sp,
    ),
    // ... mapped from design tokens
)
```

**For iOS (SwiftUI / Liquid Glass):**
```swift
// Generated DesignTokens.swift
extension Color {
    static let brandPrimary = Color(hex: "6750A4")
    static let brandSurface = Color(hex: "FEF7FF")
}

extension GlassCard {
    static func branded() -> some View {
        content
            .glassEffect(.regular.tint(.brandPrimary))
    }
}

struct AppTypography {
    static let displayLarge = Font.system(size: 57, weight: .regular)
    static let headlineMedium = Font.system(size: 28, weight: .medium)
}
```

**For Web (Tailwind / CSS Variables):**
```css
/* Generated from the same token source */
:root {
    --color-primary: #6750A4;
    --color-surface: #FEF7FF;
    --font-display-large: 3.5625rem;
}
```

#### MCP Server Architecture

```
┌──────────────────────────────────────────────────────┐
│                design-token-bridge-mcp                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Tools:                                              │
│  ├── extract_tokens_from_tailwind(config)            │
│  │   → Parses v0/Tailwind theme into universal       │
│  │     token format                                  │
│  │                                                   │
│  ├── extract_tokens_from_figma(variables)            │
│  │   → Reads Figma variables via Figma MCP           │
│  │     and normalizes to universal format            │
│  │                                                   │
│  ├── generate_material3_theme(tokens)                │
│  │   → Outputs Kotlin: ColorScheme, Typography,      │
│  │     Shapes for Jetpack Compose                    │
│  │                                                   │
│  ├── generate_swiftui_theme(tokens, liquid_glass)    │
│  │   → Outputs Swift: Color extensions, Glass        │
│  │     modifiers, Typography structs                 │
│  │                                                   │
│  ├── generate_tailwind_config(tokens)                │
│  │   → Outputs tailwind.config.js with               │
│  │     custom theme values                           │
│  │                                                   │
│  ├── generate_css_variables(tokens)                  │
│  │   → Outputs CSS custom properties                 │
│  │                                                   │
│  └── validate_contrast(tokens, platform)             │
│      → Checks WCAG AA/AAA compliance per platform    │
│                                                      │
│  Universal Token Schema (internal):                  │
│  {                                                   │
│    "colors": {                                       │
│      "primary": { "value": "#6750A4",                │
│                    "description": "Brand primary" }, │
│      "surface": { "value": "#FEF7FF" }               │
│    },                                                │
│    "typography": {                                   │
│      "display-large": {                              │
│        "fontSize": 57, "lineHeight": 64,             │
│        "fontWeight": 400                             │
│      }                                               │
│    },                                                │
│    "spacing": { "xs": 4, "sm": 8, "md": 16 },       │
│    "radii": { "sm": 8, "md": 12, "lg": 16, "xl": 28}│
│    "elevation": { ... },                             │
│    "motion": { ... }                                 │
│  }                                                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

This MCP would essentially be a **Style Dictionary on steroids** — Style Dictionary (by Amazon) already does token transformation, but wrapping it in an MCP with Material 3 and Liquid Glass awareness would make it directly usable from Claude Code.

---

## Full Pipeline Map

### Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│   v0 (Web)  │────▶│   Figma     │────▶│   Claude Code    │
│             │     │             │     │                  │
│ Visual      │     │ Design      │     │ Implementation   │
│ Exploration │     │ System      │     │ Engine           │
└─────────────┘     └─────────────┘     └──────────────────┘
      │                   │                      │
      │ v0 MCP            │ Figma MCP            │ Outputs
      │                   │                      │
      ▼                   ▼                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Claude Code MCP Hub                   │
│                                                         │
│  Existing MCPs:          New MCPs Needed:               │
│  ├── Context7            ├── design-token-bridge-mcp    │
│  ├── GitHub              │   (token translation)        │
│  ├── Taskmaster          │                              │
│  ├── Playwright          └── (optional) natively-mcp    │
│  ├── tmux                    (React Native generation)  │
│  ├── Hugging Face                                       │
│  └── Linear                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step-by-Step Workflow

#### Phase 1: Visual Exploration (v0)

**Tool**: v0.app or v0 MCP from Claude Code
**Cost**: Free–$20/mo

```
You (or CC via v0 MCP):
  "Create a modern fintech dashboard with dark mode, 
   glassmorphism cards, gradient accents, and clean typography"

v0 outputs:
  → React/Tailwind components with complete visual design
  → tailwind.config.js with color palette, fonts, spacing
  → Component library (buttons, cards, nav, tables)
```

What you extract from v0:
- Color palette (hex values, semantic naming)
- Typography choices (font families, size scale)
- Spacing system
- Component patterns and visual hierarchy
- Overall aesthetic direction

#### Phase 2: Design System Codification (Figma)

**Tool**: Figma with MCP enabled
**Cost**: $12–16/mo

Take the v0 output and formalize it:

1. **Import v0 screenshots/designs into Figma** (v0 Premium supports Figma export)
2. **Create Variables**: Define colors, typography, spacing as Figma variables
3. **Build Components**: Create a component library aligned to all three platforms
4. **Set up Code Connect**: Map Figma components to your actual codebase for React, SwiftUI, and Compose

Figma becomes your **single source of truth** for the design language.

#### Phase 3: Native Implementation (Claude Code)

**Tool**: Claude Code with MCP servers
**Cost**: Existing Anthropic subscription

##### MCP Setup on Your Machines

**MacBook Pro M4 (Primary Dev Machine):**
```json
{
  "mcpServers": {
    "v0-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/v0-mcp/dist/main.js"],
      "env": { "V0_API_KEY": "your_v0_api_key" }
    },
    "figma": {
      "type": "streamable-http",
      "url": "https://mcp.figma.com/mcp"
    },
    "design-token-bridge": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/design-token-bridge-mcp/dist/index.js"]
    },
    "context7": { "...existing config..." },
    "github": { "...existing config..." },
    "taskmaster": { "...existing config..." }
  }
}
```

**Or install Figma's official CC plugin:**
```bash
claude plugin install figma@claude-plugins-official
```

##### Web Output (React/Next.js)
```
CC prompt: "Using the Figma MCP, read the design tokens from our
design system and generate the web implementation. Use the existing
v0-generated components as a starting point but align them with
the finalized design tokens."

CC actions:
  1. Figma MCP → get_design_context (reads variables, components)
  2. Generates/updates tailwind.config.js
  3. Generates React component library
  4. Outputs to your Next.js project
```

##### Android Output (Kotlin/Jetpack Compose + Material 3 Expressive)
```
CC prompt: "Using the Figma MCP, read our design tokens and generate
a Material 3 Expressive theme for Android. Include ColorScheme,
Typography, Shapes, and component wrappers for Jetpack Compose."

CC actions:
  1. Figma MCP → get_design_context (framework: android, compose)
  2. (If design-token-bridge exists) → generate_material3_theme
  3. Generates ui/theme/ package:
     - Color.kt (light + dark schemes)
     - Type.kt (typography scale)
     - Shape.kt (corner radii)
     - Theme.kt (MaterialTheme wrapper)
  4. Generates component library matching design system
```

##### iOS Output (SwiftUI + Liquid Glass)
```
CC prompt: "Using the Figma MCP, read our design tokens and generate
a SwiftUI design system with Liquid Glass support for iOS 26.
Include color extensions, glass modifiers, typography, and
reusable components."

CC actions:
  1. Figma MCP → get_design_context (framework: SwiftUI)
  2. (If design-token-bridge exists) → generate_swiftui_theme
  3. Generates DesignSystem/ package:
     - Colors.swift (Color extensions + semantic colors)
     - Typography.swift (Font definitions)
     - GlassStyles.swift (Liquid Glass modifiers)
     - Components/ (GlassCard, GlassButton, etc.)
  4. Leverages iOS 26 APIs:
     - .glassEffect(.regular)
     - GlassEffectContainer for morphing
     - .concentric rectangle shapes
```

---

## Key References

### v0
- Main site: https://v0.app
- Docs: https://v0.app/docs
- Pricing: https://v0.app/pricing
- v0 MCP (for CC): https://github.com/hellolucky/v0-mcp
- Design systems blog: https://vercel.com/blog/ai-powered-prototyping-with-design-systems

### Figma
- MCP server guide: https://help.figma.com/hc/en-us/articles/32132100833559
- MCP developer docs: https://developers.figma.com/docs/figma-mcp-server/
- Code Connect: https://help.figma.com/hc/en-us/articles/23920389749655
- CC plugin: `claude plugin install figma@claude-plugins-official`
- Pricing: https://www.figma.com/pricing/
- MCP rate limits: https://developers.figma.com/docs/figma-mcp-server/plans-access-and-permissions/

### Liquid Glass (iOS 26 / SwiftUI)
- Apple docs: https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass
- WWDC session - Build a SwiftUI app: https://developer.apple.com/videos/play/wwdc2025/323/
- WWDC session - Design system: https://developer.apple.com/videos/play/wwdc2025/356/
- Claude reference repo: https://github.com/conorluddy/LiquidGlassReference
- Design system in SwiftUI: https://github.com/sanjaynela/liquid-glass-ios-system

### Material 3 Expressive (Android / Jetpack Compose)
- M3 Compose guide: https://developer.android.com/develop/ui/compose/designsystems/material3
- M3 dev portal: https://m3.material.io/develop
- M3 Expressive catalog: https://github.com/meticha/material-3-expressive-catalog
- Theme Builder: https://m3.material.io/theme-builder

### Token Translation (Building the Bridge MCP)
- Style Dictionary (Amazon): https://amzn.github.io/style-dictionary/
- Design Tokens W3C spec: https://design-tokens.github.io/community-group/format/
- Figma Variables API: Available via Figma MCP `get_variables` tool

---

## Summary: What to Do Right Now

1. **Sign up for v0 Premium** ($20/mo) — get API access for the MCP
2. **Get Figma Professional** ($12/mo Dev seat) — unlock 200 MCP calls/day
3. **Install the v0 MCP** on your MacBook Pro
4. **Install the Figma CC plugin** (`claude plugin install figma@claude-plugins-official`)
5. **Start with v0** to explore visual directions for your project
6. **Codify in Figma** — set up variables and components from the v0 output
7. **Use CC + Figma MCP** to generate web, Android (Material 3), and iOS (Liquid Glass) implementations
8. **(Optional, future)** Build `design-token-bridge-mcp` to automate the token translation step

The design-token-bridge MCP is genuinely buildable — it's essentially a Style Dictionary wrapper with Material 3 and Liquid Glass templates exposed as MCP tools. That could be a fun Claude Code project in itself.
