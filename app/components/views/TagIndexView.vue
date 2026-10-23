<script setup lang="ts">
import { computed } from 'vue';
import PageTitle from '../PageTitle.vue';
import EmptyState from '../EmptyState.vue';
import { collectTerms, useAllPosts } from '~/composables/usePosts';

const allPosts = useAllPosts();
const terms = computed(() => collectTerms('tags', allPosts.value));
</script>

<template>
  <div class="mx-auto max-w-[1000px]">
    <PageTitle title="标签" />

    <!-- 标签云：胶囊尺寸随文字长度自然伸缩 -->
    <div class="mt-5 flex flex-wrap gap-3">
      <NuxtLink
        v-for="term in terms"
        :key="term.name"
        class="inline-flex items-center gap-1.5 rounded-full border border-default bg-default px-[18px] py-2 text-sm text-toned transition-colors duration-200 hover:border-brand-600/30 hover:bg-brand-soft hover:text-brand-600"
        :to="term.path"
      >
        #{{ term.name }}
        <span class="text-xs text-dimmed">{{ term.count }}</span>
      </NuxtLink>
      <EmptyState v-if="!terms.length" text="暂无标签" />
    </div>
  </div>
</template>
