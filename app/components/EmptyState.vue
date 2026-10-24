<script setup lang="ts">
// 列表 / 归档 / 分类索引 / 标签索引页共用的空状态文案。
// col-span-full 在非 grid 父级下会被忽略，因此四个调用点可以共用同一份样式。
withDefaults(
  defineProps<{
    text?: string;
  }>(),
  { text: '暂无内容' },
);
</script>

<template>
  <p class="col-span-full py-10 text-center text-[15px] text-dimmed">{{ text }}</p>
</template>
