<script setup lang="ts">
import { openSearchDialog } from '~/composables/useSearch';
</script>

<template>
  <UButton
    class="search-launcher mb-[18px] w-full justify-start gap-3 rounded-full px-[18px] py-3 text-[15px] font-normal"
    variant="outline"
    color="neutral"
    icon="i-lucide-search"
    label="搜索新闻标题与正文..."
    aria-haspopup="dialog"
    @click="openSearchDialog($event.currentTarget as HTMLElement)"
  />
  <!-- 无 JS 时上面的对话框打不开，退化成站内搜索页链接 -->
  <a
    class="search-launcher-fallback mb-[18px] hidden text-brand-600 underline"
    :href="withBase('/search/')"
    >打开搜索页</a
  >
</template>

<style scoped>
/* 无 JS 降级：hide/show 由 html 上的 .js 标记决定 */
:global(html:not(.js)) .search-launcher {
  display: none;
}

:global(html:not(.js)) .search-launcher-fallback {
  display: inline-block;
}
</style>
