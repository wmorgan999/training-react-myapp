// In a TypeScript `catch (e)`, `e` is `unknown`: anything can be thrown.
// This turns it into text we can show.
export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}
