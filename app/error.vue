<script setup lang="ts">
import type { NuxtError } from '#app';

// 自定义错误页：保留站点外壳（侧栏 / 抽屉 / 搜索），正文只渲染 404 视图
const props = defineProps<{ error: NuxtError }>();

// 非 404（如构建期异常）时也统一展示 404 视图，避免暴露堆栈
if (import.meta.dev && props.error?.statusCode !== 404) {
  console.error(props.error);
}
</script>

<template>
  <NuxtLayout>
    <NotFoundView />
  </NuxtLayout>
</template>
