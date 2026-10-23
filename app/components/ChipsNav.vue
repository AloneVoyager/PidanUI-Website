<script setup lang="ts">
// 分类 / 标签 / 归档快捷入口
const CHIPS = [
  { label: '全部分类', href: '/categories/' },
  { label: '全部标签', href: '/tags/' },
  { label: '归档', href: '/archives/' },
] as const;
</script>

<template>
  <nav class="flex flex-wrap gap-2.5" aria-label="新闻快捷入口">
    <UButton
      v-for="chip in CHIPS"
      :key="chip.href"
      :to="chip.href"
      :label="chip.label"
      variant="outline"
      color="neutral"
      size="sm"
      rounded-full
    />
  </nav>
</template>
