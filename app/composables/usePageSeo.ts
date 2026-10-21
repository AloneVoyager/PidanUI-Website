import type { MaybeRefOrGetter } from 'vue';
import { SITE } from '#shared/site';
import { absoluteUrl } from '#shared/utils/post';
import { withSiteSuffix } from '#shared/utils/title';

/**
 * 站点级（非文章）页面 SEO：标题 / 描述 / OG。
 * 等价于 VitePress 时期 config.mts 里 transformPageData 与 transformHead
 * 为非文章页输出的基础标签。
 *
 * 注意：title 传「裸标题」即可（如「关于」），`· PidanUI` 后缀由 app.vue 的
 * 全局 titleTemplate 统一追加；这里的 og:title / twitter:title 需要显式补，
 * 因为 og 标签不经过 titleTemplate。
 */
export function usePageSeo(title: MaybeRefOrGetter<string>, description: MaybeRefOrGetter<string>) {
  const route = useRoute();
  const pageTitle = computed(() => withSiteSuffix(toValue(title)));

  useSeoMeta({
    title,
    description,
    ogType: 'website',
    ogSiteName: SITE.brand,
    ogTitle: pageTitle,
    ogDescription: description,
    ogUrl: () => absoluteUrl(route.path),
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
  });
}

/** 分页后缀：第 2 页起标题追加「 · 第 N 页」 */
export function withPageSuffix(title: string, page: number): string {
  return page > 1 ? `${title} · 第 ${page} 页` : title;
}
