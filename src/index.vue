<script>
import mermaid from 'mermaid'

mermaid.parseError = error => console.error(error)

export default {
  mounted() {
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
    return <div class="foo">{this.value}</div>
  },
}
</script>
