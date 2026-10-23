<script setup lang="ts">
import { computed } from 'vue';
import { useTheme, type ThemeMode } from '~/composables/useTheme';

// 主题切换按钮：三态循环（跟随系统 → 浅色 → 深色），图标随当前模式变化
const { mode, cycle } = useTheme();

const LABELS: Record<ThemeMode, string> = {
  auto: '跟随系统',
  light: '浅色模式',
  dark: '深色模式',
};

const ICONS: Record<ThemeMode, string> = {
  auto: 'i-lucide-monitor',
  light: 'i-lucide-sun',
  dark: 'i-lucide-moon',
};

const label = computed(() => LABELS[mode.value]);
const icon = computed(() => ICONS[mode.value]);
</script>

<template>
  <!-- mt-auto：父级是 flex column，把按钮顶到左栏底部 -->
  <UButton
    class="mt-auto w-full justify-start gap-3 px-3 py-2.5"
    variant="outline"
    color="neutral"
    :icon="icon"
    :label="label"
    :title="`当前：${label}（点击切换）`"
    :aria-label="`切换主题，当前${label}`"
    @click="cycle"
  />
</template>
