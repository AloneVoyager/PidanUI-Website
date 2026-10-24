<script setup lang="ts">
// 首页：Hero 主视觉 + 重要说明 + 下载卡片 + 核心特性
// 容器弱化，与暖黄渐变背景融为一体
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
  <div class="mx-auto max-w-page">
    <!-- Hero 主视觉 -->
    <section class="hero flex flex-col items-center pt-10 pb-7 text-center">
      <h1 class="hero-title mb-4 text-[clamp(32px,5vw,48px)] leading-[1.25] font-extrabold tracking-[1px]">
        Pidan<em>UI</em>
      </h1>
      <p class="max-w-[600px] text-base leading-[1.7] text-toned">
        一个由蛋仔爱好者发起的 Windows & Liunx 桌面美化项目，专注于实现《蛋仔派对》风格的桌面视觉体验。
      </p>

      <!-- 重要说明：极浅背景 + 左边框，不用卡片外观 -->
      <div
        class="mx-auto mt-6 max-w-[720px] rounded-(--radius-m) border-l-4 border-brand bg-brand-a14 px-[18px] py-3.5 text-left"
        role="note"
      >
        <h3 class="mb-1.5 flex items-center gap-2 text-sm font-semibold text-brand-600">
          <span
            class="inline-flex size-[18px] items-center justify-center rounded-full bg-brand text-white"
            aria-hidden="true"
          >
            <UIcon name="i-lucide-triangle-alert" class="size-3" />
          </span>
          温馨提示
        </h3>
        <p class="text-[13.5px] leading-[1.65] text-toned">
          PidanUI 是一个普通的 Windows & Liunx 桌面美化包，不适用于手机系统或其他操作系统。本项目为《蛋仔派对》粉丝二次创作作品，严格禁止任何商业用途。
        </p>
      </div>
    </section>

    <!-- 下载引导卡片 -->
    <section
      class="download-callout mt-8 mb-2 flex items-center gap-7 rounded-(--radius-m) bg-brand-a10 px-7 py-6"
      aria-label="立即下载"
    >
      <div class="min-w-0 flex-1">
        <span class="mb-2.5 inline-flex text-brand-600" aria-hidden="true">
          <UIcon name="i-lucide-download" class="size-8" />
        </span>
        <h2 class="mb-1 text-[clamp(22px,3.2vw,28px)] font-bold tracking-[-0.01em] text-default">
          立即 <span class="grad-text">下载</span>
        </h2>
        <p class="mb-3.5 text-sm text-toned">获取最新版本 · Windows 7/10/11 · 完全免费</p>
        <UButton
          to="/download"
          variant="soft"
          color="primary"
          size="sm"
          rounded-full
          trailing-icon="i-lucide-arrow-right"
          label="前往下载"
        />
      </div>
      <div class="callout-visual size-[140px] flex-none" aria-hidden="true">
        <img
          class="size-full rounded-(--radius-m) object-cover"
          :src="withBase('/images/characters/yeggy.webp')"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>

    <!-- 项目特性 -->
    <section
      id="features"
      class="feature-grid mt-10 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4.5"
      aria-label="项目特性"
    >
      <article
        v-for="item in FEATURES"
        :key="item.title"
        class="rounded-(--radius-l) border border-default bg-default px-[22px] pt-[22px] pb-5"
      >
        <UBadge class="mb-3" variant="soft" color="primary" size="sm" :label="item.tag" />
        <h3 class="mb-1.5 text-base font-bold text-default">{{ item.title }}</h3>
        <p class="text-[13.5px] leading-[1.7] text-toned">{{ item.desc }}</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
/* 品牌渐变文字：需要 background-clip:text，工具类写起来过于冗长 */
.hero-title,
.grad-text {
  background: var(--brand-grad);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-title em {
  font-style: normal;
}

/* 窄屏：下载卡片转纵向，插图置顶 */
@media (max-width: 960px) {
  .download-callout {
    flex-direction: column;
    padding: 22px 20px;
    text-align: center;
  }

  .download-callout .callout-visual {
    order: -1;
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
