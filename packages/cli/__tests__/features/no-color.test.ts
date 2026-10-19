import { noColorMiddleware } from '@utils/index.js';
import { saveEnv } from '../helpers/env.js';

describe('noColorMiddleware', () => {
  it('sets FORCE_COLOR to 0 when --no-color is passed', () => {
    using _env = saveEnv('FORCE_COLOR');

    noColorMiddleware({ color: false });

    expect(process.env.FORCE_COLOR).toBe('0');
  });

  it('does not set FORCE_COLOR when color is true', () => {
    using _env = saveEnv('FORCE_COLOR');
    delete process.env.FORCE_COLOR;

    noColorMiddleware({ color: true });

    expect(process.env.FORCE_COLOR).toBeUndefined();
  });
});
