import { endent, filter } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginComponent from '@dword-design/tester-plugin-component'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'

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
        await this.page.waitForSelector('.foo')
        await this.page.click('button')
        expect(
          await this.page.screenshot({ fullPage: true })
        ).toMatchImageSnapshot(this)
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
        await this.page.waitForSelector(
          '.diagram:first-child .node[id^=flowchart-A-] a[href="https://google.com"]'
        )

        const node1 = await this.page.waitForSelector(
          '.diagram:first-child .node:last-child'
        )

        const node2 = await this.page.waitForSelector(
          '.diagram:last-child .node:last-child'
        )
        expect(
          (
            this.page.evaluate(() => Object.keys(window))
            |> await
            |> filter(key => key.startsWith(callbackPrefix))
          ).length
        ).toEqual(2)
        await node1.click()
        await this.page.waitForSelector('.diagram:first-child.clicked')
        await this.page.waitForSelector('.diagram:last-child.not-clicked')
        await node2.click()
        await this.page.waitForSelector('.diagram:last-child.clicked')

        const hideButton = await this.page.waitForSelector('.hide-button')
        await hideButton.click()
        expect(
          (
            this.page.evaluate(() => Object.keys(window))
            |> await
            |> filter(key => key.startsWith(callbackPrefix))
          ).length
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
        await this.page.waitForSelector('.foo')
        expect(
          await this.page.screenshot({ fullPage: true })
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
        await this.page.waitForSelector('.foo')
        expect(
          await this.page.screenshot({ fullPage: true })
        ).toMatchImageSnapshot(this)
      },
    },
  },
  [
    testerPluginComponent({ componentPath: require.resolve('./index.vue') }),
    testerPluginPuppeteer(),
  ]
)
