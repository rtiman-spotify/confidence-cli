import { message, fail } from '@output/print.js';
import { authenticate } from '@spotify-confidence/core';
import { tryLoadAuthToken } from '@utils/auth.js';

export async function resolveAuthToken(opts?: {
  forceNew?: boolean;
  profile?: string;
}): Promise<string | null> {
  if (!opts?.forceNew) {
    const { token } = await tryLoadAuthToken(opts?.profile);
    if (token) return token;
  }

  try {
    message('Authentication required. Opening browser...');
    const result = await authenticate({
      mode: 'login',
      profile: opts?.profile,
      onUrl: (url) => message(`If the browser did not open, visit:\n${url}`),
    });
    return result.accessToken;
  } catch (err) {
    fail(`Authentication failed: ${(err as Error).message}`);
    return null;
  }
}
