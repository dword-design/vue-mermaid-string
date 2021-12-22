export default (diagram, options = {}) =>
  diagram.replace(/^(\s*click\s+[^\s]+\s*)$/gm, `$1 mermaidClick_${options.id}`)
