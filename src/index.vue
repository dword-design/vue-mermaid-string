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

/**
 * Serialize a Mermaid config so two objects with the same values compare equal.
 * Key order is ignored, so replacing the options object without changing it
 * does not count as a new config.
 */
const serializeMermaidOptions = (value: unknown): string => {
  if (typeof value === 'function' || value === undefined) {
    return 'undefined';
  }

  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value) ?? 'undefined';
  }

  if (Array.isArray(value)) {
    return `[${value.map(item => serializeMermaidOptions(item)).join(',')}]`;
  }

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .toSorted()
    .map(
      key => `${JSON.stringify(key)}:${serializeMermaidOptions(record[key])}`,
    )
    .join(',')}}`;
};

const optionsJson = computed(() => serializeMermaidOptions(props.options));
const allData = computed(() => [finalValue.value, id, optionsJson.value]);
let appliedOptionsJson = '';

/**
 * Mermaid keeps one global config, and `run` uses whatever `initialize` set last.
 * Call it again only when `options` change. `themeCSS` is read from that config.
 */
const applyMermaidOptions = () => {
  if (optionsJson.value === appliedOptionsJson) {
    return;
  }

  appliedOptionsJson = optionsJson.value;

  mermaid.initialize({
    securityLevel: 'loose',
    startOnLoad: false,
    theme: 'default',
    ...props.options,
  });
};

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

      // The first render replaces the diagram text with an SVG. An options-only
      // update does not make Vue write that text back, so restore it before run.
      if (root.value.textContent !== finalValue.value) {
        root.value.textContent = finalValue.value;
      }

      applyMermaidOptions();
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
