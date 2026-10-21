<script setup lang="ts">
import { computed } from 'vue';
import ListView from './ListView.vue';
import { pinnedFirst, useAllPosts, usePagedPosts } from '~/composables/usePosts';
import { termPagePrefix, termPath } from '#shared/utils/term';

const props = defineProps<{ name: string; page: number }>();

const allPosts = useAllPosts();

// 标签列表：置顶文章优先，其余按时间倒序
const source = () =>
  pinnedFirst(allPosts.value.filter((post) => post.tags.includes(props.name)));
const { pagePosts, page, totalPages } = usePagedPosts(() => props.page, source);

const title = computed(() => `标签：#${props.name}`);
</script>

<template>
  <ListView
    :title="title"
    :posts="pagePosts"
    :current="page"
    :total-pages="totalPages"
    :first-href="termPath('tags', name)"
    :page-prefix="termPagePrefix('tags', name)"
    hide-chips
  />
</template>