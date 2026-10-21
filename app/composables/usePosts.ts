import { computed, type ComputedRef, type Ref } from 'vue';
import { PAGE_SIZE } from '#shared/site';
import { byDateDesc } from '#shared/utils/post';
import type { Post, TermItem } from '#shared/types/post';

// ============================================================
// 文章数据访问
//
// 约定（很重要）：带 useState() 的函数只能在 setup 顶层的同步代码里调用。
// 不要放进 computed / 模板 / 事件回调——那样会在渲染期反复执行 inject，
// dev 模式下会不断打印告警并触发重渲染，表现为页面卡死。
// 因此这里把「取状态」与「算派生数据」拆开：
//   const all = useAllPosts();                       // setup 里取一次
//   const list = computed(() => collectTerms('tags', all.value));
// ============================================================

/**
 * 全站共用的文章列表状态。
 *
 * 由 layout 在渲染前 `await fetchAllPosts()` 填一次，其余组件直接读这份
 * state —— 这样侧栏「最新动态」与页面列表用的是同一份数据，且只查询一次。
 */
export function useAllPosts(): Ref<Post[]> {
  return useState<Post[]>('posts:all', () => []);
}

/** 拉取并规范化全部文章（时间倒序）。重复调用直接复用已填充的状态。 */
export async function fetchAllPosts(): Promise<Ref<Post[]>> {
  const posts = useAllPosts();
  if (posts.value.length) return posts;

  // 刻意不用 useAsyncData：数据写进 useState 后本来就会随 payload 序列化，
  // 再套一层 asyncData 只会在 plugin / layout 里制造额外的 hydration 等待，
  // 静态托管时还会引入 payload key 匹配问题。
  // 走自家预渲染接口 /api/posts.json；SSR 阶段必须用 useRequestFetch 才能发相对地址。
  const fetcher = import.meta.server ? useRequestFetch() : $fetch;
  const list = await fetcher<Post[]>(withBase('/api/posts.json'));

  posts.value = (list ?? []).sort(byDateDesc);
  return posts;
}

export interface PagedPosts {
  /** 总页数（至少 1） */
  totalPages: ComputedRef<number>;
  /** 当前页（已按上下界收敛） */
  page: ComputedRef<number>;
  /** 当前页文章 */
  pagePosts: ComputedRef<Post[]>;
}

/**
 * 置顶优先排序：stickypost 为 true 的文章整体前移。
 * Array#sort 是稳定排序，因此置顶组内部与其余文章都保持原有的时间倒序。
 * 仅用于按时间倒序的列表页（首页 / 分类 / 标签）；归档时间轴与搜索结果按原顺序展示。
 */
export function pinnedFirst(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => Number(b.stickypost) - Number(a.stickypost));
}

/**
 * 列表分页组合式函数。
 * @param getCurrent 当前页取值函数（响应式）
 * @param getSource  数据集取值函数，默认全部文章（分类/标签页可传入过滤后的集合）
 */
export function usePagedPosts(getCurrent: () => number, getSource: () => Post[]): PagedPosts {
  const totalPages = computed(() => Math.max(1, Math.ceil(getSource().length / PAGE_SIZE)));
  const page = computed(() => {
    const raw = Math.floor(Number(getCurrent()));
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.min(raw, totalPages.value);
  });
  const pagePosts = computed(() =>
    getSource().slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE),
  );

  return { totalPages, page, pagePosts };
}

/** 统计分类集合（返回按文章数倒序的条目） */
export function collectTerms(kind: 'categories' | 'tags', posts: Post[]): TermItem[] {
  const counter = new Map<string, number>();
  for (const post of posts) {
    const names = kind === 'categories' ? post.categories : post.tags;
    for (const name of names) {
      counter.set(name, (counter.get(name) ?? 0) + 1);
    }
  }
  return [...counter.entries()]
    .map(([name, count]) => ({
      name,
      count,
      path: `/${kind}/${encodeURIComponent(name)}`,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 取最新 n 篇文章（侧栏「最新动态」用，置顶不改变时间序） */
export function latestPosts(posts: Post[], n: number): Post[] {
  return posts.slice(0, n);
}
