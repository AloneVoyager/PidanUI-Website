import { countYears, yearPaginationParams } from '../../.vitepress/build/posts.ts';

/**
 * 归档动态路由：按年分页，每年一页。
 * 第 1 页（最新年份）为 /archives/，此处生成 /archives/page/2 …
 */
export default {
  watch: ['../../posts/*.md'],
  paths() {
    return yearPaginationParams(countYears());
  },
};