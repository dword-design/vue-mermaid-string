import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      // Use consistent animations setting
      animations: 'disabled',

      // Increase threshold to account for minor anti-aliasing differences
      maxDiffPixelRatio: 0.01,
    },
  },

  fullyParallel: true,

  preserveOutput: 'failures-only',

  snapshotPathTemplate:
    '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{ext}',

  use: {
    // Ensure consistent font rendering
    launchOptions: {
      args: [
        '--font-render-hinting=none',
        '--disable-skia-runtime-opts',
        '--disable-font-subpixel-positioning',
        '--disable-lcd-text',
      ],
    },
  },
});
