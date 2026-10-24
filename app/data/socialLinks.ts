/**
 * 「关注我们」链接列表。新增 / 调整渠道只需编辑本文件后重新构建发布。
 * 站内相对路径（如 /atom.xml）在渲染时经 withBase 处理；以 .xml 结尾视为订阅源。
 */
export interface SocialLink {
  /** 站点名 */
  name: string;
  /** 站点链接（站内写 / 开头的相对路径，站外写完整 URL） */
  url: string;
  /**
   * 显示图标（Iconify 名称，用 <UIcon> 渲染）。
   * 品牌图标走 simple-icons 集（i-simple-icons-*），通用图标走 lucide 集
   * （i-lucide-*）；两个集都由 @iconify-json 本地安装，构建期不联网。
   */
  icon: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'RSS 订阅',
    url: '/atom.xml',
    icon: 'i-lucide-rss',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/PidanEggyTeam',
    icon: 'i-simple-icons-github',
  },
  {
    name: 'GitCode',
    url: 'https://gitcode.com/PidanUI-Team',
    icon: 'i-bi-git',
  },
  {
    name: '哔哩哔哩',
    url: 'https://space.bilibili.com/3546563248916693',
    icon: 'i-simple-icons-bilibili',
  },
  {
    name: 'QQ 交流群',
    url: 'https://qm.qq.com/q/WiTRsJYre0',
    icon: 'i-simple-icons-tencentqq',
  },
  {
    name: 'PidanUI 上线了官网',
    url: 'https://eggyui.mysxl.cn',
    icon: 'i-lucide-globe',
  },
  {
    name: '本官网源代码仓库',
    url: 'https://github.com/PidanEggyTeam/PidanUI-Website',
    icon: 'i-octicon-repo-16',
  },
];
