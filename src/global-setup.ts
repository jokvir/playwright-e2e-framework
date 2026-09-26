import { rmSync } from 'node:fs';

export default function globalSetup(): void {
  rmSync('allure-results', { recursive: true, force: true });
}
