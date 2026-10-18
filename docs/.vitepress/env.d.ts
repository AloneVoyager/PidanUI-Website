/**
 * 全局类型声明
 *   补上 VitePress 主题里用到的 Vue SFC / 样式副作用导入，
 *   以及缺少类型定义的 markdown-it 插件，供 TypeScript 7 类型检查通过。
 */

/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module '*.scss';
declare module '*.css';

declare module 'markdown-it-deflist';
declare module 'markdown-it-footnote';
declare module 'markdown-it-mark';
declare module 'markdown-it-sub';
declare module 'markdown-it-sup';
declare module 'markdown-it-task-lists';
