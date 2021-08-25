<script>
import mermaid from 'mermaid'

export default {
  mounted() {
    mermaid.parseError = error => {
      console.log('this is a parse error')
      this.$emit('parse-error', error)
    }
    mermaid.initialize({
      securityLevel: 'loose',
      startOnLoad: false,
      theme: 'default',
    })
    mermaid.init(this.value, this.$el)
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
