<script setup lang="ts">
import SearchResults from '../SearchResults.vue';
import NewsSearchBox from '../NewsSearchBox.vue';
import PageTitle from '../PageTitle.vue';
</script>

<template>
  <div class="mx-auto max-w-page">
    <!-- 搜索框置于标题之上（搜索页独有布局） -->
    <NewsSearchBox autofocus />

    <header class="mb-6 border-b border-default pb-5">
      <PageTitle title="搜索" />
    </header>

    <SearchResults />
  </div>
</template>
