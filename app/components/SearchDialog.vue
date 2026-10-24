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

/**
 * 点结果里的文章 → 先收起弹窗再跳转。
 *
 * 不要用具体类名（如 `a.post-card`）判断：PostCard 的根节点类名会随样式重构
 * 变化，之前就因为从 `post-card` 改成 `card` 导致这里的判断永远不成立、
 * 点完文章弹窗不关。结果区域里只有「文章链接」这一种可点元素，
 * 因此任何带 href 的链接都视为命中。
 */
function onResultClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('a[href]')) closeSearchDialog();
}

// 兜底：无论以何种方式发生路由跳转（结果链接、键盘回车、程序化导航），
// 只要弹窗还开着就一并收起，避免它盖在新页面上。
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    if (searchDialogOpen.value) closeSearchDialog();
  },
);
</script>

<template>
  <UModal
    v-model:open="searchDialogOpen"
    title="搜索新闻"
    :ui="{
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
