/* ecoc.app/plant — the field guide, the profile, and the key.
   All three views render from the same CharacterProfile records. */

import { SPECIES, SOURCES, TERMS, QUESTIONS, KEYABLE } from './data.js';
import { drawPlant, describe } from './pixel.js';

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const app = document.getElementById('app');
const byId = id => SPECIES.find(s => s.id === id);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- shared bits ---------- */
function portrait(sp, cls = '') {
  const c = document.createElement('canvas');
  c.className = 'portrait ' + cls;
  c.setAttribute('role', 'img');
  c.setAttribute('aria-label', `pixel portrait of ${sp.common}, generated from its traits`);
  drawPlant(c, sp.traits);
  return c;
}
function bloomStrip(months) {
  return `<div class="bloom" aria-label="flowering months">${
    MONTHS.map((m, i) => `<span class="${months.includes(i + 1) ? 'on' : ''}">${m}</span>`).join('')
  }</div>`;
}
function cite(sourceId) {
  const s = SOURCES[sourceId];
  if (!s) return '';
  return s.url
    ? `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.title)}</a>`
    : esc(s.title);
}

/* ---------- view: field guide ---------- */
function viewGuide() {
  app.innerHTML = `
    <header class="page-head">
      <p class="eyebrow">ecoc &middot; field guide</p>
      <h1>Plants people call weeds</h1>
      <p class="lede">Every plant here is a record of botanical traits &mdash; the same data keys it,
      describes it, and draws its portrait. Nothing is uncited.</p>
      <a class="btn btn-key" href="#/key">Key out a plant &rarr;</a>
    </header>
    <div class="guide" id="guide"></div>
    <p class="foot-note">${SPECIES.length} species &middot; Northeast natives and naturalised weeds</p>`;

  const grid = document.getElementById('guide');
  SPECIES.forEach(sp => {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = `#/plant/${sp.id}`;
    const plate = document.createElement('div');
    plate.className = 'plate';
    plate.appendChild(portrait(sp));
    a.appendChild(plate);
    a.insertAdjacentHTML('beforeend', `
      <div class="card-body">
        <div class="cn"><span class="dot d-${sp.difficulty}"></span>${esc(sp.common)}</div>
        <div class="sn">${esc(sp.scientific)}</div>
        <div class="fam">${esc(sp.family)} &middot; ${esc(sp.status)}</div>
      </div>`);
    grid.appendChild(a);
  });
}

/* ---------- view: plant profile ---------- */
function viewPlant(id) {
  const sp = byId(id);
  if (!sp) { location.hash = '#/'; return; }
  const t = sp.traits;

  const traitRow = (field, label) => {
    const v = t[field]; if (!v) return '';
    const plain = (TERMS[field] && TERMS[field][v]) || v;
    const gloss = plain === v ? '' : `<span class="plain">${esc(plain)}</span>`;  // don't echo "green / green"
    return `<div class="trow"><span class="tk">${label}</span>
      <span class="tv"><b>${esc(v)}</b>${gloss}</span></div>`;
  };

  app.innerHTML = `
    <a class="back" href="#/">&larr; field guide</a>
    <article class="profile">
      <div class="hero">
        <div class="plate hero-plate" id="heroPlate"></div>
        <div class="hero-txt">
          <p class="eyebrow">deep dive &middot; <span class="dot d-${sp.difficulty}"></span> ${
            sp.difficulty === 'green' ? 'easy to tell' : sp.difficulty === 'amber' ? 'look closely' : 'easily confused'}</p>
          <h1>${esc(sp.common)}</h1>
          <p class="sci">${esc(sp.scientific)} <span>${esc(sp.authority || '')}</span></p>
          <div class="chips">
            <span class="chip">${esc(sp.family)}</span>
            <span class="chip">${esc(sp.status)}</span>
            ${sp.gbifKey ? `<span class="chip">gbif ${sp.gbifKey}</span>` : ''}
          </div>
          <p class="essence">${esc(sp.essence)}</p>
          ${sp.alsoKnown?.length ? `<p class="aka"><b>Also called:</b> ${sp.alsoKnown.map(esc).join(', ')}</p>` : ''}
        </div>
      </div>

      <section class="vitals">
        <div><span class="k">habit</span><span class="v">${esc(TERMS.habit[t.habit])}</span></div>
        <div><span class="k">life</span><span class="v">${esc(TERMS.duration[t.duration])}</span></div>
        <div><span class="k">height</span><span class="v">${esc(TERMS.heightClass[t.heightClass])}</span></div>
        <div><span class="k">flowering</span><span class="v">${bloomStrip(sp.bloomMonths)}</span></div>
      </section>

      <section class="block">
        <h2>Where it grows</h2>
        <p class="body">${esc(sp.habitat)}</p>
      </section>

      <section class="block">
        <h2>How to know it</h2>
        <p class="body sub">The botanical term, and what it actually means when you are looking at the plant.</p>
        <div class="traits">
          ${traitRow('habit', 'habit')}
          ${traitRow('stemColor', 'stem colour')}
          ${traitRow('stemSurface', 'stem surface')}
          ${traitRow('leafArrangement', 'leaf arrangement')}
          ${traitRow('leafType', 'leaf type')}
          ${traitRow('leafShape', 'leaf shape')}
          ${traitRow('leafMargin', 'leaf margin')}
          ${traitRow('symmetry', 'flower symmetry')}
          ${traitRow('flowerForm', 'flower form')}
          ${traitRow('inflorescence', 'flowers arranged')}
          ${traitRow('petalColor', 'petal colour')}
          ${traitRow('flowerCenter', 'centre')}
          ${traitRow('markings', 'markings')}
          ${traitRow('fruitType', 'fruit')}
        </div>
        ${sp.notes?.length ? `<ul class="notes">${sp.notes.map(n =>
          `<li>${esc(n.text)} <span class="src">${cite(n.sourceId)}</span></li>`).join('')}</ul>` : ''}
      </section>

      ${sp.confusedWith?.length ? `
      <section class="block">
        <h2>Confused with</h2>
        ${sp.confusedWith.map(c => `
          <div class="confused">
            <div class="cw-name">${esc(c.name)} <i>${esc(c.scientific)}</i></div>
            <p class="cw-tell"><b>The tell:</b> ${esc(c.tell)} <span class="src">${cite(c.sourceId)}</span></p>
          </div>`).join('')}
      </section>` : ''}

      ${sp.uses?.length ? `
      <section class="block">
        <h2>How it&rsquo;s honoured</h2>
        <p class="body sub">Cultural and ecological record, each with its source. Not instructions.</p>
        ${sp.uses.map(u => `
          <div class="use ${u.caution ? 'caution' : ''}">
            <div class="ucat">${esc(u.category)}</div>
            <p>${esc(u.text)}</p>
            <div class="src">&#8627; ${cite(u.sourceId)}</div>
          </div>`).join('')}
        <p class="disclaimer">Cited record &middot; not medical advice &middot; never forage on an app&rsquo;s say-so</p>
      </section>` : ''}

      <section class="block">
        <h2>Sources</h2>
        <ul class="sources">
          ${sp.sourceIds.map(sid => SOURCES[sid]
            ? `<li>${cite(sid)} <span class="src">${esc(SOURCES[sid].note)}</span></li>` : '').join('')}
        </ul>
      </section>
    </article>`;

  const plate = document.getElementById('heroPlate');
  plate.appendChild(portrait(sp, 'big'));
  plate.insertAdjacentHTML('beforeend',
    `<p class="cap">${esc(describe(t, TERMS))}</p>`);
}

/* ---------- view: the key ---------- */
let pool = [], asked = [];

/* Pick the trait that best splits the remaining candidates. */
function bestTrait(cands) {
  let best = null, bestScore = Infinity;
  for (const field of KEYABLE) {
    if (asked.includes(field)) continue;
    const groups = {};
    cands.forEach(s => { const v = s.traits[field]; if (v) (groups[v] ||= []).push(s); });
    const keys = Object.keys(groups);
    if (keys.length < 2) continue;                       // useless: everyone the same
    const largest = Math.max(...keys.map(k => groups[k].length));
    if (largest < bestScore) { bestScore = largest; best = { field, groups }; }
  }
  return best;
}

function viewKey(reset) {
  if (reset) { pool = SPECIES.slice(); asked = []; }
  const step = bestTrait(pool);

  if (pool.length === 1 || !step) {
    const sp = pool[0];
    app.innerHTML = `
      <a class="back" href="#/">&larr; field guide</a>
      <div class="key-wrap">
        ${strip()}
        ${pool.length === 1 ? `
          <div class="key-result">
            <p class="eyebrow">keyed out</p>
            <h1>${esc(sp.common)}</h1>
            <p class="sci">${esc(sp.scientific)}</p>
            <a class="btn" href="#/plant/${sp.id}">Open the full profile &rarr;</a>
          </div>` : `
          <div class="key-result">
            <p class="eyebrow">narrowed as far as these traits allow</p>
            <h1>${pool.length} still possible</h1>
            <p class="body">These share every trait we can ask about. Compare them side by side.</p>
            <div class="mini-list">${pool.map(s =>
              `<a class="btn btn-ghost" href="#/plant/${s.id}">${esc(s.common)}</a>`).join('')}</div>
          </div>`}
        <button class="restart" id="again">&#8635; start again</button>
      </div>`;
    document.getElementById('again').onclick = () => viewKey(true);
    return;
  }

  const { field, groups } = step;
  app.innerHTML = `
    <a class="back" href="#/">&larr; field guide</a>
    <div class="key-wrap">
      ${strip()}
      <p class="eyebrow">question ${asked.length + 1}</p>
      <h1 class="q">${QUESTIONS[field] || field}</h1>
      <div class="opts" id="opts"></div>
      <button class="restart" id="again">&#8635; start again</button>
    </div>`;

  const opts = document.getElementById('opts');
  Object.keys(groups).sort().forEach(v => {
    const b = document.createElement('button');
    b.className = 'opt';
    const plain = (TERMS[field] && TERMS[field][v]) || v;
    b.innerHTML = `<b>${esc(v)}</b><span>${esc(plain)}</span><i>${groups[v].length}</i>`;
    b.onclick = () => { pool = groups[v]; asked.push(field); viewKey(false); };
    opts.appendChild(b);
  });
  document.getElementById('again').onclick = () => viewKey(true);
}

function strip() {
  return `<div class="strip"><span class="cnt">${pool.length} of ${SPECIES.length}</span>
    <div class="chips-row">${SPECIES.map(s =>
      `<span class="scrap ${pool.includes(s) ? '' : 'out'}">${esc(s.common)}</span>`).join('')}</div></div>`;
}

/* ---------- router ---------- */
function route() {
  const h = location.hash || '#/';
  if (h.startsWith('#/plant/')) return viewPlant(h.slice('#/plant/'.length));
  if (h.startsWith('#/key')) return viewKey(true);
  return viewGuide();
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });
route();
