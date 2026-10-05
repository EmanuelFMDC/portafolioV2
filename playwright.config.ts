import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Un solo servidor de producción atiende a todos los workers: más paralelismo
  // solo satura el optimizador de imágenes (AVIF) con la caché fría.
  workers: process.env.CI ? 2 : 4,
  reporter: "list",
  use: { baseURL: "http://localhost:3000", navigationTimeout: 45_000 },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run build && npm start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
