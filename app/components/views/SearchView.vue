<script setup lang="ts">
import SearchResults from '../SearchResults.vue';
import NewsSearchBox from '../NewsSearchBox.vue';
import PageTitle from '../PageTitle.vue';
</script>

<template>
  <div class="search-view">
    <!-- 搜索框置于标题之上（搜索页独有布局） -->
    <NewsSearchBox autofocus />

    <!-- mt-2 覆盖标题的上边距（原 .list-title 的 margin-top: 8px），
         工具类只做增量：PageTitle 自身不写 margin -->
    <PageTitle title="搜索" class="mt-2" />

    <SearchResults />
  </div>
</template>

<style scoped>
/* ============================================================
   搜索页：搜索框在上，标题在下
   ============================================================ */
.search-view {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
