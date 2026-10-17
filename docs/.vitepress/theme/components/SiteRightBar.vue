<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { withBase } from 'vitepress';
import { SOCIAL_LINKS } from '@/config';
import { latestPosts } from '@/composables/usePosts';
import {
  activeMobileDrawer,
  drawerOffset,
  drawerProgress,
  isDrawerDragging,
  toggleMobileDrawer,
} from '@/composables/useMobileDrawer';

// 右侧小部件栏：最新动态 + 关注我们 + 项目状态（搜索框已移至新闻页顶部）
const posts = latestPosts(3);
const drawerOpen = computed(() => activeMobileDrawer.value === 'right');
const drawerStyle = computed(
  () =>
    ({
      '--drawer-progress': String(drawerProgress.value),
      '--drawer-offset': `${drawerOffset.value}px`,
      '--drawer-shadow-alpha': String(drawerProgress.value * 0.18),
    }) as CSSProperties,
);
</script>

<template>
  <button
    class="menu-toggle menu-toggle-right"
    type="button"
    :aria-label="drawerOpen ? '关闭侧边栏' : '打开侧边栏'"
    aria-controls="sidebar-right"
    :aria-expanded="drawerOpen"
    @click="toggleMobileDrawer('right')"
  >
    <i class="fa-solid fa-table-columns" aria-hidden="true"></i>
  </button>

  <aside
    id="sidebar-right"
    class="sidebar-right"
    :class="{ open: drawerOpen, 'is-dragging': isDrawerDragging && drawerOpen }"
    :style="drawerStyle"
    aria-label="侧边栏"
  >
    <!-- 最新动态 -->
    <section class="widget">
      <h2 class="widget-title">最新动态</h2>
      <div class="widget-list">
        <a v-for="post in posts" :key="post.url" :href="withBase(post.url)">
          {{ post.title }}
        </a>
        <p v-if="!posts.length" class="widget-empty">暂无动态</p>
      </div>
      <a class="widget-more" :href="withBase('/posts/')">
        查看全部新闻
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </a>
    </section>

    <!-- 关注我们 -->
    <section class="widget">
      <h2 class="widget-title">关注我们</h2>
      <div class="social-links">
        <a :href="withBase(SOCIAL_LINKS.RSS)" target="_blank" rel="alternate noopener" type="application/atom+xml">
          <i class="fa-solid fa-rss" aria-hidden="true"></i>
          RSS 订阅
        </a>
        <a :href="SOCIAL_LINKS.GitHub" target="_blank" rel="noopener">
          <i class="fa-brands fa-github" aria-hidden="true"></i>
          GitHub
        </a>
        <a :href="SOCIAL_LINKS.Bilibili" target="_blank" rel="noopener">
          <i class="fa-brands fa-bilibili" aria-hidden="true"></i>
          哔哩哔哩
        </a>
        <a :href="SOCIAL_LINKS.QQ群" target="_blank" rel="noopener">
          <i class="fa-brands fa-qq" aria-hidden="true"></i>
          QQ 交流群
        </a>
        <a :href="SOCIAL_LINKS.Alternate" target="_blank" rel="noopener">
          <i class="fa-solid fa-globe" aria-hidden="true"></i>
          另一个 PidanUI 官网
        </a>
      </div>
    </section>

    <!-- 项目状态 -->
    <section class="widget">
      <h2 class="widget-title">项目状态</h2>
      <p class="widget-note">PidanUI 项目组持续维护中，欢迎加入我们。</p>
    </section>
  </aside>
</template>