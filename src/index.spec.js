import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginComponent from '@dword-design/tester-plugin-component'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import P from 'path'
import puppeteerToIstanbul from 'puppeteer-to-istanbul'

const storagePath = P.resolve('.nyc_output')

export default tester(
  {
    works: {
      componentPath: require.resolve('./index.vue'),
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
        await this.page.coverage.startJSCoverage()
        await this.page.goto('http://localhost:3000')
        await this.page.waitForSelector('.foo')
        expect(
          await this.page.screenshot({ fullPage: true })
        ).toMatchImageSnapshot(this)
        const coverage = await this.page.coverage.stopJSCoverage()
        puppeteerToIstanbul.write(coverage, { storagePath })
      },
    },
  },
  [testerPluginComponent({ pluginMode: 'client' }), testerPluginPuppeteer()]
)
