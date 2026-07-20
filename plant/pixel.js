/* ecoc.app/plant — generative pixel portrait
   Draws a plant from its CharacterProfile traits. Nothing is hand-drawn:
   habit sets the silhouette, leaf/stem/flower fields do the rest. */

const W = 34, H = 42, CX = 17, GROUND = H - 1;

const HUES = {
  orange: { c: '#e8892f', a: '#b5541a' },
  yellow: { c: '#e8c53c', a: '#b5791a' },
  white:  { c: '#ece6d2', a: '#c9b98f' },
  blue:   { c: '#7ea6df', a: '#3f6fb0' },
  pink:   { c: '#dc8cb2', a: '#a24e78' },
  purple: { c: '#9a6cc0', a: '#5f3f8f' },
  red:    { c: '#d4553f', a: '#7d2a1c' }
};
const CENTERS = { concolorous: null, yellow: '#e8c53c', white: '#efe9d6', dark: '#5a3a12' };
const STEMS = {
  green:            { s: '#6fae5a', d: '#4f8b3b' },
  red:              { s: '#b5532f', d: '#7d3419' },
  'purple-spotted': { s: '#6fae5a', d: '#4f8b3b', dot: '#7a2f5e' },
  glaucous:         { s: '#8fae92', d: '#6b8a70' },
  woody:            { s: '#8a6a44', d: '#5f4a2f', prickle: '#caa96f' }
};
const LEAF = '#5c9e49', LEAF_D = '#3f6f2f', LEAF_L = '#79b85e';
const PLATE = '#16210d', SPARK = '#c9d6a5';

export function drawPlant(canvas, t, vary = 0) {
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = PLATE; ctx.fillRect(0, 0, W, H);

  const fc = HUES[t.petalColor] || HUES.yellow;
  const cen = CENTERS[t.flowerCenter] || fc.a;
  const sm = STEMS[t.stemColor] || STEMS.green;
  const many = t.inflorescence !== 'solitary' && t.inflorescence !== 'capitulum';

  // deterministic-per-specimen jitter
  let seed = (vary * 9301 + 49297) % 233280;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const jit = () => (vary ? Math.round((rnd() - 0.5) * 2) : 0);

  const P = (x, y, c) => {
    x = Math.round(x); y = Math.round(y);
    if (x >= 0 && x < W && y >= 0 && y < H) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
  };
  const stemX = y => CX + Math.round(Math.sin((GROUND - y) / 7));

  /* ---------- leaves ---------- */
  function blade(x, y, dir) {
    const len = ({ small: 3, medium: 5, large: 7 })[t.leafSize] || 5;
    let hw = ({ small: 1, medium: 2, large: 3 })[t.leafSize] || 2;
    if (t.leafShape === 'linear' || t.leafShape === 'lanceolate') hw = 1;
    const toothed = ['serrate', 'dentate', 'crenate', 'ciliate'].includes(t.leafMargin);

    for (let i = 0; i <= len; i++) {
      const ax = x + dir * i, ay = y - Math.round(i * 0.5);
      let w = Math.max(0, Math.round(hw * Math.sin(Math.PI * (i + 0.5) / (len + 1))));
      if (t.leafShape === 'dissected') {          // feathery: rib + ticks
        P(ax, ay, LEAF);
        if (i % 2 === 0 && i > 0) { P(ax, ay - 1, LEAF_D); P(ax, ay + 1, LEAF_D); }
        continue;
      }
      for (let k = -w; k <= w; k++) {
        const edge = (k === w || k === -w);
        if (t.leafShape === 'lobed' && edge && i % 2 === 0) continue;   // notches
        P(ax, ay + k, edge ? LEAF_D : LEAF);
      }
      if (toothed && w > 0 && i % 2 === 0) P(ax, ay - w, LEAF_L);
    }
    if (t.leafShape === 'cordate') { P(x + dir, y + 1, LEAF); P(x + 2 * dir, y + 1, LEAF); }
    if (t.leafType === 'palmate' || t.leafType === 'pinnate') {         // hint of leaflets
      P(x + dir * 2, y - 2, LEAF); P(x + dir * 3, y - 2, LEAF_D);
    }
    P(x, y, LEAF);
  }

  /* ---------- flower stamps ---------- */
  const disc = (x, y, r, col) => {
    for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++)
      if (a * a + b * b <= r * r + 1) P(x + a, y + b, col);
  };
  function capitulum(x, y, big) {
    const r = big ? 2 : 1, rays = big ? 12 : 8;
    for (let i = 0; i < rays; i++) {
      const an = i / rays * Math.PI * 2;
      P(x + Math.round(Math.cos(an) * (r + 1.6)), y + Math.round(Math.sin(an) * (r + 1.6)), fc.c);
    }
    disc(x, y, r, fc.c); disc(x, y, big ? 1 : 0, cen || fc.a);
  }
  function star5(x, y) {
    [[0, -2], [2, -1], [1, 2], [-1, 2], [-2, -1]].forEach(o => {
      P(x + o[0], y + o[1], fc.c);
      P(x + Math.round(o[0] * 0.5), y + Math.round(o[1] * 0.5), fc.c);
    });
    P(x, y, cen || fc.a);
  }
  function cross4(x, y) {
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(o => P(x + o[0], y + o[1], fc.c));
    P(x, y, cen || fc.c);
  }
  const campanulate = (x, y) => { P(x, y, fc.c); P(x + 1, y, fc.c); P(x, y + 1, fc.c); P(x + 1, y + 1, fc.c); P(x, y + 2, fc.a); P(x + 1, y + 2, fc.a); };
  const papilionaceous = (x, y) => { P(x, y - 1, fc.c); P(x + 1, y - 1, fc.c); P(x, y, fc.c); P(x + 1, y, fc.c); P(x, y + 1, fc.a); P(x + 1, y + 1, fc.a); };
  function spurred(x, y) {
    P(x, y, fc.c); P(x + 1, y, fc.c); P(x + 2, y, fc.c);
    P(x, y + 1, fc.c); P(x + 1, y + 1, fc.c); P(x + 2, y + 1, fc.c); P(x + 3, y + 1, fc.c);
    P(x - 1, y + 2, fc.a);
    if (t.markings === 'spotted') { P(x + 1, y, fc.a); P(x + 2, y + 1, fc.a); }
  }
  function bloom(x, y) {
    switch (t.flowerForm) {
      case 'capitulum': return capitulum(x, y, t.inflorescence === 'capitulum');
      case 'star5': return star5(x, y);
      case 'cross4': return cross4(x, y);
      case 'campanulate': return campanulate(x, y);
      case 'papilionaceous': return papilionaceous(x, y);
      case 'spurred': return spurred(x, y);
      default: P(x, y, fc.c); P(x, y, cen || fc.a);
    }
  }

  /* ---------- placement ---------- */
  function place(tips, topY) {
    if (t.inflorescence === 'umbel') {
      tips.forEach(tp => {
        const n = many ? 7 : 4;
        for (let i = 0; i < n; i++) {
          const dx = Math.round((i - (n - 1) / 2) * 2), fy = tp[1] - (i % 2);
          P(tp[0] + dx, tp[1] + 1, sm.d); P(tp[0] + dx, tp[1] + 2, sm.d);
          P(tp[0] + dx, fy, fc.c); P(tp[0] + dx, fy - 1, i % 2 ? (cen || fc.c) : fc.c);
        }
      });
      return;
    }
    if (t.flowerForm === 'spurred') {                    // dangling on short pedicels
      for (let i = 0; i < 3; i++) {
        const yy = topY + 1 + i * 3, sx = stemX(yy);
        P(sx + 1, yy, sm.d); spurred(sx + 2, yy);
      }
      return;
    }
    if (t.inflorescence === 'raceme' || t.inflorescence === 'spike') {
      const n = tips.length > 1 ? 3 : (many ? 6 : 4);   // don't swamp multi-caned shrubs
      tips.forEach(tp => {
        for (let i = 0; i < n; i++) bloom(tp[0] + (i % 2 ? 1 : -1), tp[1] + i * 2);
      });
      return;
    }
    if (t.inflorescence === 'solitary' || t.inflorescence === 'capitulum') {
      bloom(tips[0][0], tips[0][1]); return;
    }
    tips.forEach(tp => [[0, 0], [-2, 0], [2, 0], [-1, -2], [1, -2], [0, -3]]
      .forEach(o => bloom(tp[0] + o[0] + jit(), tp[1] + o[1])));
  }

  const sparkle = () => { P(4, 6, SPARK); P(W - 5, 9, SPARK); };

  /* ---------- silhouettes by habit ---------- */
  if (t.habit === 'rosette') {
    const ty = 9;
    for (let y = GROUND - 1; y >= ty; y--) P(CX, y, sm.d);
    [-1, 1].forEach(d => { blade(CX, GROUND - 1, d); blade(CX + d, GROUND - 2, d); });
    for (let dx = -3; dx <= 3; dx++) P(CX + dx, GROUND, LEAF_D);
    place([[CX, ty]], ty); return sparkle();
  }

  if (t.habit === 'mat') {
    const yy = GROUND - 1;
    for (let x = 4; x <= W - 5; x++) { P(x, yy, sm.s); P(x, yy + 1, sm.d); }
    for (let x = 6; x <= W - 6; x += 4) { blade(x, yy - 1, -1); blade(x + 1, yy - 1, 1); }
    for (let x = 8; x <= W - 8; x += 4) bloom(x, yy - 3);
    return sparkle();
  }

  if (t.habit === 'creeping') {
    let x = 5, y = GROUND - 2; const pts = [];
    while (x < W - 6) { P(x, y, sm.s); P(x, y + 1, sm.d); pts.push([x, y]); x++; if (x % 2 === 0) y--; }
    pts.forEach((p, i) => { if (i % 3 === 1) { blade(p[0], p[1], -1); blade(p[0], p[1], 1); } });
    pts.filter((p, i) => i > pts.length * 0.35 && i % 3 === 0)
       .forEach(p => bloom(p[0], p[1] - 2));
    return sparkle();
  }

  if (t.habit === 'shrub') {
    [-1, 1].forEach(dir => {
      let x = CX, y = GROUND - 1;
      for (let i = 0; i < 15; i++) {
        P(x, y, sm.s); P(x, y + 1, sm.d);
        if (sm.prickle && i % 3 === 0) P(x + dir, y - 1, sm.prickle);
        x += dir; if (i < 10) y--;
        if (i % 4 === 2) blade(x, y, dir);
      }
    });
    place([[CX - 6, GROUND - 12], [CX + 6, GROUND - 12], [CX, GROUND - 14]], GROUND - 14);
    return sparkle();
  }

  // upright / branching
  const topY = t.heightClass === 'tall' ? 9 : t.heightClass === 'short' ? 22 : 14;
  const stemTop = t.habit === 'branched' ? Math.max(topY, 12) : topY;
  for (let y = GROUND; y >= stemTop; y--) {
    const xx = stemX(y);
    P(xx, y, sm.s); if (y > GROUND - 2) P(xx, y, sm.d);
    if (sm.dot && y % 4 === 0) P(xx + 1, y, sm.dot);
    if (sm.prickle && y % 3 === 0) P(xx - 1, y, sm.prickle);
  }
  let tips = [[stemX(stemTop), stemTop]];
  if (t.habit === 'branched') {
    const bx = stemX(13);
    for (let q = 1; q <= 6; q++) { P(bx - q, 13 - q, sm.s); P(bx + q, 13 - q, sm.s); }
    tips = [[bx - 6, 7], [bx + 6, 7], [stemX(stemTop), stemTop]];
  }
  if (t.leafArrangement === 'basal') {
    for (let dx = -3; dx <= 3; dx++) P(CX + dx, GROUND - 1, LEAF_D);
    blade(CX - 2, GROUND - 1, -1); blade(CX + 2, GROUND - 1, 1);
  } else {
    let flip = 1;
    // paired leaves need wider spacing or the stem turns into a solid green block
    let step = t.leafSize === 'large' ? 4 : 3;
    if (t.leafArrangement === 'opposite' || t.leafArrangement === 'whorled') step += 2;
    for (let y = GROUND - 3; y >= stemTop + 3; y -= step) {
      const nx = stemX(y);
      if (t.leafArrangement === 'opposite' || t.leafArrangement === 'whorled') { blade(nx, y, -1); blade(nx, y, 1); }
      else { blade(nx, y, flip); flip = -flip; }
    }
  }
  place(tips, stemTop);
  sparkle();
}

/* A one-line plain-language reading of the portrait, from the same fields. */
export function describe(t, TERMS) {
  // when form and arrangement are the same term, don't say it twice
  const flowers = t.flowerForm === t.inflorescence
    ? TERMS.flowerForm[t.flowerForm]
    : TERMS.flowerForm[t.flowerForm] + ' in ' + TERMS.inflorescence[t.inflorescence];
  const bits = [
    TERMS.habit[t.habit],
    TERMS.stemColor[t.stemColor] + ' stem',
    TERMS.leafArrangement[t.leafArrangement] + ', ' + TERMS.leafShape[t.leafShape] + ' leaves',
    flowers
  ];
  return bits.join(' · ');
}
