<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import CardGrid from './CardGrid.vue';
import { searchKeyword } from '~/composables/useSearch';
import type { Post } from '#shared/types/post';

// 检索语料是 nuxt generate 构建期固定的静态文件（/api/search.json），
// 内容只随部署更新。此前每次打开搜索弹窗 / 进入搜索页都会重新下载全量
// 语料，这里按「会话内只请求一次」复用结果；请求失败时不缓存（复位
// Promise），下次打开仍按原行为重试，不会把失败结果留成空语料。
let corpusRequest: Promise<Post[]> | null = null;

function loadCorpus(): Promise<Post[]> {
  corpusRequest ||= $fetch<Post[]>(withBase('/api/search.json')).catch((error) => {
    corpusRequest = null;
    throw error;
  });
  return corpusRequest;
}

const corpus = shallowRef<Post[]>([]);

onMounted(async () => {
  try {
    // 只在真正打开搜索时才拉取（保持既有的「懒加载」行为，仅去重请求）
    corpus.value = await loadCorpus();
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
  <p class="mt-2 mb-4 flex items-center gap-2 text-sm text-dimmed" aria-live="polite">
    <UIcon name="i-lucide-search" class="size-4 shrink-0" aria-hidden="true" />
    {{ stats }}
  </p>
  <CardGrid v-if="tokens.length" :posts="hits" empty-text="未找到相关新闻" />
</template>
