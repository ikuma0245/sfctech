// =============================================================
//  サイトの中身はこのファイルだけ編集すればOK
//  各班の原稿が届いたら groups の該当箇所を書き換える
//  画像は images/ フォルダに入れて、ファイル名を書く
// =============================================================

window.SITE = {
  event: {
    name: "SFC TECH 2026",
    date: "2026年11月24日（火）",
    venue: "慶應義塾大学 北別館（東京都港区三田）",
    url: "https://www.tech.sfc.keio.ac.jp/",
  },
  lab: {
    name: "古谷研究室",
    nameEn: "Furutani Lab, Keio University SFC",
    members: "古谷 知之（総合政策学部 教授）／中島 有希大（政策・メディア研究科 特任助教）",
    theme: "AI人材育成と地域活性化",
    lead:
      "福島イノベーション・コースト構想「復興知」事業で取り組んでいる、AI人材育成を通じた復興支援を紹介します。",
    url: "", // 研究室の公式ページがあれば URL を入れる
  },
};

// -------------------------------------------------------------
//  班の一覧
//  status: "ready"（公開）/ "draft"（準備中と表示）
// -------------------------------------------------------------
window.GROUPS = [
  {
    id: "group1",
    status: "draft",
    name: "1班",
    color: "#A97FE0", // ヒーローやカードの背景色
    title: "プロジェクト名（準備中）",
    catch: "ひとことで言うと何をしているか",
    cover: "", // 例: "images/group1-cover.jpg"
    summary: "",
    background: "",
    results: [],
    images: [], // 例: [{ src: "images/group1-1.jpg", caption: "実験のようす" }]
    video: "", // YouTube の URL（任意）
    future: "",
    members: [],
    links: [], // 例: [{ label: "論文", url: "https://..." }]
  },
  {
    id: "group2",
    status: "draft",
    name: "2班",
    color: "#EE8BC8", // ヒーローやカードの背景色
    title: "プロジェクト名（準備中）",
    catch: "ひとことで言うと何をしているか",
    cover: "",
    summary: "",
    background: "",
    results: [],
    images: [],
    video: "",
    future: "",
    members: [],
    links: [],
  },
  {
    id: "group3",
    status: "draft",
    name: "3班",
    color: "#5EC4A6", // ヒーローやカードの背景色
    title: "プロジェクト名（準備中）",
    catch: "ひとことで言うと何をしているか",
    cover: "",
    summary: "",
    background: "",
    results: [],
    images: [],
    video: "",
    future: "",
    members: [],
    links: [],
  },
];

// -------------------------------------------------------------
//  メディア掲載（新しいものを上に）
// -------------------------------------------------------------
window.MEDIA = [
  {
    source: "PIVOT",
    program: "PIVOT TALK BUSINESS",
    date: "2026.11.13",
    title: "防衛テック投資の最前線",
    person: "古谷 知之（国際文化会館 新領域戦略研究所 共同代表／慶應義塾大学 総合政策学部 教授）",
    summary:
      "ウクライナや中東情勢を背景に、世界で急増する防衛テックへの投資。防衛市場の構造変化と日本の現在地、そして次の主戦場となる量子技術の可能性を解説。",
    duration: "30:54",
    url: "https://pivotmedia.co.jp/movie/15242",
    thumb: "https://pivotmedia.co.jp/images/static/converted/chapter/15242/ogp/15242.webp",
  },
];
