import type { MaybeRefOrGetter } from 'vue';
import { SITE } from '#shared/site';
import { absoluteUrl } from '#shared/utils/post';

/**
 * 站点级（非文章）页面 SEO：标题 / 描述 / OG。
 * 等价于 VitePress 时期 config.mts 里 transformPageData 与 transformHead
 * 为非文章页输出的基础标签。
 */
export function usePageSeo(title: MaybeRefOrGetter<string>, description: MaybeRefOrGetter<string>) {
  const route = useRoute();

  useSeoMeta({
    title,
    description,
    ogType: 'website',
    ogSiteName: SITE.brand,
    ogTitle: title,
    ogDescription: description,
    ogUrl: () => absoluteUrl(route.path),
    twitterCard: 'summary_large_image',
  });
}

/** 分页后缀：第 2 页起标题追加「 · 第 N 页」 */
export function withPageSuffix(title: string, page: number): string {
  return page > 1 ? `${title} · 第 ${page} 页` : title;
}
