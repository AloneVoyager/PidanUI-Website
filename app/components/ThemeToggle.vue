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

const label = computed(() => LABELS[mode.value]);
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :title="`当前：${label}（点击切换）`"
    :aria-label="`切换主题，当前${label}`"
    @click="cycle"
  >
    <span class="toggle-icon" aria-hidden="true">
      <i v-if="mode === 'auto'" class="fa-solid fa-display"></i>
      <i v-else-if="mode === 'light'" class="fa-solid fa-sun"></i>
      <i v-else class="fa-solid fa-moon"></i>
    </span>
    <span class="toggle-label">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
@use 'variables' as *;

// 置于左侧栏底部（父级为 flex column，用 margin-top:auto 顶到底）
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding: 10px 12px;
  font-size: 14px;
  color: $ink-2;
  background: transparent;
  border: 1px solid $line;
  border-radius: $radius-m;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  .toggle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;

    i {
      font-size: 15px;
    }
  }

  &:hover {
    color: $brand-deep;
    background: rgba(255, 197, 61, 0.1);
    border-color: rgba(255, 159, 26, 0.35);
  }
}
</style>
