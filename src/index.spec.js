import { endent, filter } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginComponent from '@dword-design/tester-plugin-component'
import { expect } from '@playwright/test'
import { createRequire } from 'module'
import { chromium } from 'playwright'

const resolver = createRequire(import.meta.url)

export default tester(
  {
    'change value': {
      page: endent`
        <template>
          <div>
            <self class="foo" :value="diagram" />
            <button @click="change" />
          </div>
        </template>

        <script>
        import { endent } from '@dword-design/functions'

        export default {
          data: () => ({
            diagram: endent\`
              graph TD
                A --> B
            \`,
          }),
          methods: {
            change() {
              this.diagram = endent\`
                graph TD
                  B --> C
              \`
            },
          },
        }
        </script>
      `,
      async test() {
        await this.page.goto('http://localhost:3000')
        await this.page.waitForSelector('.foo svg')
        await this.page.click('button')
        expect(await this.page.screenshot()).toMatchImageSnapshot(this)
      },
    },
    click: {
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
      async test() {
        const callbackPrefix = 'mermaidClick_'
        await this.page.goto('http://localhost:3000')
        await new Promise(resolve => setTimeout(resolve, 40000))
        await expect(
          this.page.locator('.diagram:first-child .node[id^=flowchart-A-] a'),
        ).toHaveAttribute('href', 'https://google.com')
        expect(
          (
            this.page.evaluate(() => Object.keys(window))
            |> await
            |> filter(key => key.startsWith(callbackPrefix))
          ).length,
        ).toEqual(2)
        await this.page.click('.diagram:first-child .node:last-child')
        await this.page.waitForSelector('.diagram:first-child.clicked')
        await this.page.waitForSelector('.diagram:last-child.not-clicked')
        await this.page.click('.diagram:last-child .node:last-child')
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
    },
    'error handling': {
      page: endent`
        <template>
          <div v-if="error" class="foo">{{ error }}</div>
          <self v-else class="foo" value="foo" @parse-error="error = $event" />
        </template>

        <script>
        export default {
          data: () => ({
            error: undefined,
          }),
        }
        </script>
      `,
      async test() {
        await this.page.goto('http://localhost:3000')
        await expect(this.page.locator('.foo')).toHaveText(endent`
          Error: Parse error on line 1:
          foo
          ^
          Expecting 'open_directive', 'NEWLINE', 'SPACE', 'GRAPH', got 'ALPHA'
        `)
      },
    },
    options: {
      page: endent`
        <template>
          <self class="foo" :value="diagram" :options="{ maxTextSize: 3 }" />
        </template>

        <script>
        import { endent } from '@dword-design/functions'

        export default {
          computed: {
            diagram: () => endent\`
              graph TD
                A --> B
            \`,
          },
        }
        </script>
      `,
      async test() {
        await this.page.goto('http://localhost:3000')
        expect(
          await this.page.locator('.foo svg').screenshot(),
        ).toMatchImageSnapshot(this)
      },
    },
    works: {
      page: endent`
        <template>
          <self class="foo" :value="diagram" />
        </template>

        <script>
        import { endent } from '@dword-design/functions'

        export default {
          computed: {
            diagram: () => endent\`
              graph TD
                A --> B
            \`,
          },
        }
        </script>
      `,
      async test() {
        await this.page.goto('http://localhost:3000')
        expect(
          await this.page.locator('.foo svg').screenshot(),
        ).toMatchImageSnapshot(this)
      },
    },
  },
  [
    testerPluginComponent({ componentPath: resolver.resolve('./index.vue') }),
    {
      async after() {
        await this.browser.close()
      },
      async before() {
        this.browser = await chromium.launch()
        this.page = await this.browser.newPage()
      },
    },
  ],
)
