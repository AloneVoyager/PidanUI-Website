// ============================================================
// 文章列表预取
//
// 侧栏「最新动态」与各列表页共用同一份 `useState('posts:all')`。
// 放在 plugin 里而不是 layout 的 setup 里，是因为：
//   - plugin 在应用创建阶段执行，SSR 时数据先就位，首屏 HTML 就有内容；
//   - layout 不在 <Suspense> 内，它的顶层 await 会让客户端 hydration 挂起
//     （表现为页面卡死），所以 layout 里不能 await。
// 客户端 hydration 时 `fetchAllPosts` 会命中 payload 里的状态直接返回，
// 不会重复请求。
// ============================================================
export default defineNuxtPlugin(async () => {
  try {
    await fetchAllPosts();
  } catch {
    // 接口不可用（例如离线开发）时降级为空列表，不阻塞应用启动
  }
});
