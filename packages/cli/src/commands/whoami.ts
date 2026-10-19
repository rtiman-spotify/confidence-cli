import { decodeJwtPayload } from '@spotify-confidence/core';
import { print, extractFlags } from '@output/print.js';
import { tryResolveAuthToken } from '@utils/auth.js';

const ORG_ID_KEY = 'https://confidence.dev/org_login_id';
const REGION_KEY = 'https://confidence.dev/region';
const ACCOUNT_KEY = 'https://confidence.dev/account_name';

export const whoamiCommand = {
  command: 'whoami',
  describe: 'Show current user, org, region, and token expiry',
  async handler(argv: Record<string, unknown>) {
    const profile = argv.profile as string | undefined;

    const token = await tryResolveAuthToken(profile);
    if (!token) return;

    const payload = decodeJwtPayload(token);
    const email = (payload.email as string) ?? undefined;
    const org = (payload.org_id as string) ?? (payload[ORG_ID_KEY] as string) ?? undefined;
    const region = payload[REGION_KEY] === 'US' ? 'US' : 'EU';
    const workspace = (payload[ACCOUNT_KEY] as string) ?? (payload.email as string) ?? undefined;
    const exp = payload.exp as number | undefined;
    const expiresAt = exp ? new Date(exp * 1000).toISOString() : 'unknown';

    print({
      data: {
        email: email ?? 'unknown',
        organization: org ?? 'unknown',
        region,
        workspace: workspace ?? 'unknown',
        expires: expiresAt,
        profile: profile ?? 'default',
      },
      columns: [
        { key: 'key', header: 'Field', width: 14 },
        { key: 'value', header: 'Value' },
      ],
      flags: extractFlags(argv),
    });
  },
};
