import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

process.loadEnvFile(existsSync('.env') ? '.env' : '.env.example');

defineBddConfig({
  features: 'features/*.feature',
  steps: ['src/steps/*.ts', 'src/fixtures.ts'],
  outputDir: 'tests',
});

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  // Caps concurrent sessions on a third-party site; 8 workers also crashed Firefox contexts on Windows.
  workers: 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['blob'], ['github']] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, dependencies: ['setup'] },
  ],
});
