<script>
export default {
  mounted() {
    if (typeof window !== 'undefined') {
      const mermaid = require('mermaid')
      mermaid.parseError = error => this.$emit('parse-error', error)
      mermaid.initialize({
        securityLevel: 'loose',
        startOnLoad: false,
        theme: 'default',
      })
      mermaid.init(this.value, this.$el)
    }
  },
  name: 'VueMermaidComponent',
  props: {
    value: { type: String },
  },
  render() {
    return <div>{this.value}</div>
  },
}
</script>
