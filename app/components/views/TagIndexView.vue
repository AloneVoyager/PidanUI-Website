<script setup lang="ts">
import { computed } from 'vue';
import PageTitle from '../PageTitle.vue';
import EmptyState from '../EmptyState.vue';
import { collectTerms, useAllPosts } from '~/composables/usePosts';

const allPosts = useAllPosts();
const terms = computed(() => collectTerms('tags', allPosts.value));
</script>

<template>
  <div class="terms-view">
    <PageTitle title="标签" />

    <div class="term-cloud">
      <NuxtLink
        v-for="term in terms"
        :key="term.name"
        class="tag-chip"
        :to="term.path"
      >
        #{{ term.name }}
        <span class="term-count">{{ term.count }}</span>
      </NuxtLink>
      <EmptyState v-if="!terms.length" text="暂无标签" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   标签索引页：标签云罗列全部标签
   ============================================================ */
.terms-view {
  max-width: 1000px;
  margin: 0 auto;
}

.term-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.term-cloud .tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  font-size: 14px;
  color: var(--ink-2);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.term-cloud .tag-chip:hover {
  color: var(--brand-deep);
  background: var(--brand-soft);
  border-color: rgba(255, 159, 26, 0.3);
}

.term-cloud .tag-chip .term-count {
  font-size: 12px;
  color: var(--ink-3);
}
</style>
