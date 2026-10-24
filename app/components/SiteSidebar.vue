<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch, type CSSProperties } from 'vue';
import { SITE } from '#shared/site';
import {
  activeMobileDrawer,
  closeMobileDrawer,
  drawerOffset,
  drawerProgress,
  installMobileDrawerGestures,
  isDrawerDragging,
  toggleMobileDrawer,
} from '~/composables/useMobileDrawer';
import ThemeToggle from './ThemeToggle.vue';

// 左侧固定导航栏：品牌标识 + 四个导航项；移动端（≤960px）收起为抽屉
const route = useRoute();

const navOpen = computed(() => activeMobileDrawer.value === 'left');
const drawerStyle = computed(
  () =>
    ({
      '--drawer-progress': String(drawerProgress.value),
      '--drawer-offset': `${drawerOffset.value}px`,
      '--drawer-shadow-alpha': String(drawerProgress.value * 0.18),
      '--overlay-alpha': String(drawerProgress.value * 0.3),
      '--overlay-blur': `${drawerProgress.value * 4}px`,
    }) as CSSProperties,
);
let mobileBreakpoint: MediaQueryList | undefined;
let stopDrawerGestures: (() => void) | undefined;

const NAV_ITEMS = [
  { key: 'home', label: '首页', href: '/', icon: 'i-lucide-house' },
  { key: 'download', label: '下载', href: '/download', icon: 'i-lucide-download' },
  { key: 'news', label: '新闻', href: '/posts/', icon: 'i-lucide-newspaper' },
  { key: 'about', label: '关于', href: '/about', icon: 'i-lucide-info' },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]['key'];

/** 当前路径归属的导航分区（新闻分区包含 posts/categories/tags/archives/search） */
const activeKey = computed<NavKey | ''>(() => {
  const path = route.path;
  if (path === '/' || path.startsWith('/index')) return 'home';
  if (path.startsWith('/download')) return 'download';
  if (
    path.startsWith('/posts') ||
    path.startsWith('/categories') ||
    path.startsWith('/tags') ||
    path.startsWith('/archives') ||
    path.startsWith('/search')
  ) {
    return 'news';
  }
  if (path.startsWith('/about') || path.startsWith('/personality-test')) return 'about';
  return '';
});

function closeMenu() {
  closeMobileDrawer();
}

function toggleMenu() {
  toggleMobileDrawer('left');
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && activeMobileDrawer.value) {
    closeMenu();
  }
}

function onBreakpointChange(event: MediaQueryListEvent) {
  if (!event.matches) closeMenu();
}

// 路由切换时关闭抽屉
watch(
  () => route.fullPath,
  () => closeMenu(),
);

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
  stopDrawerGestures = installMobileDrawerGestures();
  mobileBreakpoint = window.matchMedia('(max-width: 960px)');
  mobileBreakpoint.addEventListener('change', onBreakpointChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  mobileBreakpoint?.removeEventListener('change', onBreakpointChange);
  stopDrawerGestures?.();
  closeMenu();
});
</script>

<template>
  <!-- 移动端汉堡按钮 -->
  <button
    class="menu-toggle"
    type="button"
    :aria-label="navOpen ? '关闭主导航' : '打开主导航'"
    :aria-expanded="navOpen"
    @click="toggleMenu"
  >
    <UIcon name="i-lucide-menu" class="size-5" aria-hidden="true" />
  </button>
  <!-- 遮罩 -->
  <div
    class="sidebar-overlay"
    :class="{ open: activeMobileDrawer !== null }"
    :style="drawerStyle"
    aria-hidden="true"
    @click="closeMenu"
  />

  <!-- 左侧导航 -->
  <aside
    class="sidebar-left"
    :class="{ open: navOpen, 'is-dragging': isDrawerDragging && navOpen }"
    :style="drawerStyle"
    aria-label="主导航"
  >
    <NuxtLink
      class="mb-6 flex items-center gap-2.5 px-2 text-[18px] font-bold text-default"
      :to="'/'"
      :aria-label="SITE.brand"
    >
      <img
        class="size-[34px] shrink-0 rounded-[10px] object-contain"
        :src="withBase('/images/logo.webp')"
        :alt="SITE.brand"
        width="34"
        height="34"
      />
      <span>{{ SITE.brand }}</span>
    </NuxtLink>

    <nav class="flex flex-col gap-2" aria-label="站点导航">
      <NuxtLink
        v-for="item in NAV_ITEMS"
        :key="item.key"
        class="flex items-center gap-3 rounded-(--radius-m) px-3 py-2.5 text-[14.5px] transition-colors"
        :class="
          activeKey === item.key
            ? 'bg-brand-soft font-semibold text-brand-600'
            : 'text-toned hover:bg-brand-a10 hover:text-brand-600'
        "
        :to="item.href"
        :aria-current="activeKey === item.key ? 'page' : undefined"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <ThemeToggle />
  </aside>
</template>