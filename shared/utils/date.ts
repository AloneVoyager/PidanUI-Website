/**
 * 日期解析：把 frontmatter 里的 `YYYY-MM-DD HH:mm:ss` 统一按 **UTC** 解释。
 *
 * 为什么需要它：迁移到 @nuxt/content 后 frontmatter 由 YAML 1.2 解析，
 * `2026-10-20 22:00:00` 不再是 Date 而是字符串；而 `new Date('2026-10-20 22:00:00')`
 * 在 Node 里按本地时区解释，会导致构建机时区不同、日期/年份漂移。
 */
export function parsePostDate(value: unknown): Date {
  if (value instanceof Date) return value;

  const raw = String(value ?? '').trim();
  if (!raw) return new Date(Number.NaN);

  // 纯日期或「日期 + 时间（无时区）」→ 补 Z 按 UTC 解释
  if (/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/.test(raw)) {
    return new Date(`${raw.replace(' ', 'T')}Z`);
  }

  return new Date(raw);
}
