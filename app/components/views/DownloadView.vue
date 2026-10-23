<script setup lang="ts">
import { ref } from 'vue';
import { downloadMeta } from '~/data';
import DownloadVersionItem from '~/components/DownloadVersionItem.vue';

// 数据来自构建期打包的本地模块（downloadMeta），运行时不发起任何网络请求
const title = downloadMeta.title || '下载';
const badge = downloadMeta.version ? `v${downloadMeta.version}` : '';
const overallDesc = downloadMeta.description || '';
const versions = downloadMeta.versions && downloadMeta.versions.length ? downloadMeta.versions : null;

// 同时只展开一个版本；null 表示全部收起
const activeId = ref<string | null>(versions?.[0]?.id ?? null);

function toggle(id: string): void {
  activeId.value = activeId.value === id ? null : id;
}
</script>

<template>
  <div class="mx-auto max-w-page">
    <header class="mb-7">
      <div class="flex flex-wrap items-center gap-3">
        <PageTitle :title="title" />
        <UBadge v-if="badge" variant="soft" color="primary" :label="badge" />
        <UBadge
          v-if="versions"
          variant="outline"
          color="neutral"
          :label="`共 ${versions.length} 个版本`"
        />
      </div>
      <p v-if="overallDesc" class="mt-2 text-[15px] text-toned">{{ overallDesc }}</p>
    </header>

    <div v-if="versions" class="flex flex-col gap-3">
      <DownloadVersionItem
        v-for="(v, i) in versions"
        :key="v.id || i"
        class="rounded-(--radius-l) border border-default bg-default px-4 transition-[border-color] duration-200 hover:border-brand-600/25"
        :version="v"
        :open="activeId === (v.id ?? String(i))"
        @toggle="toggle(v.id ?? String(i))"
      />
    </div>
    <EmptyState v-else text="暂无版本信息" />
  </div>
</template>
