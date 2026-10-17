<script setup lang="ts">
import PostCard from './PostCard.vue';
import type { Post } from '@/types';

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
    <p v-if="!posts.length" class="empty-state">{{ emptyText }}</p>
    <template v-else>
      <PostCard v-for="post in posts" :key="post.url" :post="post" />
    </template>
  </div>
</template>

<style scoped lang="scss">
@use 'variables' as *;
@use 'mixins' as *;

// 紧凑卡片网格：新闻 / 分类 / 标签 / 搜索共用
// auto-fill 让窄屏自然降为单列，宽屏（搜索对话框）自动增加列数
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 40px 0;
  font-size: 15px;
  color: $ink-3;
  text-align: center;
}

@include respond-below($bp-sm) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
