<script setup lang="ts">
import ChipsNav from '../ChipsNav.vue';
import CardGrid from '../CardGrid.vue';
import Pagination from '../Pagination.vue';
import PageTitle from '../PageTitle.vue';
import type { Post } from '#shared/types/post';

// 列表页通用外壳：标题 + 统计 + 快捷入口 + 卡片网格 + 分页
defineProps<{
  title: string;
  posts: Post[];
  current: number;
  totalPages: number;
  firstHref: string;
  pagePrefix: string;
  /** 标题下方的一行说明，如「共 12 篇 · 第 1 / 2 页」 */
  summary?: string;
  /** 隐藏分类/标签/归档快捷入口（分类、标签详情页使用） */
  hideChips?: boolean;
}>();
</script>

<template>
  <div class="mx-auto max-w-page">
    <!-- 页面级顶部插槽（如新闻页的搜索框） -->
    <slot name="top" />

    <header
      class="list-head mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-b border-default pb-5"
    >
      <div class="min-w-0">
        <PageTitle :title="title" />
        <p v-if="summary" class="mt-1.5 text-[13px] text-dimmed">{{ summary }}</p>
      </div>
      <ChipsNav v-if="!hideChips" />
    </header>

    <CardGrid :posts="posts" />

    <Pagination
      :current="current"
      :total-pages="totalPages"
      :first-href="firstHref"
      :page-prefix="pagePrefix"
    />
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .list-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
