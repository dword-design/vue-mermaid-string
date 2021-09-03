<script>
export default {
  mounted() {
    if (typeof window !== 'undefined') {
      const mermaid = window.mermaid || require('mermaid')
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
    value: { required: true, type: String },
  },
  render() {
    return <div>{this.value}</div>
  },
}
</script>
