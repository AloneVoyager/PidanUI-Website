<script setup lang="ts">
</script>

<template>
  <div class="not-found">
    <p class="code">404</p>
    <h1>页面走丢了</h1>
    <p class="desc">你访问的页面不存在，或者已经被移动。</p>
    <NuxtLink class="btn" :to="'/'">返回首页</NuxtLink>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 520px;
  margin: 10vh auto 0;
  padding: 40px 32px;
  text-align: center;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-l);
}

.not-found .code {
  font-size: 64px;
  font-weight: 800;
  line-height: 1;
  color: var(--brand-deep);
}

.not-found h1 {
  margin: 12px 0 8px;
  font-size: 22px;
  color: var(--ink);
}

.not-found .desc {
  margin-bottom: 24px;
  font-size: 15px;
  color: var(--ink-2);
}

.not-found .btn {
  display: inline-block;
  padding: 11px 28px;
  font-weight: 600;
  color: #fff;
  background: var(--brand-grad);
  border-radius: var(--radius-full);
}
</style>