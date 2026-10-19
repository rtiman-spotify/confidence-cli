import { SESSION_EXPIRED_ERR } from './constants.js';

export function hasExpiredSession(err: unknown) {
  return (err as Error).cause === SESSION_EXPIRED_ERR;
}
