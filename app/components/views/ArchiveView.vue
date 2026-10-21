<script setup lang="ts">
import { computed, ref } from 'vue';
import CardGrid from '../CardGrid.vue';
import Pagination from '../Pagination.vue';
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
  <div class="archive-view">
    <div class="list-head">
      <h1 class="list-title">归档</h1>
      <p class="archive-total">
        共 {{ allPosts.length }} 篇文章 · {{ totalPages }} 个年份
      </p>
    </div>

    <h2 v-if="currentYear" class="archive-year">
      {{ currentYear }} 年
      <span class="year-count">{{ currentPosts.length }} 篇</span>
    </h2>

    <p v-if="!months.length" class="empty-state">暂无归档内容</p>

    <div v-else class="month-groups">
      <section
        v-for="month in months"
        :key="month.key"
        class="month-group"
        :class="{ open: isOpen(month.key) }"
      >
        <button
          class="month-head"
          type="button"
          :aria-expanded="isOpen(month.key)"
          @click="toggleMonth(month.key)"
        >
          <span class="month-name">{{ month.label }}</span>
          <span class="month-count">{{ month.posts.length }} 篇</span>
          <i class="fa-solid fa-chevron-down month-arrow" aria-hidden="true"></i>
        </button>
        <div class="month-body">
          <div class="month-body-inner">
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

<style scoped lang="scss">
@use 'variables' as *;
@use 'mixins' as *;

// ============================================================
// 归档页：按年分页，页内按月折叠分组
// ============================================================
.archive-view {
  max-width: $max-w;
  margin: 0 auto;
}

// 页面主标题（与列表 / 搜索 / 分类索引页保持一致）
.list-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px 14px;
  margin-bottom: 18px;
}

.list-title {
  font-size: clamp(24px, 3.6vw, 32px);
  font-weight: 700;
  color: $ink;
  letter-spacing: -0.01em;
}

.archive-total {
  font-size: 14px;
  color: $ink-3;
}

.archive-year {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 20px;
  font-weight: 700;
  color: $brand-deep;

  .year-count {
    font-size: 13px;
    font-weight: 500;
    color: $ink-3;
  }
}

.month-groups {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// 月份分组：点击头部展开 / 收起，动画与下载页手风琴一致
.month-group {
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid $line;
  border-radius: $radius-l;

  @include dark-mode {
    background: rgba(31, 31, 35, 0.6);
  }
}

.month-head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 2px;
  font: inherit;
  color: $ink;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: $brand-deep;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 159, 26, 0.45);
    outline-offset: 2px;
    border-radius: $radius-s;
  }

  .month-name {
    font-size: 15px;
    font-weight: 600;
  }

  .month-count {
    font-size: 12.5px;
    color: $ink-3;
  }

  .month-arrow {
    display: inline-block;
    margin-left: auto;
    font-size: 12px;
    color: $ink-3;
    transition: transform 0.3s ease;
  }
}

// 收起时箭头朝右
.month-group:not(.open) .month-arrow {
  transform: rotate(-90deg);
}

// 展开 / 收起动画：grid-template-rows 0fr ↔ 1fr，
// 高度随卡片数量自适应（无需写死 max-height），观感与下载页手风琴一致
.month-body {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.month-group:not(.open) .month-body {
  grid-template-rows: 0fr;
}

.month-body-inner {
  min-height: 0;
  overflow: hidden;
}

.month-grid {
  margin-bottom: 14px;
}

.empty-state {
  padding: 40px 0;
  font-size: 15px;
  color: $ink-3;
  text-align: center;
}

@include respond-below($bp-sm) {
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
