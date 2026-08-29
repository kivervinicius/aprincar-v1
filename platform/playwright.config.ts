import { defineConfig } from '@playwright/test';

const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;

export default defineConfig({
  testDir: './e2e',
  webServer: { command: 'npm run dev', port: 4173, reuseExistingServer: true },
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: executablePath ? { executablePath, args: ['--no-sandbox', '--disable-gpu'] } : undefined,
  },
});
