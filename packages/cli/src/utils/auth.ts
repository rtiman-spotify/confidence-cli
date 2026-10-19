import {
  loadPersistedToken,
  validateToken,
  refreshAccessToken,
  authenticate,
  isInteractive,
} from '@spotify-confidence/core';
import { fail, message } from '@output/print.js';

type LoadTokenResult = {
  token: string | null;
  expired: boolean;
};

export async function tryLoadToken(profile?: string): Promise<LoadTokenResult> {
  const existing = loadPersistedToken(profile);
  if (!existing) return { token: null, expired: false };

  const { valid } = validateToken(existing);
  if (valid) return { token: existing, expired: false };

  try {
    const refreshed = await refreshAccessToken(profile);
    return { token: refreshed.accessToken, expired: false };
  } catch {
    return { token: null, expired: true };
  }
}

export async function tryResolveAuthToken(profile?: string): Promise<string | null> {
  const loaded = await tryLoadToken(profile);
  if (loaded.token) return loaded.token;

  if (!isInteractive()) {
    fail(
      loaded.expired
        ? 'Token expired. Run "confidence login" to re-authenticate.'
        : 'Not logged in. Run "confidence login" first.',
    );
    return null;
  }

  try {
    message(
      loaded.expired
        ? 'Session expired. Opening browser to re-authenticate...'
        : 'Not logged in to Confidence. Opening browser to authenticate...',
    );

    const result = await authenticate({
      mode: 'login',
      profile,
      onUrl: (url) => message(`If the browser did not open, visit:\n${url}`),
    });

    message(`Authenticated as ${result.workspace ?? 'unknown'} (${result.region})`);
    return result.accessToken;
  } catch {
    fail('Login failed. Try running "confidence login" to re-authenticate.');
    return null;
  }
}

export function withAuth(
  fn: (argv: Record<string, unknown>, token: string) => Promise<void>,
): (argv: Record<string, unknown>) => Promise<void> {
  return async (argv) => {
    const token = await tryResolveAuthToken(argv.profile as string | undefined);
    if (!token) return;

    await fn(argv, token);
  };
}
