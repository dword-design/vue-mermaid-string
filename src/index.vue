<template>
  <div ref="root">{{ finalValue }}</div>
</template>

<script setup lang="ts">
import mermaid, { type MermaidConfig, type ParseErrorFunction } from 'mermaid';
import { nanoid } from 'nanoid';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  useTemplateRef,
  watch,
} from 'vue';

import addClickEvent from './add-click-event';

type MermaidError = Parameters<ParseErrorFunction>[0];
declare global {
  interface Window {
    [key: `mermaidClick_${string}`]: (nodeId: string) => void;
  }
}

const props = withDefaults(
  defineProps<{ options?: MermaidConfig; value: string }>(),
  { options: () => ({}) },
);

const emit = defineEmits<{
  'node-click': [nodeId: string];
  'parse-error': [error: MermaidError];
  rendered: [];
}>();

const maybeRoot = useTemplateRef('root');
const id = nanoid();
const root = computed(() => maybeRoot.value!);
const finalValue = computed(() => addClickEvent(props.value, { id }));
const allData = computed(() => [finalValue.value, id]);

onBeforeUnmount(() => {
  if (globalThis.window === undefined) {
    return;
  }

  delete window[`mermaidClick_${id}`];
});

onMounted(() => {
  if (globalThis.window === undefined) {
    return;
  }

  mermaid.initialize({
    securityLevel: 'loose',
    startOnLoad: false,
    theme: 'default',
    ...props.options,
  });

  window[`mermaidClick_${id}`] = nodeId => emit('node-click', nodeId);
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

    await nextTick(async () => {
      delete root.value.dataset.processed;
      mermaid.parseError = error => emit('parse-error', error);

      try {
        await mermaid.run({
          nodes: [root.value],
          postRenderCallback: () => emit('rendered'),
        });
      } catch {
        // Mermaid will throw the error although the parseError function is set
      }
    });
  },
  { flush: 'post', immediate: true },
);
</script>
