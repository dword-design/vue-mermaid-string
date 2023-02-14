<!-- TITLE/ -->
# vue-mermaid-string
<!-- /TITLE -->

<!-- BADGES/ -->
  <p>
    <a href="https://npmjs.org/package/vue-mermaid-string">
      <img
        src="https://img.shields.io/npm/v/vue-mermaid-string.svg"
        alt="npm version"
      >
    </a><img src="https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue" alt="Linux macOS Windows compatible"><a href="https://github.com/dword-design/vue-mermaid-string/actions">
      <img
        src="https://github.com/dword-design/vue-mermaid-string/workflows/build/badge.svg"
        alt="Build status"
      >
    </a><a href="https://codecov.io/gh/dword-design/vue-mermaid-string">
      <img
        src="https://codecov.io/gh/dword-design/vue-mermaid-string/branch/master/graph/badge.svg"
        alt="Coverage status"
      >
    </a><a href="https://david-dm.org/dword-design/vue-mermaid-string">
      <img src="https://img.shields.io/david/dword-design/vue-mermaid-string" alt="Dependency status">
    </a><img src="https://img.shields.io/badge/renovate-enabled-brightgreen" alt="Renovate enabled"><br/><a href="https://gitpod.io/#https://github.com/dword-design/vue-mermaid-string">
      <img
        src="https://gitpod.io/button/open-in-gitpod.svg"
        alt="Open in Gitpod"
        width="114"
      >
    </a><a href="https://www.buymeacoffee.com/dword">
      <img
        src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
        alt="Buy Me a Coffee"
        width="114"
      >
    </a><a href="https://paypal.me/SebastianLandwehr">
      <img
        src="https://sebastianlandwehr.com/images/paypal.svg"
        alt="PayPal"
        width="163"
      >
    </a><a href="https://www.patreon.com/dworddesign">
      <img
        src="https://sebastianlandwehr.com/images/patreon.svg"
        alt="Patreon"
        width="163"
      >
    </a>
</p>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
A Vue.js component that turns a Mermaid string into a diagram.
<!-- /DESCRIPTION -->

In contrast to [vue-mermaid](https://github.com/robin1liu/vue-mermaid), which works by passing structured data to it, this component uses the diagram string directly. The advantage is that it always supports the latest language standard and is easier to use if you have an existing diagram. Depends on your use case which fits better.

<!-- INSTALL/ -->
## Install via a package manager

```bash
# npm
$ npm install vue-mermaid-string

# Yarn
$ yarn add vue-mermaid-string
```

Add to local components:

```html
<script>
import VueMermaidString from 'vue-mermaid-string'

export default {
  components: {
    VueMermaidString,
  },
}
</script>
```

Or register as a global component:

```js
import Vue from 'vue'
import VueMermaidString from 'vue-mermaid-string'

Vue.component('VueMermaidString', VueMermaidString)
```

Or register as a plugin:

```js
import Vue from 'vue'
import VueMermaidString from 'vue-mermaid-string'

Vue.use(VueMermaidString)
```

## Install via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
<script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>
<script src="https://unpkg.com/vue-mermaid-string"></script>
```
<!-- /INSTALL -->

<!--## Install Via a Package Manager
```bash
# npm
$ npm install vue-mermaid-string

# Yarn
$ yarn add vue-mermaid-string
```

Add to Local Components:

```js
import VueMermaidString from 'vue-mermaid-string'

export default {
  components: {
    VueMermaidString,
  },
}
```

Or register as global component:

```js
import Vue from 'vue'
import VueMermaidString from 'vue-mermaid-string'

Vue.component('VueMermaidString', VueMermaidString)
```

Or register as plugin:

```js
import Vue from 'vue'
import VueMermaidString from 'vue-mermaid-string'

Vue.use(VueMermaidString)
```

## Install Via CDN

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>
<script src="https://unpkg.com/vue-mermaid-string"></script>
```-->

## Usage

Usage is simple, you pass a Mermaid string to the component and you get a visual diagram. For ease of use, we will use the [endent](https://github.com/indentjs/endent) package to declare multiline strings. Of course you can also write them using `\n`.

```html
<template>
  <vue-mermaid-string :value="diagram" />
</template>
```

```js
<script>
import endent from 'endent'

export default {
  computed: {
    // equals graph TD\n  A --> B
    diagram: () => endent`
      graph TD
        A --> B
    `,
  },
}
</script>
```

## Mermaid options

It is possible to customize the diagram by passing options to the component. The options are internally passed to `mermaid.initialize`. See the [default config](https://github.com/mermaid-js/mermaid/blob/5b269348024c031e6d76c5582242ea89a86ebf47/src/defaultConfig.js) for a list of available options.

```html
<template>
  <vue-mermaid-string :value="diagram" :options="{ maxTextSize: 10000 }" />
</template>
```

## Click events

You can register click events by declaring them in the diagram string. See [the Mermaid docs](https://mermaid-js.github.io/mermaid/#/flowchart?id=interaction) for details. When registering a callback, you do not need to specify the callback name, the component will magically inject it into the diagram by itself. Implement the `node-click` event handler to react to click events:

```html
<template>
  <vue-mermaid-string :value="diagram" @node-click="nodeClick" />
</template>
```

```js
<script>
import endent from 'endent'

export default {
  computed: {
    diagram: () => endent`
      graph TD
        A --> B
        click A
        click B
    `,
  },
  methods: {
    nodeClick: nodeId => console.log(nodeId),
  },
}
</script>
```

You can also still implement node links. In this case, the handler won't be called but instead the node will be an `<a>` tag that opens the link on click:

```html
<template>
  <vue-mermaid-string :value="diagram" />
</template>
```

```js
<script>
import endent from 'endent'

export default {
  computed: {
    diagram: () => endent`
      graph TD
        A --> B
        click B href "https://github.com"
    `,
  },
}
</script>
```

## Error handling

Mermaid has its own default error handling behavior, outputting a little graphical error message if a parsing error occurs. If you want to have custom error handling, you can react to the `@parse-error` event. Here is a simple example that outputs the error message as a plain string:

```html
<template>
  <div v-if="error">{{ error }}</div>
  <self v-else value="foo" @parse-error="error = $event" />
</template>
```

```js
<script>
export default {
  data: () => ({
    error: undefined,
  }),
}
</script>
```

<!-- LICENSE/ -->
## Contribute

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/dword-design/vue-mermaid-string/issues) or a [pull request](https://github.com/dword-design/vue-mermaid-string/pulls)! ⚙️

## Support

Hey, I am Sebastian Landwehr, a freelance web developer, and I love developing web apps and open source packages. If you want to support me so that I can keep packages up to date and build more helpful tools, you can donate here:

<p>
  <a href="https://www.buymeacoffee.com/dword">
    <img
      src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
      alt="Buy Me a Coffee"
      width="114"
    >
  </a>&nbsp;If you want to send me a one time donation. The coffee is pretty good 😊.<br/>
  <a href="https://paypal.me/SebastianLandwehr">
    <img
      src="https://sebastianlandwehr.com/images/paypal.svg"
      alt="PayPal"
      width="163"
    >
  </a>&nbsp;Also for one time donations if you like PayPal.<br/>
  <a href="https://www.patreon.com/dworddesign">
    <img
      src="https://sebastianlandwehr.com/images/patreon.svg"
      alt="Patreon"
      width="163"
    >
  </a>&nbsp;Here you can support me regularly, which is great so I can steadily work on projects.
</p>

Thanks a lot for your support! ❤️

## See also

* [nuxt-mermaid-string](https://github.com/dword-design/nuxt-mermaid-string): Embed a Mermaid diagram in a Nuxt.js app by providing its diagram string.

## License

[MIT License](https://opensource.org/licenses/MIT) © [Sebastian Landwehr](https://sebastianlandwehr.com)
<!-- /LICENSE -->
