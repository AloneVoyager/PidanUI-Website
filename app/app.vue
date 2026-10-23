<script setup lang="ts">
import { withSiteSuffix } from '#shared/utils/title';

// 页面切换过渡由 nuxt.config 的 app.pageTransition 提供（类名 .page-enter-* 见 _animation.scss）。
//
// 注意：这里**不要**传 :page-key。给 NuxtPage 传一个内联箭头函数（:page-key="r => r.path"）
// 每次渲染都会产生新的函数身份，NuxtPage 内部监听到 props 变化 → 再次渲染 → 再次传入新函数，
// 形成渲染死循环（表现为 Firefox 报「此页面拖慢 Firefox」、整页卡死）。
// 默认行为已经足够：路径变化会重建页面组件，query 变化不会。

// 全局标题模板：所有页面标题统一补「· PidanUI」后缀。
// 沿用 VitePress 时期的语义（当年由默认 titleTemplate 自动追加 `| PidanUI`，
// 首页用 frontmatter 的 titleTemplate: false 关掉），Nuxt 没有这层自动模板，
// 这里显式补上；已含品牌名的标题不重复追加，见 withSiteSuffix。
useHead({
  titleTemplate: (title) => withSiteSuffix(title),
});
</script>

<template>
  <!-- UApp 提供 Toast / Tooltip / 程序化浮层的容器与分析钩子，
       必须是应用根节点（包住 NuxtLayout）。 -->
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
