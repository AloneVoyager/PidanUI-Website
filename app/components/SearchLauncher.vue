<script setup lang="ts">
import { openSearchDialog } from '~/composables/useSearch';
</script>

<template>
  <button class="search-launcher" type="button" aria-haspopup="dialog" @click="openSearchDialog($event.currentTarget as HTMLElement)">
    <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
    <span>搜索新闻标题与正文...</span>
  </button>
  <a class="search-launcher-fallback" :href="withBase('/search/')">打开搜索页</a>
</template>

<style scoped>
.search-launcher {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 0 0 18px;
  padding: 12px 18px;
  color: var(--ink-3);
  font: inherit;
  font-size: 15px;
  text-align: left;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 40px;
  cursor: pointer;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.search-launcher i {
  flex: 0 0 auto;
  font-size: 15px;
}

.search-launcher:hover,
.search-launcher:focus-visible {
  border-color: var(--brand-deep);
  box-shadow: 0 0 0 4px rgba(255, 159, 26, 0.14);
  outline: none;
}

.search-launcher-fallback {
  display: none;
  margin-bottom: 18px;
  color: var(--brand-deep);
  text-decoration: underline;
}

:global(html:not(.js)) .search-launcher {
  display: none;
}

:global(html:not(.js)) .search-launcher-fallback {
  display: inline-block;
}
</style>
