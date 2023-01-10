<template>
  <div>{{ finalValue }}</div>
</template>

<script>
import packageName from 'depcheck-package-name'
import { nanoid } from 'nanoid'

import addClickEvent from './add-click-event.js'

export default {
  beforeDestroy() {
    delete window[`mermaidClick_${this.id}`]
  },
  computed: {
    finalValue() {
      return addClickEvent(this.value, { id: this.id })
    },
    id: () => nanoid(),
  },
  methods: {
    async update() {
      if (typeof window !== 'undefined') {
        const mermaid =
          window.mermaid || (await import(packageName`mermaid`)).default
        mermaid.parseError = error => this.$emit('parse-error', error)
        this.$el.removeAttribute('data-processed')
        this.$el.replaceChild(
          document.createTextNode(this.finalValue),
          this.$el.firstChild
        )
        mermaid.init(this.finalValue, this.$el)
      }
    },
  },
  async mounted() {
    if (typeof window !== 'undefined') {
      window[`mermaidClick_${this.id}`] = id => this.$emit('node-click', id)

      const mermaid =
        window.mermaid || (await import(packageName`mermaid`)).default
      mermaid.initialize({
        securityLevel: 'loose',
        startOnLoad: false,
        theme: 'default',
      })
    }

    return this.update()
  },
  name: 'VueMermaidString',
  props: {
    value: { required: true, type: String },
  },
  watch: {
    finalValue() {
      return this.update()
    },
  },
}
</script>
