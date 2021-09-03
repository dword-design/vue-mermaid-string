<script>
import mermaid from 'mermaid'
import { nanoid } from 'nanoid'

console.log(nanoid)
mermaid.parseError = error => console.error(error)
let idGenerator = 0

export default {
  /* beforeDestroy() {
    delete window[`mermaidClick_${this.id}`]
  }, */
  computed: {
    finalValue() {
      return this.value.replace(
        /^(\s*click\s+[^\s]\s*)$/gm,
        `$1 mermaidClick_${this.id}`
      )
    },
    id: () => {
      const id = idGenerator
      idGenerator += 1

      return id
    },
  },
  /* data: () => ({
    id: undefined,
  }), */
  mounted() {
    /* this.id = idGenerator
    idGenerator += 1 */
    window[`mermaidClick_${this.id}`] = id => this.$emit('node-click', id)
    mermaid.initialize({
      securityLevel: 'loose',
      startOnLoad: false,
      theme: 'default',
    })
    mermaid.init(this.finalValue, this.$el)
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
