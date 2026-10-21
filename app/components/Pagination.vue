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

const prevHref = computed(() =>
  props.current <= 2 ? props.firstHref : `${props.pagePrefix}${props.current - 1}`,
);
const nextHref = computed(() => `${props.pagePrefix}${props.current + 1}`);
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" role="navigation">
    <NuxtLink v-if="current > 1" class="page-btn" :to="prevHref">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      上一页
    </NuxtLink>
    <span class="page-info">{{ current }} / {{ totalPages }}</span>
    <NuxtLink v-if="current < totalPages" class="page-btn" :to="nextHref">
      下一页
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </NuxtLink>
  </nav>
</template>

<style scoped lang="scss">
@use 'variables' as *;

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 28px;

  .page-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 18px;
    font-size: 13px;
    color: $brand-deep;
    background: $brand-soft;
    border-radius: $radius-full;
    transition: background 0.25s ease;

    &:hover {
      background: rgba(255, 159, 26, 0.2);
    }

    &.disabled {
      color: $ink-3;
      background: $bg;
      cursor: not-allowed;
    }
  }

  .page-info {
    font-size: 13px;
    color: $ink-3;
  }
}
</style>
