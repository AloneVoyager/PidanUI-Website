/**
 * Nuxt UI 运行时主题配置。
 *
 * 色彩体系全部落在项目自己的设计令牌上（见 app/assets/styles/tokens.css）：
 *   primary → brand   （蛋仔黄 #ffc53d 色阶，500/600 对齐 --brand / --brand-deep）
 *   neutral → ink     （与 --bg / --line / --ink 逐档对齐的灰阶；
 *                       不能叫 neutral —— 那是 Nuxt UI 的保留名，会被 old- 前缀
 *                       回退到它自己的 oklch 灰，站点灰阶就对不上了）
 *   error   → danger  （站点一贯的红，用于下载失败、表单校验）
 *
 * 只映射这三个别名：nuxt.config.ts 的 ui.theme.colors 也只生成这三个，
 * 多余的语义色（secondary / success / info / warning）不生成 CSS。
 */
export default defineAppConfig({
  // 图标一律渲染成内联 <svg>（Nuxt Icon 默认的 css 模式输出 <span class="iconify">，
  // 要等客户端拿到图标数据才有内容；静态站点要首屏就有图标，必须用 svg 模式）
  icon: {
    mode: 'svg',
  },
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'ink',
      error: 'danger',
    },
  },
});
