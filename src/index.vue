<script>
import { nanoid } from 'nanoid'

export default {
  beforeDestroy() {
    delete window[`mermaidClick_${this.id}`]
  },
  computed: {
    finalValue() {
      return this.value.replace(
        /^(\s*click\s+[^\s]\s*)$/gm,
        `$1 mermaidClick_${this.id}`
      )
    },
    id: () => nanoid(),
  },
  mounted() {
    if (typeof window !== 'undefined') {
      const mermaid = window.mermaid || require('mermaid')
      window[`mermaidClick_${this.id}`] = id => this.$emit('node-click', id)
      mermaid.parseError = error => {
        console.log('this is a parse error')
        this.$emit('parse-error', error)
      }
      mermaid.initialize({
        securityLevel: 'loose',
        startOnLoad: false,
        theme: 'default',
      })
      mermaid.init(this.finalValue, this.$el)
    }
  },
  name: 'VueMermaidString',
  props: {
    value: { type: String },
  },
  render() {
    return <div>{this.finalValue}</div>
  },
}
</script>
