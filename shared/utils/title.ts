import { SITE } from '../site';

// ============================================================
// 页面标题后缀
//
// VitePress 会默认给每个页面标题追加 `| <site title>`，Nuxt 没有这层自动模板，
// 迁移后各页 `<title>` 就只剩裸标题（「关于」「归档」…）。这里统一补上
// `· PidanUI` 后缀，并由 app.vue 注册成全局 titleTemplate，
// 这样即使某个页面漏写标题、或走 error.vue，也不会有裸标题漏出。
// ============================================================

/** 标题后缀（与品牌名之间用中点分隔） */
const SUFFIX = `· ${SITE.brand}`;

/**
 * 给页面标题补上站点后缀。
 *
 * 已经在标题里出现品牌名的（首页「PidanUI · 蛋仔风格 Windows 美化」、
 * 以及部分标题自带的文章）直接原样返回，避免出现
 * 「PidanUI · 蛋仔风格 Windows 美化 · PidanUI」这种重复。
 */
export function withSiteSuffix(title?: string | null): string {
  const text = String(title ?? '').trim();
  if (!text) return SITE.brand;
  if (text.includes(SITE.brand)) return text;
  return `${text} ${SUFFIX}`;
}
