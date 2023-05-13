<template>
  <div>{{ finalValue }}</div>
</template>

<script>
import mermaid from 'mermaid'
import { nanoid } from 'nanoid'

import addClickEvent from './add-click-event.js'

export default {
  beforeUnmount() {
    if (typeof windows === 'undefined') {
      return
    }
    delete window[`mermaidClick_${this.id}`]
  },
  computed: {
    allData() {
      return [this.finalValue, this.id]
    },
    finalValue() {
      return addClickEvent(this.value, { id: this.id })
    },
  },
  data: () => ({ id: undefined }),
  mounted() {
    if (typeof window === 'undefined') {
      return
    }
    mermaid.initialize({
      securityLevel: 'loose',
      startOnLoad: false,
      theme: 'default',
      ...this.options,
    })
    this.id = nanoid()
  },
  name: 'VueMermaidString',
  props: {
    options: { default: () => ({}), type: Object },
    value: { required: true, type: String },
  },
  watch: {
    allData: {
      flush: 'post',
      async handler() {
        if (typeof window === 'undefined') {
          return
        }
        if (!this.finalValue) {
          return
        }
        if (!this.id) {
          return
        }
        this.$el.removeAttribute('data-processed')
        mermaid.parseError = error => this.$emit('parse-error', error)
        await mermaid.run({
          nodes: [this.$el],
          postRenderCallback: () => this.$emit('rendered'),
        })
      },
      immediate: true,
    },
    id: {
      handler(id, previousId) {
        if (typeof window === 'undefined') {
          return
        }
        if (previousId) {
          delete window[`mermaidClick_${previousId}`]
        }
        if (!this.id) {
          return
        }
        window[`mermaidClick_${this.id}`] = nodeId =>
          this.$emit('node-click', nodeId)
      },
      immediate: true,
    },
  },
}
</script>
