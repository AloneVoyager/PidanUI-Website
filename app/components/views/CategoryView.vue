<script setup lang="ts">
import { computed } from 'vue';
import ListView from './ListView.vue';
import { pinnedFirst, useAllPosts, usePagedPosts } from '~/composables/usePosts';
import { termPagePrefix, termPath } from '#shared/utils/term';

const props = defineProps<{ name: string; page: number }>();

const allPosts = useAllPosts();

// 分类列表：置顶文章优先，其余按时间倒序
const source = () =>
  pinnedFirst(allPosts.value.filter((post) => post.categories.includes(props.name)));
const { pagePosts, page, totalPages } = usePagedPosts(() => props.page, source);

const title = computed(() => `分类：${props.name}`);
</script>

<template>
  <ListView
    :title="title"
    :posts="pagePosts"
    :current="page"
    :total-pages="totalPages"
    :first-href="termPath('categories', name)"
    :page-prefix="termPagePrefix('categories', name)"
    hide-chips
  />
</template>