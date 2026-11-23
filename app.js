(function () {
  const S = window.SITE;
  const G = window.GROUPS;
  const isTop = !!document.getElementById("slider");
  const base = isTop ? "" : "./";

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (i) => String(i + 1).padStart(2, "0");
  const groupUrl = (g) => `group.html?id=${encodeURIComponent(g.id)}`;
  const isReady = (g) => g.status === "ready";
  const setTheme = (c) => {
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = c;
  };

  const wordmarkSvg = () => `
    <svg viewBox="0 0 1000 150" role="img" aria-label="Furutani Lab">
      <text x="0" y="128" font-size="164" textLength="1000" lengthAdjust="spacingAndGlyphs">furutaniLAB</text>
    </svg>`;

  const art = (g, i, cls) => `
    <div class="${cls}" style="--c:${esc(g.color)}">
      ${g.cover ? `<img src="${esc(g.cover)}" alt="" loading="lazy">` : ""}
    </div>`;

  // ---------------- header / footer ----------------
  function header() {
    document.getElementById("header").innerHTML = `
      <header class="site-header">
        <a class="logo" href="${base || "./"}#top">
          <small>${esc(S.event.name)}</small>
          <b>furutaniLAB</b>
        </a>
        <nav class="nav">
          <div class="pill-nav">
            <a href="${base}#top">TOP</a>
            <a href="${base}#about">ABOUT</a>
            <a href="${base}#projects">PROJECTS</a>
          </div>
          <a class="pill-black" href="${esc(S.event.url)}" target="_blank" rel="noopener">SFC TECH<span class="arrow">↗</span></a>
        </nav>
      </header>`;
  }

  function footer() {
    document.getElementById("footer").innerHTML = `
      <div class="wrap">
        <div class="wordmark">${wordmarkSvg()}</div>
        <div class="foot-row">
          <p>${esc(S.lab.name)}｜慶應義塾大学 湘南藤沢キャンパス</p>
          <p><a href="${esc(S.event.url)}" target="_blank" rel="noopener">${esc(S.event.name)}</a>　${esc(S.event.date)}　${esc(S.event.venue)}</p>
        </div>
      </div>`;
  }

  // ---------------- top page ----------------
  function renderTop() {
    const hero = document.querySelector(".hero");
    const slider = document.getElementById("slider");

    slider.innerHTML = G.map((g, i) => `
      <a class="slide" href="${groupUrl(g)}" data-color="${esc(g.color)}">
        ${art(g, i, "slide-art")}
        ${g.cover ? "" : `<span class="slide-num">${num(i)}</span>`}
        <div class="slide-cap">
          <span class="tag">${esc(g.name)}</span>${isReady(g) ? "" : '<span class="tag soon">COMING SOON</span>'}<br>
          <span class="hl ttl">${esc(g.title)}</span>
          <span class="sub"><span class="hl">${esc(g.catch)}</span></span>
        </div>
      </a>`).join("");

    document.getElementById("wordmark").innerHTML = wordmarkSvg();

    const items = [S.event.name, "2026.11.24 TUE", S.event.venue, S.lab.theme, S.lab.name];
    const row = items.map((t) => `<span>${esc(t)}</span>`).join("");
    document.getElementById("ticker").innerHTML = row + row + row + row;

    // 表示中のスライドに合わせて背景色を変える
    const slides = [...slider.children];
    let current = 0;
    const apply = (i) => {
      current = i;
      const c = slides[i].dataset.color;
      hero.style.setProperty("--hero", c);
      setTheme(c);
    };
    const nearest = () => {
      const mid = slider.scrollLeft + slider.clientWidth / 2;
      let best = 0, d = Infinity;
      slides.forEach((s, i) => {
        const dd = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
        if (dd < d) { d = dd; best = i; }
      });
      return best;
    };
    let raf;
    slider.addEventListener("scroll", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { const i = nearest(); if (i !== current) apply(i); });
    }, { passive: true });

    const go = (i) => {
      const n = (i + slides.length) % slides.length;
      const s = slides[n];
      slider.scrollTo({ left: s.offsetLeft - (slider.clientWidth - s.offsetWidth) / 2, behavior: "smooth" });
    };
    document.getElementById("prev").onclick = () => { pause(); go(current - 1); };
    document.getElementById("next").onclick = () => { pause(); go(current + 1); };

    // 自動スライド（触ったらしばらく止める）
    let pausedUntil = 0;
    const pause = () => { pausedUntil = Date.now() + 10000; };
    slider.addEventListener("pointerdown", pause);
    slider.addEventListener("touchstart", pause, { passive: true });
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(() => { if (Date.now() > pausedUntil && !document.hidden) go(current + 1); }, 5000);
    }
    apply(0);

    // about
    document.getElementById("about-body").innerHTML = `
      <div>
        <p class="about-theme">${esc(S.lab.theme)}</p>
        <p class="about-lead">${esc(S.lab.lead)}</p>
        <p class="about-members">${esc(S.lab.members)}</p>
      </div>
      <div class="event-card">
        <p class="en">${esc(S.event.name)}</p>
        <dl>
          <dt>DATE</dt><dd>${esc(S.event.date)}</dd>
          <dt>PLACE</dt><dd>${esc(S.event.venue)}</dd>
        </dl>
        <a class="pill-black" href="${esc(S.event.url)}" target="_blank" rel="noopener">イベント公式サイト<span class="arrow">↗</span></a>
      </div>`;

    // media（掲載・出演の一覧。動画の埋め込みやサムネイルは出さない）
    const M = window.MEDIA || [];
    const MI = window.MEDIA_INFO || {};
    const mediaSec = document.getElementById("media");
    // 題名の最後の1文字と矢印をひとまとめにして、矢印だけが次の行に落ちないようにする
    const ext = (url, label) => {
      const t = [...String(label)];
      const last = t.pop() ?? "";
      return `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(t.join(""))}<span class="nb">${esc(last)}<span class="arrow" aria-hidden="true">↗</span></span></a>`;
    };
    if (!M.length) mediaSec.remove();
    else document.getElementById("media-list").innerHTML = `
      <div class="media-head">
        ${MI.image ? `<img class="media-face" src="${esc(MI.image)}" alt="" width="72" height="72" loading="lazy">` : ""}
        <div>
          ${MI.person ? `<p class="media-who">${esc(MI.person)}</p>` : ""}
          ${MI.period ? `<p class="media-period">${esc(MI.period)}</p>` : ""}
        </div>
      </div>
      <ol class="media-rows">${M.map((m) => `
        <li>
          <div class="media-date en">${esc(m.date)}</div>
          <div class="media-item">
            <div class="media-src">${m.kind ? `<span class="tag">${esc(m.kind)}</span>` : ""}<span>${esc(m.source)}</span></div>
            <p class="media-ttl">${m.url ? ext(m.url, m.title) : esc(m.title)}</p>
            ${m.videos?.length ? `<p class="media-more">${m.videos.map((v, k) => ext(v, m.videos.length > 1 ? `動画 ${k + 1}` : "動画")).join("")}</p>` : ""}
          </div>
        </li>`).join("")}
      </ol>
      ${MI.note ? `<p class="media-note">${esc(MI.note)}</p>` : ""}`;

    // projects
    document.getElementById("cards").innerHTML = G.map((g, i) => `
      <a class="card" href="${groupUrl(g)}">
        <div class="card-media">
          ${art(g, i, "card-art")}
          ${g.cover ? "" : `<span class="num">${num(i)}</span>`}
        </div>
        <div class="card-body">
          <div><span class="tag">${esc(g.name)}</span>${isReady(g) ? "" : '<span class="tag soon">COMING SOON</span>'}</div>
          <h3>${esc(g.title)}</h3>
          <p>${esc(g.catch)}</p>
          <span class="card-more" aria-hidden="true">→</span>
        </div>
      </a>`).join("");
  }

  // ---------------- group page ----------------
  function youtubeEmbed(url) {
    const m = String(url).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : "";
  }

  function renderGroup() {
    const id = new URLSearchParams(location.search).get("id");
    const i = G.findIndex((g) => g.id === id);
    const main = document.getElementById("group");
    if (i < 0) {
      main.innerHTML = `
        <section class="g-hero"><div class="wrap">
          <h1 class="g-title"><span class="hl">ページが見つかりませんでした</span></h1>
          <a class="pill-black" href="./">トップへ戻る</a>
        </div></section>`;
      return;
    }
    const g = G[i];
    document.title = `${g.title}｜${S.lab.name} ${S.event.name}`;
    setTheme(g.color);

    const sec = (en, ja, html) =>
      html ? `<section class="g-sec"><h2><span class="en">${en}</span><span class="ja">${ja}</span></h2><div>${html}</div></section>` : "";
    const para = (t) => (t ? `<p>${esc(t)}</p>` : "");

    let body;
    if (!isReady(g)) {
      body = `<div class="soon-box"><p class="en">COMING SOON</p><p>このページは準備中です。当日までに公開します。</p></div>`;
    } else {
      const results = g.results?.length ? `${g.resultsNote ? `<p class="note">${esc(g.resultsNote)}</p>` : ""}<ol class="results">${g.results.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>` : "";
      const gallery = g.images?.length
        ? `<div class="gallery">${g.images.map((im) => {
            const img = `<img src="${esc(im.src)}" alt="${esc(im.caption)}" loading="lazy">`;
            return `
            <figure>${im.url ? `<a href="${esc(im.url)}" target="_blank" rel="noopener">${img}</a>` : img}
            ${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ""}</figure>`;
          }).join("")}</div>`
        : "";
      const yt = g.video ? youtubeEmbed(g.video) : "";
      const video = yt ? `<div class="video"><iframe src="${yt}" allowfullscreen loading="lazy" title="動画"></iframe></div>` : "";
      const members = g.members?.length ? `<div class="chips">${g.members.map((m) => `<span class="chip">${esc(m)}</span>`).join("")}</div>` : "";
      const links = g.links?.length
        ? `<div class="links">${g.links.map((l) => `<a class="pill-black" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}<span class="arrow">↗</span></a>`).join("")}</div>`
        : "";
      body = `
        ${sec("SUMMARY", "概要", para(g.summary))}
        ${sec("BACKGROUND", "背景・目的", para(g.background))}
        ${sec("RESULTS", "成果", results)}
        ${sec("GALLERY", esc(g.imagesLabel || "写真"), gallery)}
        ${sec("MOVIE", "動画", video)}
        ${sec("FUTURE", "今後の展望", para(g.future))}
        ${sec("MEMBERS", "メンバー", members)}
        ${sec("LINKS", "関連リンク", links)}`;
    }

    const prev = G[i - 1], next = G[i + 1];
    const pg = (x, dir, cls) => `
      <a class="${cls}" href="${groupUrl(x)}" style="--c:${esc(x.color)}">
        <span class="dir">${dir}</span><span class="t">${esc(x.name)}｜${esc(x.title)}</span>
      </a>`;

    main.innerHTML = `
      <section class="g-hero" style="--hero:${esc(g.color)}">
        <div class="wrap">
          <div class="crumbs"><a href="./">TOP</a> / <a href="./#projects">PROJECTS</a> / ${esc(g.name)}</div>
          <span class="tag">${esc(g.name)}</span>${isReady(g) ? "" : '<span class="tag soon">COMING SOON</span>'}
          <h1 class="g-title"><span class="hl">${esc(g.title)}</span></h1>
          <p class="g-catch">${esc(g.catch)}</p>
          ${g.cover ? `<figure class="g-cover"><img src="${esc(g.cover)}" alt="${esc(g.coverCaption)}">${g.coverCaption ? `<figcaption>${esc(g.coverCaption)}</figcaption>` : ""}</figure>` : ""}
        </div>
      </section>
      <div class="wrap">
        <div class="g-body">${body}</div>
        <nav class="pager">
          ${prev ? pg(prev, "← PREV", "prev") : ""}
          ${next ? pg(next, "NEXT →", "next") : ""}
        </nav>
      </div>`;
  }

  header();
  if (isTop) renderTop();
  if (document.getElementById("group")) renderGroup();
  footer();
})();
