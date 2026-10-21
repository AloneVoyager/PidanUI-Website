<script setup lang="ts">
import { computed } from 'vue';
import PageTitle from '../PageTitle.vue';
import EmptyState from '../EmptyState.vue';
import { collectTerms, useAllPosts } from '~/composables/usePosts';

const allPosts = useAllPosts();
const terms = computed(() => collectTerms('categories', allPosts.value));
</script>

<template>
  <div class="terms-view">
    <PageTitle title="分类" />

    <div class="term-grid">
      <NuxtLink v-for="term in terms" :key="term.name" class="term-card" :to="term.path">
        <span class="term-name">{{ term.name }}</span>
        <span class="term-count">{{ term.count }} 篇</span>
      </NuxtLink>
      <EmptyState v-if="!terms.length" text="暂无分类" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   分类索引页：卡片网格罗列全部分类
   ============================================================ */
.terms-view {
  max-width: 1000px;
  margin: 0 auto;
}

.term-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.term-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.term-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 159, 26, 0.3);
  box-shadow: var(--shadow-card);
}

.term-card .term-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}

.term-card .term-count {
  font-size: 13px;
  color: var(--ink-3);
}

@media (max-width: 768px) {
  .term-grid {
    grid-template-columns: 1fr;
  }
}
</style>
