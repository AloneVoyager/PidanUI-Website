<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import CardGrid from './CardGrid.vue';
import { searchKeyword } from '~/composables/useSearch';
import type { Post } from '#shared/types/post';

const corpus = shallowRef<Post[]>([]);

onMounted(async () => {
  try {
    // 检索语料在构建期由 /api/search.json 预渲染成静态文件，
    // 只在真正打开搜索时才拉取（保持旧的「懒加载」行为）
    corpus.value = await $fetch<Post[]>(withBase('/api/search.json'));
  } catch {
    corpus.value = [];
  }
});

const tokens = computed(() => searchKeyword.value.toLowerCase().split(/\s+/).filter(Boolean));

const hits = computed(() => {
  if (!tokens.value.length) return [];
  return corpus.value.filter((post) => {
    const haystack = [post.title, post.content ?? '', post.tags.join(' ')].map((text) =>
      text.toLowerCase(),
    );
    return tokens.value.every((token) => haystack.some((text) => text.includes(token)));
  });
});

const stats = computed(() => {
  const keyword = searchKeyword.value.trim();
  if (!keyword) return '输入关键词开始搜索新闻。';
  if (!hits.value.length) return `未找到与“${keyword}”相关的新闻。`;
  return `找到 ${hits.value.length} 条与“${keyword}”相关的结果`;
});
</script>

<template>
  <p class="search-tip" aria-live="polite">{{ stats }}</p>
  <CardGrid v-if="tokens.length" :posts="hits" empty-text="未找到相关新闻" />
</template>

<style scoped>
.search-tip {
  margin: 8px 0 16px;
  font-size: 14px;
  color: var(--ink-3);
}
</style>
