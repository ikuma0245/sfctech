(function () {
  const S = window.SITE;
  const G = window.GROUPS;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function footer() {
    const el = document.getElementById("footer");
    if (!el) return;
    el.innerHTML = `
      <p>${esc(S.lab.name)}（慶應義塾大学 湘南藤沢キャンパス）</p>
      <p><a href="${esc(S.event.url)}" target="_blank" rel="noopener">${esc(S.event.name)}</a>
        ／${esc(S.event.date)}／${esc(S.event.venue)}</p>`;
  }

  function youtubeEmbed(url) {
    const m = String(url).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : "";
  }

  // ---------------- index ----------------
  function renderIndex() {
    document.getElementById("hero").innerHTML = `
      <span class="eyebrow">${esc(S.event.name)}</span>
      <h1>${esc(S.lab.name)}</h1>
      <p class="en">${esc(S.lab.nameEn)}</p>
      <p class="theme">${esc(S.lab.theme)}</p>
      <p class="lead">${esc(S.lab.lead)}</p>
      <p class="meta">${esc(S.lab.members)}</p>`;

    document.getElementById("cards").innerHTML = G.map((g) => {
      const draft = g.status !== "ready";
      const thumb = g.cover
        ? `<img class="thumb" src="${esc(g.cover)}" alt="" loading="lazy">`
        : `<div class="thumb"></div>`;
      return `
        <a class="card${draft ? " draft" : ""}" href="group.html?id=${encodeURIComponent(g.id)}">
          ${thumb}
          <div class="body">
            <span class="tag">${esc(g.name)}</span>${draft ? '<span class="badge">準備中</span>' : ""}
            <h3>${esc(g.title)}</h3>
            <p>${esc(g.catch)}</p>
          </div>
        </a>`;
    }).join("");
  }

  // ---------------- group page ----------------
  function renderGroup() {
    const id = new URLSearchParams(location.search).get("id");
    const i = G.findIndex((g) => g.id === id);
    const main = document.getElementById("group");
    if (i < 0) {
      main.innerHTML = `<div class="draft-note">ページが見つかりませんでした。<br><a href="./">トップへ戻る</a></div>`;
      return;
    }
    const g = G[i];
    document.title = `${g.title}｜${S.lab.name} ${S.event.name}`;

    const block = (title, html) => (html ? `<section class="block"><h2>${title}</h2>${html}</section>` : "");
    const para = (t) => (t ? `<p>${esc(t)}</p>` : "");
    const list = (a) => (a && a.length ? `<ul>${a.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "");

    let body;
    if (g.status !== "ready") {
      body = `<div class="draft-note">このページは準備中です。<br>当日までに公開します。</div>`;
    } else {
      const gallery = g.images && g.images.length
        ? `<div class="gallery">${g.images.map((im) => `
            <figure><img src="${esc(im.src)}" alt="${esc(im.caption)}" loading="lazy">
            ${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`
        : "";
      const yt = g.video ? youtubeEmbed(g.video) : "";
      const video = yt ? `<div class="video"><iframe src="${yt}" allowfullscreen loading="lazy" title="動画"></iframe></div>` : "";
      const links = g.links && g.links.length
        ? `<ul>${g.links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>`
        : "";
      body = `
        ${g.cover ? `<img class="cover" src="${esc(g.cover)}" alt="">` : ""}
        ${block("概要", para(g.summary))}
        ${block("背景・目的", para(g.background))}
        ${block("成果", list(g.results))}
        ${block("写真", gallery)}
        ${block("動画", video)}
        ${block("今後の展望", para(g.future))}
        ${block("メンバー", g.members && g.members.length ? `<p>${g.members.map(esc).join("、")}</p>` : "")}
        ${block("関連リンク", links)}`;
    }

    const prev = G[i - 1], next = G[i + 1];
    main.innerHTML = `
      <a class="back" href="./">← ${esc(S.lab.name)} トップ</a>
      <header class="group-hero">
        <span class="eyebrow">${esc(g.name)}</span>
        <h1>${esc(g.title)}</h1>
        <p class="catch">${esc(g.catch)}</p>
      </header>
      ${body}
      <nav class="pager">
        <span>${prev ? `<a href="group.html?id=${encodeURIComponent(prev.id)}">← ${esc(prev.name)}</a>` : ""}</span>
        <span>${next ? `<a href="group.html?id=${encodeURIComponent(next.id)}">${esc(next.name)} →</a>` : ""}</span>
      </nav>`;
  }

  if (document.getElementById("cards")) renderIndex();
  if (document.getElementById("group")) renderGroup();
  footer();
})();
