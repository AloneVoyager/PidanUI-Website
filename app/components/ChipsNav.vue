<script setup lang="ts">

// 分类 / 标签 / 归档快捷入口
const CHIPS = [
  { label: '全部分类', href: '/categories/' },
  { label: '全部标签', href: '/tags/' },
  { label: '归档', href: '/archives/' },
] as const;
</script>

<template>
  <nav class="chips-nav flex flex-wrap gap-2.5" aria-label="新闻快捷入口">
    <NuxtLink v-for="chip in CHIPS" :key="chip.href" class="chip" :to="chip.href">
      {{ chip.label }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.chips-nav .chip {
  padding: 6px 16px;
  font-size: 13px;
  color: var(--ink-2);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.chips-nav .chip:hover {
  color: var(--brand-deep);
  background: var(--brand-soft);
  border-color: rgba(255, 159, 26, 0.3);
}
</style>
