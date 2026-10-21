<script setup lang="ts">
import PostCard from './PostCard.vue';
import EmptyState from './EmptyState.vue';
import type { Post } from '#shared/types/post';

withDefaults(
  defineProps<{
    posts: Post[];
    emptyText?: string;
  }>(),
  { emptyText: '暂无内容' },
);
</script>

<template>
  <div class="card-grid">
    <EmptyState v-if="!posts.length" :text="emptyText" />
    <template v-else>
      <PostCard v-for="post in posts" :key="post.url" :post="post" />
    </template>
  </div>
</template>

<style scoped>
/* 紧凑卡片网格：新闻 / 分类 / 标签 / 搜索共用
   auto-fill 让窄屏自然降为单列，宽屏（搜索对话框）自动增加列数 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
