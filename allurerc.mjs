import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Sauce Demo E2E',
  output: 'allure-report',
  historyPath: 'allure-history/history.jsonl',
  historyLimit: 20,
});
