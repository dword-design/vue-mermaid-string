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

<!-- INSTALL/ -->
## Install via a package manager

```bash
# npm
$ npm install vue-mermaid-string

# Yarn
$ yarn add vue-mermaid-string
```

Add to local components:

```js
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
<script src="https://unpkg.com/vue"></script>
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

Usage is simple, you pass a Mermaid string to the component and you get a visual diagram:

```html
<template>
  <vue-mermaid-string :value="diagram" />
</template>
```

```js
<script>
export default {
  computed: {
    diagram: () => 'graph TD\n  A --> B',
  },
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
