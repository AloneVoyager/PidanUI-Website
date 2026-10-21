<script setup lang="ts">
// 页面切换过渡由 nuxt.config 的 app.pageTransition 提供（类名 .page-enter-* 见 _animation.scss）。
//
// 注意：这里**不要**传 :page-key。给 NuxtPage 传一个内联箭头函数（:page-key="r => r.path"）
// 每次渲染都会产生新的函数身份，NuxtPage 内部监听到 props 变化 → 再次渲染 → 再次传入新函数，
// 形成渲染死循环（表现为 Firefox 报「此页面拖慢 Firefox」、整页卡死）。
// 默认行为已经足够：路径变化会重建页面组件，query 变化不会。
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
