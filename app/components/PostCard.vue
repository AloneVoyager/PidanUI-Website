<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '#shared/types/post';

const props = defineProps<{ post: Post }>();

// 封面：外链原样输出，站内相对路径补 base
const coverSrc = computed(() => {
  const cover = props.post.cover;
  if (!cover) return withBase('/images/default_cover.webp');
  if (/^(?:https?:|data:)/i.test(cover)) return cover;
  return withBase(cover.startsWith('/') ? cover : `/${cover}`);
});
</script>

<template>
  <!-- 紧凑横排卡片：新闻 / 分类 / 标签 / 搜索页 / 搜索对话框共用 -->
  <NuxtLink
    class="group card flex min-h-[92px] items-stretch overflow-hidden rounded-(--radius-m) border border-default bg-default transition-[border-color,box-shadow] duration-200 hover:border-brand-600/25 hover:shadow-card"
    :to="post.url"
  >
    <div class="relative w-32 flex-none self-stretch overflow-hidden bg-muted">
      <UBadge
        v-if="post.stickypost"
        class="absolute top-1.5 left-1.5 z-1"
        color="primary"
        size="sm"
        label="置顶"
      />
      <img
        class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        :src="coverSrc"
        :alt="post.title"
        loading="lazy"
      />
    </div>

    <div class="flex min-w-0 flex-auto flex-col justify-center gap-1.5 py-3 pr-0 pl-3.5">
      <span class="line-clamp-2 text-[14.5px] leading-[1.45] font-semibold text-default">
        {{ post.title }}
      </span>
      <div class="flex flex-wrap items-center gap-2 text-[12.5px] text-dimmed">
        <time>{{ post.date }}</time>
        <UBadge
          v-if="post.categories.length"
          variant="soft"
          color="primary"
          size="sm"
          :label="post.categories[0]"
        />
      </div>
    </div>

    <UIcon
      name="i-lucide-arrow-right"
      class="my-auto me-3.5 shrink-0 text-dimmed transition-colors group-hover:text-brand-600"
      aria-hidden="true"
    />
  </NuxtLink>
</template>

<style scoped>
/* 窄屏收紧缩略图与标题（断点与 tokens.css 的 2xs=480 对齐，
   仍手写媒体查询，避免与 960px 主断点的约定冲突） */
@media (max-width: 480px) {
  .card {
    min-height: 84px;
  }

  .card > div:first-child {
    width: 96px;
  }
}
</style>
