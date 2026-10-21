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
  <NuxtLink class="post-card flex items-stretch" :to="post.url">
    <div class="card-cover">
      <span v-if="post.stickypost" class="pin-badge">置顶</span>
      <img :src="coverSrc" :alt="post.title" loading="lazy" />
    </div>
    <div class="card-body flex flex-col justify-center gap-1.5 min-w-0 flex-auto">
      <span class="card-title">{{ post.title }}</span>
      <div class="card-meta flex items-center gap-2">
        <time class="card-date">{{ post.date }}</time>
        <span v-if="post.categories.length" class="card-cat">{{ post.categories[0] }}</span>
      </div>
    </div>
    <i class="fa-solid fa-arrow-right card-arrow" aria-hidden="true"></i>
  </NuxtLink>
</template>

<style scoped>
/* ============================================================
   文章卡片（紧凑横排）
     新闻 / 分类 / 标签 / 搜索页 / 搜索对话框共用：横向缩略图 + 标题 + 元信息，
     在同等高度内可容纳更多条目。
   ============================================================ */
.post-card {
  min-height: 92px;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.post-card:hover {
  box-shadow: var(--shadow-card);
  border-color: rgba(255, 159, 26, 0.25);
}

.post-card:hover .card-arrow {
  color: var(--brand-deep);
  transform: translateX(3px);
}

.post-card .card-cover {
  position: relative;
  flex: 0 0 128px;
  align-self: stretch;
  overflow: hidden;
  background: var(--bg);
}

.post-card .card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.post-card:hover .card-cover img {
  transform: scale(1.04);
}

.post-card .pin-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 1;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: var(--brand-deep);
  border-radius: var(--radius-full);
}

.post-card .card-body {
  padding: 12px 0 12px 14px;
}

.post-card .card-title {
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--ink);
  /* 多行文本截断（原 clamp-lines mixin 展开） */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card .card-meta {
  font-size: 12.5px;
  color: var(--ink-3);
}

.post-card .card-cat {
  padding: 0 8px;
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--brand-deep);
  background: var(--brand-soft);
  border-radius: var(--radius-full);
}

.post-card .card-arrow {
  flex: 0 0 auto;
  align-self: center;
  margin: 0 14px 0 10px;
  font-size: 14px;
  color: var(--ink-3);
  transition: color 0.25s ease, transform 0.25s ease;
}

@media (max-width: 480px) {
  .post-card {
    min-height: 84px;
  }

  .post-card .card-cover {
    flex-basis: 96px;
  }

  .post-card .card-title {
    font-size: 14px;
  }

  .post-card .card-arrow {
    margin-right: 10px;
  }
}
</style>
