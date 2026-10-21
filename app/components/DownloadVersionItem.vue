<script setup lang="ts">
import { ref } from 'vue';
import type { DownloadVersion } from '#shared/types/download';

const props = defineProps<{
  version: DownloadVersion;
  expanded: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

type ImgState = 'placeholder' | 'image' | 'error';

const hasImage = !!props.version.image && props.version.image.trim() !== '';
const imgState = ref<ImgState>('placeholder');

function onImgLoad() {
  imgState.value = 'image';
}

function onImgError() {
  imgState.value = 'error';
}
</script>

<template>
  <div class="accordion-item" :class="{ active: expanded }">
    <button class="accordion-header" type="button" :aria-expanded="expanded" @click="emit('toggle')">
      <span class="header-left flex flex-1 min-w-0 items-center flex-wrap gap-3.5">
        <span class="type">{{ version.type || '版本' }}</span>
        <span v-if="version.version" class="ver">{{ version.version }}</span>
        <span v-if="version.fileSize" class="size-tag">{{ version.fileSize }}</span>
      </span>
      <span class="header-right flex shrink-0 items-center gap-2.5">
        <span class="status-dot" aria-hidden="true"></span>
        <span class="arrow" aria-hidden="true">
          <i class="fa-solid fa-chevron-down"></i>
        </span>
      </span>
    </button>

    <div class="accordion-body">
      <div class="body-inner">
        <!-- 配图 / 占位 / 失败态 -->
        <div class="body-image">
          <img
            v-if="hasImage && imgState !== 'error'"
            :src="version.image"
            :alt="(version.type || '版本') + ' 配图'"
            :style="{ display: imgState === 'image' ? 'block' : 'none' }"
            loading="lazy"
            @load="onImgLoad"
            @error="onImgError"
          />
          <div v-if="imgState === 'placeholder'" class="image-state">
            <i class="fa-regular fa-image" aria-hidden="true"></i>
            <span>{{ hasImage ? '加载中...' : '暂无配图' }}</span>
          </div>
          <div v-if="imgState === 'error'" class="image-state error">
            <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            <span>图片加载失败</span>
          </div>
        </div>

        <!-- 描述 -->
        <p class="body-desc">{{ version.description || '暂无描述' }}</p>

        <!-- 元信息 -->
        <div class="body-meta flex flex-wrap justify-center gap-x-8 gap-y-4">
          <span class="meta-item">
            <i class="fa-regular fa-file-lines" aria-hidden="true"></i>
            <span class="label">大小</span>
            <span class="value">{{ version.fileSize || '--' }}</span>
          </span>
          <span class="meta-item">
            <i class="fa-regular fa-calendar-days" aria-hidden="true"></i>
            <span class="label">更新</span>
            <span class="value">{{ version.updateDate || '--' }}</span>
          </span>
        </div>

        <!-- 下载：有直链 → <a> 新标签打开；无直链 → 禁用 -->
        <a
          v-if="version.downloadUrl"
          class="body-download-btn"
          :href="version.downloadUrl"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-solid fa-download" aria-hidden="true"></i>
          <span>下载</span>
        </a>
        <button v-else class="body-download-btn" type="button" disabled>
          <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
          <span>暂无链接</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---- 手风琴 item（单个版本块） ---- */
.accordion-item {
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-l);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.accordion-item:hover {
  border-color: rgba(255, 159, 26, 0.25);
  box-shadow: var(--shadow-card);
}

.accordion-item.active {
  border-color: var(--brand-deep);
  box-shadow: 0 4px 24px rgba(255, 159, 26, 0.12);
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 18px 24px;
  color: inherit;
  text-align: left;
  background: transparent;
  border: none;
  transition: background 0.2s ease;
}

.accordion-header:hover {
  background: rgba(255, 197, 61, 0.06);
}

.header-left .type {
  font-size: 17px;
  font-weight: 600;
  color: var(--ink);
}

.header-left .ver,
.header-left .size-tag {
  padding: 0 12px;
  font-size: 13px;
  line-height: 26px;
  color: var(--ink-3);
  background: var(--bg);
  border-radius: var(--radius-full);
}

.header-left .ver {
  font-size: 14px;
  color: var(--ink-2);
}

.header-right .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
  transition: background 0.3s ease;
}

.header-right .arrow {
  transition: transform 0.3s ease;
}

.header-right .arrow i {
  font-size: 15px;
  color: var(--ink-3);
  transition: color 0.2s ease;
}

.accordion-item.active .header-right .status-dot {
  background: var(--brand-deep);
}

.accordion-item.active .header-right .arrow {
  transform: rotate(180deg);
}

.accordion-item.active .header-right .arrow i {
  color: var(--brand-deep);
}

.accordion-body {
  max-height: 0;
  padding: 0 24px;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), padding 0.3s ease;
}

.accordion-item.active .accordion-body {
  max-height: 1400px;
  padding: 0 24px 24px;
}

/* 禁用 JavaScript 时强制展开所有手风琴：点击头部展开依赖 JS toggle，
   把 max-height 设为 none 让所有内容立即可读。
   顶层 html 选择器 Vue scoped 不会加 data-v-xxx 前缀，仍能命中 */
html:not(.js) .accordion-item .accordion-body {
  max-height: none;
  padding: 0 24px 24px;
}

html:not(.js) .accordion-item .accordion-header {
  cursor: default;
}

.body-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 4px;
}

.body-image {
  width: 100%;
  max-width: 560px;
  overflow: hidden;
  background: var(--bg);
  border-radius: var(--radius-m);
}

.body-image img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.body-image .image-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  aspect-ratio: 16 / 9;
  color: var(--ink-3);
  background: var(--bg);
}

.body-image .image-state i {
  font-size: 40px;
}

.body-image .image-state span {
  font-size: 13px;
}

.body-image .image-state.error i {
  color: #ef4444;
}

.body-desc {
  max-width: 560px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink-2);
  text-align: center;
}

.body-meta {
  font-size: 14px;
  color: var(--ink-3);
}

.body-meta .meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.body-meta .meta-item i {
  font-size: 14px;
}

.body-meta .meta-item .value {
  font-weight: 500;
  color: var(--ink);
}

.body-download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 160px;
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: var(--brand-grad);
  border: none;
  border-radius: 60px;
  box-shadow: var(--shadow-brand);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.body-download-btn i {
  font-size: 16px;
}

.body-download-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  background: linear-gradient(135deg, #94a3b8, #64748b);
  box-shadow: none;
}

.body-download-btn:disabled:hover {
  transform: none;
}

@media (max-width: 640px) {
  .accordion-header {
    padding: 14px 16px;
  }

  .header-left .type {
    font-size: 15px;
  }

  .accordion-body {
    padding: 0 16px;
  }

  .accordion-item.active .accordion-body {
    padding: 0 16px 18px;
  }

  .body-download-btn {
    min-width: 140px;
    padding: 12px 28px;
    font-size: 15px;
  }

  .body-meta {
    gap: 12px 20px;
    font-size: 13px;
  }
}
</style>
