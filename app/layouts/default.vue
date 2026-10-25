<script setup lang="ts">
import { setupScrollReveal } from '~/composables/useScrollReveal';

// ============================================================
// 全站壳层：进度条 + 左侧栏 + 主滚动区 + 右侧栏 + 搜索弹窗
//
// 与 VitePress 时期的 Layout.vue 差异：按 frontmatter.layout 分派视图的逻辑
// 已下沉到 app/pages/**（路由即布局），这里只保留外壳与全站钩子。
// ============================================================

// 注意：这里**不能**用顶层 await。layout 不在 <Suspense> 包裹范围内，
// 异步 setup 会让客户端 hydration 一直挂起（表现为页面卡死）。
// 文章列表改由 plugins/posts.ts 在应用创建阶段填充（见该文件注释）。
const nuxtApp = useNuxtApp();
const route = useRoute();
const {
  progress,
  active: progressActive,
  done: progressDone,
  completeRendering,
  start,
  markPageLoaded,
} = usePageProgress();

// out-in 过渡下，入场开始 = 旧页面已离场；此时复位唯一滚动容器
function resetScroller(): void {
  if (import.meta.server) return;
  if (window.location.hash) return;
  document.querySelector<HTMLElement>('.site-main')?.scrollTo({ top: 0, behavior: 'auto' });
}

const offLoadingStart = nuxtApp.hook('page:loading:start', () => start(false));
const offLoadingEnd = nuxtApp.hook('page:loading:end', () => markPageLoaded());
const offTransitionFinish = nuxtApp.hook('page:transition:finish', resetScroller);
// 新页面已挂载：重新扫描滚动淡入目标，并让进度条等字体 / 图片就绪后收尾
const offPageFinish = nuxtApp.hook('page:finish', () => {
  setupScrollReveal();
  completeRendering();
  // 带 hash 的跨页导航：此时新页 DOM 已就绪，交给 usePostEnhance 精确对齐
  // （router.options.ts 只负责「不复位」，不直接滚，避免目标节点还没渲染出来）
  const hash = route.hash;
  if (hash) {
    document.dispatchEvent(new CustomEvent('pidan:anchor', { detail: hash }));
  }
});

onMounted(() => {
  resetScroller();
  setupScrollReveal();
  completeRendering();
});

onBeforeUnmount(() => {
  offLoadingStart();
  offLoadingEnd();
  offTransitionFinish();
  offPageFinish();
});
</script>

<template>
  <PageProgress :progress="progress" :active="progressActive" :done="progressDone" />
  <!-- 长文阅读进度条（与上面的路由加载条同位、下一层） -->
  <ReadingProgress />

  <SiteSidebar />

  <!-- 主内容地标：浏览器阅读模式据此定位正文，忽略侧栏等噪声 -->
  <main id="content" class="site-main" role="main">
    <slot />
  </main>

  <SiteRightBar />
  <BackToTop />
  <SearchDialog />
</template>
