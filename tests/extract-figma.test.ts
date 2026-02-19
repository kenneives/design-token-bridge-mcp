import { describe, it, expect } from "vitest";
import { extractTokensFromFigmaVariables } from "../src/tools/extract-figma.js";

describe("extractTokensFromFigmaVariables", () => {
  const makeFigmaExport = (variables: Record<string, any>, collections?: Record<string, any>) =>
    JSON.stringify({
      variables: variables,
      variableCollections: collections ?? {
        "collection:1": {
          id: "collection:1",
          name: "Design System",
          modes: [{ modeId: "mode:1", name: "Light" }],
          defaultModeId: "mode:1",
        },
      },
    });

  it("extracts color variables", () => {
    const json = makeFigmaExport({
      "var:1": {
        id: "var:1",
        name: "Colors/Primary",
        resolvedType: "COLOR",
        valuesByMode: {
          "mode:1": { r: 0.404, g: 0.314, b: 0.643, a: 1 },
        },
      },
      "var:2": {
        id: "var:2",
        name: "Colors/Surface",
        resolvedType: "COLOR",
        valuesByMode: {
          "mode:1": { r: 0.996, g: 0.969, b: 1, a: 1 },
        },
      },
    });

    const tokens = extractTokensFromFigmaVariables(json);
    expect(tokens.colors).toBeDefined();
    expect(tokens.colors!.primary.value).toMatch(/^#[0-9A-F]{6}$/);
    expect(tokens.colors!.surface.value).toMatch(/^#[0-9A-F]{6}$/);
  });

  it("extracts FLOAT variables as spacing", () => {
    const json = makeFigmaExport({
      "var:1": {
        id: "var:1",
        name: "Spacing/xs",
        resolvedType: "FLOAT",
        valuesByMode: { "mode:1": 4 },
      },
      "var:2": {
        id: "var:2",
        name: "Spacing/md",
        resolvedType: "FLOAT",
        valuesByMode: { "mode:1": 16 },
      },
    });

    const tokens = extractTokensFromFigmaVariables(json);
    expect(tokens.spacing!.xs).toBe(4);
    expect(tokens.spacing!.md).toBe(16);
  });

  it("extracts FLOAT radius variables as radii", () => {
    const json = makeFigmaExport({
      "var:1": {
        id: "var:1",
        name: "Corner Radius/sm",
        resolvedType: "FLOAT",
        valuesByMode: { "mode:1": 8 },
      },
    });

    const tokens = extractTokensFromFigmaVariables(json);
    expect(tokens.radii!.sm).toBe(8);
  });

  it("resolves variable aliases", () => {
    const json = makeFigmaExport({
      "var:1": {
        id: "var:1",
        name: "Primitives/Blue500",
        resolvedType: "COLOR",
        valuesByMode: {
          "mode:1": { r: 0, g: 0, b: 1, a: 1 },
        },
      },
      "var:2": {
        id: "var:2",
        name: "Colors/Primary",
        resolvedType: "COLOR",
        valuesByMode: {
          "mode:1": { type: "VARIABLE_ALIAS", id: "var:1" },
        },
      },
    });

    const tokens = extractTokensFromFigmaVariables(json);
    expect(tokens.colors!.primary.value).toBe("#0000FF");
  });

  it("infers color categories from names", () => {
    const json = makeFigmaExport({
      "var:1": {
        id: "var:1",
        name: "Colors/Primary",
        resolvedType: "COLOR",
        valuesByMode: { "mode:1": { r: 1, g: 0, b: 0, a: 1 } },
      },
      "var:2": {
        id: "var:2",
        name: "Colors/Error",
        resolvedType: "COLOR",
        valuesByMode: { "mode:1": { r: 1, g: 0, b: 0, a: 1 } },
      },
    });

    const tokens = extractTokensFromFigmaVariables(json);
    expect(tokens.colors!.primary.category).toBe("primary");
    expect(tokens.colors!.error.category).toBe("error");
  });

  it("handles meta-wrapped format", () => {
    const json = JSON.stringify({
      meta: {
        variables: {
          "var:1": {
            id: "var:1",
            name: "Colors/Brand",
            resolvedType: "COLOR",
            valuesByMode: { "mode:1": { r: 0.5, g: 0.5, b: 0.5, a: 1 } },
          },
        },
        variableCollections: {},
      },
    });

    const tokens = extractTokensFromFigmaVariables(json);
    expect(tokens.colors!.brand).toBeDefined();
  });

  it("preserves descriptions", () => {
    const json = makeFigmaExport({
      "var:1": {
        id: "var:1",
        name: "Colors/Primary",
        resolvedType: "COLOR",
        description: "Main brand color",
        valuesByMode: { "mode:1": { r: 0, g: 0, b: 1, a: 1 } },
      },
    });

    const tokens = extractTokensFromFigmaVariables(json);
    expect(tokens.colors!.primary.description).toBe("Main brand color");
  });

  it("throws on invalid JSON", () => {
    expect(() => extractTokensFromFigmaVariables("{bad}")).toThrow("Invalid JSON");
  });

  it("throws on empty variables", () => {
    expect(() => extractTokensFromFigmaVariables(JSON.stringify({ variables: {} }))).toThrow(
      "No variables found"
    );
  });
});
