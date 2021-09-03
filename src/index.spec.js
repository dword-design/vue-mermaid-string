import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginComponent from '@dword-design/tester-plugin-component'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'

export default tester(
  {
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
