/* ============================================================
   Cielo Sur — Wiki
   Catálogo navegable por categorías, buscador y ficha detallada.
   ============================================================ */

import { WIKI_INDEX, CATEGORIES } from './data.js';

let wikiState = { cat: 'all', query: '' };

export function renderWikiView(root, ctx) {
  wikiState = { cat: 'all', query: '' };

  root.innerHTML = `
    <div class="search-wrap">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
      </svg>
      <input type="search" class="search-input" id="wiki-search"
             placeholder="Buscar por nombre, catálogo, bayer…" autocomplete="off" />
    </div>

    <div class="chip-row" id="wiki-cats">
      ${CATEGORIES.map(c => `
        <button class="chip ${c.id==='all'?'active':''}" data-cat="${c.id}">
          ${c.label}
        </button>
      `).join('')}
    </div>

    <div class="wiki-count" id="wiki-count"></div>
    <div class="wiki-grid" id="wiki-grid"></div>
  `;

  const gridEl = root.querySelector('#wiki-grid');
  const searchEl = root.querySelector('#wiki-search');
  const catsEl = root.querySelector('#wiki-cats');
  const countEl = root.querySelector('#wiki-count');

  function renderList() {
    const q = wikiState.query.trim().toLowerCase();
    const items = WIKI_INDEX.filter(it => {
      if (wikiState.cat !== 'all' && it._cat !== wikiState.cat) return false;
      if (!q) return true;
      return (it.name || '').toLowerCase().includes(q)
          || (it.cat  || '').toLowerCase().includes(q)
          || (it.bayer|| '').toLowerCase().includes(q)
          || (it.abbr || '').toLowerCase().includes(q)
          || (it.con  || '').toLowerCase().includes(q)
          || (it.type || '').toLowerCase().includes(q);
    });

    // Orden: por magnitud si tienen, luego por nombre
    items.sort((a, b) => {
      const am = a.mag != null ? Number(a.mag) : 99;
      const bm = b.mag != null ? Number(b.mag) : 99;
      if (am !== bm) return am - bm;
      return (a.name || '').localeCompare(b.name || '');
    });

    countEl.textContent = `${items.length} ${items.length === 1 ? 'ficha' : 'fichas'}`;

    if (!items.length) {
      gridEl.innerHTML = `<div class="wiki-empty">Sin resultados.</div>`;
      return;
    }

    gridEl.innerHTML = items.map(it => wikiCardHTML(it)).join('');

    gridEl.querySelectorAll('[data-wiki-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = WIKI_INDEX.find(x => x.id === btn.dataset.wikiId);
        if (it) ctx.openObjectSheet(it);
      });
    });
  }

  searchEl.addEventListener('input', e => { wikiState.query = e.target.value; renderList(); });
  catsEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    wikiState.cat = btn.dataset.cat;
    catsEl.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === btn));
    renderList();
  });

  renderList();
}

/* ---------- Card en la grilla ---------- */
function wikiCardHTML(it) {
  const cat = it._cat;
  const color = CATEGORIES.find(c => c.id === cat)?.color || 'var(--tx-md)';
  const sub = subtitleFor(it);
  const right = rightBadgeFor(it);
  return `
    <button class="wiki-card" data-wiki-id="${it.id}">
      <span class="wiki-card-dot" style="background:${color};box-shadow:0 0 10px ${color}"></span>
      <span class="wiki-card-body">
        <span class="wiki-card-name">${it.name}</span>
        <span class="wiki-card-sub">${sub}</span>
      </span>
      ${right ? `<span class="wiki-card-right">${right}</span>` : ''}
    </button>
  `;
}

function subtitleFor(it) {
  const parts = [];
  if (it._cat === 'star') {
    if (it.bayer) parts.push(it.bayer);
    if (it.con) parts.push(it.con);
    if (it.spectral) parts.push(it.spectral);
  } else if (it._cat === 'constellation') {
    if (it.latin) parts.push(it.latin);
    if (it.season) parts.push(it.season);
  } else if (it._cat === 'dso') {
    if (it.cat) parts.push(it.cat);
    if (it.con) parts.push(it.con);
    parts.push(it.type);
  } else if (it._cat === 'planet') {
    parts.push(it.subtype || it.type);
  } else if (it._cat === 'solar' || it._cat === 'moon') {
    parts.push(it.type);
  } else if (it._cat === 'concept') {
    parts.push(it.subtype || it.type);
  } else if (it._cat === 'history') {
    if (it.year) parts.push(it.year);
    if (it.subtype) parts.push(it.subtype);
  }
  return parts.join(' · ');
}

function rightBadgeFor(it) {
  if (it.mag != null && typeof it.mag === 'number') return `mag ${it.mag.toFixed(2)}`;
  if (it.mag != null) return `mag ${it.mag}`;
  if (it.dist) return it.dist;
  return '';
}

/* ---------- Ficha detallada ---------- */
export function objectSheetHTML(obj) {
  const cat = obj._cat || guessCat(obj);
  const color = CATEGORIES.find(c => c.id === cat)?.color || 'var(--accent)';
  const typeLabel = labelFor(obj);

  const sections = [];

  // Descripción
  if (obj.desc) {
    sections.push(`<p class="body">${obj.desc}</p>`);
  }

  // Datos clave
  const stats = buildStats(obj);
  if (stats.length) {
    sections.push(`
      <div class="sheet-section-title">Datos clave</div>
      <div class="data-grid">
        ${stats.map(([l,v]) => `
          <div class="data-cell">
            <div class="dc-label">${l}</div>
            <div class="dc-value">${v}</div>
          </div>
        `).join('')}
      </div>
    `);
  }

  // Detalle ampliado
  if (obj.detail) {
    sections.push(`
      <div class="sheet-section-title">Detalle</div>
      <p class="body">${obj.detail}</p>
    `);
  }

  // Cómo observar
  if (obj.howToObserve) {
    sections.push(`
      <div class="sheet-section-title">Cómo observarlo</div>
      <p class="body">${obj.howToObserve}</p>
    `);
  }

  // Curiosidades
  if (obj.facts && obj.facts.length) {
    sections.push(`
      <div class="sheet-section-title">Curiosidades</div>
      <ul class="facts-list">
        ${obj.facts.map(f => `<li>${f}</li>`).join('')}
      </ul>
    `);
  }

  // Relacionados
  if (obj.related && obj.related.length) {
    const rel = obj.related
      .map(id => WIKI_INDEX.find(x => x.id === id))
      .filter(Boolean);
    if (rel.length) {
      sections.push(`
        <div class="sheet-section-title">Relacionados</div>
        <div class="related-chips">
          ${rel.map(r => `<button class="chip" data-related-id="${r.id}">${r.name}</button>`).join('')}
        </div>
      `);
    }
  }

  return `
    <div class="sheet-handle"></div>
    <div class="sheet-hero">
      <div class="sheet-hero-dot" style="background:${color};box-shadow:0 0 20px ${color}"></div>
      <div class="sheet-hero-info">
        <h2>${obj.name}</h2>
        <div class="sheet-type">${typeLabel}</div>
      </div>
    </div>
    ${sections.join('')}
  `;
}

function guessCat(obj) {
  if (obj.bayer) return 'star';
  if (obj.abbr) return 'constellation';
  if (obj.ra != null && obj.cat) return 'dso';
  if (obj.temp && obj.diameter) return 'planet';
  return 'concept';
}

function labelFor(obj) {
  const parts = [];
  if (obj.type) parts.push(obj.type);
  if (obj.bayer) parts.push(obj.bayer);
  if (obj.cat && !obj.name.includes(obj.cat)) parts.push(obj.cat);
  if (obj.abbr) parts.push(obj.abbr);
  return parts.join(' · ');
}

function buildStats(obj) {
  const rows = [];
  const push = (l, v) => { if (v != null && v !== '') rows.push([l, v]); };

  // Coordenadas
  if (obj.ra != null) push('AR', hmsString(obj.ra));
  if (obj.dec != null) push('Dec', dmsString(obj.dec));

  // Observacional
  if (obj.mag != null) push('Magnitud', typeof obj.mag === 'number' ? obj.mag.toFixed(2) : obj.mag);
  if (obj.dist) push('Distancia', obj.dist);
  if (obj.size) push('Tamaño', obj.size);
  if (obj.con) push('Constelación', obj.con);

  // Estrella
  if (obj.spectral) push('Tipo espectral', obj.spectral);
  if (obj.temp && !obj.diameter) push('Temperatura', obj.temp);
  if (obj.mass && !obj.diameter) push('Masa', obj.mass);
  if (obj.radius) push('Radio', obj.radius);
  if (obj.lum) push('Luminosidad', obj.lum);

  // Planeta / Luna
  if (obj.diameter) push('Diámetro', obj.diameter);
  if (obj.mass && obj.diameter) push('Masa', obj.mass);
  if (obj.dist_sun) push('Dist. del Sol', obj.dist_sun);
  if (obj.dist_earth) push('Dist. de la Tierra', obj.dist_earth);
  if (obj.day) push('Día', obj.day);
  if (obj.year) push('Año', obj.year);
  if (obj.moons != null) push('Lunas', obj.moons);
  if (obj.temp && obj.diameter) push('Temperatura', obj.temp);
  if (obj.parent) push('Planeta', obj.parent);
  if (obj.dist_parent) push('Dist. del planeta', obj.dist_parent);
  if (obj.period) push('Período orbital', obj.period);
  if (obj.cycle) push('Ciclo sinódico', obj.cycle);

  // Constelación
  if (obj.area) push('Área', obj.area);
  if (obj.season) push('Mejor época', obj.season);
  if (obj.latin) push('Latín', obj.latin);

  // Historia
  if (obj.year && !obj.day) push('Año', obj.year);

  return rows;
}

function hmsString(ra_hours) {
  const h = Math.floor(ra_hours);
  const m = Math.floor((ra_hours - h) * 60);
  const s = Math.round((((ra_hours - h) * 60) - m) * 60);
  return `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
}
function dmsString(dec_deg) {
  const sign = dec_deg < 0 ? '−' : '+';
  const a = Math.abs(dec_deg);
  const d = Math.floor(a);
  const m = Math.floor((a - d) * 60);
  const s = Math.round((((a - d) * 60) - m) * 60);
  return `${sign}${d}° ${String(m).padStart(2,'0')}′ ${String(s).padStart(2,'0')}″`;
}