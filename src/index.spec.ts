import { expect, test } from '@playwright/test';
import endent from 'endent';
import type { ParseErrorFunction } from 'mermaid';
import pTimeout from 'p-timeout';

import Self from './index.vue';

type MermaidError = Parameters<ParseErrorFunction>[0];
const CALLBACK_PREFIX = 'mermaidClick_';

test('change value', async ({ mount }) => {
  const self = await mount(Self, {
    props: {
      value: endent`
        graph TD
          A --> B
      `,
    },
  });

  await self.update({
    props: {
      value: endent`
        graph TD
          B --> C
      `,
    },
  });

  await expect(self.locator('svg')).toHaveScreenshot();
});

test('click', async ({ page, mount }) => {
  let wasNodeClicked = false;

  const self = await mount(Self, {
    props: {
      'onNode-click': (nodeId: string) => {
        if (nodeId === 'B') {
          wasNodeClicked = true;
        }
      },
      value: endent`
        graph TD
          A --> B
          click A href "https://google.com"
          click B
      `,
    },
  });

  await expect(
    self.locator('a[*|href="https://google.com"] .node[id^=flowchart-A-]'),
  ).toBeAttached();

  let windowKeys = await page.evaluate(() => Object.keys(globalThis));

  expect(
    windowKeys.filter(key => key.startsWith(CALLBACK_PREFIX)).length,
  ).toEqual(1);

  await self.locator('.node[id^=flowchart-B-]').click();
  expect(wasNodeClicked).toEqual(true);
  await self.unmount();
  windowKeys = await page.evaluate(() => Object.keys(globalThis));

  expect(
    windowKeys.filter(key => key.startsWith(CALLBACK_PREFIX)).length,
  ).toEqual(0);
});

/* 'click: multiple diagrams': {
  page: endent`
    <template>
      <div>
        <button class="hide-button" @click="hide" />
        <div>
          <self :class="['diagram', clicked1]" :value="diagram" @node-click="nodeClick1" />
          <self v-if="visible" :class="['diagram', clicked2]" :value="diagram" @node-click="nodeClick2" />
        </div>
      </div>
    </template>

    <script>
    import { endent } from '@dword-design/functions'

    export default {
      data: () => ({
        clicked1: 'not-clicked',
        clicked2: 'not-clicked',
        visible: true,
      }),
      computed: {
        diagram: () => endent\`
          graph TD
            A --> B
            click A href "https://google.com"
            click B
        \`,
      },
      methods: {
        hide() {
          this.visible = false
        },
        nodeClick1(id) {
          if (id === 'B') {
            this.clicked1 = 'clicked'
          }
        },
        nodeClick2(id) {
          if (id === 'B') {
            this.clicked2 = 'clicked'
          }
        },
      },
    }
    </script>
  `,
  async test({ port }) {
    const callbackPrefix = 'mermaidClick_'
    await this.page.goto(`http://localhost:${port}`)
    await this.page.waitForSelector(
      '.diagram:first-child a[*|href="https://google.com"] .node[id^=flowchart-A-]',
    )

    expect(
      (
        this.page.evaluate(() => Object.keys(window))
        |> await
        |> filter(key => key.startsWith(callbackPrefix))
      ).length,
    ).toEqual(2)
    await this.page.click('.diagram:first-child .node[id^=flowchart-B-]')
    await this.page.waitForSelector('.diagram:first-child.clicked')
    await this.page.waitForSelector('.diagram:last-child.not-clicked')
    await this.page.click('.diagram:last-child .node[id^=flowchart-B-]')
    await this.page.waitForSelector('.diagram:last-child.clicked')
    await this.page.click('.hide-button')
    expect(
      (
        this.page.evaluate(() => Object.keys(window))
        |> await
        |> filter(key => key.startsWith(callbackPrefix))
      ).length,
    ).toEqual(1)
  },
}, */
test('error handling', async ({ mount }) => {
  const error = await pTimeout<MermaidError>(
    new Promise(resolve =>
      mount(Self, {
        props: {
          'onParse-error': (_error: MermaidError) => resolve(_error),
          value: 'foo',
        },
      }),
    ),
    { milliseconds: 5000 },
  );

  expect(error instanceof Error ? error.message : error).toMatchSnapshot();
});

test('options', async ({ mount }) => {
  const self = await mount(Self, {
    props: {
      options: { maxTextSize: 3 },
      value: endent`
        graph TD
          A --> B
      `,
    },
  });

  await expect(self.locator('svg')).toHaveScreenshot();
});

test('works', async ({ mount }) => {
  const self = await mount(Self, {
    props: {
      value: endent`
        graph TD
          A --> B
      `,
    },
  });

  await expect(self.locator('svg')).toHaveScreenshot();
});
