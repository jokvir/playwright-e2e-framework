export const personas = ['standard_user', 'problem_user', 'error_user', 'visual_user'] as const;

export type Persona = (typeof personas)[number];

const { SAUCE_PASSWORD } = process.env;
if (!SAUCE_PASSWORD) {
  throw new Error('SAUCE_PASSWORD is empty. Set it in .env or as a CI secret.');
}
export const password = SAUCE_PASSWORD;

export function authFile(persona: Persona): string {
  return `.auth/${persona}.json`;
}
