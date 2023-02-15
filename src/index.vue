<template>
  <div>{{ finalValue }}</div>
</template>

<script>
import mermaid from 'mermaid'
import { nanoid } from 'nanoid'

import addClickEvent from './add-click-event.js'

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
    update() {
      if (typeof window !== 'undefined') {
        this.$el.removeAttribute('data-processed')
        mermaid.parseError = error => this.$emit('parse-error', error)
        mermaid.init(this.finalValue, this.$el)
      }
    },
  },
  mounted() {
    if (typeof window !== 'undefined') {
      window[`mermaidClick_${this.id}`] = id => this.$emit('node-click', id)
      mermaid.initialize({
        securityLevel: 'loose',
        startOnLoad: false,
        theme: 'default',
        ...this.options,
      })
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
