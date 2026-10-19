export function noColorMiddleware(argv: Record<string, unknown>): void {
  if (argv.color === false) {
    process.env.FORCE_COLOR = '0';
  }
}
