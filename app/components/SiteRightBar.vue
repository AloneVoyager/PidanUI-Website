<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { SOCIAL_LINKS } from '~/data/socialLinks';
import { latestPosts, useAllPosts } from '~/composables/usePosts';
import {
  activeMobileDrawer,
  drawerOffset,
  drawerProgress,
  isDrawerDragging,
  toggleMobileDrawer,
} from '~/composables/useMobileDrawer';

// 右侧小部件栏：最新动态 + 关注我们 + 项目状态（搜索框已移至新闻页顶部）
const allPosts = useAllPosts();
const posts = computed(() => latestPosts(allPosts.value, 3));

// 关注我们：站内相对路径补 base，订阅源补 alternate / Atom MIME
const socialLinks = SOCIAL_LINKS.map((link) => {
  const isFeed = link.url.endsWith('.xml');
  return {
    ...link,
    href: link.url.startsWith('/') ? withBase(link.url) : link.url,
    rel: isFeed ? 'alternate noopener' : 'noopener',
    type: isFeed ? 'application/atom+xml' : undefined,
  };
});

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
        <NuxtLink v-for="post in posts" :key="post.url" :to="post.url">
          {{ post.title }}
        </NuxtLink>
        <p v-if="!posts.length" class="widget-empty">暂无动态</p>
      </div>
      <NuxtLink class="widget-more" :to="'/posts/'">
        查看全部新闻
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </NuxtLink>
    </section>

    <!-- 关注我们 -->
    <section class="widget">
      <h2 class="widget-title">关注我们</h2>
      <div class="social-links">
        <a
          v-for="link in socialLinks"
          :key="link.url"
          :href="link.href"
          target="_blank"
          :rel="link.rel"
          :type="link.type"
        >
          <i :class="link.iconClass" aria-hidden="true"></i>
          {{ link.name }}
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