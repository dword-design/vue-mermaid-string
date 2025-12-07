import { expect, test } from '@playwright/test';
import endent from 'endent';

import self from './add-click-event';

interface TestConfig {
  subject: string;
  result: string;
}

const tests: Record<string, TestConfig> = {
  'multiple chars': {
    result: endent`
      graph TD
        click AA mermaidClick_<id>
    `,
    subject: endent`
      graph TD
        click AA
    `,
  },
  works: {
    result: endent`
      graph TD
        click A mermaidClick_<id>
    `,
    subject: endent`
      graph TD
        click A
    `,
  },
};

for (const [name, config] of Object.entries(tests)) {
  test(name, () =>
    expect(self(config.subject, { id: '<id>' })).toEqual(config.result),
  );
}
