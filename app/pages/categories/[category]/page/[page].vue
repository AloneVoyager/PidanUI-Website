<script setup lang="ts">
// 文章列表是各列表页与分页校验的数据前提，先确保已就绪
await fetchAllPosts();
const allPosts = useAllPosts();

/** 路由参数解码：PreRender 阶段部分路径段仍是百分号编码，这里容错处理 */
function decodeParam(value: unknown): string {
  const raw = String(value ?? '');
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

import { PAGE_SIZE } from '#shared/site';
import { withPageSuffix } from '~/composables/usePageSeo';

const route = useRoute();
const name = computed(() => decodeParam(route.params.category));
const page = computed(() => Math.floor(Number(route.params.page)) || 1);

const matchCount = computed(
  () => allPosts.value.filter((post) => post.categories.includes(name.value)).length,
);
const totalPages = computed(() => Math.max(1, Math.ceil(matchCount.value / PAGE_SIZE)));

if (!name.value || !matchCount.value || page.value < 2 || page.value > totalPages.value) {
  throw createError({ statusCode: 404, message: '分页不存在', fatal: true });
}

usePageSeo(
  computed(() => withPageSuffix(`分类：${name.value}`, page.value)),
  '按分类浏览 PidanUI 新闻与公告。',
);
</script>

<template>
  <CategoryView :name="name" :page="page" />
</template>
