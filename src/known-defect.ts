export function knownDefect(id: string, description: string) {
  return { type: 'known-defect', description: `${id}: ${description}` };
}
