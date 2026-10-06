/* ============================================================
   Cielo Sur — Corazón de la app
   ============================================================ */

import {
  STARS, CONSTELLATIONS, DEEP_SKY, PLANETS, METEOR_SHOWERS, WIKI_INDEX,
  DEFAULT_LOCATION
} from './data.js';
import { renderWikiView, objectSheetHTML } from './wiki.js';

/* ============================================================
   1. UTILIDADES
   ============================================================ */
const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pad2 = n => String(n).padStart(2, '0');
const wrap360 = d => ((d % 360) + 360) % 360;
const wrap180 = d => { d = wrap360(d); return d > 180 ? d - 360 : d; };

function jdFromDate(date) { return date.getTime() / 86400000 + 2440587.5; }

/* ============================================================
   2. ESTADO
   ============================================================ */
const LS_KEY = 'cielosur.v1';

const state = {
  location: { ...DEFAULT_LOCATION },
  nightMode: false,
  skyTime: null,
  skyView: { rotation: 180, zoom: 1 },
  skyLayers: {
    names: true, lines: true, grid: true, planets: true, dso: true,
    milkyway: true, ecliptic: false
  },
  gear: { camera: '—', lens: '—', telescope: '—' },
  journal: []
};

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
    state.skyView = Object.assign({ rotation: 180, zoom: 1 }, state.skyView || {});
    state.skyLayers = Object.assign(
      { names: true, lines: true, grid: true, planets: true, dso: true, milkyway: true, ecliptic: false },
      state.skyLayers || {}
    );
    state.journal = Array.isArray(state.journal) ? state.journal : [];
    state.skyView.rotation = wrap360(Number(state.skyView.rotation) || 180);
    state.skyView.zoom = clamp(Number(state.skyView.zoom) || 1, 1, 4);
  } catch (e) {}
}

function saveState() {
  try {
    const { skyTime, ...toSave } = state;
    localStorage.setItem(LS_KEY, JSON.stringify(toSave));
  } catch (e) {}
}

/* ============================================================
   3. ASTRONOMÍA — Base
   ============================================================ */
function localSiderealTime(date, lonDeg) {
  const jd = jdFromDate(date);
  const T = (jd - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
            + 0.000387933 * T * T - T * T * T / 38710000;
  return wrap360(wrap360(gmst) + lonDeg);
}

function radecToAltAz(ra_h, dec_deg, date, latDeg, lonDeg) {
  const lst = localSiderealTime(date, lonDeg) / 15;
  const H = wrap180((lst - ra_h) * 15) * D2R;
  const dec = dec_deg * D2R;
  const lat = latDeg * D2R;
  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(H);
  const alt = Math.asin(clamp(sinAlt, -1, 1));
  const cosAz = (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat) || 1e-9);
  let az = Math.acos(clamp(cosAz, -1, 1));
  if (Math.sin(H) > 0) az = 2 * Math.PI - az;
  return { alt: alt * R2D, az: az * R2D };
}

/* ============================================================
   4. EFEMÉRIDES PLANETARIAS
   ============================================================ */
const PLANET_ELEMENTS = {
  mercury: { a:[0.38709927, 0.00000037], e:[0.20563593, 0.00001906],
             i:[7.00497902, -0.00594749], L:[252.25032350, 149472.67411175],
             w:[77.45779628, 0.16047689], O:[48.33076593, -0.12534081] },
  venus:   { a:[0.72333566, 0.00000390], e:[0.00677672, -0.00004107],
             i:[3.39467605, -0.00078890], L:[181.97909950, 58517.81538729],
             w:[131.60246718, 0.00268329], O:[76.67984255, -0.27769418] },
  earth:   { a:[1.00000261, 0.00000562], e:[0.01671123, -0.00004392],
             i:[-0.00001531, -0.01294668], L:[100.46457166, 35999.37244981],
             w:[102.93768193, 0.32327364], O:[0.0, 0.0] },
  mars:    { a:[1.52371034, 0.00001847], e:[0.09339410, 0.00007882],
             i:[1.84969142, -0.00813131], L:[-4.55343205, 19140.30268499],
             w:[-23.94362959, 0.44441088], O:[49.55953891, -0.29257343] },
  jupiter: { a:[5.20288700, -0.00011607], e:[0.04838624, -0.00013253],
             i:[1.30439695, -0.00183714], L:[34.39644051, 3034.74612775],
             w:[14.72847983, 0.21252668], O:[100.47390909, 0.20469106] },
  saturn:  { a:[9.53667594, -0.00125060], e:[0.05386179, -0.00050991],
             i:[2.48599187, 0.00193609], L:[49.95424423, 1222.49362201],
             w:[92.59887831, -0.41897216], O:[113.66242448, -0.28867794] },
  uranus:  { a:[19.18916464, -0.00196176], e:[0.04725744, -0.00004397],
             i:[0.77263783, -0.00242939], L:[313.23810451, 428.48202785],
             w:[170.95427630, 0.40805281], O:[74.01692503, 0.04240589] },
  neptune: { a:[30.06992276, 0.00026291], e:[0.00859048, 0.00005105],
             i:[1.77004347, 0.00035372], L:[-55.12002969, 218.45945325],
             w:[44.96476227, -0.32241464], O:[131.78422574, -0.00508664] },
  pluto:   { a:[39.48211675, -0.00031596], e:[0.24882730, 0.00005170],
             i:[17.14001206, 0.00004818], L:[238.92903833, 145.20780515],
             w:[224.06891629, -0.04062942], O:[110.30393684, -0.01183482] }
};

function heliocentricPosition(name, jd) {
  const el = PLANET_ELEMENTS[name];
  const T = (jd - 2451545.0) / 36525;
  const a = el.a[0] + el.a[1] * T;
  const e = el.e[0] + el.e[1] * T;
  const i = (el.i[0] + el.i[1] * T) * D2R;
  const L = wrap360(el.L[0] + el.L[1] * T) * D2R;
  const w = (el.w[0] + el.w[1] * T) * D2R;
  const O = (el.O[0] + el.O[1] * T) * D2R;
  const M = wrap180((L - w) * R2D) * D2R;
  let E = M;
  for (let k = 0; k < 10; k++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-10) break;
  }
  const xOrb = a * (Math.cos(E) - e);
  const yOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const omega = w - O;
  const cosw = Math.cos(omega), sinw = Math.sin(omega);
  const cosO = Math.cos(O), sinO = Math.sin(O);
  const cosi = Math.cos(i), sini = Math.sin(i);
  const x = (cosw * cosO - sinw * sinO * cosi) * xOrb + (-sinw * cosO - cosw * sinO * cosi) * yOrb;
  const y = (cosw * sinO + sinw * cosO * cosi) * xOrb + (-sinw * sinO + cosw * cosO * cosi) * yOrb;
  const z = (sinw * sini) * xOrb + (cosw * sini) * yOrb;
  return { x, y, z };
}

function planetEquatorial(name, jd) {
  const p = heliocentricPosition(name, jd);
  const e = heliocentricPosition('earth', jd);
  const xg = p.x - e.x, yg = p.y - e.y, zg = p.z - e.z;
  const eps = 23.43928 * D2R;
  const xe = xg;
  const ye = yg * Math.cos(eps) - zg * Math.sin(eps);
  const ze = yg * Math.sin(eps) + zg * Math.cos(eps);
  const r = Math.hypot(xe, ye, ze);
  const ra = wrap360(Math.atan2(ye, xe) * R2D) / 15;
  const dec = Math.asin(ze / r) * R2D;
  return { ra, dec, dist: r };
}

/* ============================================================
   5. LUNA Y SOL
   ============================================================ */
function moonAge(date) {
  const jd = jdFromDate(date);
  const newMoon2000 = 2451550.1;
  const synodic = 29.530588853;
  return ((jd - newMoon2000) % synodic + synodic) % synodic;
}

function moonInfo(date) {
  const age = moonAge(date);
  const phase = age / 29.530588853;
  const illum = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const names = [
    [0.00, 0.03, 'Luna nueva'],
    [0.03, 0.22, 'Luna creciente'],
    [0.22, 0.28, 'Cuarto creciente'],
    [0.28, 0.47, 'Gibosa creciente'],
    [0.47, 0.53, 'Luna llena'],
    [0.53, 0.72, 'Gibosa menguante'],
    [0.72, 0.78, 'Cuarto menguante'],
    [0.78, 0.97, 'Luna menguante'],
    [0.97, 1.01, 'Luna nueva']
  ];
  const found = names.find(([a, b]) => phase >= a && phase < b);
  return { age, phase, illum, name: found ? found[2] : 'Luna nueva' };
}

function sunInfo(date, lat, lon) {
  const jd = jdFromDate(date);
  const n = Math.floor(jd - 2451545.0 + 0.5);
  const T = n / 36525;
  const L = wrap360(280.460 + 36000.771 * T);
  const g = wrap360(357.528 + 35999.050 * T);
  const lambda = wrap360(L + 1.915 * Math.sin(g * D2R) + 0.020 * Math.sin(2 * g * D2R));
  const eps = 23.439 - 0.0000004 * n;
  const dec = Math.asin(Math.sin(eps * D2R) * Math.sin(lambda * D2R)) * R2D;
  const cosH = -Math.tan(lat * D2R) * Math.tan(dec * D2R);
  let H;
  if (cosH >= 1) H = 0;
  else if (cosH <= -1) H = 12;
  else H = Math.acos(cosH) * R2D / 15;
  const solarNoon = 12 - lon / 15;
  return { sunrise: solarNoon - H, sunset: solarNoon + H, solarNoon, dec };
}

function moonRiseSet(date) {
  const age = moonAge(date);
  const baseRise = 6 + (age / 29.53) * 24;
  const rise = ((baseRise % 24) + 24) % 24;
  const set = (rise + 12.4) % 24;
  return { rise, set };
}

/* ============================================================
   6. VISIBILIDAD NOCTURNA
   ============================================================ */
function sampleNight(ra, dec, baseDate, lat, lon, opts = {}) {
  const startH = opts.startH ?? 18;
  const endH = opts.endH ?? 30;
  const stepMin = opts.stepMin ?? 30;
  const start = new Date(baseDate);
  start.setHours(startH, 0, 0, 0);
  const totalMin = (endH - startH) * 60;
  const samples = [];
  for (let m = 0; m <= totalMin; m += stepMin) {
    const t = new Date(start.getTime() + m * 60000);
    const { alt, az } = radecToAltAz(ra, dec, t, lat, lon);
    samples.push({ t, alt, az });
  }
  return samples;
}

function planetTonight(planetId, baseDate, lat, lon) {
  const start = new Date(baseDate);
  start.setHours(18, 0, 0, 0);
  const samples = [];
  for (let m = 0; m <= 720; m += 20) {
    const t = new Date(start.getTime() + m * 60000);
    const jd = jdFromDate(t);
    const p = planetEquatorial(planetId, jd);
    const { alt, az } = radecToAltAz(p.ra, p.dec, t, lat, lon);
    samples.push({ t, alt, az, ra: p.ra, dec: p.dec });
  }
  const visible = samples.filter(s => s.alt > 10);
  if (!visible.length) return { visible: false };
  let peak = visible[0];
  for (const s of visible) if (s.alt > peak.alt) peak = s;
  return {
    visible: true, start: visible[0].t, end: visible[visible.length - 1].t,
    peak: peak.t, peakAlt: peak.alt, peakAz: peak.az, ra: peak.ra, dec: peak.dec
  };
}

/* ============================================================
   7. EVENTOS
   ============================================================ */
function computeUpcomingEvents(fromDate, days = 60) {
  const events = [];
  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + days * 86400000);

  const checkpoints = [
    { p: 0.0,  name: 'Luna nueva',       icon: '🌑', type: 'moon' },
    { p: 0.25, name: 'Cuarto creciente', icon: '🌓', type: 'moon' },
    { p: 0.5,  name: 'Luna llena',       icon: '🌕', type: 'moon' },
    { p: 0.75, name: 'Cuarto menguante', icon: '🌗', type: 'moon' }
  ];
  let prev = moonInfo(start).phase;
  for (let d = 1; d <= days; d++) {
    const date = new Date(start.getTime() + d * 86400000);
    const p = moonInfo(date).phase;
    for (const cp of checkpoints) {
      const crossed = cp.p === 0 ? (prev > 0.9 && p < 0.1) : (prev < cp.p && p >= cp.p);
      if (crossed) events.push({ type: 'moon', date, name: cp.name, icon: cp.icon, desc: moonEventDescription(cp.name) });
    }
    prev = p;
  }
  const y = start.getFullYear();
  for (const sh of METEOR_SHOWERS) {
    for (const yr of [y, y + 1]) {
      const peak = new Date(yr, sh.peak[0] - 1, sh.peak[1], 22, 0, 0);
      if (peak >= start && peak <= end) {
        events.push({ type: 'meteor', date: peak, name: `Lluvia de ${sh.name}`, icon: '☄',
          desc: `${sh.desc} ZHR máximo: ${sh.zhr}. Radiante en ${sh.radiant}.` });
      }
    }
  }
  for (const yr of [y, y + 1]) {
    const marks = [
      { date: new Date(yr, 2, 20), name: 'Equinoccio de marzo', desc: 'Comienza el otoño en el hemisferio sur.' },
      { date: new Date(yr, 5, 21), name: 'Solsticio de junio', desc: 'Comienza el invierno en el hemisferio sur.' },
      { date: new Date(yr, 8, 22), name: 'Equinoccio de septiembre', desc: 'Comienza la primavera en el hemisferio sur.' },
      { date: new Date(yr, 11, 21), name: 'Solsticio de diciembre', desc: 'Comienza el verano en el hemisferio sur.' }
    ];
    for (const mk of marks) {
      if (mk.date >= start && mk.date <= end)
        events.push({ type: 'season', date: mk.date, name: mk.name, icon: '☀', desc: mk.desc });
    }
  }
  events.sort((a, b) => a.date - b.date);
  return events;
}

function moonEventDescription(name) {
  switch (name) {
    case 'Luna nueva': return 'Cielo oscuro toda la noche. Ideal para observar objetos débiles y fotografiar la Vía Láctea.';
    case 'Cuarto creciente': return 'La Luna se pone alrededor de la medianoche. Buenas horas oscuras después.';
    case 'Luna llena': return 'Luna visible toda la noche. Excelente para observarla, pero mala para cielo profundo.';
    case 'Cuarto menguante': return 'La Luna sale después de medianoche. Buenas horas oscuras al anochecer.';
    default: return '';
  }
}

function daysUntil(date) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  return Math.round((d - now) / 86400000);
}

/* ============================================================
   8. VÍA LÁCTEA
   ============================================================ */
const GALACTIC_CENTER = { ra: 17.7611, dec: -29.0078 };

function galacticCenterPlan(date, lat, lon) {
  const samples = sampleNight(GALACTIC_CENTER.ra, GALACTIC_CENTER.dec, date, lat, lon, { stepMin: 20 });
  const visible = samples.filter(s => s.alt > 10);
  if (!visible.length) return { visible: false, samples };
  let peak = visible[0];
  for (const s of visible) if (s.alt > peak.alt) peak = s;
  return { visible: true, start: visible[0].t, end: visible[visible.length - 1].t,
    peak: peak.t, peakAlt: peak.alt, peakAz: peak.az, samples };
}

/* Puntos de la banda galáctica (plano galáctico b=0) en coordenadas ecuatoriales */
function galacticPlanePoints() {
  const raNGP = 192.85948 * D2R;
  const decNGP = 27.12825 * D2R;
  const lNCP = 122.93192 * D2R;
  const pts = [];
  for (let l = 0; l < 360; l += 3) {
    const lRad = l * D2R;
    const sinDec = Math.cos(decNGP) * Math.cos(lNCP - lRad);
    const dec = Math.asin(clamp(sinDec, -1, 1));
    const cosDec = Math.cos(dec) || 1e-9;
    const sinDA = Math.sin(lNCP - lRad) / cosDec;
    const cosDA = -Math.sin(decNGP) * Math.cos(lNCP - lRad) / cosDec;
    const da = Math.atan2(sinDA, cosDA);
    const ra = wrap360((raNGP + da) * R2D) / 15;
    pts.push({ ra, dec: dec * R2D });
  }
  return pts;
}
const MILKY_WAY_POINTS = galacticPlanePoints();

/* Puntos de la eclíptica en coordenadas ecuatoriales */
function eclipticPoints() {
  const eps = 23.4393 * D2R;
  const pts = [];
  for (let lam = 0; lam < 360; lam += 3) {
    const lRad = lam * D2R;
    const x = Math.cos(lRad);
    const y = Math.sin(lRad) * Math.cos(eps);
    const z = Math.sin(lRad) * Math.sin(eps);
    const ra = wrap360(Math.atan2(y, x) * R2D) / 15;
    const dec = Math.asin(z) * R2D;
    pts.push({ ra, dec });
  }
  return pts;
}
const ECLIPTIC_POINTS = eclipticPoints();

/* ============================================================
   9. FORMATO
   ============================================================ */
function fmtHour(h) {
  h = ((h % 24) + 24) % 24;
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${pad2(hh === 24 ? 0 : hh)}:${pad2(mm === 60 ? 0 : mm)}`;
}
function fmtTime(date) { return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`; }
function fmtDate(date) {
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${date.getDate()} ${meses[date.getMonth()]}`;
}
function fmtDateTime(date) { return `${fmtDate(date)} · ${fmtTime(date)}`; }
function fmtDaysUntil(date) {
  const d = daysUntil(date);
  if (d === 0) return 'Hoy';
  if (d === 1) return 'Mañana';
  if (d < 0) return `Hace ${-d} días`;
  return `En ${d} días`;
}
function fmtOffsetHours(offset) {
  if (Math.abs(offset) < 0.01) return 'ahora';
  const abs = Math.abs(offset);
  const sign = offset > 0 ? '+' : '−';
  const totalMinutes = Math.round(abs * 60);
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  let str;
  if (hh === 0) str = `${mm} min`;
  else if (mm === 0) str = `${hh} h`;
  else str = `${hh} h ${pad2(mm)} min`;
  return `${sign}${str}`;
}

/* ============================================================
   10. VISTAS
   ============================================================ */

/* ---------- 10.1 HOY ---------- */
function renderTonightView(root) {
  const now = new Date();
  const loc = state.location;
  const m = moonInfo(now);
  const sun = sunInfo(now, loc.lat, loc.lon);
  const moonRS = moonRiseSet(now);
  const planetsData = PLANETS.map(p => ({ ...p, tonight: planetTonight(p.id, now, loc.lat, loc.lon) }))
    .filter(p => p.tonight.visible);
  const dsoTonight = DEEP_SKY.slice(0, 6);

  root.innerHTML = `
    <div class="card hero">
      <div class="hero-moon">
        <div class="moon-orb"><canvas id="hero-moon-cv" width="168" height="168"></canvas></div>
        <div class="hero-info">
          <div class="hero-phase">${m.name}</div>
          <div class="hero-sub">${(m.illum*100).toFixed(0)}% iluminada · edad ${m.age.toFixed(1)} días</div>
          <div class="hero-sub">Sale ${fmtHour(moonRS.rise)} · se pone ${fmtHour(moonRS.set)}</div>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi"><div class="kpi-label">Atardecer</div><div class="kpi-value">${fmtHour(sun.sunset)}</div></div>
        <div class="kpi"><div class="kpi-label">Amanecer</div><div class="kpi-value">${fmtHour(sun.sunrise)}</div></div>
      </div>
      <div class="card-title">Noche de hoy</div>
      <div class="timeline" id="tonight-timeline">
        <div class="timeline-hours"><span>18:00</span><span>21:00</span><span>00:00</span><span>03:00</span><span>06:00</span></div>
        <div class="timeline-grid" id="tonight-rows"></div>
      </div>
    </div>
    <div class="card"><div class="card-title">Planetas visibles esta noche</div><div class="list" id="tonight-planets"></div></div>
    <div class="card"><div class="card-title">Objetos de cielo profundo al alcance</div><div class="list" id="tonight-dso"></div></div>
    <div class="card"><div class="card-title">Diario · últimas observaciones</div><div id="journal-preview"></div></div>
    <p class="text-xs muted" style="text-align:center;margin-top:8px">
      Datos calculados para ${loc.name} · ${loc.lat.toFixed(3)}°, ${loc.lon.toFixed(3)}°
    </p>
  `;

  drawMoonPhase($('#hero-moon-cv'), m.phase);

  const rowsEl = $('#tonight-rows');
  const T0 = 18, T1 = 30;
  const colors = ['#fbbf24','#7dd3fc','#a78bfa','#4ade80','#f87171','#fb923c','#cfe4ff'];
  const tlRows = [];
  let mStart = moonRS.rise < 18 ? moonRS.rise + 24 : moonRS.rise;
  let mEnd = moonRS.set < mStart ? moonRS.set + 24 : moonRS.set;
  tlRows.push({ name:'Luna', start: mStart, end: mEnd, color:'#fbbf24' });
  planetsData.forEach((p, i) => {
    const s = p.tonight.start.getHours() + p.tonight.start.getMinutes() / 60;
    const e = p.tonight.end.getHours() + p.tonight.end.getMinutes() / 60;
    const sAdj = s < 18 ? s + 24 : s;
    const eAdj = e < sAdj ? e + 24 : e;
    tlRows.push({ name: p.name, start: sAdj, end: eAdj, color: colors[(i + 1) % colors.length] });
  });
  tlRows.push({ name:'M42', start: 23, end: 3, color:'#4ade80' });

  rowsEl.innerHTML = tlRows.slice(0, 5).map((r, i) => {
    const left = clamp((r.start - T0) / (T1 - T0), 0, 1) * 100;
    const width = clamp((r.end - r.start) / (T1 - T0), 0, 1) * 100;
    return `<div class="tl-row" style="top:${i * 16}px">
      <div class="tl-bar" style="left:${left}%;width:${width}%;background:${r.color}"></div>
      <div class="tl-label" style="color:${r.color}">${r.name}</div>
    </div>`;
  }).join('');

  if (planetsData.length === 0) {
    $('#tonight-planets').innerHTML = `<div class="journal-empty">Ningún planeta visible esta noche por encima de 10°.</div>`;
  } else {
    $('#tonight-planets').innerHTML = planetsData.map(p => `
      <button class="list-item" data-wiki-id="${p.id}">
        <span class="li-dot" style="background:${p.color};box-shadow:0 0 8px ${p.color}"></span>
        <span class="li-main"><div class="li-name">${p.name}</div>
          <div class="li-sub">Mejor: ${fmtTime(p.tonight.peak)} · alt máx ${p.tonight.peakAlt.toFixed(0)}°</div></span>
      </button>`).join('');
  }

  $('#tonight-dso').innerHTML = dsoTonight.map(d => `
    <button class="list-item" data-wiki-id="${d.id}">
      <span class="li-dot" style="background:var(--accent-2);box-shadow:0 0 8px var(--accent-2)"></span>
      <span class="li-main"><div class="li-name">${d.name}</div>
        <div class="li-sub">${d.type} · ${d.con}</div></span>
      <span class="li-value">mag ${d.mag?.toFixed(1) ?? '—'}</span>
    </button>`).join('');

  renderJournalPreview($('#journal-preview'));

  root.addEventListener('click', e => {
    const b = e.target.closest('[data-wiki-id]');
    if (!b) return;
    const it = WIKI_INDEX.find(x => x.id === b.dataset.wikiId);
    if (it) openObjectSheet(it);
  });
}

/* ---------- 10.2 CARTA DEL CIELO ---------- */
let skyCleanup = null;
const SIM_SPEED = 60;
const CHART_R_RATIO = 0.40;

const simEngine = { playing: false, offsetHours: 0, raf: null, lastFrame: 0, lastDraw: 0 };

function renderSkyView(root) {
  if (skyCleanup) { skyCleanup(); skyCleanup = null; }
  simEngine.playing = false;
  simEngine.offsetHours = 0;
  simEngine.raf = null;

  const loc = state.location;

  root.innerHTML = `
    <div class="chart-wrap" id="chart-wrap">
      <canvas id="sky-canvas"></canvas>
      <div class="chart-overlay">
        <div class="co-top">
          <button class="chart-btn" data-layer="names" title="Nombres">Aa</button>
          <button class="chart-btn" data-layer="lines" title="Constelaciones">✦</button>
          <button class="chart-btn" data-layer="grid"  title="Grilla">▦</button>
          <button class="chart-btn" data-layer="dso"   title="Cielo profundo">◈</button>
          <button class="chart-btn" data-layer="milkyway" title="Vía Láctea">✺</button>
          <button class="chart-btn" data-layer="ecliptic" title="Eclíptica">◎</button>
        </div>
      </div>
      <div class="chart-hint" id="chart-hint">
        Arrastrá para girar<br>
        Pinch para acercar · Tocá un objeto
      </div>
    </div>

    <div class="sim-panel" id="sim-panel">
      <div class="sim-head">
        <button class="sim-play" id="sim-play" aria-label="Simular movimiento del cielo">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" id="sim-play-icon">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <div class="sim-time">
          <div class="sim-time-value" id="sim-time">--:--</div>
          <div class="sim-time-delta now" id="sim-delta">ahora</div>
        </div>
        <button class="sim-reset" id="sim-reset" aria-label="Volver a ahora">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>
          </svg>
        </button>
      </div>
      <input type="range" class="sim-range" id="sim-range" min="-12" max="12" step="0.02" value="0" />
    </div>

    <div class="chart-info">
      <span class="ci-pill" id="ci-up">↑ Sur</span>
      <span class="ci-pill" id="ci-zoom">1.0×</span>
    </div>

    <div class="chart-legend">
      <span class="lg-item"><span class="lg-dot"></span>Estrella</span>
      <span class="lg-item"><span class="lg-dot planet"></span>Planeta</span>
      <span class="lg-item"><span class="lg-dot dso"></span>Cielo profundo</span>
    </div>
  `;

  const canvas = $('#sky-canvas');
  const wrap = $('#chart-wrap');
  const hint = $('#chart-hint');
  const hideHintTimer = setTimeout(() => hint.classList.add('hide'), 4500);
  const dismissHint = () => { clearTimeout(hideHintTimer); hint.classList.add('hide'); };

  const el = {
    play: $('#sim-play'), playIcon: $('#sim-play-icon'),
    time: $('#sim-time'), delta: $('#sim-delta'),
    range: $('#sim-range'), panel: $('#sim-panel')
  };

  function project(az, alt, R, cx, cy, rotation, zoom) {
    const visibleDeg = 90 / zoom;
    const rNorm = (90 - alt) / visibleDeg;
    const r = rNorm * R;
    const theta = (az - rotation) * D2R;
    return { x: cx + r * Math.sin(theta), y: cy - r * Math.cos(theta), rNorm, inside: rNorm <= 1 };
  }

  function draw() {
    if (!canvas.width || !canvas.height) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const dpr = parseFloat(canvas.dataset.dpr || 1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const time = currentSimTime();
    const layers = state.skyLayers;
    const v = state.skyView;
    const rotation = v.rotation;
    const zoom = clamp(v.zoom || 1, 1, 4);

    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * CHART_R_RATIO;

    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    bg.addColorStop(0, 'rgba(30, 48, 86, 0.55)');
    bg.addColorStop(0.65, 'rgba(12, 22, 45, 0.65)');
    bg.addColorStop(1, 'rgba(5, 8, 16, 0.92)');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();

    if (layers.grid) {
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.10)';
      ctx.lineWidth = 1 * dpr;
      [30, 60].forEach(alt => {
        const r = ((90 - alt) / (90 / zoom)) * R;
        if (r > R + 0.5) return;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      });
      for (let az = 0; az < 360; az += 30) {
        const theta = (az - rotation) * D2R;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.sin(theta) * R, cy - Math.cos(theta) * R);
        ctx.stroke();
      }
    }

    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
    ctx.lineWidth = 1.6 * dpr;
    ctx.stroke();

    drawDegrees(ctx, cx, cy, R, rotation, dpr);

    // Capa Vía Láctea
    if (layers.milkyway) drawMilkyWay(ctx, time, loc, project, R, cx, cy, rotation, zoom, dpr);

    // Capa Eclíptica
    if (layers.ecliptic) drawEcliptic(ctx, time, loc, project, R, cx, cy, rotation, zoom, dpr);

    // Estrellas
    const visible = [];
    for (const s of STARS) {
      const { alt, az } = radecToAltAz(s.ra, s.dec, time, loc.lat, loc.lon);
      if (alt <= 0) continue;
      const p = project(az, alt, R, cx, cy, rotation, zoom);
      if (!p.inside) continue;
      visible.push({ ...s, alt, az, p });
    }

    if (layers.lines) {
      const byId = Object.fromEntries(visible.map(s => [s.id, s]));
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.50)';
      ctx.lineWidth = 1.1 * dpr;
      for (const c of CONSTELLATIONS) {
        for (const [a, b] of c.lines) {
          const A = byId[a], B = byId[b];
          if (!A || !B) continue;
          ctx.beginPath(); ctx.moveTo(A.p.x, A.p.y); ctx.lineTo(B.p.x, B.p.y); ctx.stroke();
        }
      }
    }

    for (const s of visible) {
      const p = s.p;
      const r = Math.max(1.2, (6 - s.mag) * 0.9) * dpr;
      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
      halo.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = s.color || '#fff';
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      if (layers.names && s.mag < 2.2) {
        ctx.font = `${10 * dpr}px ui-monospace, monospace`;
        ctx.fillStyle = 'rgba(230, 236, 244, 0.85)';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(s.name, p.x + r + 4 * dpr, p.y);
      }
    }

    if (layers.dso) {
      for (const d of DEEP_SKY) {
        const { alt, az } = radecToAltAz(d.ra, d.dec, time, loc.lat, loc.lon);
        if (alt < 5) continue;
        const p = project(az, alt, R, cx, cy, rotation, zoom);
        if (!p.inside) continue;
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.95)';
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath(); ctx.arc(p.x, p.y, 5 * dpr, 0, Math.PI * 2); ctx.stroke();
        if (layers.names) {
          ctx.font = `${9 * dpr}px ui-monospace, monospace`;
          ctx.fillStyle = 'rgba(167, 139, 250, 0.9)';
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(d.cat || d.name, p.x + 7 * dpr, p.y);
        }
      }
    }

    if (layers.planets) {
      const jd = jdFromDate(time);
      for (const pl of PLANETS) {
        const pe = planetEquatorial(pl.id, jd);
        const { alt, az } = radecToAltAz(pe.ra, pe.dec, time, loc.lat, loc.lon);
        if (alt < 0) continue;
        const p = project(az, alt, R, cx, cy, rotation, zoom);
        if (!p.inside) continue;
        ctx.fillStyle = pl.color;
        ctx.shadowColor = pl.color; ctx.shadowBlur = 12 * dpr;
        ctx.beginPath(); ctx.arc(p.x, p.y, 5.5 * dpr, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        if (layers.names) {
          ctx.font = `bold ${10 * dpr}px ui-monospace, monospace`;
          ctx.fillStyle = pl.color;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(pl.name, p.x + 9 * dpr, p.y);
        }
      }
    }

    drawCardinalLabels(ctx, cx, cy, R, rotation, dpr);
    ctx.fillStyle = 'rgba(125, 211, 252, 0.4)';
    ctx.beginPath(); ctx.arc(cx, cy, 2 * dpr, 0, Math.PI * 2); ctx.fill();

    const up = $('#ci-up'); if (up) up.textContent = `↑ ${azToLabel(rotation)}`;
    const zi = $('#ci-zoom'); if (zi) zi.textContent = `${zoom.toFixed(1)}×`;
  }

  function drawMilkyWay(ctx, time, loc, project, R, cx, cy, rotation, zoom, dpr) {
    // Banda exterior difusa (halo)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(160, 180, 230, 0.10)';
    ctx.lineWidth = 26 * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let started = false;
    for (const p of MILKY_WAY_POINTS) {
      const { alt, az } = radecToAltAz(p.ra, p.dec, time, loc.lat, loc.lon);
      if (alt < -5) { started = false; continue; }
      const q = project(az, alt, R, cx, cy, rotation, zoom);
      if (!q.inside) { started = false; continue; }
      if (!started) { ctx.moveTo(q.x, q.y); started = true; }
      else ctx.lineTo(q.x, q.y);
    }
    ctx.stroke();

    // Núcleo más definido
    ctx.strokeStyle = 'rgba(190, 210, 250, 0.20)';
    ctx.lineWidth = 12 * dpr;
    ctx.beginPath();
    started = false;
    for (const p of MILKY_WAY_POINTS) {
      const { alt, az } = radecToAltAz(p.ra, p.dec, time, loc.lat, loc.lon);
      if (alt < -5) { started = false; continue; }
      const q = project(az, alt, R, cx, cy, rotation, zoom);
      if (!q.inside) { started = false; continue; }
      if (!started) { ctx.moveTo(q.x, q.y); started = true; }
      else ctx.lineTo(q.x, q.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawEcliptic(ctx, time, loc, project, R, cx, cy, rotation, zoom, dpr) {
    ctx.save();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
    ctx.lineWidth = 1.4 * dpr;
    ctx.setLineDash([6 * dpr, 6 * dpr]);
    ctx.beginPath();
    let started = false;
    for (const p of ECLIPTIC_POINTS) {
      const { alt, az } = radecToAltAz(p.ra, p.dec, time, loc.lat, loc.lon);
      if (alt < -2) { started = false; continue; }
      const q = project(az, alt, R, cx, cy, rotation, zoom);
      if (!q.inside) { started = false; continue; }
      if (!started) { ctx.moveTo(q.x, q.y); started = true; }
      else ctx.lineTo(q.x, q.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawDegrees(ctx, cx, cy, R, rotation, dpr) {
    const offDeg = Math.min(cx, cy) * 0.045;
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.30)';
    ctx.lineWidth = 1 * dpr;
    for (let az = 0; az < 360; az += 10) {
      const theta = (az - rotation) * D2R;
      const long = az % 30 === 0;
      const r1 = R + 3 * dpr;
      const r2 = R + (long ? offDeg * 0.55 : offDeg * 0.32);
      ctx.beginPath();
      ctx.moveTo(cx + Math.sin(theta) * r1, cy - Math.cos(theta) * r1);
      ctx.lineTo(cx + Math.sin(theta) * r2, cy - Math.cos(theta) * r2);
      ctx.stroke();
    }
    const rn = R + offDeg * 1.05;
    ctx.font = `${9 * dpr}px ui-monospace, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let az = 0; az < 360; az += 30) {
      const theta = (az - rotation) * D2R;
      const x = cx + Math.sin(theta) * rn;
      const y = cy - Math.cos(theta) * rn;
      ctx.fillStyle = az % 90 === 0 ? 'rgba(125, 211, 252, 0.60)' : 'rgba(125, 211, 252, 0.32)';
      ctx.fillText(String(az), x, y);
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }

  function azToLabel(az) {
    const dirs = ['Norte','Noreste','Este','Sureste','Sur','Suroeste','Oeste','Noroeste'];
    return dirs[Math.round(wrap360(az) / 45) % 8];
  }

  function drawCardinalLabels(ctx, cx, cy, R, rotation, dpr) {
    const dirs = [
      { az: 0, label: 'N' }, { az: 45, label: 'NE' },
      { az: 90, label: 'E' }, { az: 135, label: 'SE' },
      { az: 180, label: 'S' }, { az: 225, label: 'SO' },
      { az: 270, label: 'O' }, { az: 315, label: 'NO' }
    ];
    const offCard = Math.min(cx, cy) * 0.085;
    const rCard = R + offCard;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const d of dirs) {
      const theta = (d.az - rotation) * D2R;
      const x = cx + Math.sin(theta) * rCard;
      const y = cy - Math.cos(theta) * rCard;
      const cardinal = d.label.length === 1;
      const size = cardinal ? 14 : 9;
      ctx.font = `${cardinal ? 'bold ' : ''}${size * dpr}px -apple-system, system-ui, sans-serif`;
      ctx.fillStyle = cardinal ? 'rgba(125, 211, 252, 0.98)' : 'rgba(125, 211, 252, 0.45)';
      ctx.fillText(d.label, x, y);
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }

  function currentSimTime() {
    return new Date(Date.now() + simEngine.offsetHours * 3600 * 1000);
  }

  function updateSimUI() {
    const t = currentSimTime();
    el.time.textContent = fmtTime(t);
    el.delta.textContent = fmtOffsetHours(simEngine.offsetHours);
    el.delta.classList.remove('now', 'future', 'past');
    if (Math.abs(simEngine.offsetHours) < 0.01) el.delta.classList.add('now');
    else if (simEngine.offsetHours > 0) el.delta.classList.add('future');
    else el.delta.classList.add('past');
    el.range.value = String(clamp(simEngine.offsetHours, -12, 12));
    const playing = simEngine.playing;
    el.play.classList.toggle('playing', playing);
    el.panel.classList.toggle('playing', playing);
    el.playIcon.innerHTML = playing
      ? '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>'
      : '<path d="M8 5v14l11-7z"/>';
  }

  function simLoop(now) {
    if (!simEngine.playing) { simEngine.raf = null; return; }
    const dt = (now - simEngine.lastFrame) / 1000;
    simEngine.lastFrame = now;
    simEngine.offsetHours += (dt * SIM_SPEED) / 3600;
    if (simEngine.offsetHours > 12) simEngine.offsetHours -= 24;
    if (simEngine.offsetHours < -12) simEngine.offsetHours += 24;
    const t = currentSimTime();
    el.time.textContent = fmtTime(t);
    el.delta.textContent = fmtOffsetHours(simEngine.offsetHours);
    el.delta.classList.remove('now', 'future', 'past');
    if (simEngine.offsetHours > 0) el.delta.classList.add('future');
    else if (simEngine.offsetHours < 0) el.delta.classList.add('past');
    el.range.value = String(clamp(simEngine.offsetHours, -12, 12));
    if (now - simEngine.lastDraw > 33) { draw(); simEngine.lastDraw = now; }
    simEngine.raf = requestAnimationFrame(simLoop);
  }

  function startSim() {
    if (simEngine.playing) return;
    simEngine.playing = true;
    simEngine.lastFrame = performance.now();
    simEngine.lastDraw = 0;
    updateSimUI();
    simEngine.raf = requestAnimationFrame(simLoop);
  }
  function pauseSim() {
    if (!simEngine.playing) return;
    simEngine.playing = false;
    if (simEngine.raf) cancelAnimationFrame(simEngine.raf);
    simEngine.raf = null;
    updateSimUI();
  }
  function toggleSim() { simEngine.playing ? pauseSim() : startSim(); }
  function setOffset(hours, { fromUser = false } = {}) {
    if (fromUser && simEngine.playing) pauseSim();
    simEngine.offsetHours = clamp(hours, -12, 12);
    state.skyTime = currentSimTime();
    updateSimUI();
    draw();
  }
  function resetToNow() {
    pauseSim();
    simEngine.offsetHours = 0;
    state.skyTime = null;
    updateSimUI();
    draw();
  }

  el.play.addEventListener('click', toggleSim);
  el.range.addEventListener('input', () => setOffset(parseFloat(el.range.value), { fromUser: true }));
  $('#sim-reset').addEventListener('click', resetToNow);

  // Gestos
  let pointers = new Map();
  let lastDist = 0;
  let wasPinching = false;
  function onPointerDown(e) {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, moved: false });
    dismissHint();
  }
  function onPointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) prev.moved = true;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, moved: prev.moved });
    const pts = [...pointers.values()];
    if (pts.length === 1 && !wasPinching) {
      const v = state.skyView;
      const rect = canvas.getBoundingClientRect();
      const scale = 180 / Math.max(rect.width, 1);
      v.rotation = wrap360(v.rotation - dx * scale);
      draw();
    } else if (pts.length >= 2) {
      wasPinching = true;
      const [a, b] = pts;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastDist > 0) {
        state.skyView.zoom = clamp(state.skyView.zoom * (dist / lastDist), 1, 4);
        draw();
      }
      lastDist = dist;
    }
  }
  function onPointerUp(e) {
    const p = pointers.get(e.pointerId);
    pointers.delete(e.pointerId);
    if (pointers.size < 2) lastDist = 0;
    if (pointers.size === 0) {
      if (p && !p.moved && !wasPinching) handleSkyTap(e, canvas, project);
      wasPinching = false;
    }
  }
  function onPointerCancel(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) lastDist = 0;
  }
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);

  function onLayerClick(e) {
    const btn = e.currentTarget;
    const k = btn.dataset.layer;
    state.skyLayers[k] = !state.skyLayers[k];
    btn.classList.toggle('on', state.skyLayers[k]);
    saveState();
    draw();
  }
  const layerBtns = $$('.chart-btn[data-layer]');
  layerBtns.forEach(btn => {
    btn.addEventListener('click', onLayerClick);
    btn.classList.toggle('on', state.skyLayers[btn.dataset.layer]);
  });

  // Tamaño con ResizeObserver
  let lastPx = 0;
  function applySize(cssSize) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = Math.max(160, Math.round(cssSize * dpr));
    if (px === lastPx) return;
    lastPx = px;
    canvas.width = px;
    canvas.height = px;
    canvas.dataset.dpr = String(dpr);
    draw();
  }
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      const rect = entry.contentRect;
      const size = Math.min(rect.width, rect.height || rect.width);
      if (size > 0) applySize(size);
    }
  });
  ro.observe(wrap);

  requestAnimationFrame(() => {
    const rect = wrap.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height || rect.width);
    if (size > 0) applySize(size);
    updateSimUI();
    draw();
  });

  skyCleanup = () => {
    pauseSim();
    ro.disconnect();
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerCancel);
    layerBtns.forEach(btn => btn.removeEventListener('click', onLayerClick));
  };
}

function handleSkyTap(e, canvas, project) {
  const rect = canvas.getBoundingClientRect();
  const dpr = parseFloat(canvas.dataset.dpr || 1);
  const x = (e.clientX - rect.left) * dpr;
  const y = (e.clientY - rect.top) * dpr;
  const time = new Date(Date.now() + simEngine.offsetHours * 3600 * 1000);
  const loc = state.location;
  const threshold = 25 * dpr;
  const rotation = state.skyView.rotation;
  const zoom = clamp(state.skyView.zoom || 1, 1, 4);
  const R = Math.min(canvas.width, canvas.height) * CHART_R_RATIO;
  const cx = canvas.width / 2, cy = canvas.height / 2;
  let best = null, bestDist = Infinity;
  function tryObj(obj, ra, dec) {
    const { alt, az } = radecToAltAz(ra, dec, time, loc.lat, loc.lon);
    if (alt < 0) return;
    const p = project(az, alt, R, cx, cy, rotation, zoom);
    if (!p.inside) return;
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < threshold && d < bestDist) { best = obj; bestDist = d; }
  }
  STARS.forEach(s => tryObj(s, s.ra, s.dec));
  DEEP_SKY.forEach(d => tryObj(d, d.ra, d.dec));
  const jd = jdFromDate(time);
  for (const pl of PLANETS) {
    const pe = planetEquatorial(pl.id, jd);
    tryObj(pl, pe.ra, pe.dec);
  }
  if (best) {
    const it = WIKI_INDEX.find(w => w.id === best.id);
    if (it) openObjectSheet(it);
  }
}

/* ---------- 10.3 LUNA ---------- */
function renderMoonView(root) {
  const now = new Date();
  const m = moonInfo(now);
  const moonRS = moonRiseSet(now);
  let photoQuality, photoColor, photoNote;
  if (m.illum < 0.25) { photoQuality = 'Excelente'; photoColor = 'var(--ok)'; photoNote = 'Cielo oscuro, ideal para Vía Láctea y objetos débiles.'; }
  else if (m.illum < 0.6) { photoQuality = 'Aceptable'; photoColor = 'var(--warm)'; photoNote = 'Algo de luz lunar; evitá apuntar hacia la Luna.'; }
  else { photoQuality = 'Mala'; photoColor = 'var(--bad)'; photoNote = 'Luna muy brillante; aprovechá para fotografiar la propia Luna.'; }

  root.innerHTML = `
    <div class="card hero">
      <div class="hero-moon">
        <div class="moon-orb" style="width:120px;height:120px">
          <canvas id="moon-cv" width="240" height="240"></canvas>
        </div>
        <div class="hero-info">
          <div class="hero-phase">${m.name}</div>
          <div class="hero-sub">${(m.illum*100).toFixed(1)}% iluminada</div>
          <div class="hero-sub">Edad: ${m.age.toFixed(2)} días</div>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi"><div class="kpi-label">Sale</div><div class="kpi-value">${fmtHour(moonRS.rise)}</div></div>
        <div class="kpi"><div class="kpi-label">Se pone</div><div class="kpi-value">${fmtHour(moonRS.set)}</div></div>
      </div>
      <div class="card-title mt-4">Calidad para astrofotografía</div>
      <div class="row between">
        <span style="font-size:20px;font-weight:600;color:${photoColor}">${photoQuality}</span>
        <span class="text-xs muted">${(m.illum*100).toFixed(0)}%</span>
      </div>
      <p class="text-sm muted mt-3">${photoNote}</p>
    </div>
    <div class="card">
      <div class="row between" style="margin-bottom:12px">
        <div class="card-title" style="margin:0" id="cal-month">—</div>
        <div class="row" style="gap:4px">
          <button class="icon-btn" id="cal-prev">‹</button>
          <button class="icon-btn" id="cal-next">›</button>
        </div>
      </div>
      <div class="moon-cal" id="moon-cal"></div>
    </div>
  `;

  drawMoonPhase($('#moon-cv'), m.phase);
  let calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const calEl = $('#moon-cal');
  const calLabel = $('#cal-month');
  function drawCalendar() {
    const y = calMonth.getFullYear();
    const mo = calMonth.getMonth();
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    calLabel.textContent = `${meses[mo]} ${y}`;
    const first = new Date(y, mo, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(y, mo + 1, 0).getDate();
    const dows = ['D','L','M','M','J','V','S'];
    let html = dows.map(d => `<div class="dow">${d}</div>`).join('');
    const prevDays = new Date(y, mo, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) html += `<div class="moon-day other-month">${prevDays - i}</div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, mo, d);
      const mm = moonInfo(date);
      const isToday = date.toDateString() === now.toDateString();
      html += `
        <button class="moon-day ${isToday ? 'today' : ''}" data-day="${d}">
          <span>${d}</span>
          <canvas width="40" height="40" data-phase="${mm.phase}"></canvas>
        </button>`;
       }
    const total = startDow + daysInMonth;
    const trailing = (7 - (total % 7)) % 7;
    for (let i = 1; i <= trailing; i++) html += `<div class="moon-day other-month">${i}</div>`;
    calEl.innerHTML = html;
    calEl.querySelectorAll('canvas[data-phase]').forEach(cv => drawMoonPhase(cv, parseFloat(cv.dataset.phase)));
    calEl.querySelectorAll('[data-day]').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = parseInt(btn.dataset.day);
        const date = new Date(y, mo, d);
        const mm = moonInfo(date);
        const rs = moonRiseSet(date);
        alert(`${fmtDate(date)}\n\n${mm.name}\n${(mm.illum*100).toFixed(0)}% iluminada\nSale: ${fmtHour(rs.rise)}\nSe pone: ${fmtHour(rs.set)}`);
      });
    });
  }
  $('#cal-prev').addEventListener('click', () => { calMonth.setMonth(calMonth.getMonth() - 1); drawCalendar(); });
  $('#cal-next').addEventListener('click', () => { calMonth.setMonth(calMonth.getMonth() + 1); drawCalendar(); });
  drawCalendar();
}

/* ---------- 10.4 EVENTOS ---------- */
function renderEventsView(root) {
  const events = computeUpcomingEvents(new Date(), 60);
  root.innerHTML = `
    <div class="card">
      <div class="card-title">Próximos 60 días</div>
      <p class="text-sm muted">${events.length} evento${events.length === 1 ? '' : 's'} astronómico${events.length === 1 ? '' : 's'} en el horizonte.</p>
    </div>
    <div class="card" id="events-list" style="padding: 8px 16px;"></div>
  `;
  const listEl = $('#events-list');
  if (!events.length) {
    listEl.innerHTML = `<div class="journal-empty">Sin eventos en los próximos 60 días.</div>`;
    return;
  }
  listEl.innerHTML = events.map(ev => {
    const days = daysUntil(ev.date);
    const countdownClass = days === 0 ? 'today' : (days <= 3 ? 'soon' : '');
    return `<div class="event-item">
      <div class="event-icon ${ev.type}">${ev.icon}</div>
      <div class="event-body">
        <div class="event-name">${ev.name}</div>
        <div class="event-when">${fmtDate(ev.date)}</div>
        <div class="event-desc">${ev.desc}</div>
      </div>
      <div class="event-countdown ${countdownClass}">${fmtDaysUntil(ev.date)}</div>
    </div>`;
  }).join('');
}

/* ---------- 10.5 WIKI ---------- */
function renderWiki(root) {
  renderWikiView(root, { openObjectSheet });
}

/* ---------- 10.6 FOTO ---------- */
function renderPhotoView(root) {
  const loc = state.location;
  const gcPlan = galacticCenterPlan(new Date(), loc.lat, loc.lon);

  root.innerHTML = `
    <div class="card">
      <div class="card-title">Tiempo máximo de exposición</div>
      <div class="field">
        <label>Distancia focal (mm)</label>
        <input type="number" id="p-focal" value="24" min="4" max="2000" />
      </div>
      <div class="field-row">
        <div class="field"><label>Apertura f/</label><input type="number" id="p-f" value="2.8" step="0.1" min="0.9" max="22" /></div>
        <div class="field"><label>Píxel pitch (µm)</label><input type="number" id="p-pixel" value="4.3" step="0.1" min="1" max="15" /></div>
      </div>
      <div class="field">
        <label>Zona del cielo</label>
        <select id="p-zone">
          <option value="1">Ecuador celeste (peor caso)</option>
          <option value="0.7" selected>Declinación media (~45°)</option>
          <option value="0.4">Cerca del polo (mejor caso)</option>
        </select>
      </div>
    </div>

    <div class="card elevated">
      <div class="result-box">
        <div class="card-title" style="text-align:center">NPF rule</div>
        <div><span class="result-big" id="p-npf">—</span><span class="result-unit">seg</span></div>
        <div class="result-sub">Método moderno y preciso</div>
      </div>
      <div class="kpi-grid mt-3">
        <div class="kpi"><div class="kpi-label">Regla 500</div><div class="kpi-value mono" id="p-500">—<span class="kpi-unit">s</span></div></div>
        <div class="kpi"><div class="kpi-label">Regla 400</div><div class="kpi-value mono" id="p-400">—<span class="kpi-unit">s</span></div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">StarTrails · trazos de estrellas</div>
      <div class="field">
        <label>Duración total del trazo</label>
        <select id="st-duration">
          <option value="30">30 minutos</option>
          <option value="60" selected>1 hora</option>
          <option value="120">2 horas</option>
          <option value="240">4 horas</option>
        </select>
      </div>
      <div class="field">
        <label>Zona del cielo</label>
        <select id="st-zone">
          <option value="0.5">Cerca del ecuador celeste (trazos rápidos)</option>
          <option value="0.85" selected>Declinación media (45°)</option>
          <option value="0.97">Cerca del polo (trazos circulares)</option>
        </select>
      </div>
      <div id="st-results"></div>
    </div>

    <div class="card">
      <div class="card-title">Cómo hacer StarTrails</div>
      <p class="text-sm muted" style="line-height:1.7">
        <strong style="color:var(--tx-hi)">Dos métodos:</strong><br>
        <strong style="color:var(--accent)">Exposición única:</strong> una sola toma muy larga (30 min a varias horas) con cámara en modo BULB. Trazo continuo y limpio, pero requiere trípode muy estable, cielo sin Luna y riesgo de ruido térmico.<br><br>
        <strong style="color:var(--accent)">Apilado (recomendado):</strong> muchas tomas cortas (20-30 s cada una) y se combinan después. Más control, menos ruido, podés descartar tomas con aviones o nubes. Con Software como StarStaX, Sequator o Photoshop.<br><br>
        <strong style="color:var(--tx-hi)">Ajustes base:</strong><br>
        · ISO: 400–1600 para exposiciones largas, 1600–3200 para apilado<br>
        · Apertura: f/2.8–f/4<br>
        · Enfoque: manual a infinito, verificado en live view<br>
        · Balance de blancos: manual (por ejemplo 3800 K)<br>
        · Formato RAW siempre<br><br>
        <strong style="color:var(--tx-hi)">Consejos clave:</strong><br>
        · Buscá un horizonte con un punto de referencia (árbol, casa, montaña) para dar contexto.<br>
        · Dejá 1 segundo de intervalo entre tomas para no forzar el buffer.<br>
        · Bloqueá todos los automatismos: estabilización OFF, autofoco OFF, reducción de ruido OFF.<br>
        · Batería cargada y tarjeta con espacio. Con frío, la batería dura menos.<br>
        · Sin Luna y con cielos oscuros es cuando mejor se ven las estrellas.
      </p>
    </div>

    <div class="card">
      <div class="card-title">Centro galáctico · Vía Láctea</div>
      <div id="gc-content"></div>
    </div>

    <div class="card">
      <div class="card-title">Ficha del equipo</div>
      <div class="field"><label>Cámara</label><input type="text" id="g-cam" placeholder="Ej: Canon EOS R6" /></div>
      <div class="field"><label>Objetivo</label><input type="text" id="g-lens" placeholder="Ej: Samyang 14mm f/2.8" /></div>
      <div class="field"><label>Telescopio</label><input type="text" id="g-tel" placeholder="Ej: SkyWatcher 200/1000" /></div>
      <button class="btn full" id="g-save">Guardar equipo</button>
    </div>
  `;

  $('#g-cam').value = state.gear.camera === '—' ? '' : state.gear.camera;
  $('#g-lens').value = state.gear.lens === '—' ? '' : state.gear.lens;
  $('#g-tel').value = state.gear.telescope === '—' ? '' : state.gear.telescope;

  function calcNPF() {
    const focal = parseFloat($('#p-focal').value) || 24;
    const f = parseFloat($('#p-f').value) || 2.8;
    const pixel = parseFloat($('#p-pixel').value) || 4.3;
    const zone = parseFloat($('#p-zone').value) || 1;
    const npf = (35 * f + 30 * pixel) / focal / zone;
    const r500 = 500 / focal / zone;
    const r400 = 400 / focal / zone;
    $('#p-npf').textContent = npf.toFixed(2);
    $('#p-500').innerHTML = `${r500.toFixed(1)}<span class="kpi-unit">s</span>`;
    $('#p-400').innerHTML = `${r400.toFixed(1)}<span class="kpi-unit">s</span>`;
  }
  ['p-focal','p-f','p-pixel','p-zone'].forEach(id => {
    $('#' + id).addEventListener('input', calcNPF);
  });
  calcNPF();

  function calcStarTrail() {
    const focal = parseFloat($('#p-focal').value) || 24;
    const pixel = parseFloat($('#p-pixel').value) || 4.3;
    const durationMin = parseFloat($('#st-duration').value) || 60;
    const cosDec = parseFloat($('#st-zone').value) || 0.85;

    const imageScale = (206.265 * pixel) / focal;                 // arcsec/pixel
    const angularSpeed = 15.041 * cosDec;                         // arcsec/segundo
    const pixelsPerSec = angularSpeed / imageScale;               // píxeles/segundo
    const trailLengthPx = pixelsPerSec * durationMin * 60;        // píxeles totales

    // Recomendaciones
    const frames30s = Math.round((durationMin * 60) / 30);
    const frames20s = Math.round((durationMin * 60) / 20);

    const box = $('#st-results');
    box.innerHTML = `
      <div class="result-box" style="margin-top:12px">
        <div class="card-title" style="text-align:center">Longitud del trazo</div>
        <div><span class="result-big">${trailLengthPx.toFixed(0)}</span><span class="result-unit">px</span></div>
        <div class="result-sub">para ${durationMin} min de exposición</div>
      </div>
      <div class="kpi-grid mt-3">
        <div class="kpi">
          <div class="kpi-label">Velocidad del trazo</div>
          <div class="kpi-value mono">${(pixelsPerSec * 60).toFixed(1)}<span class="kpi-unit">px/min</span></div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Escala de imagen</div>
          <div class="kpi-value mono">${imageScale.toFixed(2)}<span class="kpi-unit">″/px</span></div>
        </div>
      </div>
      <div class="kpi-grid mt-3">
        <div class="kpi">
          <div class="kpi-label">Frames de 20 s</div>
          <div class="kpi-value mono">${frames20s}<span class="kpi-unit">tomas</span></div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Frames de 30 s</div>
          <div class="kpi-value mono">${frames30s}<span class="kpi-unit">tomas</span></div>
        </div>
      </div>
      <p class="text-xs muted mt-3">
        Con la focal y píxel elegidos, cada minuto de exposición deja un trazo de
        ${(pixelsPerSec * 60).toFixed(1)} px. Después sumá los frames apilados para el trazo completo.
      </p>
    `;
  }
  ['st-duration','st-zone','p-focal','p-pixel'].forEach(id => {
    const el = $('#' + id);
    if (el) el.addEventListener('input', calcStarTrail);
  });
  calcStarTrail();

  renderGalacticCenter($('#gc-content'), gcPlan, loc);

  $('#g-save').addEventListener('click', () => {
    state.gear.camera = $('#g-cam').value || '—';
    state.gear.lens = $('#g-lens').value || '—';
    state.gear.telescope = $('#g-tel').value || '—';
    saveState();
    toast('Equipo guardado');
  });
}

function renderGalacticCenter(container, plan, loc) {
  if (!plan.visible) {
    container.innerHTML = `
      <div class="mw-badge bad">No visible esta noche por encima de 10°</div>
      <p class="text-sm muted mt-3">
        El centro galáctico (Sagitario) es un objeto del cielo austral de invierno.
        Desde ${loc.name}, las mejores noches para fotografiarlo son de mayo a agosto.
      </p>
    `;
    return;
  }
  const az = plan.peakAz;
  const dirs = ['N','NE','E','SE','S','SO','O','NO'];
  const dir = dirs[Math.round(wrap360(az) / 45) % 8];
  const maxAltOk = plan.peakAlt >= 25;
  const badgeClass = maxAltOk ? 'ok' : 'warn';
  const quality = plan.peakAlt >= 40 ? 'Excelente'
                : plan.peakAlt >= 25 ? 'Buena'
                : plan.peakAlt >= 15 ? 'Aceptable' : 'Baja';
  container.innerHTML = `
    <div class="row" style="flex-wrap:wrap;gap:8px;margin-bottom:12px">
      <span class="mw-badge ${badgeClass}">Alt máx ${plan.peakAlt.toFixed(0)}°</span>
      <span class="mw-badge">${quality}</span>
    </div>
    <canvas class="mw-chart" id="mw-chart" width="640" height="180"></canvas>
    <div class="kpi-grid mt-3">
      <div class="kpi"><div class="kpi-label">Mejor momento</div><div class="kpi-value mono" style="font-size:17px">${fmtTime(plan.peak)}</div></div>
      <div class="kpi"><div class="kpi-label">Dirección</div><div class="kpi-value mono" style="font-size:17px">${dir} · ${az.toFixed(0)}°</div></div>
      <div class="kpi"><div class="kpi-label">Visible desde</div><div class="kpi-value mono" style="font-size:15px">${fmtTime(plan.start)}</div></div>
      <div class="kpi"><div class="kpi-label">Hasta</div><div class="kpi-value mono" style="font-size:15px">${fmtTime(plan.end)}</div></div>
    </div>
    <p class="text-sm muted mt-3">
      ${maxAltOk
        ? 'Buena altura sobre el horizonte. Buscá un sitio sin obstáculos hacia el ' + dir + '.'
        : 'Altura baja: la Vía Láctea estará cerca del horizonte. Buscá un horizonte ' + dir + ' totalmente despejado.'}
    </p>
  `;
  drawMilkyWayChart($('#mw-chart'), plan.samples);
}

function drawMilkyWayChart(canvas, samples) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 320;
  const cssH = canvas.clientHeight || 90;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const w = canvas.width, h = canvas.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const padL = 8 * dpr, padR = 8 * dpr, padT = 8 * dpr, padB = 16 * dpr;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const maxAlt = 60;
  const yFor = alt => padT + innerH * (1 - clamp(alt, 0, maxAlt) / maxAlt);
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1 * dpr;
  ctx.beginPath(); ctx.moveTo(padL, yFor(0)); ctx.lineTo(w - padR, yFor(0)); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath(); ctx.moveTo(padL, yFor(30)); ctx.lineTo(w - padR, yFor(30)); ctx.stroke();
  const n = samples.length;
  ctx.beginPath();
  let first = true;
  for (let i = 0; i < n; i++) {
    const s = samples[i];
    const x = padL + (i / (n - 1)) * innerW;
    const y = yFor(s.alt);
    if (first) { ctx.moveTo(x, y); first = false; }
    else ctx.lineTo(x, y);
  }
  ctx.lineTo(w - padR, yFor(0));
  ctx.lineTo(padL, yFor(0));
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, yFor(maxAlt), 0, yFor(0));
  grad.addColorStop(0, 'rgba(167, 139, 250, 0.55)');
  grad.addColorStop(1, 'rgba(167, 139, 250, 0.05)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const s = samples[i];
    const x = padL + (i / (n - 1)) * innerW;
    const y = yFor(s.alt);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.95)';
  ctx.lineWidth = 2 * dpr;
  ctx.stroke();
  ctx.font = `${10 * dpr}px ui-monospace, monospace`;
  ctx.fillStyle = 'rgba(182, 189, 207, 0.7)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const marks = [18, 21, 0, 3, 6];
  for (let hi = 0; hi < n; hi += 3) {
    const s = samples[hi];
    const hour = s.t.getHours();
    if (!marks.includes(hour)) continue;
    const x = padL + (hi / (n - 1)) * innerW;
    ctx.fillText(`${pad2(hour)}h`, x, h - padB + 2 * dpr);
  }
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
}

/* ---------- 10.7 AJUSTES ---------- */
function renderSettingsView(root) {
  root.innerHTML = `
    <div class="card">
      <div class="card-title">Ubicación</div>
      <div class="field"><label>Nombre del sitio</label><input type="text" id="s-name" value="${state.location.name}" /></div>
      <div class="field-row">
        <div class="field"><label>Latitud</label><input type="number" id="s-lat" value="${state.location.lat}" step="0.0001" min="-90" max="90" /></div>
        <div class="field"><label>Longitud</label><input type="number" id="s-lon" value="${state.location.lon}" step="0.0001" min="-180" max="180" /></div>
      </div>
      <div class="row" style="gap:8px">
        <button class="btn" id="s-gps" style="flex:1">Usar GPS</button>
        <button class="btn primary" id="s-save" style="flex:1">Guardar</button>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Visualización</div>
      <div class="switch-row">
        <div>
          <div class="sr-label">Modo noche rojo</div>
          <div class="sr-desc">Preserva la adaptación visual en la oscuridad</div>
        </div>
        <div class="switch ${state.nightMode ? 'on' : ''}" id="s-night"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Diario</div>
      <p class="text-sm muted" style="margin-bottom:12px">${state.journal.length} entrada${state.journal.length === 1 ? '' : 's'} registrada${state.journal.length === 1 ? '' : 's'}.</p>
      <button class="btn full" id="s-journal-clear">Vaciar diario</button>
    </div>
    <div class="card">
      <div class="card-title">Acerca de</div>
      <p class="text-sm muted">
        <strong>Cielo Sur</strong> — Guía astronómica offline.<br>
        Todos los cálculos se ejecutan en el dispositivo.<br>
        No envía datos a ningún servidor.
      </p>
    </div>
  `;
  $('#s-save').addEventListener('click', () => {
    state.location.name = $('#s-name').value || 'Sin nombre';
    state.location.lat = parseFloat($('#s-lat').value) || 0;
    state.location.lon = parseFloat($('#s-lon').value) || 0;
    saveState();
    toast('Ubicación actualizada');
  });
  $('#s-gps').addEventListener('click', () => {
    if (!navigator.geolocation) { toast('GPS no disponible'); return; }
    toast('Buscando GPS…');
    navigator.geolocation.getCurrentPosition(
      pos => {
        $('#s-lat').value = pos.coords.latitude.toFixed(4);
        $('#s-lon').value = pos.coords.longitude.toFixed(4);
        toast('Coordenadas obtenidas');
      },
      () => toast('No se pudo obtener ubicación'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
  $('#s-night').addEventListener('click', function() {
    const on = !this.classList.contains('on');
    this.classList.toggle('on', on);
    setNightMode(on);
  });
  $('#s-journal-clear').addEventListener('click', () => {
    if (confirm('¿Borrar todas las entradas del diario?')) {
      state.journal = [];
      saveState();
      toast('Diario vaciado');
      renderSettingsView(root);
    }
  });
}

/* ============================================================
   11. DIARIO
   ============================================================ */
function renderJournalPreview(container) {
  if (!state.journal.length) {
    container.innerHTML = `<div class="journal-empty">
      Todavía no anotaste observaciones.<br>
      Tocá cualquier objeto (en la carta o en los listados) y usá "Anotar".
    </div>`;
    return;
  }
  const recent = state.journal.slice(0, 4);
  container.innerHTML = recent.map(entry => {
    const d = new Date(entry.date);
    return `<div class="journal-item">
      <div class="journal-head">
        <div class="journal-name">${entry.objectName}</div>
        <div class="journal-date">${fmtDateTime(d)}</div>
      </div>
      ${entry.notes ? `<div class="journal-notes">${escapeHTML(entry.notes)}</div>` : ''}
    </div>`;
  }).join('');
}

function addJournalEntry(obj) {
  const notes = prompt(`Notas para ${obj.name} (opcional):`, '') || '';
  state.journal.unshift({
    id: Date.now().toString(36),
    objectId: obj.id,
    objectName: obj.name,
    date: new Date().toISOString(),
    notes
  });
  if (state.journal.length > 500) state.journal.length = 500;
  saveState();
  toast('Anotado en el diario');
  closeObjectSheet();
}

function escapeHTML(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ============================================================
   12. MODO NOCHE
   ============================================================ */
function setNightMode(on) {
  state.nightMode = on;
  document.documentElement.classList.toggle('night-red', on);
  $('#night-toggle').classList.toggle('active', on);
  saveState();
}

/* ============================================================
   13. FICHA DE OBJETO
   ============================================================ */
function openObjectSheet(obj) {
  let backdrop = $('#sheet-backdrop');
  let sheet = $('#sheet');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'sheet-backdrop';
    backdrop.className = 'sheet-backdrop';
    document.body.appendChild(backdrop);
    sheet = document.createElement('div');
    sheet.id = 'sheet';
    sheet.className = 'sheet';
    document.body.appendChild(sheet);
    backdrop.addEventListener('click', closeObjectSheet);
    let startY = 0, curY = 0, dragging = false;
    sheet.addEventListener('pointerdown', e => {
      if (sheet.scrollTop > 0) return;
      dragging = true; startY = e.clientY; curY = 0;
    });
    sheet.addEventListener('pointermove', e => {
      if (!dragging) return;
      curY = Math.max(0, e.clientY - startY);
      sheet.style.transform = `translateY(${curY}px)`;
    });
    sheet.addEventListener('pointerup', () => {
      dragging = false;
      if (curY > 80) closeObjectSheet();
      else sheet.style.transform = '';
    });
  }
  sheet.innerHTML = objectSheetHTML(obj) + `
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn primary" id="sheet-journal" style="flex:1">Anotar observación</button>
      <button class="btn ghost" id="sheet-close" style="flex:0 0 auto;min-width:80px">Cerrar</button>
    </div>
  `;
  sheet.style.transform = '';
  sheet.scrollTop = 0;
  requestAnimationFrame(() => {
    backdrop.classList.add('open');
    sheet.classList.add('open');
  });

  const jbtn = sheet.querySelector('#sheet-journal');
  if (jbtn) jbtn.addEventListener('click', () => addJournalEntry(obj));
  const cbtn = sheet.querySelector('#sheet-close');
  if (cbtn) cbtn.addEventListener('click', closeObjectSheet);

  sheet.querySelectorAll('[data-related-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const it = WIKI_INDEX.find(w => w.id === btn.dataset.relatedId);
      if (it) openObjectSheet(it);
    });
  });
}
function closeObjectSheet() {
  const backdrop = $('#sheet-backdrop');
  const sheet = $('#sheet');
  if (!backdrop) return;
  backdrop.classList.remove('open');
  sheet.classList.remove('open');
  sheet.style.transform = '';
}

/* ============================================================
   14. FASE LUNAR
   ============================================================ */
function drawMoonPhase(canvas, phase) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.44;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0b1220';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  const cosPhase = Math.cos(2 * Math.PI * phase);
  const rx = r * Math.abs(cosPhase);
  const rightLit = phase < 0.5;
  const traceRight = (phase < 0.5 && cosPhase > 0) || (phase > 0.5 && cosPhase < 0);
  ctx.fillStyle = '#e9e2c6';
  ctx.beginPath();
  if (rightLit) ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
  else          ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, true);
  if (rx < 0.001) ctx.lineTo(cx, cy - r);
  else ctx.ellipse(cx, cy, rx, r, 0, Math.PI / 2, -Math.PI / 2, traceRight);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
}

/* ============================================================
   15. TOAST
   ============================================================ */
function toast(msg) {
  let el = $('#toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = `position:fixed;left:50%;bottom:90px;transform:translateX(-50%);
      background:rgba(20,26,40,0.95);color:var(--tx-hi);padding:10px 18px;border-radius:999px;
      font-size:13px;border:1px solid var(--line-2);backdrop-filter:blur(8px);
      z-index:100;opacity:0;transition:opacity .2s;pointer-events:none;`;
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => { el.style.opacity = '1'; });
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = '0'; }, 2000);
}

/* ============================================================
   16. ROUTER Y ARRANQUE
   ============================================================ */
const ROUTES = {
  tonight:  { title: 'Hoy',      render: renderTonightView },
  sky:      { title: 'Cielo',    render: renderSkyView },
  moon:     { title: 'Luna',     render: renderMoonView },
  events:   { title: 'Eventos',  render: renderEventsView },
  wiki:     { title: 'Wiki',     render: renderWiki },
  photo:    { title: 'Foto',     render: renderPhotoView },
  settings: { title: 'Ajustes',  render: renderSettingsView }
};

let currentRoute = null;
function navigate(route) {
  if (!ROUTES[route]) route = 'tonight';
  if (currentRoute === route) return;
  currentRoute = route;
  location.hash = `#/${route}`;
  $('#view-title').textContent = ROUTES[route].title;
  $$('#tabbar .tab').forEach(t => t.classList.toggle('active', t.dataset.route === route));
  const view = $('#view');
  view.innerHTML = '';
  view.scrollTop = 0;
  ROUTES[route].render(view);
}

function boot() {
  loadState();
  if (state.nightMode) document.documentElement.classList.add('night-red');
  $('#night-toggle').classList.toggle('active', state.nightMode);
  $('#night-toggle').addEventListener('click', () => setNightMode(!state.nightMode));
  $$('#tabbar .tab').forEach(t => t.addEventListener('click', () => navigate(t.dataset.route)));
  window.addEventListener('hashchange', () => {
    const r = location.hash.replace('#/', '') || 'tonight';
    navigate(r);
  });
  const initial = location.hash.replace('#/', '') || 'tonight';
  navigate(initial);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

boot();