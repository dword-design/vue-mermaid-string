import { endent, filter } from '@dword-design/functions'
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
            <button class="hide-button" @click="hide" />
            <div>
              <self :class="['diagram', clicked1]" :value="diagram" @node-click="nodeClick1" />
              <self v-if="visible" :class="['diagram', clicked2]" :value="diagram" @node-click="nodeClick2" />
            </div>
          </div>
        </client-only>
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
