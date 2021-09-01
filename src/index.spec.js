import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginComponent from '@dword-design/tester-plugin-component'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import chalk from 'chalk'

export default tester(
  {
    click: {
      page: endent`
      <template>
        <client-only>
          <self :class="clazz" :value="diagram" @node-click="nodeClick" />
        </client-only>
      </template>

      <script>
      import { endent } from '@dword-design/functions'

      export default {
        data: () => ({
          clazz: 'foo',
        }),
        computed: {
          diagram: () => endent\`
            graph TD
              A --> B
              click B mermaidClick
          \`,
        },
        methods: {
          nodeClick() {
            this.clazz = 'bar'
          },
        },
      }
      </script>

    `,
      async test() {
        /* this.page
          .on('console', message =>
            console.log(
              `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
            )
          )
          .on('pageerror', context => console.log(context.message))
          .on('response', response =>
            console.log(`${response.status()} ${response.url()}`)
          )
          .on('requestfailed', request =>
            console.log(`${request.failure().errorText} ${request.url()}`)
          ) */

        // make args accessible
        const describe = jsHandle =>
          jsHandle.executionContext().evaluate(
            obj =>
              // serialize |obj| however you want
              `OBJ: ${typeof obj}, ${obj}`,
            jsHandle
          )

        const colors = {
          // (text: any) => text,
          ERR: chalk.red,
          INF: chalk.cyan,
          LOG: chalk.grey,
          WAR: chalk.yellow,
        }
        // listen to browser console there
        this.page.on('console', async message => {
          const args = await Promise.all(
            message.args().map(arg => describe(arg))
          )

          // make ability to paint different console[types]
          const type = message.type().substr(0, 3).toUpperCase()

          const color = colors[type] || chalk.blue
          let text = ''
          for (let i = 0; i < args.length; i += 1) {
            text += `[${i}] ${args[i]} `
          }
          console.log(color(`CONSOLE.${type}: ${message.text()}\n${text} `))
        })
        await this.page.goto('http://localhost:3000')

        const node = await this.page.waitForSelector('.nodes .node:last-child')
        await node.click()
        await this.page.waitForSelector('.bar')
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
