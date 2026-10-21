/**
 * 「关注我们」链接列表。新增 / 调整渠道只需编辑本文件后重新构建发布。
 * 站内相对路径（如 /atom.xml）在渲染时经 withBase 处理；以 .xml 结尾视为订阅源。
 */
export interface SocialLink {
  /** 站点名 */
  name: string;
  /** 站点链接（站内写 / 开头的相对路径，站外写完整 URL） */
  url: string;
  /** 显示图标（Font Awesome 类名：品牌图标用 fa-brands） */
  iconClass: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'RSS 订阅',
    url: '/atom.xml',
    iconClass: 'fa-solid fa-rss',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/PidanEggyTeam',
    iconClass: 'fa-brands fa-github',
  },
  {
    name: '哔哩哔哩',
    url: 'https://space.bilibili.com/3493144343612119',
    iconClass: 'fa-brands fa-bilibili',
  },
  {
    name: 'QQ 交流群',
    url: 'https://qm.qq.com/q/WiTRsJYre0',
    iconClass: 'fa-brands fa-qq',
  },
  {
    name: 'PidanUI 上线了官网',
    url: 'https://eggyui.mysxl.cn',
    iconClass: 'fa-solid fa-globe',
  },
];