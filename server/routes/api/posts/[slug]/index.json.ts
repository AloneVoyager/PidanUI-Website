import { queryCollection } from '@nuxt/content/server';

// 单篇文章（含 body AST）：文章页用，客户端按需拉取。
// 路径刻意以 /index.json 结尾：预渲染后会落成真正的 .json 文件，
// 静态托管能给出正确的 application/json，客户端 $fetch 才能直接解析。
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? '';
  const target = `/posts/${slug}`;

  // 用 all() + 精确比对而不是 .path()：文章量极小，直接比对最稳
  const docs = await queryCollection(event, 'posts').all();
  const doc = docs.find((item) => item.path === target || item.path === `/${slug}`);

  if (!doc) {
    throw createError({ statusCode: 404, message: '文章不存在', fatal: true });
  }

  return doc;
});
