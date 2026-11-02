<template>
  <div ref="root"></div>
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

let renderCount = 0;

// Render off-DOM first and swap the SVG in once ready, so the previous chart stays visible meanwhile.
watch(
  allData,
  async () => {
    if (globalThis.window === undefined) {
      return;
    }

    if (!finalValue.value) {
      return;
    }

    await nextTick();
    const currentRender = ++renderCount;
    mermaid.parseError = error => emit('parse-error', error);

    try {
      const { svg, bindFunctions } = await mermaid.render(
        // Prefixed because mermaid uses the id as a CSS selector and nanoid ids may start with a digit
        `mermaid-${id}-${currentRender}`,
        finalValue.value,
      );

      // Skip stale renders if a newer value has been requested meanwhile
      if (currentRender !== renderCount) {
        return;
      }

      root.value.innerHTML = svg;
      bindFunctions?.(root.value);
      emit('rendered');
    } catch {
      // Mermaid will throw the error although the parseError function is set
    }
  },
  { flush: 'post', immediate: true },
);
</script>
