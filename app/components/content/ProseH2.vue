<script setup lang="ts">
// MDC 默认把整段标题文本包进 <a>（当 anchorLinks 开启时）；
// 本站沿用 VitePress 的形态：标题文本保持纯文本，末尾追加一个 .header-anchor
// 图标链接，由 _post.scss 控制 hover 时淡入。
const props = defineProps<{ id?: string }>();
</script>

<template>
  <h2 :id="props.id">
    <slot />
    <a v-if="props.id" class="header-anchor" :href="`#${props.id}`" aria-hidden="true" tabindex="-1" />
  </h2>
</template>
