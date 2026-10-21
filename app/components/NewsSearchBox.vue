<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { searchKeyword, syncKeywordFromUrl, writeKeywordToUrl } from '~/composables/useSearch';

/**
 * 全站共享的新闻搜索框。
 * - 搜索对话框与 /search/ 直达页共用关键词并即时过滤
 * - 输入只用 replaceState 同步当前地址栏，不触发路由重建
 * - 禁用 JavaScript 时显示降级提示（由 CSS 依据 <html> 上的 .js 标记控制显隐）
 */
const props = withDefaults(defineProps<{ autofocus?: boolean }>(), { autofocus: false });

const inputEl = ref<HTMLInputElement | null>(null);
const value = searchKeyword;
// 挂载前（SSR / 禁用 JS）不渲染输入框，仅保留降级提示
const mounted = ref(false);

function onInput(event: Event) {
  value.value = (event.target as HTMLInputElement).value;
  writeKeywordToUrl();
}

function onSubmit() {
  writeKeywordToUrl();
}

onMounted(() => {
  mounted.value = true;
  // 直接访问 /search/?q=xxx 或打开带 ?q= 的搜索对话框时，回填关键词
  syncKeywordFromUrl();
  if (props.autofocus) inputEl.value?.focus({ preventScroll: true });
});
</script>

<template>
  <form class="news-search" data-js="required" role="search" @submit.prevent="onSubmit">
    <!-- 降级提示：用普通元素而非 <noscript>。
         <noscript> 在 JS 启用时会被浏览器按「原始文本」解析，其内部标签不会成为
         真实节点，与 SSR 输出的 DOM 结构不一致，从而触发
         "Hydration completed but contains mismatches"。改为普通 <p> 后
         SSR 与客户端结构一致，再由 CSS 依据 <html> 的 .js 标记控制显隐。 -->
    <p class="news-search-noscript">
      本站搜索需要启用 JavaScript。你可以使用 <a :href="withBase('/atom.xml')">RSS 订阅</a> 获取最新新闻。
    </p>
    <template v-if="mounted">
      <span class="news-search-icon" aria-hidden="true">
        <i class="fa-solid fa-magnifying-glass"></i>
      </span>
        <input
        ref="inputEl"
        :value="value"
        type="search"
        name="q"
        placeholder="搜索新闻标题与正文..."
        aria-label="搜索新闻"
        autocomplete="off"
        @input="onInput"
      />
    </template>
  </form>
</template>

<style scoped>
.news-search {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0 18px;
}

/* 降级提示：默认隐藏（有 JS 时 <head> 内联脚本会立即给 <html> 加上 .js），
   仅在无 JS 时由下方 html:not(.js) 规则显示。 */
.news-search .news-search-noscript {
  display: none;
  padding: 0 2px;
  font-size: 14px;
  color: var(--ink-2);
  text-align: center;
}

.news-search .news-search-noscript a {
  color: var(--brand-deep);
  text-decoration: underline;
}

.news-search .news-search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  display: flex;
  color: var(--ink-3);
  pointer-events: none;
  transform: translateY(-50%);
}

.news-search .news-search-icon i {
  font-size: 15px;
}

.news-search input {
  width: 100%;
  padding: 12px 18px 12px 46px;
  font-size: 15px;
  color: var(--ink);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 40px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.news-search input::placeholder {
  color: var(--ink-3);
}

.news-search input:focus {
  border-color: var(--brand-deep);
  box-shadow: 0 0 0 4px rgba(255, 159, 26, 0.14);
}

/* 禁用 JS 时的搜索框降级：隐藏表单控件，只显示降级提示文本
   顶层 html 选择器 Vue scoped 不会加 data-v-xxx 前缀，仍能命中 */
html:not(.js) .news-search {
  display: block;
  padding: 0;
  background: transparent;
  border: none;
}

html:not(.js) .news-search .news-search-icon,
html:not(.js) .news-search input {
  display: none !important;
}

/* 此时 <template v-if="mounted"> 不会渲染（mounted 永远为 false），
   整个 <form> 里只剩这条提示，把它显示出来 */
html:not(.js) .news-search .news-search-noscript {
  display: block;
}
</style>
