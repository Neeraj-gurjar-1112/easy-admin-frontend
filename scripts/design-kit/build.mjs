// Design kit generator — writes the Easy Admin "Delivery agents" design as SVG artboards
// (desktop 1440 / tablet 768 / phone 375, filled + loading + empty + error states) plus a design
// board page (public/design/index.html) that lists the artboards and the token sheet.
//
// Why SVG: Figma imports SVG as editable frames (shapes + real text), so the kit becomes a Figma
// file in one drag-and-drop. Every value here is a token from src/styles/_variables.scss.
//
//   node scripts/design-kit/build.mjs   → public/design/*.svg + public/design/index.html
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "design");
mkdirSync(OUT, { recursive: true });

// ---- tokens (= _variables.scss, day values) --------------------------------------------
const C = {
  blue1: "#2563eb", blue2: "#1d4ed8", blue3: "#dbeafe",
  grey1: "#0f172a", grey2: "#475569", grey3: "#64748b", grey4: "#e3e8ef", grey5: "#f8fafc", grey6: "#f3f5f9", grey7: "#ffffff", grey8: "#cbd5e1",
  green1: "#15803d", green2: "#dcfce7", yellow1: "#b45309", yellow2: "#fef3c7", red1: "#b91c1c", red2: "#fee2e2",
  cyan1: "#0e7490", cyan2: "#cffafe", slate1: "#475569", slate2: "#e2e8f0", navy1: "#0f172a", navy2: "#cbd5e1", navy3: "#64748b",
  white: "#ffffff", sidebarActive: "rgba(37,99,235,0.22)",
};
const S = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 };
const F = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 28 };
const R = { sm: 7, md: 10, lg: 12, pill: 999 };
const SIZE = { topbar: 56, sidebar: 248, touch: 44, avatar: 36, avatarLg: 56, icon: 40 };
const FONT = "Inter, Arial, sans-serif";

// ---- svg helpers ---------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rect = (x, y, w, h, { fill = "none", stroke, rx = 0, sw = 1, opacity } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ""}${opacity !== undefined ? ` opacity="${opacity}"` : ""}/>`;
const text = (x, y, str, { size = F.sm, weight = 400, fill = C.grey1, anchor = "start", upper = false, spacing } = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ""} dominant-baseline="middle">${esc(upper ? String(str).toUpperCase() : str)}</text>`;
const circle = (cx, cy, r, fill, stroke) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}"` : ""}/>`;
const line = (x1, y1, x2, y2, stroke = C.grey4, sw = 1) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;
const group = (parts) => parts.join("\n");

// Simple geometric icons (design-level placeholders for PrimeIcons)
const icon = {
  truck: (x, y, c) => group([rect(x, y + 4, 12, 8, { fill: c, rx: 2 }), rect(x + 12, y + 7, 5, 5, { fill: c, rx: 1 }), circle(x + 4, y + 14, 2, c), circle(x + 13, y + 14, 2, c)]),
  users: (x, y, c) => group([circle(x + 6, y + 5, 3.5, c), circle(x + 13, y + 6, 2.5, c), rect(x, y + 10, 12, 6, { fill: c, rx: 3 }), rect(x + 10, y + 11, 8, 5, { fill: c, rx: 2.5 })]),
  clock: (x, y, c) => group([circle(x + 8, y + 8, 7, "none", c), line(x + 8, y + 4, x + 8, y + 8, c, 2), line(x + 8, y + 8, x + 11, y + 10, c, 2)]),
  bolt: (x, y, c) => `<polygon points="${x + 9},${y} ${x + 3},${y + 9} ${x + 8},${y + 9} ${x + 6},${y + 17} ${x + 13},${y + 7} ${x + 8},${y + 7}" fill="${c}"/>`,
  star: (x, y, c, size = 8) => {
    const pts = [];
    for (let i = 0; i < 10; i += 1) {
      const r = i % 2 ? size * 0.45 : size;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${(x + size + Math.cos(a) * r).toFixed(1)},${(y + size + Math.sin(a) * r).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}" fill="${c}"/>`;
  },
  search: (x, y, c) => group([circle(x + 7, y + 7, 5.5, "none", c), line(x + 11, y + 11, x + 16, y + 16, c, 2)]),
  chevron: (x, y, c) => `<polyline points="${x},${y + 4} ${x + 6},${y + 10} ${x + 12},${y + 4}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  plus: (x, y, c) => group([line(x + 7, y, x + 7, y + 14, c, 2), line(x, y + 7, x + 14, y + 7, c, 2)]),
  eye: (x, y, c) => group([`<ellipse cx="${x + 8}" cy="${y + 8}" rx="8" ry="5" fill="none" stroke="${c}" stroke-width="1.6"/>`, circle(x + 8, y + 8, 2.4, c)]),
  check: (x, y, c) => `<polyline points="${x + 2},${y + 8} ${x + 6},${y + 12} ${x + 14},${y + 3}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  ban: (x, y, c) => group([circle(x + 8, y + 8, 7, "none", c), line(x + 3, y + 3, x + 13, y + 13, c, 2)]),
  trash: (x, y, c) => group([rect(x + 3, y + 4, 10, 11, { fill: "none", stroke: c, rx: 1.5, sw: 1.6 }), line(x + 1, y + 4, x + 15, y + 4, c, 1.6), line(x + 6, y + 1, x + 10, y + 1, c, 1.6)]),
  menu: (x, y, c) => group([line(x, y + 2, x + 16, y + 2, c, 2), line(x, y + 8, x + 16, y + 8, c, 2), line(x, y + 14, x + 16, y + 14, c, 2)]),
  moon: (x, y, c) => `<path d="M${x + 12} ${y + 2}a8 8 0 1 0 6 12a7 7 0 0 1-6-12z" fill="${c}"/>`,
  inbox: (x, y, c) => group([rect(x, y + 6, 40, 26, { fill: "none", stroke: c, rx: 4, sw: 2.5 }), `<polyline points="${x},${y + 20} ${x + 12},${y + 20} ${x + 16},${y + 26} ${x + 24},${y + 26} ${x + 28},${y + 20} ${x + 40},${y + 20}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>`]),
  warning: (x, y, c) => group([`<polygon points="${x + 20},${y + 2} ${x + 39},${y + 36} ${x + 1},${y + 36}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>`, line(x + 20, y + 14, x + 20, y + 24, c, 3), circle(x + 20, y + 30, 1.8, c)]),
  refresh: (x, y, c) => group([`<path d="M${x + 14} ${y + 8}a6 6 0 1 1-2-4.5" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`, `<polyline points="${x + 11},${y + 1} ${x + 14},${y + 4} ${x + 11},${y + 7}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`]),
  arrowLeft: (x, y, c) => group([line(x + 2, y + 7, x + 14, y + 7, c, 2), `<polyline points="${x + 7},${y + 2} ${x + 2},${y + 7} ${x + 7},${y + 12}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`]),
  user: (x, y, c) => group([circle(x + 8, y + 5, 4, c), rect(x + 1, y + 11, 14, 6, { fill: c, rx: 3 })]),
  bag: (x, y, c) => group([rect(x + 4, y + 10, 32, 26, { fill: "none", stroke: c, rx: 4, sw: 2.5 }), `<path d="M${x + 13} ${y + 10}v-3a7 7 0 0 1 14 0v3" fill="none" stroke="${c}" stroke-width="2.5"/>`]),
  signOut: (x, y, c) => group([rect(x + 1, y + 1, 9, 14, { fill: "none", stroke: c, rx: 2, sw: 1.6 }), line(x + 7, y + 8, x + 16, y + 8, c, 1.8), `<polyline points="${x + 12},${y + 4} ${x + 16},${y + 8} ${x + 12},${y + 12}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`]),
};

const TONE = {
  success: [C.green1, C.green2], warning: [C.yellow1, C.yellow2], danger: [C.red1, C.red2], info: [C.cyan1, C.cyan2], neutral: [C.slate1, C.slate2], primary: [C.blue1, C.blue3],
};
const AVATAR_TONES = ["primary", "success", "warning", "danger", "info", "neutral"];
const textWidth = (str, size) => Math.round(String(str).length * size * 0.53);

function badge(x, y, label, tone, { dot = false, iconName } = {}) {
  const [fg, bg] = TONE[tone];
  const padX = S[2];
  const lead = dot ? 12 : iconName ? 19 : 0;
  const w = padX * 2 + lead + textWidth(label, F.xs);
  const h = 22;
  return group([
    rect(x, y, w, h, { fill: bg, rx: R.pill }),
    dot ? circle(x + padX + 4, y + h / 2, 4, fg) : "",
    iconName ? icon[iconName](x + padX - 1, y + 3, fg) : "",
    text(x + padX + lead, y + h / 2 + 0.5, label, { size: F.xs, weight: 600, fill: fg }),
  ]);
}

function avatar(x, y, name, size = SIZE.avatar) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 9973;
  const [fg, bg] = TONE[AVATAR_TONES[hash % 6]];
  const initials = name.split(/\s+/).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
  return group([circle(x + size / 2, y + size / 2, size / 2, bg), text(x + size / 2, y + size / 2 + 0.5, initials, { size: size > 40 ? F.lg : F.xs, weight: 700, fill: fg, anchor: "middle" })]);
}

function button(x, y, w, label, { variant = "primary", iconName, iconOnly = false, h = SIZE.touch } = {}) {
  const styles = {
    primary: { fill: C.blue1, stroke: C.blue1, fg: C.white },
    outlined: { fill: C.white, stroke: C.grey8, fg: C.grey2 },
    success: { fill: C.green1, stroke: C.green1, fg: C.white },
    dangerOutlined: { fill: C.white, stroke: C.red1, fg: C.red1 },
    text: { fill: "none", stroke: "none", fg: C.blue1 },
    dangerText: { fill: "none", stroke: "none", fg: C.red1 },
    disabled: { fill: C.white, stroke: C.grey4, fg: C.grey8 },
  }[variant];
  const parts = [rect(x, y, w, h, { fill: styles.fill, stroke: styles.stroke === "none" ? undefined : styles.stroke, rx: R.sm })];
  if (iconOnly) {
    parts.push(icon[iconName](x + w / 2 - 8, y + h / 2 - 8, styles.fg));
    return group(parts);
  }
  const tw = textWidth(label, F.sm);
  const iw = iconName ? 14 + S[2] : 0;
  const startX = x + (w - tw - iw) / 2;
  if (iconName) parts.push(icon[iconName](startX, y + h / 2 - 7, styles.fg));
  parts.push(text(startX + iw, y + h / 2 + 0.5, label, { size: F.sm, weight: 600, fill: styles.fg }));
  return group(parts);
}

function input(x, y, w, placeholder, { leadIcon, trailChevron, value, h = SIZE.touch } = {}) {
  const parts = [rect(x, y, w, h, { fill: C.white, stroke: C.grey8, rx: R.sm })];
  let tx = x + S[3];
  if (leadIcon) {
    parts.push(icon[leadIcon](x + S[3], y + h / 2 - 8, C.grey3));
    tx += 24;
  }
  parts.push(text(tx, y + h / 2 + 0.5, value ?? placeholder, { size: F.sm, fill: value ? C.grey1 : C.grey3 }));
  if (trailChevron) parts.push(icon.chevron(x + w - S[3] - 12, y + h / 2 - 7, C.grey3));
  return group(parts);
}

function card(x, y, w, h) {
  return rect(x, y, w, h, { fill: C.white, stroke: C.grey4, rx: R.lg });
}

function skeleton(x, y, w, h = 14) {
  return rect(x, y, w, h, { fill: C.grey4, rx: R.sm });
}

// ---- data (= the seed rows the build shows on page 1) --------------------------------------
const ROWS = [
  ["Harini Venkatesh", "+91 98765 00013", "harini.v@example.com", "Bike", false, "online", 0, 0, 0, "2026-10-06"],
  ["Imran Shaikh", "+91 91111 00099", "imran.shaikh@example.com", "Bike", false, "online", 0, 0, 0, "2026-10-05"],
  ["Tanvi Desai", "+91 98765 00007", "tanvi.desai@example.com", "Scooter", false, "online", 0, 0, 0, "2026-10-04"],
  ["Arjun Menon", "+91 95555 44332", "arjun.menon@example.com", "Car", false, "online", 0, 0, 0, "2026-10-03"],
  ["Deepak Nair", "+91 97444 55667", "deepak.nair@example.com", "Scooter", false, "online", 0, 0, 0, "2026-10-01"],
  ["Lakshmi Rao", "+91 98765 00002", "lakshmi.rao@example.com", "Bicycle", true, "online", 0, 45, 4.5, "2026-03-03"],
  ["Yash Thakur", "+91 98765 00014", "yash.thakur@example.com", "Bike", true, "online", 1, 199, 4.4, "2026-02-02"],
  ["Ayesha Siddiqui", "+91 98765 00009", "ayesha.siddiqui@example.com", "Bicycle", true, "online", 0, 88, 4.6, "2026-01-20"],
  ["Nikhil Chauhan", "+91 98765 00008", "nikhil.chauhan@example.com", "Bike", true, "busy", 1, 277, 4.3, "2025-11-11"],
  ["Pooja Mehta", "+91 94444 33322", "pooja.mehta@example.com", "Scooter", true, "offline", 0, 61, 3.9, "2025-10-30"],
];
const PRESENCE = { online: ["Online", "success"], busy: ["Busy", "warning"], offline: ["Offline", "neutral"] };
const fmt = (n) => n.toLocaleString("en-US");

// ---- shell: sidebar + topbar -------------------------------------------------------------
function shell(W, H, { sidebar = true, title = "Admin panel", mock = false } = {}) {
  const parts = [rect(0, 0, W, H, { fill: C.grey6 })];
  let contentX = 0;
  if (sidebar) {
    parts.push(rect(0, 0, SIZE.sidebar, H, { fill: C.navy1 }));
    parts.push(rect(S[5], S[5], S[8], S[8], { fill: C.blue1, rx: R.sm }));
    parts.push(text(S[5] + S[8] / 2, S[5] + S[8] / 2 + 0.5, "E", { size: F.base, weight: 700, fill: C.white, anchor: "middle" }));
    parts.push(text(S[5] + S[8] + S[3], S[5] + S[8] / 2 + 0.5, "Easy Admin", { size: F.base, weight: 600, fill: C.white }));
    parts.push(text(S[6], 80, "Operations", { size: F.xs, weight: 600, fill: C.navy3, upper: true, spacing: 0.7 }));
    parts.push(rect(S[3], 98, SIZE.sidebar - S[6], SIZE.touch, { fill: C.sidebarActive, rx: R.sm }));
    parts.push(icon.truck(S[6], 112, C.blue1));
    parts.push(text(S[6] + 28, 120.5, "Delivery agents", { size: F.sm, weight: 500, fill: C.white }));
    contentX = SIZE.sidebar;
  }
  const topW = W - contentX;
  parts.push(rect(contentX, 0, topW, SIZE.topbar, { fill: C.white }));
  parts.push(line(contentX, SIZE.topbar, W, SIZE.topbar, C.grey4));
  let tx = contentX + (sidebar ? S[6] : S[3]);
  if (!sidebar) {
    parts.push(icon.menu(tx + 6, SIZE.topbar / 2 - 8, C.grey2));
    tx += 44;
  }
  parts.push(text(tx, SIZE.topbar / 2 + 0.5, title, { size: F.sm, weight: 600, fill: C.grey2 }));
  // right side: theme toggle + account chip (+ sign-out)
  const rightPad = sidebar ? S[6] : S[3];
  let rx = W - rightPad;
  if (W >= 768) {
    rx -= 36;
    parts.push(icon.signOut(rx + 10, SIZE.topbar / 2 - 8, C.grey3));
    const chipLabel = mock ? "Demo mode — data stays in this browser" : "admin@example.com";
    const chipW = textWidth(chipLabel, F.xs) + 44;
    rx -= chipW + S[2];
    parts.push(rect(rx, SIZE.topbar / 2 - 16, chipW, 32, { fill: C.grey5, rx: R.pill }));
    parts.push(icon.user(rx + 12, SIZE.topbar / 2 - 8, C.grey2));
    parts.push(text(rx + 34, SIZE.topbar / 2 + 0.5, chipLabel, { size: F.xs, fill: C.grey2 }));
    rx -= 40;
  } else {
    rx -= 32;
    parts.push(circle(rx + 16, SIZE.topbar / 2, 16, C.grey5));
    parts.push(icon.user(rx + 8, SIZE.topbar / 2 - 8, C.grey2));
    rx -= 40;
  }
  parts.push(icon.moon(rx + 6, SIZE.topbar / 2 - 10, C.blue1));
  return { svg: group(parts), contentX, pad: W >= 768 ? S[6] : S[4] };
}

function pageHeader(x, y, w, title, desc, actionLabel, { stack = false } = {}) {
  const parts = [text(x, y + 14, title, { size: w < 480 ? F.xl : F["2xl"], weight: 700 })];
  if (stack) {
    const lines = wrap(desc, w, F.sm);
    lines.forEach((l, i) => parts.push(text(x, y + 40 + i * 20, l, { size: F.sm, fill: C.grey2 })));
    const by = y + 40 + lines.length * 20 + S[2];
    parts.push(button(x, by, w, actionLabel, { iconName: "plus" }));
    return { svg: group(parts), bottom: by + SIZE.touch };
  }
  parts.push(text(x, y + 40, desc, { size: F.sm, fill: C.grey2 }));
  const bw = textWidth(actionLabel, F.sm) + 14 + S[2] + S[4] * 2;
  parts.push(button(x + w - bw, y, bw, actionLabel, { iconName: "plus" }));
  return { svg: group(parts), bottom: y + 52 };
}

function wrap(str, w, size) {
  const max = Math.floor(w / (size * 0.56));
  const words = str.split(" ");
  const lines = [];
  let cur = "";
  for (const word of words) {
    if ((cur + " " + word).trim().length > max) {
      lines.push(cur.trim());
      cur = word;
    } else cur = (cur + " " + word).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

function tiles(x, y, w, cols, { loading = false } = {}) {
  const data = [
    ["Total agents", "32", "", "users", "primary"],
    ["Pending approval", "5", "Needs a decision", "clock", "warning"],
    ["Online now", "18", "7 busy · 7 offline", "bolt", "success"],
    ["Average rating", "4.5", "Out of 5, rated agents only", "star", "info"],
  ];
  const gap = S[4];
  const tw = (w - gap * (cols - 1)) / cols;
  const th = 112;
  const parts = [];
  data.forEach((d, i) => {
    const cx = x + (i % cols) * (tw + gap);
    const cy = y + Math.floor(i / cols) * (th + gap);
    parts.push(card(cx, cy, tw, th));
    parts.push(text(cx + S[5], cy + 30, d[0], { size: F.xs, weight: 500, fill: C.grey3, upper: true, spacing: 0.5 }));
    if (loading) {
      parts.push(skeleton(cx + S[5], cy + 46, 64, 28));
    } else {
      parts.push(text(cx + S[5], cy + 60, d[1], { size: F["3xl"], weight: 700 }));
      if (d[2]) parts.push(text(cx + S[5], cy + 88, d[2], { size: F.xs, fill: C.grey2 }));
    }
    const [fg, bg] = TONE[d[4]];
    parts.push(rect(cx + tw - S[5] - SIZE.icon, cy + S[5], SIZE.icon, SIZE.icon, { fill: bg, rx: R.md }));
    parts.push(icon[d[3]](cx + tw - S[5] - SIZE.icon + 11, cy + S[5] + 11, fg));
  });
  const rows = Math.ceil(data.length / cols);
  return { svg: group(parts), bottom: y + rows * th + (rows - 1) * gap };
}

function filterBar(x, y, w, mode) {
  const parts = [];
  const pad = S[4];
  const gap = S[3];
  if (mode === "desktop") {
    const h = SIZE.touch + pad * 2;
    parts.push(card(x, y, w, h));
    const resetW = 104;
    const inner = w - pad * 2 - resetW - gap;
    const searchW = Math.round(inner * 0.36);
    const ddW = Math.round((inner - searchW - gap * 3) / 3);
    let cx = x + pad;
    parts.push(input(cx, y + pad, searchW, "Search name, phone or email", { leadIcon: "search" }));
    cx += searchW + gap;
    for (const p of ["All vehicles", "Any approval", "Any status"]) {
      parts.push(input(cx, y + pad, ddW, p, { trailChevron: true }));
      cx += ddW + gap;
    }
    parts.push(button(x + w - pad - resetW, y + pad, resetW, "Reset", { variant: "disabled", iconName: "refresh" }));
    return { svg: group(parts), bottom: y + h };
  }
  if (mode === "tablet") {
    const h = SIZE.touch * 2 + pad * 2 + gap;
    parts.push(card(x, y, w, h));
    const inner = w - pad * 2;
    const searchW = Math.round(inner * 0.42);
    const ddW = Math.round((inner - searchW - gap * 2) / 2);
    parts.push(input(x + pad, y + pad, searchW, "Search name, phone or email", { leadIcon: "search" }));
    parts.push(input(x + pad + searchW + gap, y + pad, ddW, "All vehicles", { trailChevron: true }));
    parts.push(input(x + pad + searchW + gap * 2 + ddW, y + pad, ddW, "Any approval", { trailChevron: true }));
    const resetW = 104;
    parts.push(input(x + pad, y + pad + SIZE.touch + gap, inner - resetW - gap, "Any status", { trailChevron: true }));
    parts.push(button(x + w - pad - resetW, y + pad + SIZE.touch + gap, resetW, "Reset", { variant: "disabled", iconName: "refresh" }));
    return { svg: group(parts), bottom: y + h };
  }
  // phone: everything stacked
  const items = 5;
  const h = SIZE.touch * items + gap * (items - 1) + pad * 2;
  parts.push(card(x, y, w, h));
  let cy = y + pad;
  parts.push(input(x + pad, cy, w - pad * 2, "Search name, phone or email", { leadIcon: "search" }));
  cy += SIZE.touch + gap;
  for (const p of ["All vehicles", "Any approval", "Any status"]) {
    parts.push(input(x + pad, cy, w - pad * 2, p, { trailChevron: true }));
    cy += SIZE.touch + gap;
  }
  parts.push(button(x + pad, cy, w - pad * 2, "Reset", { variant: "disabled", iconName: "refresh" }));
  return { svg: group(parts), bottom: y + h };
}

const COLS = [
  ["Agent", 190], ["Contact", 210], ["Vehicle", 90], ["Approval", 120], ["Status", 100], ["Assigned", 90, "right"], ["Completed", 100, "right"], ["Rating", 80, "right"], ["Joined", 110], ["", 130, "right"],
];

function tableCard(x, y, w, { state = "filled", clipped = false, rowCount = 10 } = {}) {
  const headH = 48;
  const rowH = 73;
  const footH = 72;
  const parts = [];
  let h;
  if (state === "filled" || state === "loading") h = headH + rowH * rowCount + footH;
  else h = 300;
  parts.push(card(x, y, w, h));
  // clip everything inside the card (table wider than a phone/tablet card scrolls inside)
  const clipId = `clip${Math.round(x + y + w)}`;
  parts.push(`<defs><clipPath id="${clipId}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${R.lg}"/></clipPath></defs>`);
  const inner = [];
  if (state === "filled" || state === "loading") {
    inner.push(rect(x, y, Math.max(w, 1220), headH, { fill: C.grey5 }));
    inner.push(line(x, y + headH, x + Math.max(w, 1220), y + headH, C.grey4));
    let cx = x + S[4];
    COLS.forEach(([label, cw, align]) => {
      const tx = align === "right" ? cx + cw - S[4] : cx;
      inner.push(text(tx, y + headH / 2 + 0.5, label, { size: F.xs, weight: 600, fill: C.grey2, upper: true, spacing: 0.4, anchor: align === "right" ? "end" : "start" }));
      cx += cw;
    });
    for (let i = 0; i < rowCount; i += 1) {
      const ry = y + headH + i * rowH;
      if (i > 0) inner.push(line(x, ry, x + Math.max(w, 1220), ry, C.grey4));
      cx = x + S[4];
      if (state === "loading") {
        COLS.forEach(([, cw]) => {
          inner.push(skeleton(cx, ry + rowH / 2 - 7, Math.max(40, cw - 40)));
          cx += cw;
        });
        continue;
      }
      const [name, phone, email, vehicle, approved, presence, assigned, completed, rating, joined] = ROWS[i % ROWS.length];
      inner.push(avatar(cx, ry + rowH / 2 - SIZE.avatar / 2, name));
      inner.push(text(cx + SIZE.avatar + S[3], ry + 27, name, { size: F.sm, weight: 600 }));
      inner.push(text(cx + SIZE.avatar + S[3], ry + 47, `…${(6743 + i).toString(16)}c7`, { size: F.xs, fill: C.grey2 }));
      cx += COLS[0][1];
      inner.push(text(cx, ry + 27, phone, { size: F.sm, weight: 600 }));
      inner.push(text(cx, ry + 47, email, { size: F.xs, fill: C.grey2 }));
      cx += COLS[1][1];
      inner.push(badge(cx, ry + rowH / 2 - 11, vehicle, "info"));
      cx += COLS[2][1];
      inner.push(approved ? badge(cx, ry + rowH / 2 - 11, "Approved", "success", { iconName: "check" }) : badge(cx, ry + rowH / 2 - 11, "Pending", "warning", { iconName: "clock" }));
      cx += COLS[3][1];
      const [pl, pt] = PRESENCE[presence];
      inner.push(badge(cx, ry + rowH / 2 - 11, pl, pt, { dot: true }));
      cx += COLS[4][1];
      inner.push(text(cx + COLS[5][1] - S[4], ry + rowH / 2 + 0.5, fmt(assigned), { size: F.sm, anchor: "end" }));
      cx += COLS[5][1];
      inner.push(text(cx + COLS[6][1] - S[4], ry + rowH / 2 + 0.5, fmt(completed), { size: F.sm, anchor: "end" }));
      cx += COLS[6][1];
      if (rating > 0) {
        inner.push(icon.star(cx + COLS[7][1] - S[4] - 44, ry + rowH / 2 - 7, C.yellow1, 7));
        inner.push(text(cx + COLS[7][1] - S[4], ry + rowH / 2 + 0.5, rating.toFixed(1), { size: F.sm, anchor: "end" }));
      } else inner.push(text(cx + COLS[7][1] - S[4], ry + rowH / 2 + 0.5, "-", { size: F.sm, anchor: "end" }));
      cx += COLS[7][1];
      inner.push(text(cx, ry + rowH / 2 + 0.5, joined, { size: F.sm }));
      cx += COLS[8][1];
      const ax = cx + COLS[9][1] - S[4] - 44 * 3;
      inner.push(button(ax, ry + rowH / 2 - 22, SIZE.touch, "", { variant: "text", iconName: "eye", iconOnly: true }));
      inner.push(approved ? group([rect(ax + 44, ry + rowH / 2 - 22, 44, 44, { fill: "none" }), icon.ban(ax + 44 + 14, ry + rowH / 2 - 8, C.red1)]) : group([icon.check(ax + 44 + 14, ry + rowH / 2 - 8, C.green1)]));
      inner.push(icon.trash(ax + 88 + 14, ry + rowH / 2 - 8, C.grey3));
    }
    // footer
    const fy = y + headH + rowH * rowCount;
    inner.push(line(x, fy, x + Math.max(w, 1220), fy, C.grey4));
    inner.push(text(x + S[4], fy + footH / 2 + 0.5, "Total", { size: F.sm, fill: C.grey2 }));
    inner.push(text(x + S[4] + 44, fy + footH / 2 + 0.5, "32", { size: F.sm, weight: 700 }));
    const pagerRight = x + w - S[4];
    if (w >= 700) {
      inner.push(rect(pagerRight - 76, fy + footH / 2 - 22, 76, 44, { fill: C.white, stroke: C.grey8, rx: R.sm }));
      inner.push(text(pagerRight - 56, fy + footH / 2 + 0.5, "10", { size: F.sm }));
      inner.push(icon.chevron(pagerRight - 28, fy + footH / 2 - 7, C.grey3));
      let px = pagerRight - 76 - S[3];
      ["»", "›", "4", "3", "2", "1", "‹", "«"].forEach((p, i) => {
        px -= 40;
        if (p === "1") inner.push(circle(px + 20, fy + footH / 2, 20, C.blue3));
        inner.push(text(px + 20, fy + footH / 2 + 0.5, p, { size: F.sm, fill: i === 5 ? C.blue2 : C.grey2, anchor: "middle", weight: p === "1" ? 600 : 400 }));
      });
    } else {
      let px = x + w / 2 - 100;
      ["‹", "1", "2", "3", "4", "›"].forEach((p) => {
        if (p === "1") inner.push(circle(px + 20, fy + footH / 2 + 18, 20, C.blue3));
        inner.push(text(px + 20, fy + footH / 2 + 18.5, p, { size: F.sm, fill: C.grey2, anchor: "middle", weight: p === "1" ? 600 : 400 }));
        px += 40;
      });
    }
  } else if (state === "empty") {
    inner.push(icon.inbox(x + w / 2 - 20, y + 70, C.grey3));
    inner.push(text(x + w / 2, y + 140, "No agents match these filters", { size: F.lg, weight: 600, anchor: "middle" }));
    inner.push(text(x + w / 2, y + 168, "Try a different name, phone or email, or clear the filters.", { size: F.sm, fill: C.grey2, anchor: "middle" }));
    inner.push(button(x + w / 2 - 80, y + 196, 160, "Clear filters", { variant: "outlined", iconName: "refresh" }));
  } else if (state === "error") {
    inner.push(icon.warning(x + w / 2 - 20, y + 66, C.red1));
    inner.push(text(x + w / 2, y + 140, "Could not load data", { size: F.lg, weight: 600, anchor: "middle" }));
    inner.push(text(x + w / 2, y + 168, "Cannot reach the server. Check that the API is running and try again.", { size: F.sm, fill: C.grey2, anchor: "middle" }));
    inner.push(button(x + w / 2 - 70, y + 196, 140, "Try again", { variant: "outlined", iconName: "refresh" }));
  }
  parts.push(`<g clip-path="url(#${clipId})">${inner.join("\n")}</g>`);
  if (clipped && (state === "filled" || state === "loading")) parts.push(text(x + w - S[3], y + headH / 2 + 0.5, "scrolls →", { size: F.xs, fill: C.grey3, anchor: "end" }));
  return { svg: group(parts), bottom: y + h };
}

// ---- screens ---------------------------------------------------------------------------
function listScreen(W, state = "filled") {
  const mode = W >= 1024 ? "desktop" : W >= 768 ? "tablet" : "phone";
  const H = mode === "desktop" ? 1060 : mode === "tablet" ? 1260 : 1760;
  const sh = shell(W, H, { sidebar: mode === "desktop" });
  const x = sh.contentX + sh.pad;
  const w = W - sh.contentX - sh.pad * 2;
  let y = SIZE.topbar + sh.pad;
  const parts = [];
  const head = pageHeader(x, y, w, "Delivery agents", "Everyone who delivers for Easy: approval, availability and performance at a glance.", "Add agent", { stack: mode === "phone" });
  parts.push(head.svg);
  y = head.bottom + S[4];
  const t = tiles(x, y, w, mode === "desktop" ? 4 : mode === "tablet" ? 2 : 1, { loading: state === "loading" });
  parts.push(t.svg);
  y = t.bottom + S[4];
  const f = filterBar(x, y, w, mode);
  parts.push(f.svg);
  y = f.bottom + S[4];
  const tb = tableCard(x, y, w, { state, clipped: mode !== "desktop" });
  parts.push(tb.svg);
  const finalH = Math.max(H, tb.bottom + sh.pad);
  return { W, H: finalH, svg: [shell(W, finalH, { sidebar: mode === "desktop" }).svg, ...parts] };
}

function formScreen(W, { mode = "create", W2 } = {}) {
  const phone = W < 768;
  const H = phone ? 1260 : 820;
  const sh = shell(W, H, { sidebar: W >= 1024 });
  const x = sh.contentX + sh.pad;
  const w = W - sh.contentX - sh.pad * 2;
  let y = SIZE.topbar + sh.pad;
  const parts = [];
  const title = mode === "create" ? "Add delivery agent" : "Edit Harini Venkatesh";
  const desc = mode === "create" ? "Create an account for a new delivery partner. They sign in to the partner app with this email and password." : "Changes apply immediately in the partner app.";
  parts.push(text(x, y + 14, title, { size: phone ? F.xl : F["2xl"], weight: 700 }));
  if (phone) {
    wrap(desc, w, F.sm).forEach((l, i) => parts.push(text(x, y + 40 + i * 20, l, { size: F.sm, fill: C.grey2 })));
    y += 40 + wrap(desc, w, F.sm).length * 20 + S[2];
    parts.push(button(x, y, w, "Back to list", { variant: "text", iconName: "arrowLeft" }));
    y += SIZE.touch + S[4];
  } else {
    parts.push(text(x, y + 40, desc, { size: F.sm, fill: C.grey2 }));
    parts.push(button(x + w - 150, y, 150, "Back to list", { variant: "text", iconName: "arrowLeft" }));
    y += 52 + S[4];
  }
  const pad = phone ? S[4] : S[6];
  const cols = phone ? 1 : 2;
  const gapX = S[6];
  const fieldW = (w - pad * 2 - gapX * (cols - 1)) / cols;
  const fields = [
    ["Full name *", mode === "edit" ? "Harini Venkatesh" : "", ""],
    ["Email *", mode === "edit" ? "harini.v@example.com" : "", ""],
    ["Phone *", mode === "edit" ? "+91 98765 00013" : "", "+91 98765 43210"],
    ["Vehicle *", "Bike", "", true],
    ["License number", mode === "edit" ? "TN22 20261006" : "", "MH12 20250001"],
    [mode === "edit" ? "New password" : "Password *", "", mode === "edit" ? "Leave blank to keep the current one" : ""],
  ];
  const fieldH = 24 + SIZE.touch + 10;
  const rows = Math.ceil(fields.length / cols);
  const switchesH = phone ? 3 * 76 + 2 * S[4] : 76;
  const cardH = pad * 2 + rows * fieldH + (rows - 1) * S[4] + 22 + S[6] + switchesH + S[6] + SIZE.touch;
  parts.push(card(x, y, w, cardH));
  fields.forEach((f, i) => {
    const fx = x + pad + (i % cols) * (fieldW + gapX);
    const fy = y + pad + Math.floor(i / cols) * (fieldH + S[4]);
    const req = f[0].endsWith(" *");
    parts.push(text(fx, fy + 8, f[0].replace(" *", ""), { size: F.sm, weight: 500, fill: C.grey2 }));
    if (req) parts.push(text(fx + textWidth(f[0].replace(" *", ""), F.sm) + 6, fy + 8, "*", { size: F.sm, fill: C.red1 }));
    parts.push(input(fx, fy + 24, fieldW, f[2] || "", { value: f[1] || undefined, trailChevron: !!f[3] }));
    if (i === 5) parts.push(text(fx, fy + 24 + SIZE.touch + 12, "Used by the agent in the partner app. 8–72 characters.", { size: F.xs, fill: C.grey3 }));
  });
  let sy = y + pad + rows * fieldH + (rows - 1) * S[4] + 22 + S[6] - 10;
  const switches = [
    ["Approved", "Can accept orders. Pending agents only see the waiting screen.", false],
    ["Active account", "Off = suspended; the agent cannot go online.", true],
    ["Available for new orders", "Off while the agent is on a delivery.", true],
  ];
  const sw = phone ? w - pad * 2 : (w - pad * 2 - S[4] * 2) / 3;
  switches.forEach((s, i) => {
    const sx = phone ? x + pad : x + pad + i * (sw + S[4]);
    const syy = phone ? sy + i * (76 + S[4]) : sy;
    parts.push(rect(sx, syy, sw, 76, { fill: C.white, stroke: C.grey4, rx: R.md }));
    parts.push(rect(sx + S[4], syy + 20, 44, 24, { fill: s[2] ? C.blue1 : C.grey8, rx: R.pill }));
    parts.push(circle(sx + S[4] + (s[2] ? 32 : 12), syy + 32, 9, C.white));
    parts.push(text(sx + S[4] + 56, syy + 26, s[0], { size: F.sm, weight: 600 }));
    wrap(s[1], sw - 72 - S[4], F.xs).slice(0, 2).forEach((l, li) => parts.push(text(sx + S[4] + 56, syy + 46 + li * 16, l, { size: F.xs, fill: C.grey3 })));
  });
  const by = y + cardH - pad - SIZE.touch;
  if (phone) {
    parts.push(button(x + pad, by - SIZE.touch - S[2], w - pad * 2, mode === "create" ? "Create agent" : "Save changes", { iconName: "check" }));
    parts.push(button(x + pad, by, w - pad * 2, "Cancel", { variant: "outlined" }));
  } else {
    parts.push(button(x + w - pad - 170, by, 170, mode === "create" ? "Create agent" : "Save changes", { iconName: "check" }));
    parts.push(button(x + w - pad - 170 - S[2] - 96, by, 96, "Cancel", { variant: "outlined" }));
  }
  const finalH = Math.max(H, y + cardH + sh.pad);
  return { W, H: finalH, svg: [shell(W, finalH, { sidebar: W >= 1024 }).svg, ...parts] };
}

function detailsScreen(W) {
  const phone = W < 768;
  const H = phone ? 1780 : 900;
  const sh = shell(W, H, { sidebar: W >= 1024 });
  const x = sh.contentX + sh.pad;
  const w = W - sh.contentX - sh.pad * 2;
  let y = SIZE.topbar + sh.pad;
  const parts = [];
  parts.push(text(x, y + 14, "Delivery agent", { size: phone ? F.xl : F["2xl"], weight: 700 }));
  const desc = "Profile, approval and performance of one delivery partner.";
  if (phone) {
    wrap(desc, w, F.sm).forEach((l, i) => parts.push(text(x, y + 40 + i * 20, l, { size: F.sm, fill: C.grey2 })));
    y += 40 + wrap(desc, w, F.sm).length * 20 + S[2];
    parts.push(button(x, y, w, "Back to list", { variant: "text", iconName: "arrowLeft" }));
    y += SIZE.touch + S[4];
  } else {
    parts.push(text(x, y + 40, desc, { size: F.sm, fill: C.grey2 }));
    parts.push(button(x + w - 150, y, 150, "Back to list", { variant: "text", iconName: "arrowLeft" }));
    y += 52 + S[4];
  }
  // hero
  const heroH = phone ? 236 : 104;
  parts.push(card(x, y, w, heroH));
  const pad = phone ? S[4] : S[6];
  parts.push(avatar(x + pad, y + S[5], "Harini Venkatesh", SIZE.avatarLg));
  parts.push(text(x + pad + SIZE.avatarLg + S[4], y + 38, "Harini Venkatesh", { size: F.xl, weight: 700 }));
  let bx = x + pad + SIZE.avatarLg + S[4];
  parts.push(badge(bx, y + 54, "Pending", "warning", { iconName: "clock" }));
  bx += 86 + S[2];
  parts.push(badge(bx, y + 54, "Online", "success", { dot: true }));
  bx += 74 + S[2];
  parts.push(badge(bx, y + 54, "Bike", "info"));
  bx += 50 + S[2];
  if (!phone) parts.push(text(bx, y + 65, "Joined 2026-10-06", { size: F.xs, fill: C.grey2 }));
  else parts.push(text(x + pad + SIZE.avatarLg + S[4], y + 90, "Joined 2026-10-06", { size: F.xs, fill: C.grey2 }));
  if (phone) {
    const bw = (w - pad * 2 - S[2]) / 2;
    parts.push(button(x + pad, y + 120, bw, "Edit", { variant: "outlined" }));
    parts.push(button(x + pad + bw + S[2], y + 120, bw, "Approve", { variant: "success", iconName: "check" }));
    parts.push(button(x + pad, y + 120 + SIZE.touch + S[2], w - pad * 2, "Delete", { variant: "dangerText", iconName: "trash" }));
  } else {
    let ax = x + w - pad;
    ax -= 100;
    parts.push(button(ax, y + 30, 100, "Delete", { variant: "dangerText", iconName: "trash" }));
    ax -= 124 + S[2];
    parts.push(button(ax, y + 30, 124, "Approve", { variant: "success", iconName: "check" }));
    ax -= 92 + S[2];
    parts.push(button(ax, y + 30, 92, "Edit", { variant: "outlined" }));
  }
  y += heroH + S[4];
  // info cards
  const cardW = phone ? w : (w - S[4]) / 2;
  const profileH = 300;
  parts.push(card(x, y, cardW, profileH));
  parts.push(text(x + S[5], y + 32, "Profile", { size: F.base, weight: 600 }));
  const kv = [["Email", "harini.v@example.com"], ["Phone", "+91 98765 00013"], ["License", "TN22 20261006"], ["Working hours", "09:00 – 21:00"], ["Last location", "Unknown"], ["Id", "6ac4d744cd5edc92c06743c7"]];
  kv.forEach(([k, v], i) => {
    const ky = y + 64 + i * 36;
    parts.push(text(x + S[5], ky, k, { size: F.xs, weight: 500, fill: C.grey3, upper: true, spacing: 0.4 }));
    parts.push(text(x + S[5] + (phone ? 112 : 130), ky, v, { size: F.sm }));
  });
  const perfX = phone ? x : x + cardW + S[4];
  const perfY = phone ? y + profileH + S[4] : y;
  const perfH = phone ? 4 * 112 + 3 * S[4] + 64 : 300;
  parts.push(card(perfX, perfY, cardW, perfH));
  parts.push(text(perfX + S[5], perfY + 32, "Performance", { size: F.base, weight: 600 }));
  const mini = [["Assigned now", "0", "", "users", "primary"], ["Completed", "0", "", "check", "success"], ["Rating", "-", "0 ratings", "star", "warning"], ["Deliveries by status", "0", "No orders recorded yet", "bolt", "info"]];
  const mcols = phone ? 1 : 2;
  const mw = (cardW - S[5] * 2 - S[4] * (mcols - 1)) / mcols;
  mini.forEach((d, i) => {
    const mx = perfX + S[5] + (i % mcols) * (mw + S[4]);
    const my = perfY + 52 + Math.floor(i / mcols) * (112 + S[4]);
    parts.push(rect(mx, my, mw, 104, { fill: C.white, stroke: C.grey4, rx: R.lg }));
    parts.push(text(mx + S[4], my + 26, d[0], { size: F.xs, weight: 500, fill: C.grey3, upper: true, spacing: 0.4 }));
    parts.push(text(mx + S[4], my + 56, d[1], { size: F["3xl"], weight: 700 }));
    if (d[2]) parts.push(text(mx + S[4], my + 84, d[2], { size: F.xs, fill: C.grey2 }));
    const [fg, bg] = TONE[d[4]];
    parts.push(rect(mx + mw - S[4] - SIZE.icon, my + S[4], SIZE.icon, SIZE.icon, { fill: bg, rx: R.md }));
    parts.push(icon[d[3]](mx + mw - S[4] - SIZE.icon + 11, my + S[4] + 11, fg));
  });
  y = (phone ? perfY + perfH : y + Math.max(profileH, perfH)) + S[4];
  const ordersH = 250;
  parts.push(card(x, y, w, ordersH));
  parts.push(text(x + S[5], y + 32, "Recent orders", { size: F.base, weight: 600 }));
  parts.push(icon.bag(x + w / 2 - 20, y + 70, C.grey3));
  parts.push(text(x + w / 2, y + 140, "No deliveries yet", { size: F.lg, weight: 600, anchor: "middle" }));
  parts.push(text(x + w / 2, y + 168, "Orders assigned to this agent will show up here.", { size: F.sm, fill: C.grey2, anchor: "middle" }));
  const finalH = Math.max(H, y + ordersH + sh.pad);
  return { W, H: finalH, svg: [shell(W, finalH, { sidebar: W >= 1024 }).svg, ...parts] };
}

function loginScreen(W) {
  const H = W < 768 ? 720 : 800;
  const cw = Math.min(420, W - S[4] * 2);
  const ch = 420;
  const cx = (W - cw) / 2;
  const cy = (H - ch) / 2;
  const pad = W < 480 ? S[5] : S[8];
  const parts = [rect(0, 0, W, H, { fill: C.grey6 }), card(cx, cy, cw, ch)];
  parts.push(rect(cx + pad, cy + pad, S[8], S[8], { fill: C.blue1, rx: R.sm }));
  parts.push(text(cx + pad + S[8] / 2, cy + pad + S[8] / 2 + 0.5, "E", { size: F.base, weight: 700, fill: C.white, anchor: "middle" }));
  parts.push(text(cx + pad + S[8] + S[3], cy + pad + 10, "Easy Admin", { size: F.xl, weight: 700 }));
  parts.push(text(cx + pad + S[8] + S[3], cy + pad + 30, "Sign in with your admin account", { size: F.sm, fill: C.grey2 }));
  let fy = cy + pad + S[8] + S[6];
  for (const [label, ph] of [["Email", "admin@example.com"], ["Password", "••••••••••"]]) {
    parts.push(text(cx + pad, fy + 8, label, { size: F.sm, weight: 500, fill: C.grey2 }));
    parts.push(input(cx + pad, fy + 24, cw - pad * 2, ph));
    fy += 24 + SIZE.touch + S[4];
  }
  parts.push(button(cx + pad, fy, cw - pad * 2, "Sign in"));
  return { W, H, svg: parts };
}

// ---- write artboards -------------------------------------------------------------------
const ARTBOARDS = [
  ["01-list-1440-filled", listScreen(1440, "filled")],
  ["02-list-1440-loading", listScreen(1440, "loading")],
  ["03-list-1440-empty", listScreen(1440, "empty")],
  ["04-list-1440-error", listScreen(1440, "error")],
  ["05-list-768-filled", listScreen(768, "filled")],
  ["06-list-375-filled", listScreen(375, "filled")],
  ["07-create-1440", formScreen(1440, { mode: "create" })],
  ["08-create-375", formScreen(375, { mode: "create" })],
  ["09-edit-1440", formScreen(1440, { mode: "edit" })],
  ["10-details-1440", detailsScreen(1440)],
  ["11-details-375", detailsScreen(375)],
  ["12-login-1440", loginScreen(1440)],
  ["13-login-375", loginScreen(375)],
];

const manifest = [];
for (const [name, ab] of ARTBOARDS) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ab.W}" height="${ab.H}" viewBox="0 0 ${ab.W} ${ab.H}" font-family="${FONT}">\n<title>${name}</title>\n${ab.svg.join("\n")}\n</svg>\n`;
  writeFileSync(join(OUT, `${name}.svg`), svg);
  manifest.push({ name, w: ab.W, h: ab.H });
}

// ---- design board page ------------------------------------------------------------------
const tokenRows = Object.entries(C)
  .filter(([k]) => !["white", "sidebarActive"].includes(k))
  .map(([k, v]) => `<tr><td><span class="swatch" style="background:${v}"></span></td><td><code>$${k.replace(/(\d)$/, "-b$1")}</code></td><td><code>${v}</code></td></tr>`)
  .join("");
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Easy Admin — Delivery agents · design board</title>
<style>
  :root{--bg:#f3f5f9;--surface:#fff;--border:#e3e8ef;--text:#0f172a;--text2:#475569;--muted:#64748b;--blue:#2563eb}
  body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,Arial,sans-serif;font-size:14px}
  header{background:#0f172a;color:#fff;padding:20px 24px}header h1{margin:0;font-size:20px}header p{margin:6px 0 0;color:#cbd5e1}
  main{max-width:1600px;margin:0 auto;padding:24px;display:flex;flex-direction:column;gap:24px}
  section{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px}
  h2{margin:0 0 12px;font-size:16px}p.note{color:var(--text2);margin:0 0 12px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}
  figure{margin:0;border:1px solid var(--border);border-radius:10px;overflow:hidden;background:#fff}
  figure img{display:block;width:100%;height:auto}figcaption{padding:10px 12px;font-size:12px;color:var(--text2);display:flex;justify-content:space-between}
  table{border-collapse:collapse;font-size:13px}td,th{padding:6px 10px;border-bottom:1px solid var(--border);text-align:left}
  .swatch{display:inline-block;width:28px;height:18px;border-radius:4px;border:1px solid var(--border)}
  code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
  .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
</style></head><body>
<header><h1>Easy Admin — Delivery agents · design board</h1><p>Generated from the token file. Desktop 1440 · tablet 768 · phone 375 · filled / loading / empty / error. Each SVG imports into Figma as an editable frame.</p></header>
<main>
<section><h2>Artboards (${manifest.length})</h2><p class="note">Click to open the SVG at full size. The same files live in the repo under <code>public/design/</code>; PNG exports under <code>docs/design/</code>.</p>
<div class="grid">${manifest.map((m) => `<figure><a href="/design/${m.name}.svg"><img src="/design/${m.name}.svg" alt="${m.name}" loading="lazy"></a><figcaption><span>${m.name}</span><span>${m.w} × ${m.h}</span></figcaption></figure>`).join("")}</div></section>
<section><h2>Tokens</h2><div class="cols">
<div><h3 style="margin:0 0 8px;font-size:14px">Colours (day values; every one has a night twin in <code>_variables.scss</code>)</h3><table>${tokenRows}</table></div>
<div><h3 style="margin:0 0 8px;font-size:14px">Type</h3><table><tr><td>Family</td><td>Inter</td></tr><tr><td>Page title</td><td>24 / 700 (20 on phones)</td></tr><tr><td>KPI number</td><td>28 / 700</td></tr><tr><td>Section title</td><td>16 / 600</td></tr><tr><td>Body</td><td>14 / 400 · 600 for primary cell text</td></tr><tr><td>Labels / badges / hints</td><td>12 / 500–600</td></tr></table>
<h3 style="margin:16px 0 8px;font-size:14px">Spacing · radius · sizes</h3><table><tr><td>Spacing scale</td><td>4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64</td></tr><tr><td>Radius</td><td>7 (controls) · 10 (chips) · 12 (cards) · pill</td></tr><tr><td>Sidebar / top bar</td><td>248 × full · 56</td></tr><tr><td>Tap target</td><td>44</td></tr><tr><td>Avatar</td><td>36 · 56 (details)</td></tr><tr><td>Breakpoints</td><td>1920 · 1600 · 1440 · 1366 · 1280 · 1024 · 991 · 768 · 640 · 480 · 375 — sidebar → drawer &lt; 1024, tiles 4→2→1, filters/fields stack &lt; 768</td></tr></table></div>
</div></section>
</main></body></html>`;
writeFileSync(join(OUT, "index.html"), html);
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`wrote ${manifest.length} artboards + index.html to ${OUT}`);
