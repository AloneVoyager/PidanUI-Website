<script setup lang="ts">
import { computed, ref } from 'vue';
import CardGrid from '../CardGrid.vue';
import Pagination from '../Pagination.vue';
import PageTitle from '../PageTitle.vue';
import EmptyState from '../EmptyState.vue';
import { useAllPosts } from '~/composables/usePosts';
import type { Post } from '#shared/types/post';

const props = defineProps<{ page: number }>();

const allPosts = useAllPosts();

interface MonthGroup {
  key: string;
  label: string;
  posts: Post[];
}

/**
 * 归档：按年份分页，每年一页。
 * 页内按月分组，每组可折叠（动画与下载页手风琴一致）；
 * 文章卡片与新闻 / 分类 / 标签 / 搜索页共用同一套紧凑卡片。
 */
const years = computed<[string, Post[]][]>(() => {
  const map = new Map<string, Post[]>();
  for (const post of allPosts.value) {
    const year = post.date.slice(0, 4) || '未知';
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(post);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
});

const totalPages = computed(() => Math.max(1, years.value.length));

const page = computed(() => {
  const raw = Math.floor(Number(props.page));
  if (!Number.isFinite(raw) || raw < 1) return 1;
  return Math.min(raw, totalPages.value);
});

const currentYear = computed(() => years.value[page.value - 1]?.[0] ?? '');

const currentPosts = computed(() => years.value[page.value - 1]?.[1] ?? []);

/** 页内按月分组（文章已按时间倒序，分组后顺序天然正确） */
const months = computed<MonthGroup[]>(() => {
  const map = new Map<string, MonthGroup>();
  for (const post of currentPosts.value) {
    const key = post.date.slice(0, 7);
    let group = map.get(key);
    if (!group) {
      const month = Number(key.slice(5, 7));
      group = { key, label: `${month || key.slice(5)} 月`, posts: [] };
      map.set(key, group);
    }
    group.posts.push(post);
  }
  return [...map.values()];
});

// 默认全部展开；记录被用户收起的月份
const collapsed = ref<Set<string>>(new Set());

function isOpen(key: string): boolean {
  return !collapsed.value.has(key);
}

function toggleMonth(key: string): void {
  const next = new Set(collapsed.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  collapsed.value = next;
}
</script>

<template>
  <div class="mx-auto max-w-page">
    <div class="list-head mb-[18px] flex flex-wrap items-baseline justify-between gap-x-3.5 gap-y-2.5">
      <PageTitle title="归档" />
      <p class="text-sm text-dimmed">
        共 {{ allPosts.length }} 篇文章 · {{ totalPages }} 个年份
      </p>
    </div>

    <h2
      v-if="currentYear"
      class="mb-3.5 flex items-baseline gap-2.5 text-xl font-bold text-brand-600"
    >
      {{ currentYear }} 年
      <span class="text-[13px] font-medium text-dimmed">{{ currentPosts.length }} 篇</span>
    </h2>

    <EmptyState v-if="!months.length" text="暂无归档内容" />

    <div v-else class="flex flex-col gap-3">
      <section
        v-for="month in months"
        :key="month.key"
        class="month-group rounded-(--radius-l) border border-default bg-default px-3.5"
        :class="{ open: isOpen(month.key) }"
      >
        <button
          class="month-head flex w-full items-center gap-2.5 rounded-(--radius-s) py-3 text-left text-[15px] font-semibold text-default transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600/45"
          type="button"
          :aria-expanded="isOpen(month.key)"
          @click="toggleMonth(month.key)"
        >
          <span>{{ month.label }}</span>
          <span class="text-[12.5px] font-normal text-dimmed">{{ month.posts.length }} 篇</span>
          <UIcon
            name="i-lucide-chevron-down"
            class="month-arrow ms-auto text-dimmed"
            aria-hidden="true"
          />
        </button>
        <div class="month-body">
          <div class="min-h-0 overflow-hidden">
            <CardGrid class="month-grid" :posts="month.posts" />
          </div>
        </div>
      </section>
    </div>

    <Pagination
      :current="page"
      :total-pages="totalPages"
      first-href="/archives/"
      page-prefix="/archives/page/"
    />
  </div>
</template>

<style scoped>
/* 展开 / 收起动画：grid-template-rows 0fr ↔ 1fr，
   高度随卡片数量自适应（无需写死 max-height）。
   这两个状态类必须留在 CSS 里：open/closed 是父级的 class 切换，
   工具类无法表达「子树状态改变时才过渡」。 */
.month-body {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.month-group:not(.open) .month-body {
  grid-template-rows: 0fr;
}

.month-arrow {
  transition: transform 0.3s ease;
}

.month-group:not(.open) .month-arrow {
  transform: rotate(-90deg);
}

.month-grid {
  margin-bottom: 14px;
}

@media (max-width: 768px) {
  .list-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .month-group {
    padding: 0 10px;
  }

  .month-grid {
    margin-bottom: 10px;
  }
}
</style>
