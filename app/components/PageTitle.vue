<script setup lang="ts">
// 列表 / 搜索 / 归档 / 分类索引 / 标签索引页共用的页面主标题。
// 抽出来是为了让五个页面的标题排版只有一个来源（此前是 5 份几乎相同的
// scoped 声明，改字号要改五处）。
defineProps<{
  title: string;
}>();
</script>

<template>
  <h1 class="page-title">{{ title }}</h1>
</template>

<style scoped>
.page-title {
  font-size: clamp(24px, 3.6vw, 32px);
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.01em;
}
</style>
