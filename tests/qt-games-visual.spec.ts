import { test, expect } from "@playwright/test";
import { resolve } from "path";

const PAGE_URL = `file://${resolve(import.meta.dirname, "../examples/qt-games/index.html")}`;

const VIEWPORTS = {
  mobile: { width: 375, height: 812, name: "mobile" },
  tablet: { width: 768, height: 1024, name: "tablet" },
  desktop: { width: 1200, height: 900, name: "desktop" },
  ultrawide: { width: 1920, height: 1080, name: "ultrawide" },
};

for (const [key, vp] of Object.entries(VIEWPORTS)) {
  test.describe(`${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("page loads without errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      await page.goto(PAGE_URL, { waitUntil: "networkidle" });
      expect(errors).toHaveLength(0);
    });

    test("hero section renders", async ({ page }) => {
      await page.goto(PAGE_URL, { waitUntil: "networkidle" });
      const hero = page.locator(".hero-title");
      await expect(hero).toBeVisible();
      await expect(hero).toContainText("Crafting Worlds");
    });

    test("all sections are present", async ({ page }) => {
      await page.goto(PAGE_URL, { waitUntil: "networkidle" });
      await expect(page.locator("#games")).toBeAttached();
      await expect(page.locator("#about")).toBeAttached();
      await expect(page.locator("#team")).toBeAttached();
      await expect(page.locator("#contact")).toBeAttached();
    });

    test("no horizontal overflow", async ({ page }) => {
      await page.goto(PAGE_URL, { waitUntil: "networkidle" });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance
    });

    test("text is readable (not overflowing containers)", async ({ page }) => {
      await page.goto(PAGE_URL, { waitUntil: "networkidle" });
      // Check that the hero title fits within the viewport
      const titleBox = await page.locator(".hero-title").boundingBox();
      expect(titleBox).toBeTruthy();
      expect(titleBox!.x).toBeGreaterThanOrEqual(0);
      expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(vp.width + 10);
    });

    test(`full page screenshot - ${vp.name}`, async ({ page }) => {
      await page.goto(PAGE_URL, { waitUntil: "networkidle" });
      await page.screenshot({
        path: `tests/screenshots/${vp.name}-full.png`,
        fullPage: true,
      });
    });
  });
}

// Mobile-specific tests
test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger menu toggles nav links", async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: "networkidle" });

    // Nav links should be hidden initially
    const navLinks = page.locator(".nav-links");
    await expect(navLinks).not.toBeVisible();

    // Toggle open
    await page.locator(".nav-toggle").click();
    await expect(navLinks).toBeVisible();

    // Toggle closed
    await page.locator(".nav-toggle").click();
    await expect(navLinks).not.toBeVisible();
  });

  test("nav links close on anchor click", async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: "networkidle" });
    await page.locator(".nav-toggle").click();
    await page.locator('.nav-links a[href="#games"]').click();

    // Give smooth scroll a moment
    await page.waitForTimeout(500);
    const navLinks = page.locator(".nav-links");
    await expect(navLinks).not.toBeVisible();
  });
});

// Desktop-specific tests
test.describe("desktop layout", () => {
  test.use({ viewport: { width: 1200, height: 900 } });

  test("game grid shows 2 columns", async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: "networkidle" });
    const grid = page.locator(".games-grid");
    const style = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    const columns = style.split(" ").length;
    expect(columns).toBe(2);
  });

  test("team grid shows 4 columns", async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: "networkidle" });
    const grid = page.locator(".team-grid");
    const style = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    const columns = style.split(" ").length;
    expect(columns).toBe(4);
  });

  test("hamburger menu is hidden", async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: "networkidle" });
    await expect(page.locator(".nav-toggle")).not.toBeVisible();
  });
});

// Accessibility basics
test.describe("accessibility", () => {
  test.use({ viewport: { width: 1200, height: 900 } });

  test("form inputs have labels", async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: "networkidle" });
    const inputs = page.locator("input, textarea");
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const id = await inputs.nth(i).getAttribute("id");
      expect(id).toBeTruthy();
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeAttached();
    }
  });

  test("nav toggle has aria-label", async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: "networkidle" });
    const label = await page.locator(".nav-toggle").getAttribute("aria-label");
    expect(label).toBeTruthy();
  });
});
