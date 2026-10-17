<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import type { Post } from '@/types';

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
  <a class="post-card" :href="withBase(post.url)">
    <div class="card-cover">
      <span v-if="post.stickypost" class="pin-badge">置顶</span>
      <img :src="coverSrc" :alt="post.title" loading="lazy" />
    </div>
    <div class="card-body">
      <span class="card-title">{{ post.title }}</span>
      <div class="card-meta">
        <time class="card-date">{{ post.date }}</time>
        <span v-if="post.categories.length" class="card-cat">{{ post.categories[0] }}</span>
      </div>
    </div>
    <i class="fa-solid fa-arrow-right card-arrow" aria-hidden="true"></i>
  </a>
</template>

<style scoped lang="scss">
@use 'variables' as *;
@use 'mixins' as *;

// ============================================================
// 文章卡片（紧凑横排）
//   新闻 / 分类 / 标签 / 搜索页 / 搜索对话框共用：横向缩略图 + 标题 + 元信息，
//   在同等高度内可容纳更多条目。
// ============================================================
.post-card {
  display: flex;
  align-items: stretch;
  min-height: 92px;
  overflow: hidden;
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-m;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    box-shadow: $shadow-card;
    border-color: rgba(255, 159, 26, 0.25);

    .card-arrow {
      color: $brand-deep;
      transform: translateX(3px);
    }
  }

  .card-cover {
    position: relative;
    flex: 0 0 128px;
    align-self: stretch;
    overflow: hidden;
    background: $bg;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
  }

  &:hover .card-cover img {
    transform: scale(1.04);
  }

  .pin-badge {
    position: absolute;
    top: 6px;
    left: 6px;
    z-index: 1;
    padding: 1px 8px;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    background: $brand-deep;
    border-radius: $radius-full;
  }

  .card-body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    padding: 12px 0 12px 14px;
  }

  .card-title {
    font-size: 14.5px;
    font-weight: 600;
    line-height: 1.45;
    color: $ink;
    @include clamp-lines(2);
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: $ink-3;
  }

  .card-cat {
    padding: 0 8px;
    font-size: 11.5px;
    line-height: 1.7;
    color: $brand-deep;
    background: $brand-soft;
    border-radius: $radius-full;
  }

  .card-arrow {
    flex: 0 0 auto;
    align-self: center;
    margin: 0 14px 0 10px;
    font-size: 14px;
    color: $ink-3;
    transition: color 0.25s ease, transform 0.25s ease;
  }
}

@include respond-below($bp-2xs) {
  .post-card {
    min-height: 84px;

    .card-cover {
      flex-basis: 96px;
    }

    .card-title {
      font-size: 14px;
    }

    .card-arrow {
      margin-right: 10px;
    }
  }
}
</style>
