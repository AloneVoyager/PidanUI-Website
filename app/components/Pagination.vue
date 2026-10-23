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

// 分页地址是多段中文路径 + 可能带锚点，UPagination 无法承载，
// 因此保留自定义的上一页/下一页结构，只把按钮换成 UButton。
</script>

<template>
  <nav v-if="totalPages > 1" class="mt-7 flex items-center justify-center gap-3.5" role="navigation">
    <UButton
      v-if="current > 1"
      :to="prevHref"
      variant="soft"
      color="primary"
      size="sm"
      rounded-full
      icon="i-lucide-arrow-left"
      label="上一页"
    />
    <span class="text-[13px] text-dimmed">{{ current }} / {{ totalPages }}</span>
    <UButton
      v-if="current < totalPages"
      :to="nextHref"
      variant="soft"
      color="primary"
      size="sm"
      rounded-full
      trailing-icon="i-lucide-arrow-right"
      label="下一页"
    />
  </nav>
</template>
