<script>
import mermaid from 'mermaid'

mermaid.parseError = error => console.error(error)

export default {
  mounted() {
    window.mermaidClick = id => this.$emit('node-click', id)
    mermaid.initialize({
      securityLevel: 'loose',
      startOnLoad: false,
      theme: 'default',
    })
    mermaid.init(this.value, this.$el)
  },
  name: 'VueMermaidString',
  props: {
    value: { type: String },
  },
  render() {
    return <div>{this.value}</div>
  },
}
</script>
