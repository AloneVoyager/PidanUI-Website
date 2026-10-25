/* ======================================================================
   PidanUI 增强层 · 行为脚本（AGPL-3.0，随仓库同许可）
   ------------------------------------------------------------------------
   滚动显现 + 阅读进度条 + 返回顶部 + 「/」快捷键，全部只做加法：
   - 不动站点任何既有 DOM / 事件 / 样式；插入元素一律挂 document.body 末尾；
   - 滚动布局感知：站点 window 不滚动、滚动发生在 .site-main 容器内
     （见 router.options.ts），所有取位基于探测出的真实滚动容器；
   - 渐进增强：禁 JS / IntersectionObserver 缺失 / 系统开启「减少动态效果」
     时各功能独立降级，页面不因此残留隐藏内容；
   - 后台标签页 scroll 事件可能被浏览器节流，故以 300ms 低频轮询兜底。
   ====================================================================== */
(function () {
  "use strict";
  window.__MIR_REV = 1; /* 增强层版本标记，便于排查缓存 */
  function motionOK() {
    try { return !window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return true; }
  }

  /* ---- 1. 滚动显现（IntersectionObserver，渐进增强） ---- */
  if (motionOK() && "IntersectionObserver" in window) {
    var root = document.documentElement;
    if (!root.classList.contains("mir-anim")) {
      root.classList.add("mir-anim");
      var targets = Array.prototype.slice.call(document.querySelectorAll(".site-main > *"));
      if (targets.length > 8) {
        targets = targets.slice(8);
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              if (!en.isIntersecting) return;
              en.target.classList.add("mirror-in");
              io.unobserve(en.target);
            });
          },
          { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
        );
        targets.forEach(function (el) {
          el.classList.add("mirror-reveal");
          io.observe(el);
        });
      }
    }
  }

  /* ---- 2. 阅读进度条 + 返回顶部（滚动容器感知，rAF 节流） ---- */
  var tick = false;
  var btn = null;

  function getScroller() {
    var de = document.documentElement;
    if (de.scrollHeight - de.clientHeight > 4) return window;
    var best = null, bestRange = 0;
    var els = document.querySelectorAll("main, [class*='site-main']");
    for (var i = 0; i < els.length; i++) {
      var el = els[i], oy = "";
      try { oy = getComputedStyle(el).overflowY; } catch (e) {}
      if (oy !== "auto" && oy !== "scroll") continue;
      var range = el.scrollHeight - el.clientHeight;
      if (range > bestRange) { best = el; bestRange = range; }
    }
    return best || window;
  }

  // capture 才能监听到容器的 scroll（scroll 事件不冒泡）
  document.addEventListener(
    "scroll",
    function () {
      if (tick) return;
      tick = true;
      window.requestAnimationFrame(onScroll);
    },
    { passive: true, capture: true }
  );

  function onScroll() {
    tick = false;
    var sc = getScroller();
    var y = sc === window ? window.scrollY : sc.scrollTop;
    var viewH = sc === window ? window.innerHeight : sc.clientHeight;

    // 阅读条：跟随页面中最长的 article；列表页的短卡片不计
    var art = null, artH = 0;
    var list = document.querySelectorAll("main article, article");
    for (var i = 0; i < list.length; i++) {
      var h = list[i].getBoundingClientRect().height;
      if (h > artH) { art = list[i]; artH = h; }
    }
    var isLong = !!(art && artH > viewH * 1.5);
    var bar = document.querySelector(".mir-readbar");
    if (isLong && !bar) {
      bar = document.createElement("div");
      bar.className = "mir-readbar";
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);
    }
    document.documentElement.classList.toggle("mir-article", isLong);
    if (bar && !isLong) bar.remove();

    if (isLong && bar) {
      var cTop = sc === window ? 0 : sc.getBoundingClientRect().top;
      var relTop = art.getBoundingClientRect().top - cTop;
      var total = artH - viewH;
      var done = Math.min(Math.max(-relTop, 0), Math.max(total, 1));
      var pct = total > 40 ? (done / total) * 100 : relTop < -4 ? 100 : 0;
      if (y < 40) pct = 0;
      bar.style.width = pct.toFixed(2) + "%";
    }

    // 返回顶部按钮
    var want = y > 700;
    if (!btn) {
      btn = document.getElementById("mir-backtop");
      if (!btn) {
        btn = document.createElement("button");
        btn.id = "mir-backtop";
        btn.type = "button";
        btn.setAttribute("aria-label", "返回顶部");
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M12 19V6M5 12l7-7 7 7"/></svg>';
        btn.addEventListener("click", function () {
          var s = getScroller();
          try { s.scrollTo({ top: 0, behavior: motionOK() ? "smooth" : "auto" }); }
          catch (err) { s.scrollTop = 0; }
          btn.classList.remove("show");
        });
        document.body.appendChild(btn);
      }
    }
    btn.classList.toggle("show", want);
  }
  // 兜底轮询：后台标签页中 scroll 事件可能被浏览器节流吞掉，
  // 用低频轮询保证进度条/返回钮状态始终自洽（开销可忽略）。
  onScroll();
  window.setInterval(onScroll, 300);

  /* ---- 3. 「/」聚焦搜索（仅在页面存在搜索框时生效，输入法/组合键不劫持） ---- */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    var q = document.querySelector('[role="search"] input, input[type="search"], input[name="q"]');
    if (!q) return;
    e.preventDefault();
    q.focus();
    if (q.select) q.select();
  });
})();
