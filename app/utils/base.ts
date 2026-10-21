/**
 * 站内链接 / 资源路径拼接（VitePress 的 withBase 等价物）。
 *
 * 保留它而不是全部改成写死路径：站点目前 base 为 '/'，但将来若改成
 * 子路径部署（GitHub Pages 项目页），只需改 nuxt.config 的 app.baseURL。
 */
export function withBase(input: string): string {
  if (!input) return input;
  // 外链、协议相对、data:、纯锚点一律原样返回
  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(input) || input.startsWith('data:')) {
    return input;
  }
  if (input.startsWith('#')) return input;

  const base = useRuntimeConfig().app.baseURL || '/';
  const prefix = base === '/' ? '' : base.replace(/\/$/, '');
  return `${prefix}${input.startsWith('/') ? input : `/${input}`}`;
}
