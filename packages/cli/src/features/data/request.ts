import type { ApiResponse } from '@spotify-confidence/core';
import { printApiError } from '@utils/api-error.js';
import { requireAuth } from '@utils/auth.js';
import { printData } from './output.js';

/** Callers must validate arguments and input before invoking this helper, including dry-runs. */
export async function executeDataRequest(
  argv: Record<string, unknown>,
  request: (token: string) => Promise<ApiResponse<unknown>>,
  preview?: unknown,
): Promise<void> {
  if (argv['dry-run'] === true) {
    printData(preview ?? { dryRun: true }, argv);
    return;
  }

  const token = requireAuth(argv.profile as string | undefined);
  if (!token) return;

  try {
    const result = await request(token);
    if (!result.ok) {
      printApiError(result);
      return;
    }
    printData(result.data, argv);
  } catch (err) {
    printApiError({
      ok: false,
      status: 0,
      error: { code: 0, message: err instanceof Error ? err.message : 'Data request failed.' },
    });
  }
}
