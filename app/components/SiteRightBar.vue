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
    <UIcon name="i-lucide-panel-right" class="size-5" aria-hidden="true" />
  </button>

  <aside
    id="sidebar-right"
    class="sidebar-right"
    :class="{ open: drawerOpen, 'is-dragging': isDrawerDragging && drawerOpen }"
    :style="drawerStyle"
    aria-label="侧边栏"
  >
    <!-- 最新动态 -->
    <section class="mb-4 rounded-(--radius-l) border border-default bg-muted p-4">
      <h2 class="mb-3 text-[13px] font-bold tracking-[0.5px] text-dimmed uppercase">最新动态</h2>
      <div class="flex flex-col">
        <NuxtLink
          v-for="post in posts"
          :key="post.url"
          class="line-clamp-2 py-1.5 text-sm text-toned transition-colors hover:text-brand-600"
          :to="post.url"
        >
          {{ post.title }}
        </NuxtLink>
        <p v-if="!posts.length" class="text-[13px] text-dimmed">暂无动态</p>
      </div>
      <!-- 浅底深字：底色用品牌浅黄（深色下自动转深棕），文字用更深的品牌色，
           比实心橙底更轻，也比纯胶囊更有按钮感。 -->
      <UButton
        class="mt-3 bg-brand-soft py-2 text-brand-800 hover:bg-brand-100 dark:text-brand-200 dark:hover:bg-brand-900"
        to="/posts/"
        variant="soft"
        color="primary"
        size="md"
        block
        trailing-icon="i-lucide-arrow-right"
        label="查看全部新闻"
      />
    </section>

    <!-- 关注我们 -->
    <section class="mb-4 rounded-(--radius-l) border border-default bg-muted p-4">
      <h2 class="mb-3 text-[13px] font-bold tracking-[0.5px] text-dimmed uppercase">关注我们</h2>
      <div class="flex flex-col gap-2.5">
        <a
          v-for="link in socialLinks"
          :key="link.url"
          class="flex items-center gap-2.5 rounded-(--radius-m) border border-default bg-default px-2.5 py-2 text-sm text-toned transition-colors hover:border-brand-600/35 hover:text-brand-600"
          :href="link.href"
          target="_blank"
          :rel="link.rel"
          :type="link.type"
        >
          <UIcon :name="link.icon" class="size-4 shrink-0" aria-hidden="true" />
          {{ link.name }}
        </a>
      </div>
    </section>

    <!-- 项目状态 -->
    <section class="mb-4 rounded-(--radius-l) border border-default bg-muted p-4">
      <h2 class="mb-3 text-[13px] font-bold tracking-[0.5px] text-dimmed uppercase">项目状态</h2>
      <p class="text-[13.5px] text-toned">PidanUI 项目组持续维护中，欢迎加入我们。</p>
    </section>
  </aside>
</template>