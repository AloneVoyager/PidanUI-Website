<script setup lang="ts">
// 复刻 VitePress 的代码块 DOM，保住 _post.scss 的排版与复制按钮：
//   <div class="language-x">
//     <button class="copy" />
//     <span class="lang">x</span>
//     <pre class="shiki …">
// MDC 默认只输出 <pre>，这里补上外层容器、语言角标与复制按钮。
const props = defineProps<{
  code?: string;
  language?: string | null;
  filename?: string | null;
  highlights?: number[];
  meta?: string | null;
  class?: string | null;
}>();

const lang = computed(() => {
  const value = props.language ?? '';
  return value === 'text' || value === 'plaintext' ? '' : value;
});
</script>

<template>
  <div :class="`language-${lang || 'text'}`">
    <button class="copy" type="button" title="Copy code" aria-label="复制代码"></button>
    <span class="lang">{{ lang }}</span>
    <pre :class="props.class"><slot /></pre>
  </div>
</template>
