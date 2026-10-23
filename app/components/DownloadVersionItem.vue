<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { DownloadVersion } from '#shared/types/download';

const props = defineProps<{
  version: DownloadVersion;
  open: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const hasImage = computed(() => !!props.version.image && props.version.image.trim() !== '');

/** 配图三态：加载中（骨架）→ 成功 / 失败（图标占位） */
const imgState = ref<'loading' | 'image' | 'error'>('loading');
const imgEl = ref<HTMLImageElement | null>(null);

/**
 * 挂载时兜底：SSR 输出后浏览器可能在 hydration 之前就把图加载完了，
 * 这时 @load 早已触发、监听器错过，状态会永远停在「加载中」。
 */
onMounted(() => {
  const el = imgEl.value;
  if (el?.complete) imgState.value = el.naturalWidth > 0 ? 'image' : 'error';
});

// 切换版本（或复用实例）时重置状态，避免上一张的失败态残留
watch(
  () => props.version.image,
  () => {
    imgState.value = 'loading';
  },
);
</script>

<template>
  <section class="version" :class="{ open }">
    <button
      class="flex w-full items-center gap-3 rounded-(--radius-s) px-1 py-4 text-left transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600/45"
      type="button"
      :aria-expanded="open"
      @click="emit('toggle')"
    >
      <span class="text-[17px] font-semibold text-default">{{ version.type || '版本' }}</span>
      <UBadge v-if="version.version" variant="soft" color="primary" size="sm" :label="version.version" />
      <UBadge v-if="version.fileSize" variant="outline" color="neutral" size="sm" :label="version.fileSize" />

      <UIcon
        name="i-lucide-chevron-down"
        class="version-arrow ms-auto shrink-0 text-dimmed"
        aria-hidden="true"
      />
    </button>

    <div class="version-body">
      <div class="min-h-0 overflow-hidden">
        <div class="version-grid">
          <!-- 配图：加载骨架 / 失败占位 / 无图占位 -->
          <div class="overflow-hidden rounded-(--radius-m) bg-muted">
            <div class="relative aspect-video">
              <USkeleton
                v-if="hasImage && imgState === 'loading'"
                class="absolute inset-0 size-full rounded-none"
              />
              <img
                v-if="hasImage && imgState !== 'error'"
                ref="imgEl"
                :src="version.image"
                :alt="(version.type || '版本') + ' 配图'"
                class="size-full object-cover"
                :class="imgState === 'image' ? '' : 'opacity-0'"
                loading="lazy"
                @load="imgState = 'image'"
                @error="imgState = 'error'"
              />
              <div
                v-else
                class="flex size-full flex-col items-center justify-center gap-2 text-dimmed"
              >
                <UIcon
                  :name="imgState === 'error' ? 'i-lucide-image-off' : 'i-lucide-image'"
                  class="size-9"
                  aria-hidden="true"
                />
                <span class="text-[13px]">{{ imgState === 'error' ? '图片加载失败' : '暂无配图' }}</span>
              </div>
            </div>
          </div>

          <!-- 说明 + 元信息 + 下载 -->
          <div class="flex flex-col gap-4">
            <p class="text-[15px] leading-[1.7] text-toned">
              {{ version.description || '暂无描述' }}
            </p>

            <dl class="grid gap-2 text-sm">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-file-text" class="size-4 shrink-0 text-dimmed" aria-hidden="true" />
                <dt class="text-dimmed">大小</dt>
                <dd class="font-medium text-default">{{ version.fileSize || '--' }}</dd>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-calendar-days" class="size-4 shrink-0 text-dimmed" aria-hidden="true" />
                <dt class="text-dimmed">更新</dt>
                <dd class="font-medium text-default">{{ version.updateDate || '--' }}</dd>
              </div>
              <div v-if="version.version" class="flex items-center gap-2">
                <UIcon name="i-lucide-tag" class="size-4 shrink-0 text-dimmed" aria-hidden="true" />
                <dt class="text-dimmed">版本</dt>
                <dd class="font-medium text-default">{{ version.version }}</dd>
              </div>
            </dl>

            <UButton
              v-if="version.downloadUrl"
              :to="version.downloadUrl"
              target="_blank"
              rel="noopener"
              color="primary"
              size="lg"
              block
              icon="i-lucide-download"
              label="下载"
            />
            <UButton
              v-else
              disabled
              color="neutral"
              size="lg"
              block
              icon="i-lucide-link-2-off"
              label="暂无链接"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 展开 / 收起：grid-template-rows 0fr ↔ 1fr，高度随内容自适应，
   不再使用 max-height 硬编码（内容多时会被截断、内容少时动画拖沓） */
.version-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.version.open .version-body {
  grid-template-rows: 1fr;
}

/* 宽屏两列：左图右文；窄屏单列（手写媒体查询，不用 lg: 变体） */
.version-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.5rem;
}

@media (min-width: 1024px) {
  .version-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    align-items: start;
    gap: 1.5rem;
  }
}

.version-arrow {
  transition: transform 0.3s ease;
}

.version.open .version-arrow {
  transform: rotate(180deg);
}
</style>
