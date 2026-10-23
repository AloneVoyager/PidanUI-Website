<script setup lang="ts">
import { computed } from 'vue';
import ChipsNav from '../ChipsNav.vue';
import CardGrid from '../CardGrid.vue';
import Pagination from '../Pagination.vue';
import PageTitle from '../PageTitle.vue';
import type { Post } from '#shared/types/post';

// 列表页通用外壳：标题 + 快捷入口 + 卡片网格 + 分页
defineProps<{
  title: string;
  posts: Post[];
  current: number;
  totalPages: number;
  firstHref: string;
  pagePrefix: string;
  /** 隐藏分类/标签/归档快捷入口（分类、标签详情页使用） */
  hideChips?: boolean;
}>();
</script>

<template>
  <div class="mx-auto max-w-page">
    <!-- 页面级顶部插槽（如新闻页的搜索框） -->
    <slot name="top" />

    <div class="list-head mb-[22px] flex flex-wrap items-center justify-between gap-3.5">
      <PageTitle :title="title" />
      <ChipsNav v-if="!hideChips" />
    </div>

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
