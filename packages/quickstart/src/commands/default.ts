import type { OnboardingGoal } from '@spotify-confidence/shared-kernel';
import type { Command } from './types.js';
import { startTui } from '@ui/start-tui.js';

const FEATURE_TO_GOAL: Record<string, OnboardingGoal> = {
  flags: 'feature-flags',
  events: 'event-tracking',
  recordings: 'session-recordings',
};

export const defaultCommand: Command = {
  name: '$0',
  description: 'Launch the Confidence setup wizard',
  handler: async (argv) => {
    const args = argv as Record<string, unknown>;
    const dryRun = Boolean(args['dry-run'] ?? args.dryRun);
    const debug = Boolean(args.debug);
    const dir = args.dir as string | undefined;

    const noColor = args.color === false;
    const noTelemetry = args.telemetry === false;

    const features = args.features as string[] | undefined;
    const goals = features
      ? [...new Set(features.map((f) => FEATURE_TO_GOAL[f]).filter(Boolean))]
      : undefined;

    if (noTelemetry) {
      process.env.CONFIDENCE_TELEMETRY = 'false';
    }

    if (noColor) {
      process.env.FORCE_COLOR = '0';
    }

    await startTui({ dryRun, debug, dir, goals });
  },
};
