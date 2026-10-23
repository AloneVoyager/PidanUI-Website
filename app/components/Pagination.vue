<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  /** 当前页（从 1 开始） */
  current: number;
  /** 总页数 */
  totalPages: number;
  /** 第 1 页地址，如 / 、/archives/ 、/categories/公告 */
  firstHref: string;
  /** 第 n(>=2) 页地址前缀，如 /page/ 、/archives/page/ 、/categories/公告/page/ */
  pagePrefix: string;
}>();

/** 页码 → 地址（第 1 页没有前缀，直接回首页地址） */
function hrefFor(page: number): string {
  return page === 1 ? props.firstHref : `${props.pagePrefix}${page}`;
}

/**
 * 页码窗口：首尾页 + 当前页及其左右各一页，中间用省略号占位。
 * 站点分页地址是多段中文路径，UPagination 无法承载，因此保留自定义结构。
 */
const items = computed<(number | 'gap')[]>(() => {
  const total = props.totalPages;
  const current = props.current;
  const picked = new Set<number>([1, total, current]);

  for (const offset of [-1, 1, -2, 2]) {
    const page = current + offset;
    if (page >= 1 && page <= total) picked.add(page);
  }

  const pages = [...picked].sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];

  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) result.push('gap');
    result.push(page);
  });

  return result;
});
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="mt-8 flex flex-wrap items-center justify-center gap-1.5"
    aria-label="分页导航"
  >
    <UButton
      v-if="current > 1"
      :to="hrefFor(current - 1)"
      variant="ghost"
      color="neutral"
      size="sm"
      square
      icon="i-lucide-chevron-left"
      aria-label="上一页"
    />

    <template v-for="(item, index) in items" :key="`${item}-${index}`">
      <span v-if="item === 'gap'" class="px-1 text-[13px] text-dimmed" aria-hidden="true">…</span>
      <UButton
        v-else
        :to="hrefFor(item)"
        :variant="item === current ? 'solid' : 'ghost'"
        :color="item === current ? 'primary' : 'neutral'"
        size="sm"
        class="min-w-8 justify-center"
        :label="String(item)"
        :aria-current="item === current ? 'page' : undefined"
        :aria-label="`第 ${item} 页`"
      />
    </template>

    <UButton
      v-if="current < totalPages"
      :to="hrefFor(current + 1)"
      variant="ghost"
      color="neutral"
      size="sm"
      square
      icon="i-lucide-chevron-right"
      aria-label="下一页"
    />
  </nav>
</template>
