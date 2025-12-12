export default (diagram: string, options: { id: string }) =>
  diagram.replaceAll(
    /^(\s*click\s+[^\s]+\s*)$/gm,
    `$1 mermaidClick_${options.id}`,
  );
