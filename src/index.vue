<template>
  <div ref="root">{{ finalValue }}</div>
</template>

<script setup lang="ts">
import mermaid from 'mermaid';
import { nanoid } from 'nanoid';
import { onBeforeUnmount, ref, watch } from 'vue';

import addClickEvent from './add-click-event';

const props = defineProps<{
  options: Record<string, unknown>;
  value: string;
}>();

const root = useTemplateRef('root');
const id = ref();
const finalValue = computed(() => addClickEvent(props.value, { id: id.value }));
const allData = computed(() => [finalValue.value, id.value]);

onBeforeUnmount(() => {
  if (globalThis.window === undefined) {
    return;
  }

  delete window[`mermaidClick_${this.id}`];
});

onMounted(() => {
  if (globalThis.window === undefined) {
    return;
  }

  mermaid.initialize({
    securityLevel: 'loose',
    startOnLoad: false,
    theme: 'default',
    ...this.options,
  });

  id.value = nanoid();
});

watch(
  allData,
  async () => {
    if (globalThis.window === undefined) {
      return;
    }

    if (!finalValue.value) {
      return;
    }

    if (!id.value) {
      return;
    }

    delete this.$el.dataset.processed;
    mermaid.parseError = error => this.$emit('parse-error', error);

    try {
      await mermaid.run({
        nodes: [root.value],
        postRenderCallback: () => this.$emit('rendered'),
      });
    } catch {
      // Mermaid will throw the error although the parseError function is set
    }
  },
  { flush: 'post', immediate: true },
);

watch(
  id,
  (id, previousId) => {
    if (globalThis.window === undefined) {
      return;
    }

    if (previousId) {
      delete window[`mermaidClick_${previousId}`];
    }

    if (!this.id) {
      return;
    }

    window[`mermaidClick_${id.value}`] = nodeId =>
      this.$emit('node-click', nodeId);
  },
  { immediate: true },
);

defineEmits(['node-click', 'parse-error', 'rendered']);
</script>
