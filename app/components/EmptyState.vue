<script setup lang="ts">
// 列表 / 归档 / 分类索引 / 标签索引页共用的空状态文案。
// grid-column 在非 grid 父级下会被忽略，因此四个调用点可以共用同一份样式。
withDefaults(
  defineProps<{
    text?: string;
  }>(),
  { text: '暂无内容' },
);
</script>

<template>
  <p class="empty-state">{{ text }}</p>
</template>

<style scoped>
.empty-state {
  grid-column: 1 / -1;
  padding: 40px 0;
  font-size: 15px;
  color: var(--ink-3);
  text-align: center;
}
</style>
