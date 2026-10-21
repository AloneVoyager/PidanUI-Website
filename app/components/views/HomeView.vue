<script setup lang="ts">

// 首页：Hero 主视觉 + 重要说明 + 下载卡片 + 核心特性
// 结构参考 EggyUIWeb-Vue3，但去除容器卡片外观，与 VitePress 暖黄渐变背景融为一体
const FEATURES = [
  {
    tag: '现代技术栈',
    title: '.NET 10 辅助组件',
    desc: '辅助组件采用 .NET 10 重构，避免杀毒软件误报，提升稳定性与兼容性。',
  },
  {
    tag: '精简美化',
    title: '保留核心体验',
    desc: '聚焦主题与 Rainmeter 小组件等基础美化，让系统更接近原版 Windows 的使用体验。',
  },
  {
    tag: '持续维护',
    title: '社区驱动',
    desc: '由 PidanUI 团队持续维护，吸取过往项目治理经验，保持稳定迭代。',
  },
] as const;
</script>

<template>
  <div class="home-view">
    <!-- Hero 主视觉 -->
    <section class="hero">
      <h1 class="hero-title">Pidan<em>UI</em></h1>
      <p class="hero-desc">
        一个由蛋仔爱好者发起的 Windows & Liunx 桌面美化项目，专注于实现《蛋仔派对》风格的桌面视觉体验。
      </p>

      <!-- 重要说明（警告条） -->
      <div class="hero-warning" role="note">
        <h3><span class="warn-icon" aria-hidden="true"><i class="fa-solid fa-exclamation"></i></span> 温馨提示</h3>
        <p>
          PidanUI 是一个普通的 Windows & Liunx 桌面美化包，不适用于手机系统或其他操作系统。本项目为《蛋仔派对》粉丝二次创作作品，严格禁止任何商业用途。
        </p>
      </div>
    </section>

    <!-- 下载引导卡片（与背景融合） -->
    <section class="download-callout" aria-label="立即下载">
      <div class="download-copy">
        <span class="callout-icon" aria-hidden="true">
          <i class="fa-solid fa-download"></i>
        </span>
        <h2>立即 <span class="highlight">下载</span></h2>
        <p>获取最新版本 · Windows 7/10/11 · 完全免费</p>
        <NuxtLink class="arrow-hint" :to="'/download'">
          前往下载
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </NuxtLink>
      </div>
      <div class="download-visual" aria-hidden="true">
        <img :src="withBase('/images/characters/yeggy.webp')" alt="" loading="lazy" />
      </div>
    </section>

    <!-- 项目特性 -->
    <section
      id="features"
      class="feature-grid grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4.5 mt-10"
      aria-label="项目特性"
    >
      <article v-for="item in FEATURES" :key="item.title" class="feature-card">
        <span class="tag">{{ item.tag }}</span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
/* ============================================================
   首页 · Hero + 警告条 + 下载引导 + 特性网格
   结构参考 EggyUIWeb-Vue3，但容器弱化，与暖黄渐变背景融为一体
   ============================================================ */
.home-view {
  max-width: 1400px;
  margin: 0 auto;
}

/* ---- Hero 主视觉 ---- */
.hero {
  padding: 40px 0 28px;
  text-align: center;
}

.hero-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  letter-spacing: 1px;
  line-height: 1.25;
  margin: 0 0 16px;
  background: var(--brand-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-title em {
  font-style: normal;
}

.hero-desc {
  max-width: 600px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 1.7;
  color: var(--ink-2);
}

/* ---- 重要说明 / 警告条（弱化外观：极浅背景 + 左边框） ---- */
.hero-warning {
  max-width: 720px;
  margin: 24px auto 0;
  padding: 14px 18px;
  text-align: left;
  color: var(--ink-2);
  background: rgba(255, 197, 61, 0.14);
  border-left: 4px solid var(--brand);
  border-radius: var(--radius-m);
}

.hero-warning h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--brand-deep);
}

.hero-warning .warn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 10px;
  line-height: 1;
  color: #fff;
  background: var(--brand);
  border-radius: 50%;
}

.hero-warning .warn-icon i {
  font-size: inherit;
}

.hero-warning p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--ink-2);
}

/* ---- 下载引导（左右分栏，弱化容器） ---- */
.download-callout {
  display: flex;
  align-items: center;
  gap: 28px;
  margin: 32px 0 8px;
  padding: 24px 28px;
  color: var(--ink);
  text-decoration: none;
  /* 弱化容器：只用一层极淡的背景，不设 border-radius / box-shadow */
  background: rgba(255, 197, 61, 0.1);
  border-radius: var(--radius-m);
}

.download-copy {
  flex: 1;
  min-width: 0;
}

.download-copy .callout-icon {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--brand-deep);
}

.download-copy .callout-icon i {
  font-size: 32px;
}

.download-copy h2 {
  margin: 0 0 4px;
  font-size: clamp(22px, 3.2vw, 28px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.download-copy h2 .highlight {
  background: var(--brand-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.download-copy > p {
  margin: 0 0 14px;
  font-size: 14px;
  color: var(--ink-2);
}

.arrow-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 500;
  color: var(--brand-deep);
  text-decoration: none;
  background: rgba(255, 159, 26, 0.08);
  border: 1px solid rgba(255, 159, 26, 0.14);
  border-radius: 30px;
  transition: background 0.2s ease, transform 0.2s ease;
}

.arrow-hint i {
  font-size: 16px;
  transition: transform 0.25s ease;
}

.arrow-hint:hover {
  background: rgba(255, 159, 26, 0.16);
}

.arrow-hint:hover i {
  transform: translateX(3px);
}

.download-visual {
  flex: 0 0 140px;
  width: 140px;
  height: 140px;
}

.download-visual img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-m);
}

/* ---- 项目特性网格 ---- */
/* 布局（columns / gap / 上边距）在模板上用工具类，这里只留窄屏覆盖 */
.feature-card {
  padding: 22px 22px 20px;
  /* 卡片底色用 CSS 变量承载深浅两套（浅色纯白 / 深色 #1f1f23），
     再叠一层极弱的品牌黄让卡片与暖色品牌微微呼应 */
  background: linear-gradient(180deg, rgba(255, 197, 61, 0.1) 0%, transparent 100%), var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-l);
}

.feature-card .tag {
  display: inline-block;
  margin-bottom: 12px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-deep);
  background: var(--brand-soft);
  border-radius: var(--radius-full);
}

.feature-card h3 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}

.feature-card p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--ink-2);
}

/* ---- 响应式 ---- */
@media (max-width: 960px) {
  .download-callout {
    flex-direction: column;
    text-align: center;
    padding: 22px 20px;
  }

  .download-callout .download-copy .callout-icon {
    justify-content: center;
  }

  .download-callout .arrow-hint {
    justify-content: center;
  }

  .download-callout .download-visual {
    order: -1;
    flex: 0 0 110px;
    width: 110px;
    height: 110px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding-top: 20px;
  }

  .hero-title {
    font-size: 28px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    margin-top: 28px;
  }

  .download-callout {
    margin-top: 24px;
  }
}
</style>
