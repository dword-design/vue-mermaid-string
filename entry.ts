import type { App } from 'vue';

import component from './src/index.vue';

component.install = (app: App) => app.component('VueMermaidString', component);

if (typeof globalThis !== 'undefined') {
  (globalThis as Record<string, unknown>).VueMermaidString = component;
}

export default component;