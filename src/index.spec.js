import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginComponent from '@dword-design/tester-plugin-component'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'

export default tester(
  {
    click: {
      page: endent`
      <template>
        <client-only>
          <div>
            <self :class="['diagram', clicked1]" :value="diagram" @node-click="nodeClick1" />
            <self :class="['diagram', clicked2]" :value="diagram" @node-click="nodeClick2" />
          </div>
        </client-only>
      </template>

      <script>
      import { endent } from '@dword-design/functions'

      export default {
        data: () => ({
          clicked1: 'not-clicked',
          clicked2: 'not-clicked',
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
        await this.page.goto('http://localhost:3000')
        await this.page.waitForSelector(
          '.diagram:first-child .node[id^=flowchart-A-] a[href="https://google.com"]'
        )

        const node = await this.page.waitForSelector(
          '.diagram:first-child .node:last-child'
        )
        await node.click()
        await this.page.waitForSelector('.diagram:first-child.clicked')
        await this.page.waitForSelector('.diagram:last-child.not-clicked')
      },
    },
    works: {
      page: endent`
      <template>
        <client-only>
          <self class="foo" :value="diagram" />
        </client-only>
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
    testerPluginComponent({
      componentPath: require.resolve('./index.vue'),
      pluginMode: 'client',
    }),
    testerPluginPuppeteer(),
  ]
)
