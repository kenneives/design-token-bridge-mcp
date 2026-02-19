import { describe, it, expect } from "vitest";
import { extractTokensFromDTCG } from "../src/tools/extract-dtcg.js";

describe("extractTokensFromDTCG", () => {
  it("extracts color tokens", () => {
    const json = JSON.stringify({
      color: {
        $type: "color",
        primary: { $value: "#6750A4", $description: "Brand primary" },
        secondary: { $value: "#625B71" },
      },
    });

    const tokens = extractTokensFromDTCG(json);
    expect(tokens.colors!.primary.value).toBe("#6750A4");
    expect(tokens.colors!.primary.description).toBe("Brand primary");
    expect(tokens.colors!.secondary.value).toBe("#625B71");
  });

  it("extracts dimension tokens as spacing", () => {
    const json = JSON.stringify({
      spacing: {
        $type: "dimension",
        xs: { $value: "4px" },
        sm: { $value: "8px" },
        md: { $value: "1rem" },
      },
    });

    const tokens = extractTokensFromDTCG(json);
    expect(tokens.spacing!.xs).toBe(4);
    expect(tokens.spacing!.sm).toBe(8);
    expect(tokens.spacing!.md).toBe(16);
  });

  it("extracts radius dimensions as radii", () => {
    const json = JSON.stringify({
      radius: {
        $type: "dimension",
        sm: { $value: "4px" },
        md: { $value: "8px" },
      },
    });

    const tokens = extractTokensFromDTCG(json);
    expect(tokens.radii!.sm).toBe(4);
    expect(tokens.radii!.md).toBe(8);
  });

  it("extracts composite typography tokens", () => {
    const json = JSON.stringify({
      typography: {
        "heading-large": {
          $type: "typography",
          $value: {
            fontFamily: "Inter",
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: "40px",
          },
        },
      },
    });

    const tokens = extractTokensFromDTCG(json);
    expect(tokens.typography!["heading-large"].fontFamily).toBe("Inter");
    expect(tokens.typography!["heading-large"].fontSize).toBe(32);
    expect(tokens.typography!["heading-large"].fontWeight).toBe(700);
    expect(tokens.typography!["heading-large"].lineHeight).toBe(40);
  });

  it("extracts shadow tokens as elevation", () => {
    const json = JSON.stringify({
      shadow: {
        sm: {
          $type: "shadow",
          $value: {
            color: "#000000",
            offsetX: "0px",
            offsetY: "2px",
            blur: "4px",
          },
        },
      },
    });

    const tokens = extractTokensFromDTCG(json);
    expect(tokens.elevation!.sm.shadowOffset.y).toBe(2);
    expect(tokens.elevation!.sm.shadowRadius).toBe(4);
  });

  it("extracts duration tokens as motion", () => {
    const json = JSON.stringify({
      motion: {
        $type: "duration",
        fast: { $value: "150ms" },
        normal: { $value: "300ms" },
      },
    });

    const tokens = extractTokensFromDTCG(json);
    expect(tokens.motion!.fast.duration).toBe(150);
    expect(tokens.motion!.normal.duration).toBe(300);
  });

  it("extracts cubicBezier tokens as motion easing", () => {
    const json = JSON.stringify({
      easing: {
        standard: {
          $type: "cubicBezier",
          $value: [0.4, 0, 0.2, 1],
        },
      },
    });

    const tokens = extractTokensFromDTCG(json);
    expect(tokens.motion!.standard.easing).toBe("cubic-bezier(0.4, 0, 0.2, 1)");
  });

  it("resolves token aliases", () => {
    const json = JSON.stringify({
      primitives: {
        blue500: { $type: "color", $value: "#3B82F6" },
      },
      semantic: {
        primary: { $type: "color", $value: "{primitives.blue500}" },
      },
    });

    const tokens = extractTokensFromDTCG(json);
    expect(tokens.colors!.primary.value).toBe("#3B82F6");
  });

  it("inherits $type from parent group", () => {
    const json = JSON.stringify({
      colors: {
        $type: "color",
        red: { $value: "#FF0000" },
        blue: { $value: "#0000FF" },
      },
    });

    const tokens = extractTokensFromDTCG(json);
    expect(tokens.colors!.red.value).toBe("#FF0000");
    expect(tokens.colors!.blue.value).toBe("#0000FF");
  });

  it("throws on invalid JSON", () => {
    expect(() => extractTokensFromDTCG("not json")).toThrow("Invalid JSON");
  });

  it("throws on empty token file", () => {
    expect(() => extractTokensFromDTCG("{}")).toThrow("No DTCG tokens found");
  });
});
