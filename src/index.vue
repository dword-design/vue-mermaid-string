<template>
  <div>{{ finalValue }}</div>
</template>

<script>
import mermaid from 'mermaid'
import { nanoid } from 'nanoid'

import addClickEvent from './add-click-event.js'

if (typeof window !== 'undefined') {
  mermaid.initialize({
    securityLevel: 'loose',
    startOnLoad: false,
    theme: 'default',
  })
}

export default {
  beforeUnmount() {
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
        this.$el.removeAttribute('data-processed')
        try {
          await mermaid.run({ nodes: [this.$el], ...this.options })
        } catch (error) {
          this.$emit('parse-error', error.message)
        }
      }
    },
  },
  mounted() {
    if (typeof window !== 'undefined') {
      window[`mermaidClick_${this.id}`] = id => this.$emit('node-click', id)
    }

    return this.update()
  },
  name: 'VueMermaidString',
  props: {
    options: { default: () => ({}), type: Object },
    value: { required: true, type: String },
  },
  watch: {
    finalValue: {
      flush: 'post',
      async handler() {
        await this.update()
      },
    },
  },
}
</script>
