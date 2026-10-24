<script setup lang="ts">
import { watch } from 'vue';
import NewsSearchBox from './NewsSearchBox.vue';
import SearchResults from './SearchResults.vue';
import {
  clearSearchKeyword,
  closeSearchDialog,
  restoreSearchDialogFocus,
  searchDialogOpen,
} from '~/composables/useSearch';

// 容器交给 UModal：焦点陷阱、ESC、遮罩点击、滚动锁都由它处理，
// 这里只保留「关闭后清空关键词 + 把焦点还给触发元素」这两件业务事。
watch(searchDialogOpen, (open) => {
  if (open) return;
  clearSearchKeyword();
  // UModal 会把焦点还给它的触发元素；我们的 opener 可能是任意按钮，
  // 因此下一帧再兜底聚焦一次（opener 未记录时此调用是空操作）。
  requestAnimationFrame(restoreSearchDialogFocus);
});

function onResultClick(event: MouseEvent): void {
  if (event.target instanceof Element && event.target.closest('a.post-card')) {
    closeSearchDialog();
  }
}
</script>

<template>
  <UModal
    v-model:open="searchDialogOpen"
    title="搜索新闻"
    :ui="{
      overlay: 'fixed inset-0 bg-[rgba(12,16,24,0.58)] backdrop-blur-[4px]',
      content: 'w-[min(960px,calc(100vw-32px))] max-w-none rounded-[20px]',
      header: 'p-6 pb-2',
      body: 'p-6 pt-0',
    }"
  >
    <template #body>
      <NewsSearchBox autofocus />
      <div class="max-h-[min(58vh,640px)] overflow-y-auto" @click="onResultClick">
        <SearchResults />
      </div>
    </template>
  </UModal>
</template>
