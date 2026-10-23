<script setup lang="ts">
import { computed } from 'vue';
import PageTitle from '../PageTitle.vue';
import EmptyState from '../EmptyState.vue';
import { collectTerms, useAllPosts } from '~/composables/usePosts';

const allPosts = useAllPosts();
const terms = computed(() => collectTerms('categories', allPosts.value));
</script>

<template>
  <div class="mx-auto max-w-[1000px]">
    <PageTitle title="分类" />

    <div class="term-grid mt-5 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
      <NuxtLink
        v-for="term in terms"
        :key="term.name"
        class="flex items-center justify-between gap-3 rounded-(--radius-m) border border-default bg-default px-5 py-4 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand-600/30 hover:shadow-card"
        :to="term.path"
      >
        <span class="text-[15px] font-semibold text-default">{{ term.name }}</span>
        <span class="text-[13px] text-dimmed">{{ term.count }} 篇</span>
      </NuxtLink>
      <EmptyState v-if="!terms.length" text="暂无分类" />
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .term-grid {
    grid-template-columns: 1fr;
  }
}
</style>
