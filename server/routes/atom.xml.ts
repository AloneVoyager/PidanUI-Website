import { queryCollection } from '@nuxt/content/server';
import { SITE } from '#shared/site';
import { parsePostDate } from '#shared/utils/date';
import { absoluteUrl } from '#shared/utils/post';
import { mdcToHtml } from '#shared/utils/mdc';

// ============================================================
// Atom feed（/atom.xml）
//   构建期由 nitro 预渲染成静态文件，格式对齐 hexo-generator-feed：
//   订阅者用 RSS 阅读器或浏览器扩展即可收到推送。
// ============================================================
const SITE_TITLE = 'PidanUI';
const SITE_DESC =
  'PidanUI 是一款专为 Windows 系统打造的蛋仔风格桌面美化项目，提供主题包、Rainmeter 小组件与系统镜像。';
const FEED_LIMIT = 20;

function xmlEscape(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default defineEventHandler(async (event) => {
  const docs = await queryCollection(event, 'posts').order('date', 'DESC').limit(FEED_LIMIT).all();

  const entries = docs.map((doc) => ({
    link: absoluteUrl(doc.path),
    title: doc.title ?? '',
    description: doc.description ?? '',
    updated: parsePostDate(doc.date).toISOString(),
    html: mdcToHtml(doc.body as never),
  }));

  const updated = entries[0]?.updated ?? new Date().toISOString();

  const items = entries
    .map((entry) =>
      [
        '  <entry>',
        `    <title>${xmlEscape(entry.title)}</title>`,
        `    <link href="${xmlEscape(entry.link)}" />`,
        `    <id>${xmlEscape(entry.link)}</id>`,
        `    <updated>${entry.updated}</updated>`,
        entry.description ? `    <summary>${xmlEscape(entry.description)}</summary>` : '',
        `    <content type="html">${xmlEscape(entry.html)}</content>`,
        '  </entry>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n');

  const feed = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <title>${xmlEscape(SITE_TITLE)}</title>`,
    `  <subtitle>${xmlEscape(SITE_DESC)}</subtitle>`,
    `  <link href="${xmlEscape(absoluteUrl('/atom.xml'))}" rel="self" />`,
    `  <link href="${xmlEscape(SITE.newsUrl)}" />`,
    `  <id>${xmlEscape(SITE.newsUrl)}</id>`,
    `  <updated>${updated}</updated>`,
    `  <author><name>${xmlEscape(SITE.author)}</name></author>`,
    `  <icon>${xmlEscape(absoluteUrl('/images/logo.webp'))}</icon>`,
    items,
    '</feed>',
    '',
  ].join('\n');

  setHeader(event, 'content-type', 'application/atom+xml; charset=utf-8');
  return feed;
});
