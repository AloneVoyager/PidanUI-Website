<script setup lang="ts">
// 分类 / 标签 / 归档快捷入口
const CHIPS = [
  { label: '全部分类', href: '/categories/' },
  { label: '全部标签', href: '/tags/' },
  { label: '归档', href: '/archives/' },
] as const;
</script>

<template>
  <!-- 浅描边胶囊：--ui-bg-elevated 被映射成卡片白，soft neutral 在白底上等于隐形，
       因此显式给边框与底色，hover 再转品牌浅黄 -->
  <nav class="flex flex-wrap gap-2" aria-label="新闻快捷入口">
    <UButton
      v-for="chip in CHIPS"
      :key="chip.href"
      :to="chip.href"
      :label="chip.label"
      variant="ghost"
      color="neutral"
      size="sm"
      class="rounded-full border border-brand-deep-a20 bg-default px-3.5 text-toned hover:border-brand-600/40 hover:bg-brand-soft hover:text-brand-600"
    />
  </nav>
</template>
