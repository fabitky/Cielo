"use strict";

window.onerror = function(msg, url, line){
  var box = document.getElementById("errbox");
  if (box){
    box.style.display = "block";
    box.appendChild(document.createTextNode(msg + " L" + line));
    box.appendChild(document.createElement("br"));
  }
  var log = document.getElementById("bootlog");
  if (log){ log.textContent = "ERROR L" + line; }
  return false;
};

function bootLog(msg){
  var log = document.getElementById("bootlog");
  if (log){ log.textContent = msg; }
}

bootLog("B1");

var APP = {};

function byId(id){ return document.getElementById(id); }
function clear(el){
  while (el.firstChild){ el.removeChild(el.firstChild); }
}
function el(tag, cls, txt){
  var e = document.createElement(tag);
  if (cls){ e.className = cls; }
  if (txt !== undefined && txt !== null){
    e.textContent = String(txt);
  }
  return e;
}
function listItem(title, sub, val, dotColor){
  var item = el("div", "item");
  item.setAttribute("data-item", title);
  var dot = el("div", "dot");
  if (dotColor){ dot.style.background = dotColor; }
  var body = el("div", "body");
  body.appendChild(el("div", "title", title));
  body.appendChild(el("div", "sub", sub));
  var v = el("div", "val", val);
  item.appendChild(dot);
  item.appendChild(body);
  item.appendChild(v);
  return item;
}
function emptyMsg(txt){ return el("div", "empty", txt); }

bootLog("B2");

var memStore = {};
function storeGet(k){
  try { return localStorage.getItem(k); }
  catch(e){ return memStore[k] || null; }
}
function storeSet(k, v){
  try { localStorage.setItem(k, v); }
  catch(e){ memStore[k] = v; }
}

var state = {
  lat: -41.9667,
  lon: -71.5333,
  timeOffset: 0,
  spin: false,
  redMode: false,
  show: {
    constellations: true,
    names: true,
    planets: true,
    grid: false
  }
};

var view = {
  zoom: 1, ox: 0, oy: 0,
  dragging: false, lastX: 0, lastY: 0,
  pinchDist: 0, pinchZoom: 1
};

var moonCal = {
  year: 0, month: 0, selected: -1
};

var journal = [];

try {
  var saved = JSON.parse(storeGet("c7loc") || "null");
  if (saved && typeof saved.lat === "number"){
    state.lat = saved.lat; state.lon = saved.lon;
  }
} catch(e){}

try {
  var savedJ = JSON.parse(storeGet("c7journal") || "[]");
  if (Array.isArray(savedJ)){ journal = savedJ; }
} catch(e){}

if (storeGet("c7redmode") === "1"){ state.redMode = true; }

var DEG = Math.PI / 180;
var RAD = 180 / Math.PI;

var toastTimer = null;
function toast(msg, ms){
  var t = byId("toast");
  if (!t){ return; }
  t.textContent = msg;
  t.className = "on";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.className = ""; }, ms || 2200);
}

bootLog("B3");

var STARS = [
  [6.752,-16.716,-1.46,"Sirius"],
  [6.399,-52.696,-0.72,"Canopus"],
  [14.660,-60.835,-0.27,"AlfaCen"],
  [14.261,19.182,-0.05,"Arturo"],
  [18.615,38.784,0.03,"Vega"],
  [5.278,45.998,0.08,"Capella"],
  [5.242,-8.202,0.13,"Rigel"],
  [7.655,5.225,0.34,"Procyon"],
  [5.919,7.407,0.42,"Betelgeuse"],
  [1.629,-57.237,0.46,"Achernar"],
  [14.064,-60.373,0.61,"Hadar"],
  [19.846,8.868,0.77,"Altair"],
  [4.599,16.509,0.85,"Aldebaran"],
  [16.490,-26.432,0.96,"Antares"],
  [13.420,-11.161,0.98,"Espiga"],
  [7.755,28.026,1.14,"Pollux"],
  [22.961,-29.622,1.16,"Fomalhaut"],
  [20.690,45.280,1.25,"Deneb"],
  [12.795,-59.689,1.25,"Mimosa"],
  [10.139,11.967,1.35,"Regulo"],
  [6.977,-28.972,1.50,"Adhara"],
  [7.577,31.888,1.58,"Castor"],
  [12.519,-57.113,1.63,"Gacrux"],
  [5.418,6.350,1.64,"Bellatrix"],
  [5.438,28.608,1.65,"Elnath"],
  [9.220,-69.717,1.67,"Miaplacidus"],
  [5.604,-1.202,1.69,"Alnilam"],
  [22.137,-46.961,1.74,"Alnair"],
  [12.900,55.960,1.77,"Alioth"],
  [5.679,-1.943,1.77,"Alnitak"],
  [11.062,61.751,1.79,"Dubhe"],
  [3.405,49.861,1.79,"Mirfak"],
  [7.140,-26.393,1.83,"Wezen"],
  [17.622,-42.998,1.86,"Sargas"],
  [18.403,-34.385,1.85,"KausAus"],
  [8.375,-59.510,1.86,"Avior"],
  [13.792,49.313,1.86,"Alkaid"],
  [5.992,44.947,1.90,"Menkalinan"],
  [16.811,-69.028,1.92,"Atria"],
  [6.629,16.399,1.93,"Alhena"],
  [20.427,-56.735,1.94,"Peacock"],
  [8.125,-47.336,1.96,"Alsephina"],
  [6.378,-17.956,1.98,"Mirzam"],
  [2.530,89.264,1.98,"Polaris"],
  [9.460,-8.659,1.98,"Alphard"],
  [2.120,23.463,2.00,"Hamal"],
  [10.333,19.841,2.08,"Algieba"],
  [0.726,-17.987,2.04,"Diphda"],
  [18.921,-26.297,2.05,"Nunki"],
  [14.111,-36.370,2.06,"Menkent"],
  [0.140,29.091,2.06,"Alpheratz"],
  [1.162,35.620,2.06,"Mirach"],
  [5.796,-9.670,2.07,"Saiph"],
  [14.845,74.156,2.08,"Kochab"],
  [17.582,12.560,2.08,"Rasalhague"],
  [3.136,40.956,2.12,"Algol"],
  [2.065,42.330,2.10,"Almach"],
  [11.818,14.572,2.14,"Denebola"],
  [9.285,-59.275,2.21,"Aspidiske"],
  [9.133,-43.433,2.23,"Suhail"],
  [15.578,26.715,2.23,"Alphecca"],
  [5.533,-0.299,2.23,"Mintaka"],
  [20.370,40.257,2.23,"Sadr"],
  [17.943,51.489,2.23,"Eltanin"],
  [0.675,56.537,2.24,"Schedar"],
  [8.060,-40.003,2.25,"Naos"],
  [0.153,59.150,2.27,"Caph"],
  [14.750,27.074,2.37,"Izar"],
  [3.791,24.105,2.87,"Alcyone"],
  [7.407,8.289,2.90,"Gomeisa"],
  [12.443,-63.099,2.60,"Acrux"],
  [17.560,-37.104,2.70,"Lesath"],
  [17.708,-39.030,2.29,"Shaula"],
  [19.044,13.863,2.99,"Sulafat"],
  [18.983,32.689,2.46,"Sheliak"],
  [21.736,9.875,2.39,"Enif"],
  [22.716,-46.885,2.07,"Ankaa"],
  [0.727,4.090,2.36,"Algenib"],
  [3.038,4.090,2.01,"Menkar"],
  [15.590,6.426,2.08,"Unukalhai"],
  [11.031,56.382,2.37,"Merak"],
  [11.897,53.695,2.44,"Phecda"],
  [12.257,57.033,3.31,"Megrez"],
  [13.399,54.925,2.23,"Mizar"],
  [1.430,60.235,2.68,"Ruchbah"],
  [1.907,63.670,3.37,"Segin"],
  [20.770,33.970,2.48,"Gienah"],
  [19.771,10.613,2.72,"Tarazed"]
];

var STAR_MAP = {};
for (var si = 0; si < STARS.length; si++){
  var stt = STARS[si];
  if (!STAR_MAP[stt[3]]){ STAR_MAP[stt[3]] = stt; }
}

var CONST_LINES = [
  ["Betelgeuse","Bellatrix"],["Alnitak","Alnilam"],
  ["Alnilam","Mintaka"],["Betelgeuse","Alnitak"],
  ["Bellatrix","Mintaka"],["Alnitak","Saiph"],
  ["Mintaka","Rigel"],["Saiph","Rigel"],
  ["Dubhe","Merak"],["Merak","Phecda"],
  ["Phecda","Megrez"],["Megrez","Dubhe"],
  ["Megrez","Alioth"],["Alioth","Mizar"],
  ["Mizar","Alkaid"],["Caph","Schedar"],
  ["Schedar","Ruchbah"],["Ruchbah","Segin"],
  ["Acrux","Gacrux"],["Mimosa","Acrux"],
  ["Antares","Shaula"],["Vega","Sheliak"],
  ["Sheliak","Sulafat"],["Sulafat","Vega"],
  ["Deneb","Sadr"],["Altair","Deneb"],
  ["Aldebaran","Elnath"]
];

var MESSIER = [
  [5.588,-5.391,"M42 Orion","Nebulosa",4.0],
  [0.712,41.269,"M31 Andromeda","Galaxia",3.4],
  [13.703,-10.448,"M104 Sombrero","Galaxia",8.0],
  [3.787,24.117,"M45 Pleiades","Cumulo",1.6],
  [18.014,-24.383,"M8 Laguna","Nebulosa",6.0],
  [18.313,-16.183,"M16 Aguila","Nebulosa",6.0],
  [17.836,-29.876,"M20 Trifida","Nebulosa",6.3],
  [12.560,12.894,"M87 Virgo","Galaxia",8.6],
  [16.695,-4.992,"M4 Escorpio","Cumulo",5.6],
  [5.586,22.014,"M1 Cangrejo","Nebulosa",8.4]
];

var PLANETS = [
  {n:"Mercurio",e:0.20563,i:7.005,O:48.331,w:29.124,M:174.796,r:4.09233445,c:"#b8b8b8"},
  {n:"Venus",   e:0.00677,i:3.395,O:76.680,w:54.884,M:50.115, r:1.60213034,c:"#ffe8b0"},
  {n:"Marte",   e:0.09339,i:1.850,O:49.558,w:286.502,M:19.373,r:0.52402068,c:"#ff9060"},
  {n:"Jupiter", e:0.04839,i:1.304,O:100.464,w:273.867,M:20.020,r:0.08308529,c:"#ffd8a0"},
  {n:"Saturno", e:0.05386,i:2.485,O:113.665,w:339.392,M:317.020,r:0.03344414,c:"#ffd070"}
];

bootLog("B4");

function julianDate(date){
  return date.getTime() / 86400000 + 2440587.5;
}
function gmst(jd){
  var T = (jd - 2451545.0) / 36525;
  var g = 280.46061837;
  g += 360.98564736629 * (jd - 2451545.0);
  g += 0.000387933 * T * T;
  g -= T * T * T / 38710000;
  return ((g % 360) + 360) % 360;
}
function lstDeg(jd, lonDeg){
  return ((gmst(jd) + lonDeg) % 360 + 360) % 360;
}
function altAz(raHours, decDeg, latDeg, lstD){
  var ha = ((lstD - raHours * 15) % 360 + 360) % 360;
  var haR = ha * DEG;
  var decR = decDeg * DEG;
  var latR = latDeg * DEG;
  var sinAlt = Math.sin(decR) * Math.sin(latR);
  sinAlt += Math.cos(decR) * Math.cos(latR) * Math.cos(haR);
  var alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  var y = -Math.sin(haR) * Math.cos(decR);
  var x = Math.sin(decR) * Math.cos(latR);
  x -= Math.cos(decR) * Math.sin(latR) * Math.cos(haR);
  var az = Math.atan2(y, x) * RAD;
  az = ((az % 360) + 360) % 360;
  return { alt: alt * RAD, az: az };
}
function sunGeoEcliptic(jd){
  var n = jd - 2451545.0;
  var L = (280.460 + 0.9856474 * n) % 360;
  var g = ((357.528 + 0.9856003 * n) % 360) * DEG;
  var lam = L + 1.915 * Math.sin(g);
  lam += 0.020 * Math.sin(2 * g);
  lam = lam * DEG;
  var r = 1.00014 - 0.01671 * Math.cos(g);
  r -= 0.00014 * Math.cos(2 * g);
  return { x: r * Math.cos(lam), y: r * Math.sin(lam), z: 0 };
}
function moonPos(jd){
  var n = jd - 2451545.0;
  var L = (218.316 + 13.176396 * n) % 360;
  var M = ((134.963 + 13.064993 * n) % 360) * DEG;
  var F = ((93.272 + 13.229350 * n) % 360) * DEG;
  var lam = (L + 6.289 * Math.sin(M)) * DEG;
  var beta = (5.128 * Math.sin(F)) * DEG;
  var eps = 23.439 * DEG;
  var num = Math.sin(lam) * Math.cos(eps);
  num -= Math.tan(beta) * Math.sin(eps);
  var ra = Math.atan2(num, Math.cos(lam)) * RAD / 15;
  var num2 = Math.sin(beta) * Math.cos(eps);
  num2 += Math.cos(beta) * Math.sin(eps) * Math.sin(lam);
  var dec = Math.asin(num2) * RAD;
  var sunLam = ((280.460 + 0.9856474 * n) % 360 + 360) % 360;
  var moonLam = ((lam * RAD) % 360 + 360) % 360;
  var elong = ((moonLam - sunLam) % 360 + 360) % 360;
  var phase = (1 - Math.cos(elong * DEG)) / 2;
  return {
    ra: ((ra % 24) + 24) % 24,
    dec: dec,
    phase: phase,
    elong: elong
  };
}
function kepler(M_deg, e){
  var M = M_deg * DEG;
  var E = M;
  for (var k = 0; k < 8; k++){ E = M + e * Math.sin(E); }
  var nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );
  var r = 1 - e * Math.cos(E);
  return { nu: nu, r: r };
}
function planetHelio(p, jd){
  var d = jd - 2451545.0;
  var M = ((p.M + p.r * d) % 360 + 360) % 360;
  var kr = kepler(M, p.e);
  var w = p.w * DEG;
  var Om = p.O * DEG;
  var inc = p.i * DEG;
  var u = kr.nu + w;
  var x = Math.cos(Om) * Math.cos(u);
  x -= Math.sin(Om) * Math.sin(u) * Math.cos(inc);
  x = kr.r * x;
  var y = Math.sin(Om) * Math.cos(u);
  y += Math.cos(Om) * Math.sin(u) * Math.cos(inc);
  y = kr.r * y;
  var z = kr.r * Math.sin(u) * Math.sin(inc);
  return { x: x, y: y, z: z };
}
function planetRaDec(p, jd){
  var ph = planetHelio(p, jd);
  var sg = sunGeoEcliptic(jd);
  var gx = ph.x + sg.x;
  var gy = ph.y + sg.y;
  var gz = ph.z;
  var eps = 23.439 * DEG;
  var ye = gy * Math.cos(eps) - gz * Math.sin(eps);
  var ze = gy * Math.sin(eps) + gz * Math.cos(eps);
  var ra = Math.atan2(ye, gx) * RAD / 15;
  ra = (ra + 24) % 24;
  var dec = Math.atan2(ze, Math.sqrt(gx * gx + ye * ye)) * RAD;
  return { ra: ra, dec: dec };
}

var SYNODIC = 29.530588853;
var NEW_MOON_JD = 2451550.26;

function nextMoonPhases(fromDate){
  var res = [];
  var jd0 = julianDate(fromDate);
  var age = ((jd0 - NEW_MOON_JD) % SYNODIC + SYNODIC) % SYNODIC;
  var frac = age / SYNODIC;
  var targets = [0, 0.25, 0.5, 0.75];
  var names = [
    "Luna nueva",
    "Cuarto creciente",
    "Luna llena",
    "Cuarto menguante"
  ];
  for (var k = 0; k < 4; k++){
    var daysAhead = ((targets[k] - frac + 1) % 1) * SYNODIC;
    if (daysAhead < 0.1){ daysAhead += SYNODIC; }
    if (daysAhead < 60){
      var dt = new Date(fromDate.getTime() + daysAhead * 86400000);
      res.push({ name: names[k], days: daysAhead, date: dt });
    }
  }
  res.sort(function(a, b){ return a.days - b.days; });
  return res;
}

var METEORS = [
  {name:"Cuadrantidas", m:1, d:3, zhr:120, rad:"Bootes"},
  {name:"Liridas", m:4, d:22, zhr:18, rad:"Lira"},
  {name:"EtaAcuaridas", m:5, d:6, zhr:50, rad:"Acuario"},
  {name:"Perseidas", m:8, d:12, zhr:100, rad:"Perseo"},
  {name:"Orionidas", m:10, d:21, zhr:20, rad:"Orion"},
  {name:"Leonidas", m:11, d:17, zhr:15, rad:"Leo"},
  {name:"Geminidas", m:12, d:14, zhr:150, rad:"Geminis"},
  {name:"Ursidas", m:12, d:22, zhr:10, rad:"OsaMenor"}
];

function nextMeteors(fromDate){
  var res = [];
  var y = fromDate.getFullYear();
  for (var i = 0; i < METEORS.length; i++){
    var m = METEORS[i];
    for (var yy = y; yy <= y + 1; yy++){
      var d = new Date(yy, m.m - 1, m.d);
      var days = (d - fromDate) / 86400000;
      if (days > 0 && days < 60){
        res.push({
          name: m.name, date: d, days: days,
          zhr: m.zhr, rad: m.rad
        });
      }
    }
  }
  res.sort(function(a, b){ return a.days - b.days; });
  return res;
}

function moonPhaseName(p){
  if (p < 0.03){ return "Nueva"; }
  if (p < 0.22){ return "Creciente"; }
  if (p < 0.28){ return "Cuarto creciente"; }
  if (p < 0.47){ return "Gibosa creciente"; }
  if (p < 0.53){ return "Llena"; }
  if (p < 0.72){ return "Gibosa menguante"; }
  if (p < 0.78){ return "Cuarto menguante"; }
  if (p < 0.97){ return "Menguante"; }
  return "Nueva";
}

function getLSTString(jd, lonDeg){
  var lst = lstDeg(jd, lonDeg);
  var hours = lst / 15;
  var h = Math.floor(hours);
  var m = Math.floor((hours - h) * 60);
  var s = Math.floor(((hours - h) * 60 - m) * 60);
  function pad(x){ return (x < 10 ? "0" : "") + x; }
  return pad(h) + "h " + pad(m) + "m " + pad(s) + "s";
}

bootLog("B5");

function go(page, btnEl){
  var pages = document.getElementsByClassName("page");
  for (var i = 0; i < pages.length; i++){
    pages[i].className = "page";
  }
  var target = byId("page-" + page);
  if (target){ target.className = "page active"; }
  var navBtns = byId("nav").getElementsByTagName("button");
  for (var j = 0; j < navBtns.length; j++){
    navBtns[j].className = "";
  }
  if (btnEl){
    btnEl.className = "on";
  } else {
    var order = [
      "home","sky","tonight","moon","calendar","journal","wiki","astro"
    ];
    var idx = order.indexOf(page);
    if (idx >= 0 && navBtns[idx]){ navBtns[idx].className = "on"; }
  }
  var main = byId("main");
  if (main){ main.scrollTop = 0; }
  if (page === "sky"){ setTimeout(resizeCanvas, 50); }
  if (page === "astro"){ renderAstro(); }
  if (page === "wiki"){ renderWikiList(); }
  if (page === "moon"){ renderMoonPage(); }
  if (page === "tonight"){ renderVisibilityChart(); }
}

var canvas = null;
var ctx = null;
var cssW = 0, cssH = 0, cxv = 0, cyv = 0, Rv = 0;

function resizeCanvas(){
  canvas = byId("skyCanvas");
  if (!canvas){ return; }
  var dpr = window.devicePixelRatio || 1;
  if (dpr > 2){ dpr = 2; }
  var rect = canvas.getBoundingClientRect();
  cssW = rect.width; cssH = rect.height;
  if (cssW < 10 || cssH < 10){
    setTimeout(resizeCanvas, 100);
    return;
  }
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx = canvas.getContext("2d");
  if (!ctx){ return; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cxv = cssW / 2;
  cyv = cssH / 2;
  Rv = Math.min(cssW, cssH) * 0.45;
  bindCanvasEvents();
  drawSky();
}

function project(alt, az){
  if (alt < -5){ return null; }
  var r = (90 - alt) / 90 * Rv;
  var a = (az - 180) * DEG;
  var x = cxv - r * Math.sin(a);
  var y = cyv + r * Math.cos(a);
  x = cxv + (x - cxv) * view.zoom + view.ox;
  y = cyv + (y - cyv) * view.zoom + view.oy;
  return { x: x, y: y };
}

function drawSky(){
  if (!ctx || !cssW){ return; }
  ctx.clearRect(0, 0, cssW, cssH);

  var grad = ctx.createRadialGradient(cxv, cyv, 0, cxv, cyv, Rv * 1.2);
  grad.addColorStop(0, "#0a1430");
  grad.addColorStop(0.7, "#060a18");
  grad.addColorStop(1, "#02030a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cssW, cssH);

  ctx.beginPath();
  ctx.arc(cxv + view.ox, cyv + view.oy, Rv * view.zoom, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(79,214,255,0.35)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(79,214,255,0.8)";
  var cN = project(-3, 0);
  var cE = project(-3, 90);
  var cS = project(-3, 180);
  var cO = project(-3, 270);
  if (cN){ ctx.fillText("N", cN.x, cN.y); }
  if (cE){ ctx.fillText("E", cE.x, cE.y); }
  if (cS){ ctx.fillText("S", cS.x, cS.y); }
  if (cO){ ctx.fillText("O", cO.x, cO.y); }

  var now = new Date(Date.now() + state.timeOffset * 60000);
  var jd = julianDate(now);
  var lst = lstDeg(jd, state.lon);

  if (state.show.grid){
    ctx.strokeStyle = "rgba(79,214,255,0.10)";
    ctx.lineWidth = 0.7;
    for (var a1 = 0; a1 < 360; a1 += 30){
      var p1 = project(0, a1);
      var p2 = project(80, a1);
      if (p1 && p2){
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  if (state.show.constellations){
    ctx.strokeStyle = "rgba(120,180,255,0.4)";
    ctx.lineWidth = 0.9;
    for (var c = 0; c < CONST_LINES.length; c++){
      var pair = CONST_LINES[c];
      var sa = STAR_MAP[pair[0]];
      var sb = STAR_MAP[pair[1]];
      if (!sa || !sb){ continue; }
      var aa = altAz(sa[0], sa[1], state.lat, lst);
      var ab = altAz(sb[0], sb[1], state.lat, lst);
      var pa = project(aa.alt, aa.az);
      var pb = project(ab.alt, ab.az);
      if (pa && pb){
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
  }

  for (var i = 0; i < STARS.length; i++){
    var s = STARS[i];
    if (s[2] > 4.0){ continue; }
    var aa2 = altAz(s[0], s[1], state.lat, lst);
    if (aa2.alt < 0){ continue; }
    var pp = project(aa2.alt, aa2.az);
    if (!pp){ continue; }
    var size = (4.5 - s[2]) * 0.9;
    if (size < 0.7){ size = 0.7; }
    var alpha = (4.5 - s[2]) / 4;
    if (alpha < 0.35){ alpha = 0.35; }
    if (alpha > 1){ alpha = 1; }
    ctx.beginPath();
    ctx.arc(pp.x, pp.y, size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
    ctx.fill();
  }

  if (state.show.names){
    ctx.font = "9px sans-serif";
    ctx.fillStyle = "rgba(180,220,255,0.7)";
    ctx.textAlign = "left";
    for (var n = 0; n < STARS.length; n++){
      var sn = STARS[n];
      if (sn[2] > 1.6){ continue; }
      var an = altAz(sn[0], sn[1], state.lat, lst);
      if (an.alt < 5){ continue; }
      var pn = project(an.alt, an.az);
      if (!pn){ continue; }
      ctx.fillText(sn[3], pn.x + 4, pn.y - 4);
    }
  }

  if (state.show.planets){
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "left";
    for (var pi = 0; pi < PLANETS.length; pi++){
      var pl = PLANETS[pi];
      var prd = planetRaDec(pl, jd);
      var aap = altAz(prd.ra, prd.dec, state.lat, lst);
      if (aap.alt < 0){ continue; }
      var ppp = project(aap.alt, aap.az);
      if (!ppp){ continue; }
      ctx.beginPath();
      ctx.arc(ppp.x, ppp.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = pl.c;
      ctx.fill();
      ctx.fillStyle = pl.c;
      ctx.fillText(pl.n, ppp.x + 6, ppp.y + 3);
    }
    var moon = moonPos(jd);
    var ma = altAz(moon.ra, moon.dec, state.lat, lst);
    if (ma.alt > 0){
      var mp = project(ma.alt, ma.az);
      if (mp){
        ctx.beginPath();
        ctx.arc(mp.x, mp.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#f5f0d8";
        ctx.fill();
        ctx.fillStyle = "#fff8d0";
        ctx.fillText("Luna", mp.x + 10, mp.y + 3);
      }
    }
  }

  ctx.font = "bold 11px sans-serif";
  ctx.fillStyle = "rgba(79,214,255,0.7)";
  ctx.textAlign = "center";
  var tm = now.toLocaleTimeString("es", { hour:"2-digit", minute:"2-digit" });
  ctx.fillText(tm, cxv, cyv + Rv + 14);

  updateVisibleList(jd, lst);
  updateSidereal(jd);
}

function updateSidereal(jd){
  var el1 = byId("sidTime");
  var el2 = byId("sidInfo");
  if (!el1 || !el2){ return; }
  el1.textContent = getLSTString(jd, state.lon);
  var lst = lstDeg(jd, state.lon);
  var info = "La hora sideral indica que parte del cielo esta ";
  info += "sobre tu meridiano. Ahora pasan por el meridiano ";
  info += "los objetos con AR ~ " + (lst / 15).toFixed(1) + "h.";
  el2.textContent = info;
}

function updateVisibleList(jd, lst){
  var container = byId("visibleList");
  if (!container){ return; }
  clear(container);
  var items = [];
  for (var i = 0; i < PLANETS.length; i++){
    var pl = PLANETS[i];
    var prd = planetRaDec(pl, jd);
    var aa = altAz(prd.ra, prd.dec, state.lat, lst);
    if (aa.alt > 10){
      items.push({
        t: pl.n,
        s: "Alt " + aa.alt.toFixed(0) + " Az " + aa.az.toFixed(0),
        v: "planeta"
      });
    }
  }
  var m = moonPos(jd);
  var ma = altAz(m.ra, m.dec, state.lat, lst);
  if (ma.alt > 0){
    items.push({
      t: "Luna",
      s: "Alt " + ma.alt.toFixed(0) + " Fase " + (m.phase * 100).toFixed(0),
      v: "luna"
    });
  }
  for (var s = 0; s < STARS.length; s++){
    var st = STARS[s];
    if (st[2] > 1.0){ continue; }
    var an = altAz(st[0], st[1], state.lat, lst);
    if (an.alt > 20){
      items.push({
        t: st[3],
        s: "Alt " + an.alt.toFixed(0) + " Mag " + st[2].toFixed(2),
        v: "estrella"
      });
    }
  }
  if (!items.length){
    container.appendChild(emptyMsg("Nada visible ahora."));
    return;
  }
  var limit = Math.min(items.length, 12);
  for (var k = 0; k < limit; k++){
    container.appendChild(listItem(items[k].t, items[k].s, items[k].v));
  }
}

bootLog("B6");

function bindCanvasEvents(){
  if (!canvas || canvas.getAttribute("data-bound")){ return; }
  canvas.setAttribute("data-bound", "1");

  canvas.addEventListener("touchstart", function(e){
    if (e.touches.length === 1){
      view.dragging = true;
      view.lastX = e.touches[0].clientX;
      view.lastY = e.touches[0].clientY;
      var hint = byId("skyHint");
      if (hint){ hint.className = "sky-hint gone"; }
    } else if (e.touches.length === 2){
      view.dragging = false;
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      view.pinchDist = Math.sqrt(dx * dx + dy * dy);
      view.pinchZoom = view.zoom;
    }
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchmove", function(e){
    if (e.touches.length === 1 && view.dragging){
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;
      view.ox += x - view.lastX;
      view.oy += y - view.lastY;
      view.lastX = x;
      view.lastY = y;
      drawSky();
    } else if (e.touches.length === 2){
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (view.pinchDist > 0){
        var z = view.pinchZoom * (dist / view.pinchDist);
        if (z < 0.5){ z = 0.5; }
        if (z > 4){ z = 4; }
        view.zoom = z;
        drawSky();
      }
    }
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchend", function(e){
    if (e.touches.length === 0){
      view.dragging = false;
      view.pinchDist = 0;
    } else if (e.touches.length === 1){
      view.dragging = true;
      view.lastX = e.touches[0].clientX;
      view.lastY = e.touches[0].clientY;
    }
  });

  canvas.addEventListener("mousedown", function(e){
    view.dragging = true;
    view.lastX = e.clientX;
    view.lastY = e.clientY;
    var hint = byId("skyHint");
    if (hint){ hint.className = "sky-hint gone"; }
  });

  canvas.addEventListener("mousemove", function(e){
    if (!view.dragging){ return; }
    view.ox += e.clientX - view.lastX;
    view.oy += e.clientY - view.lastY;
    view.lastX = e.clientX;
    view.lastY = e.clientY;
    drawSky();
  });

  canvas.addEventListener("mouseup", function(){ view.dragging = false; });
  canvas.addEventListener("mouseleave", function(){ view.dragging = false; });

  canvas.addEventListener("wheel", function(e){
    var z = view.zoom * Math.exp(-e.deltaY * 0.001);
    if (z < 0.5){ z = 0.5; }
    if (z > 4){ z = 4; }
    view.zoom = z;
    drawSky();
    e.preventDefault();
  }, { passive: false });
}

function resetView(){
  view.zoom = 1; view.ox = 0; view.oy = 0;
  drawSky();
}

function renderTonight(){
  var now = new Date();
  var jd = julianDate(now);
  var lst = lstDeg(jd, state.lon);
  var moon = moonPos(jd);

  var ph = byId("tonightPhase");
  if (ph){
    var txt = "Luna " + moonPhaseName(moon.phase);
    txt += " (" + (moon.phase * 100).toFixed(0) + "%)";
    ph.textContent = txt;
  }

  var mAlt = altAz(moon.ra, moon.dec, state.lat, lst).alt;
  var summary;
  if (moon.phase > 0.85){
    summary = "Luna casi llena: cielo muy iluminado.";
  } else if (moon.phase < 0.15){
    summary = "Luna nueva: ideal para cielo profundo y meteoros.";
  } else {
    summary = "Fase intermedia: buen equilibrio para observar.";
  }
  if (mAlt < 0){ summary += " La Luna esta bajo el horizonte."; }
  var sum = byId("tonightSummary");
  if (sum){ sum.textContent = summary; }

  var pList = [];
  for (var i = 0; i < PLANETS.length; i++){
    var pl = PLANETS[i];
    var prd = planetRaDec(pl, jd);
    var aa = altAz(prd.ra, prd.dec, state.lat, lst);
    if (aa.alt > 0){
      pList.push({
        t: pl.n,
        s: "Alt " + aa.alt.toFixed(0) + " Az " + aa.az.toFixed(0),
        v: aa.alt.toFixed(0) + "g"
      });
    }
  }
  if (mAlt > 0){
    pList.push({ t:"Luna", s:"Alt " + mAlt.toFixed(0), v: mAlt.toFixed(0) + "g" });
  }
  fillList("planetsList", pList, "Ningun planeta visible.");

  var sList = [];
  for (var s = 0; s < STARS.length; s++){
    var st = STARS[s];
    if (st[2] > 1.2){ continue; }
    var an = altAz(st[0], st[1], state.lat, lst);
    if (an.alt > 15){
      sList.push({
        t: st[3],
        s: "Alt " + an.alt.toFixed(0) + " Az " + an.az.toFixed(0),
        v: "mag " + st[2].toFixed(2),
        m: st[2]
      });
    }
  }
  sList.sort(function(a, b){ return a.m - b.m; });
  fillList("brightList", sList.slice(0, 10), "Ninguna estrella brillante.");

  var mList = [];
  for (var mm = 0; mm < MESSIER.length; mm++){
    var mo = MESSIER[mm];
    var am = altAz(mo[0], mo[1], state.lat, lst);
    if (am.alt > 20){
      mList.push({
        t: mo[2],
        s: mo[3] + " Alt " + am.alt.toFixed(0),
        v: "mag " + mo[4].toFixed(1)
      });
    }
  }
  fillList("messierList", mList.slice(0, 10), "Ningun Messier visible.", "#ffc857");
}

function fillList(id, arr, emptyText, dotColor){
  var container = byId(id);
  if (!container){ return; }
  clear(container);
  if (!arr.length){
    container.appendChild(emptyMsg(emptyText));
    return;
  }
  for (var i = 0; i < arr.length; i++){
    container.appendChild(listItem(arr[i].t, arr[i].s, arr[i].v, dotColor));
  }
}

function renderCalendar(){
  var now = new Date();
  var phases = nextMoonPhases(now);
  var meteors = nextMeteors(now);
  var events = [];

  for (var i = 0; i < phases.length; i++){
    events.push({
      date: phases[i].date,
      title: phases[i].name,
      sub: phases[i].date.toLocaleDateString("es", {
        weekday: "long", day: "numeric", month: "long"
      }),
      days: phases[i].days
    });
  }
  for (var m = 0; m < meteors.length; m++){
    events.push({
      date: meteors[m].date,
      title: "Lluvia " + meteors[m].name,
      sub: meteors[m].date.toLocaleDateString("es", {
        day: "numeric", month: "long"
      }),
      days: meteors[m].days
    });
  }
  events.sort(function(a, b){ return a.date - b.date; });

  var container = byId("eventsList");
  if (!container){ return; }
  clear(container);
  if (!events.length){
    container.appendChild(emptyMsg("Sin eventos proximos."));
    return;
  }
  var limit = Math.min(events.length, 30);
  for (var k = 0; k < limit; k++){
    var e = events[k];
    var d = Math.round(e.days);
    var dtxt;
    if (d === 0){ dtxt = "Hoy"; }
    else if (d === 1){ dtxt = "Manana"; }
    else { dtxt = "En " + d + "d"; }
    container.appendChild(listItem(e.title, e.sub, dtxt, "#ff4fd6"));
  }
}

function renderJournal(){
  var countEl = byId("jCount");
  if (countEl){ countEl.textContent = journal.length; }
  var container = byId("journalList");
  if (!container){ return; }
  clear(container);
  if (!journal.length){
    container.appendChild(emptyMsg("Aun no tenes observaciones."));
    return;
  }
  for (var i = journal.length - 1; i >= 0; i--){
    var j = journal[i];
    var item = el("div", "journal-item");
    var del = el("button", "del", "X");
    del.setAttribute("data-jdel", i);
    var date = el("div", "date");
    date.textContent = new Date(j.ts).toLocaleString("es");
    item.appendChild(del);
    item.appendChild(date);
    item.appendChild(el("div", "ttl", j.title));
    if (j.objects){ item.appendChild(el("div", "obj", j.objects)); }
    if (j.notes){ item.appendChild(el("div", "txt", j.notes)); }
    container.appendChild(item);
  }
}

function saveJournal(){
  var t = byId("jTitle").value.trim();
  var n = byId("jNotes").value.trim();
  var o = byId("jObjects").value.trim();
  if (!t && !n){ toast("Anade titulo o notas"); return; }
  journal.push({
    ts: Date.now(),
    title: t || "(sin titulo)",
    notes: n,
    objects: o
  });
  storeSet("c7journal", JSON.stringify(journal));
  byId("jTitle").value = "";
  byId("jNotes").value = "";
  byId("jObjects").value = "";
  renderJournal();
  toast("Observacion guardada");
}

function delJournal(idx){
  if (!window.confirm("Eliminar?")){ return; }
  journal.splice(idx, 1);
  storeSet("c7journal", JSON.stringify(journal));
  renderJournal();
  toast("Eliminada");
}

function renderHome(){
  var jd = julianDate(new Date());
  var lst = lstDeg(jd, state.lon);
  var moon = moonPos(jd);
  var ph = byId("homePhase");
  if (ph){ ph.textContent = "Luna " + moonPhaseName(moon.phase); }
  var mAlt = altAz(moon.ra, moon.dec, state.lat, lst).alt;
  var visiblePlanets = [];
  for (var i = 0; i < PLANETS.length; i++){
    var prd = planetRaDec(PLANETS[i], jd);
    var aa = altAz(prd.ra, prd.dec, state.lat, lst);
    if (aa.alt > 0){ visiblePlanets.push(PLANETS[i].n); }
  }
  var txt = (moon.phase * 100).toFixed(0) + "% iluminada. ";
  if (mAlt > 0){
    txt += "Luna visible a " + mAlt.toFixed(0) + " grados";
  } else {
    txt += "Luna bajo el horizonte";
  }
  if (visiblePlanets.length){
    txt += ". Planetas: " + visiblePlanets.join(", ");
  } else {
    txt += ". Sin planetas visibles";
  }
  var sum = byId("homeSummary");
  if (sum){ sum.textContent = txt; }
}

function updateLocLabel(){
  var elBtn = byId("locBtn");
  if (!elBtn){ return; }
  var lat = Math.abs(state.lat).toFixed(2);
  var lon = Math.abs(state.lon).toFixed(2);
  var latH = state.lat >= 0 ? "N" : "S";
  var lonH = state.lon >= 0 ? "E" : "O";
  elBtn.textContent = lat + " " + latH + " / " + lon + " " + lonH;
}

function saveLocation(lat, lon){
  state.lat = lat; state.lon = lon;
  storeSet("c7loc", JSON.stringify({ lat: lat, lon: lon }));
  updateLocLabel();
  renderHome();
  renderTonight();
  renderCalendar();
  renderAstro();
  renderMoonPage();
  var sky = byId("page-sky");
  if (sky && sky.className.indexOf("active") >= 0){ drawSky(); }
}

function openLoc(){
  byId("inLat").value = state.lat.toFixed(4);
  byId("inLon").value = state.lon.toFixed(4);
  byId("modal").className = "on";
}
function closeLoc(){ byId("modal").className = ""; }
function saveLoc(){
  var lat = parseFloat(byId("inLat").value);
  var lon = parseFloat(byId("inLon").value);
  if (isNaN(lat) || lat < -90 || lat > 90){ toast("Latitud invalida"); return; }
  if (isNaN(lon) || lon < -180 || lon > 180){ toast("Longitud invalida"); return; }
  saveLocation(lat, lon);
  closeLoc();
  toast("Ubicacion guardada");
}
function gps(){
  if (!navigator.geolocation){ toast("GPS no disponible"); return; }
  toast("Solicitando...");
  navigator.geolocation.getCurrentPosition(
    function(pos){
      saveLocation(pos.coords.latitude, pos.coords.longitude);
      closeLoc();
      toast("Ubicacion GPS ok");
    },
    function(err){
      var msg = "Error GPS. Coordenadas manuales.";
      if (err && err.code === 1){
        msg = "Permiso denegado. Coordenadas manuales.";
      }
      toast(msg, 3500);
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
}

function toggleLayer(key, btn){
  state.show[key] = !state.show[key];
  if (btn){
    if (state.show[key]){ btn.className = "chip on"; }
    else { btn.className = "chip"; }
  }
  var sky = byId("page-sky");
  if (sky && sky.className.indexOf("active") >= 0){ drawSky(); }
}
function nowTime(){
  state.timeOffset = 0;
  byId("timeSlider").value = 0;
  byId("timeLabel").textContent = "Ahora";
  drawSky();
}
function toggleSpin(btn){
  state.spin = !state.spin;
  if (btn){
    if (state.spin){ btn.className = "chip on"; }
    else { btn.className = "chip"; }
  }
}

// ---------------- MODO NOCHE ROJO ----------------
function toggleRedMode(){
  state.redMode = !state.redMode;
  if (state.redMode){
    document.body.className = "redmode";
    storeSet("c7redmode", "1");
  } else {
    document.body.className = "";
    storeSet("c7redmode", "0");
  }
  var btn = byId("redBtn");
  if (btn){
    if (state.redMode){ btn.className = "on"; }
    else { btn.className = ""; }
  }
}

function applyRedMode(){
  if (state.redMode){
    document.body.className = "redmode";
    var btn = byId("redBtn");
    if (btn){ btn.className = "on"; }
  }
}

bootLog("B7");

// ---------------- DIBUJO DE FASE LUNAR ----------------
function drawMoonPhase(ctx, cx, cy, r, phase){
  ctx.save();

  // Círculo iluminado completo
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#f5f0d8";
  ctx.fill();

  // La sombra
  if (phase < 0.02 || phase > 0.98){
    // Nueva: todo sombra
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a25";
    ctx.fill();
    ctx.restore();
    return;
  }

  if (phase > 0.48 && phase < 0.52){
    // Llena: nada de sombra
    ctx.restore();
    return;
  }

  var isWaxing = phase < 0.5;
  var cos2pi = Math.cos(phase * Math.PI * 2);
  var rx = r * Math.abs(cos2pi);

  ctx.beginPath();
  if (isWaxing){
    // Sombra del lado izquierdo
    ctx.arc(cx, cy, r, Math.PI/2, -Math.PI/2, false);
    if (cos2pi > 0){
      ctx.ellipse(cx, cy, rx, r, 0, -Math.PI/2, Math.PI/2, false);
    } else {
      ctx.ellipse(cx, cy, rx, r, 0, -Math.PI/2, Math.PI/2, true);
    }
  } else {
    // Sombra del lado derecho
    ctx.arc(cx, cy, r, -Math.PI/2, Math.PI/2, false);
    if (cos2pi > 0){
      ctx.ellipse(cx, cy, rx, r, 0, Math.PI/2, -Math.PI/2, false);
    } else {
      ctx.ellipse(cx, cy, rx, r, 0, Math.PI/2, -Math.PI/2, true);
    }
  }
  ctx.closePath();
  ctx.fillStyle = "#1a1a25";
  ctx.fill();

  ctx.restore();
}

// ---------------- HORAS DE SALIDA Y PUESTA ----------------
function findRiseSet(raFn, decFn, fromDate, hours){
  var results = { rise: null, set: null };
  var prevAlt = null;
  var step = 5;
  for (var m = 0; m <= hours * 60; m += step){
    var t = new Date(fromDate.getTime() + m * 60000);
    var jd = julianDate(t);
    var lst = lstDeg(jd, state.lon);
    var ra = raFn(jd);
    var dec = decFn(jd);
    var aa = altAz(ra, dec, state.lat, lst);
    if (prevAlt !== null){
      if (prevAlt < 0 && aa.alt >= 0 && !results.rise){
        results.rise = t;
      }
      if (prevAlt >= 0 && aa.alt < 0 && !results.set){
        results.set = t;
      }
    }
    prevAlt = aa.alt;
  }
  return results;
}

function moonRaFn(jd){ return moonPos(jd).ra; }
function moonDecFn(jd){ return moonPos(jd).dec; }

// ---------------- PAGINA LUNA ----------------
function renderMoonPage(){
  var now = new Date();
  renderMoonCurrent(now);
  if (moonCal.year === 0){
    moonCal.year = now.getFullYear();
    moonCal.month = now.getMonth();
  }
  renderMoonCalendar(moonCal.year, moonCal.month);
}

function renderMoonCurrent(now){
  var jd = julianDate(now);
  var m = moonPos(jd);

  var cv = byId("moonBigCanvas");
  if (cv){
    var size = 180;
    var dpr = window.devicePixelRatio || 1;
    if (dpr > 2){ dpr = 2; }
    cv.width = size * dpr;
    cv.height = size * dpr;
    var c = cv.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, size, size);
    drawMoonPhase(c, size/2, size/2, size/2 - 6, m.phase);
  }

  var name = byId("moonPhaseName");
  if (name){
    name.textContent = "Luna " + moonPhaseName(m.phase);
  }

  var det = byId("moonDetails");
  if (det){
    var pct = (m.phase * 100).toFixed(0);
    var txt = pct + "% iluminada. ";
    txt += "Edad: " + (m.phase * 29.53).toFixed(1) + " dias. ";
    var lst = lstDeg(jd, state.lon);
    var aa = altAz(m.ra, m.dec, state.lat, lst);
    if (aa.alt > 0){
      txt += "Visible a " + aa.alt.toFixed(0) + " grados sobre el horizonte.";
    } else {
      txt += "Bajo el horizonte ahora.";
    }
    det.textContent = txt;
  }
}

function renderMoonCalendar(year, month){
  var grid = byId("moonGrid");
  var label = byId("moonMonthLabel");
  var summary = byId("moonSummary");
  if (!grid){ return; }
  clear(grid);

  var monthNames = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"
  ];
  if (label){
    label.textContent = monthNames[month] + " " + year;
  }

  var first = new Date(year, month, 1);
  var firstDow = first.getDay();
  // Lunes=0, domingo=6
  var offset = (firstDow + 6) % 7;
  for (var i = 0; i < offset; i++){
    var empty = el("div", "moon-cell empty");
    grid.appendChild(empty);
  }

  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = new Date();

  var countNew = 0, countFull = 0, countQuarter = 0;

  for (var d = 1; d <= daysInMonth; d++){
    var dayDate = new Date(year, month, d, 12, 0, 0, 0);
    var jdd = julianDate(dayDate);
    var mm = moonPos(jdd);

    var cell = el("div", "moon-cell");
    cell.setAttribute("data-day", d);

    var isToday = (today.getFullYear() === year &&
                   today.getMonth() === month &&
                   today.getDate() === d);
    if (isToday){ cell.className += " today"; }
    if (moonCal.selected === d){
      cell.className += " selected";
    }

    // Mini canvas
    var miniCv = document.createElement("canvas");
    miniCv.width = 40;
    miniCv.height = 40;
    var mc = miniCv.getContext("2d");
    drawMoonPhase(mc, 20, 20, 16, mm.phase);
    cell.appendChild(miniCv);

    // Numero
    var num = el("div", "num", d);
    cell.appendChild(num);

    // Marca especial
    var mark = "";
    if (mm.phase < 0.02 || mm.phase > 0.98){ mark = "N"; countNew++; }
    else if (mm.phase > 0.48 && mm.phase < 0.52){ mark = "L"; countFull++; }
    else if ((mm.phase > 0.23 && mm.phase < 0.27) ||
             (mm.phase > 0.73 && mm.phase < 0.77)){
      mark = "C"; countQuarter++;
    }
    if (mark){
      var sp = el("div", "special", mark);
      cell.appendChild(sp);
    }

    grid.appendChild(cell);
  }

  if (summary){
    clear(summary);
    var s = "Este mes: " + countNew + " Luna nueva, ";
    s += countFull + " Luna llena, ";
    s += countQuarter + " cuartos.";
    summary.textContent = s;
  }
}

function renderMoonDayDetails(day){
  var det = byId("moonDayDetails");
  if (!det){ return; }
  clear(det);

  var dayDate = new Date(moonCal.year, moonCal.month, day, 12, 0, 0, 0);
  var jdd = julianDate(dayDate);
  var mm = moonPos(jdd);

  var block1 = el("div", "moon-day-block");
  block1.appendChild(el("h4", null, "Fase"));
  var dtxt = dayDate.toLocaleDateString("es", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  block1.appendChild(el("p", null, dtxt));
  block1.appendChild(el("p", null,
    "Fase: " + moonPhaseName(mm.phase) +
    " (" + (mm.phase * 100).toFixed(0) + "% iluminada)"));
  block1.appendChild(el("p", null,
    "Edad lunar: " + (mm.phase * 29.53).toFixed(1) + " dias"));
  det.appendChild(block1);

  // Horas de salida y puesta
  var rs = findRiseSet(moonRaFn, moonDecFn, dayDate, 26);
  var block2 = el("div", "moon-day-block");
  block2.appendChild(el("h4", null, "Salida y puesta"));
  if (rs.rise){
    block2.appendChild(el("p", null,
      "Sale: " + rs.rise.toLocaleTimeString("es", {
        hour: "2-digit", minute: "2-digit"
      })));
  } else {
    block2.appendChild(el("p", null, "Sale: no visible en este periodo"));
  }
  if (rs.set){
    block2.appendChild(el("p", null,
      "Se pone: " + rs.set.toLocaleTimeString("es", {
        hour: "2-digit", minute: "2-digit"
      })));
  } else {
    block2.appendChild(el("p", null, "Se pone: no visible en este periodo"));
  }
  det.appendChild(block2);

  // Calidad para astrofotografia
  var block3 = el("div", "moon-day-block");
  block3.appendChild(el("h4", null, "Astrofotografia"));
  var qual, cls;
  if (mm.phase < 0.15 || mm.phase > 0.85){
    qual = "Excelente. Luna casi invisible: ideal para Via Lactea y cielo profundo.";
    cls = "ok2";
  } else if (mm.phase < 0.35 || mm.phase > 0.65){
    qual = "Aceptable. Luna en cuarto: puedo fotografiar objetos brillantes.";
    cls = "hl2";
  } else {
    qual = "Mala. Luna muy iluminada: solo sirve para fotografiar la Luna y planetas.";
    cls = "warn2";
  }
  var pQual = el("p");
  var span = el("span", cls, qual);
  pQual.appendChild(span);
  block3.appendChild(pQual);
  det.appendChild(block3);

  // Consejo
  var block4 = el("div", "moon-day-block");
  block4.appendChild(el("h4", null, "Consejo"));
  var tip = "";
  if (mm.phase < 0.1){
    tip = "Ideal para observar objetos Messier y la Via Lactea.";
  } else if (mm.phase < 0.3){
    tip = "Buen momento para ver crateres lunares con sombras alargadas.";
  } else if (mm.phase < 0.5){
    tip = "La Luna empieza a molestar. Observa objetos brillantes.";
  } else if (mm.phase < 0.7){
    tip = "Luna llena: los crateres se ven planos, poco contraste.";
  } else {
    tip = "Luna menguante: aprovecha las ultimas horas de oscuridad.";
  }
  block4.appendChild(el("p", null, tip));
  det.appendChild(block4);
}

// ---------------- GRAFICO DE VISIBILIDAD ----------------
function renderVisibilityChart(){
  var cv = byId("visChart");
  if (!cv){ return; }

  var now = new Date();
  var jd0 = julianDate(now);
  var lst0 = lstDeg(jd0, state.lon);

  // Rango: desde ahora hasta 12 horas despues
  var totalHours = 12;
  var steps = 48; // cada 15 minutos
  var stepMin = (totalHours * 60) / steps;

  // Objetos a mostrar
  var objects = [];

  // Planeta Luna
  var moonCur = moonPos(jd0);
  if (true){
    objects.push({
      name: "Luna",
      color: "#f5f0d8",
      raFn: moonRaFn,
      decFn: moonDecFn
    });
  }

  // Planetas
  for (var i = 0; i < PLANETS.length; i++){
    (function(pl){
      objects.push({
        name: pl.n,
        color: pl.c,
        raFn: function(j){ return planetRaDec(pl, j).ra; },
        decFn: function(j){ return planetRaDec(pl, j).dec; }
      });
    })(PLANETS[i]);
  }

  // Top estrellas
  var brightStars = [
    "Sirius","Canopus","AlfaCen","Arturo","Vega",
    "Capella","Rigel","Procyon","Betelgeuse","Achernar"
  ];
  for (var k = 0; k < brightStars.length; k++){
    var sn = brightStars[k];
    var sdata = STAR_MAP[sn];
    if (!sdata){ continue; }
    (function(sd){
      objects.push({
        name: sd[3],
        color: "#c8d4e8",
        raFn: function(j){ return sd[0]; },
        decFn: function(j){ return sd[1]; }
      });
    })(sdata);
  }

  var dpr = window.devicePixelRatio || 1;
  if (dpr > 2){ dpr = 2; }

  var W = cv.parentNode.clientWidth - 28;
  var labelW = 70;
  var rowH = 22;
  var topPad = 10;
  var bottomPad = 30;
  var H = topPad + objects.length * rowH + bottomPad;

  cv.width = W * dpr;
  cv.height = H * dpr;
  cv.style.width = W + "px";
  cv.style.height = H + "px";

  var c = cv.getContext("2d");
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, W, H);

  // Fondo
  c.fillStyle = "#0a0f1c";
  c.fillRect(0, 0, W, H);

  // Eje de tiempo
  var chartW = W - labelW - 10;
  var chartX = labelW + 5;

  // Lineas verticales cada 2h
  c.strokeStyle = "rgba(79,214,255,0.15)";
  c.lineWidth = 1;
  c.font = "9px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "top";
  for (var hh = 0; hh <= totalHours; hh += 2){
    var xx = chartX + (hh / totalHours) * chartW;
    c.beginPath();
    c.moveTo(xx, topPad);
    c.lineTo(xx, H - bottomPad);
    c.stroke();
    var tLabel = new Date(now.getTime() + hh * 3600000);
    c.fillStyle = "rgba(122,134,168,0.9)";
    var lbl = tLabel.getHours() + "h";
    c.fillText(lbl, xx, H - bottomPad + 6);
  }

  // Ahora
  var xNow = chartX;
  c.strokeStyle = "rgba(79,220,127,0.6)";
  c.beginPath();
  c.moveTo(xNow, topPad);
  c.lineTo(xNow, H - bottomPad);
  c.stroke();

  // Filas de objetos
  for (var oi = 0; oi < objects.length; oi++){
    var obj = objects[oi];
    var y = topPad + oi * rowH + rowH / 2;

    // Etiqueta
    c.font = "11px sans-serif";
    c.textAlign = "right";
    c.textBaseline = "middle";
    c.fillStyle = obj.color;
    c.fillText(obj.name, labelW, y);

    // Barra
    var prevAlt = null;
    var barStart = -1;
    for (var s = 0; s <= steps; s++){
      var t = new Date(now.getTime() + s * stepMin * 60000);
      var jd = julianDate(t);
      var lst = lstDeg(jd, state.lon);
      var ra = obj.raFn(jd);
      var dec = obj.decFn(jd);
      var aa = altAz(ra, dec, state.lat, lst);
      var visible = aa.alt > 0;

      if (visible && barStart < 0){
        barStart = s;
      }
      if ((!visible || s === steps) && barStart >= 0){
        var x1 = chartX + (barStart / steps) * chartW;
        var x2 = chartX + (s / steps) * chartW;
        c.fillStyle = obj.color;
        c.globalAlpha = 0.85;
        c.fillRect(x1, y - 6, x2 - x1, 12);
        c.globalAlpha = 1;
        barStart = -1;
      }
    }
  }

  // Borde
  c.strokeStyle = "rgba(79,214,255,0.2)";
  c.lineWidth = 1;
  c.strokeRect(chartX, topPad, chartW, H - bottomPad - topPad);

  // Etiqueta eje
  c.font = "9px sans-serif";
  c.textAlign = "left";
  c.fillStyle = "rgba(122,134,168,0.9)";
  c.fillText("Hora local", 5, H - bottomPad + 6);
}

// ---------------- WIKI ----------------
function renderWikiList(){
  var container = byId("wikiList");
  if (!container){ return; }
  clear(container);

  if (typeof WIKI === "undefined"){
    container.appendChild(emptyMsg("Wiki no disponible."));
    return;
  }

  var search = byId("wikiSearch").value.toLowerCase();

  var cats = byId("wikiCats");
  if (cats && !cats.children.length){
    var catDefs = [
      ["todas", "Todas"],
      ["estrellas", "Estrellas"],
      ["constelaciones", "Constelac."],
      ["planetas", "Planetas"],
      ["luna", "Luna"],
      ["sol", "Sol"],
      ["messier", "Messier"],
      ["ngc", "NGC"],
      ["sistema", "Sist. Solar"],
      ["eventos", "Eventos"],
      ["fenomenos", "Fenomenos"],
      ["conceptos", "Conceptos"],
      ["historia", "Historia"]
    ];
    for (var i = 0; i < catDefs.length; i++){
      var c = el("button", i === 0 ? "chip on" : "chip", catDefs[i][1]);
      c.setAttribute("data-cat", catDefs[i][0]);
      cats.appendChild(c);
    }
  }

  var activeCat = "todas";
  var activeBtn = cats.querySelector(".chip.on");
  if (activeBtn){ activeCat = activeBtn.getAttribute("data-cat"); }

  var groups = [
    "estrellas","constelaciones","planetas","luna","sol","messier",
    "ngc","sistema","eventos","fenomenos","conceptos","historia"
  ];
  for (var g = 0; g < groups.length; g++){
    var key = groups[g];
    if (activeCat !== "todas" && activeCat !== key){ continue; }
    var items = WIKI[key];
    if (!items){ continue; }
    var shown = 0;
    var groupDiv = el("div");
    var title = el("div", "cat-title");
    title.textContent = key;
    groupDiv.appendChild(title);

    for (var j = 0; j < items.length; j++){
      var it = items[j];
      if (search && it.n.toLowerCase().indexOf(search) === -1){ continue; }
      groupDiv.appendChild(buildWikiCard(it));
      shown++;
    }
    if (shown > 0){
      container.appendChild(groupDiv);
    }
  }

  if (!container.children.length){
    container.appendChild(emptyMsg("Sin resultados."));
  }
}

function buildWikiCard(it){
  var card = el("div", "wiki-card");
  var head = el("div", "head");
  var ic = el("div", "ic");
  ic.textContent = it.ic || "*";
  var txtDiv = el("div", "txt");
  txtDiv.appendChild(el("div", "name", it.n));
  var meta = el("div", "meta");
  var metaStr = it.t || "";
  if (it.mag && it.mag !== "-"){ metaStr += " - mag " + it.mag; }
  if (it.dist && it.dist !== "-"){ metaStr += " - " + it.dist; }
  meta.textContent = metaStr;
  txtDiv.appendChild(meta);
  head.appendChild(ic);
  head.appendChild(txtDiv);
  card.appendChild(head);

  var body = el("div", "body");
  if (it.ra || it.dec){
    var dataDiv = el("div", "data");
    if (it.ra){
      dataDiv.appendChild(el("div", "k", "AR"));
      dataDiv.appendChild(el("div", "v", it.ra));
    }
    if (it.dec){
      dataDiv.appendChild(el("div", "k", "Dec"));
      dataDiv.appendChild(el("div", "v", it.dec));
    }
    if (it.mag){
      dataDiv.appendChild(el("div", "k", "Magnitud"));
      dataDiv.appendChild(el("div", "v", it.mag));
    }
    if (it.dist){
      dataDiv.appendChild(el("div", "k", "Distancia"));
      dataDiv.appendChild(el("div", "v", it.dist));
    }
    body.appendChild(dataDiv);
  }
  if (it.desc){
    var s1 = el("div", "sec");
    s1.appendChild(el("h4", null, "Descripcion"));
    s1.appendChild(el("p", null, it.desc));
    body.appendChild(s1);
  }
  if (it.ver){
    var s2 = el("div", "sec");
    s2.appendChild(el("h4", null, "Como verlo"));
    s2.appendChild(el("p", null, it.ver));
    body.appendChild(s2);
  }
  if (it.cur){
    var s3 = el("div", "sec");
    s3.appendChild(el("h4", null, "Curiosidades"));
    s3.appendChild(el("p", null, it.cur));
    body.appendChild(s3);
  }
  if (it.ejemplos){
    var s4 = el("div", "sec");
    s4.appendChild(el("h4", null, "Ejemplos"));
    s4.appendChild(el("p", null, it.ejemplos));
    body.appendChild(s4);
  }
  card.appendChild(body);

  card.addEventListener("click", function(){
    if (card.className.indexOf("open") >= 0){
      card.className = "wiki-card";
    } else {
      card.className = "wiki-card open";
    }
  });

  return card;
}

function renderAstro(){
  var mw = byId("mwResult");
  if (mw){
    clear(mw);
    var jd = julianDate(new Date());
    var lst = lstDeg(jd, state.lon);
    var sagRA = 17.75;
    var sagDec = -29;
    var aa = altAz(sagRA, sagDec, state.lat, lst);
    var line1 = el("div");
    if (aa.alt > 0){
      line1.innerHTML = "Hoy el centro galactico esta a " +
        "<b>" + aa.alt.toFixed(0) + " grados</b> de altura.";
    } else {
      line1.innerHTML = "Hoy el centro galactico esta bajo el horizonte.";
    }
    mw.appendChild(line1);

    var latAbs = Math.abs(state.lat);
    var line2 = el("div");
    line2.style.marginTop = "6px";
    if (latAbs < 25){
      line2.innerHTML = "Desde tu latitud es <span class='ok'>" +
        "visible todo el ano</span> (mejor entre marzo y octubre).";
    } else if (latAbs < 50){
      line2.innerHTML = "Desde tu latitud es visible <span class='ok'>" +
        "de marzo a octubre</span>.";
    } else {
      line2.innerHTML = "Desde tu latitud es <span class='warn'>" +
        "dificil de ver</span>: el centro galactico apenas se eleva " +
        "sobre el horizonte.";
    }
    mw.appendChild(line2);

    var bestAlt = -90;
    var bestHour = 0;
    for (var h = 0; h < 24; h++){
      var testDate = new Date();
      testDate.setHours(h, 0, 0, 0);
      var jdTest = julianDate(testDate);
      var lstTest = lstDeg(jdTest, state.lon);
      var a = altAz(sagRA, sagDec, state.lat, lstTest);
      if (a.alt > bestAlt){ bestAlt = a.alt; bestHour = h; }
    }
    var line3 = el("div");
    line3.style.marginTop = "6px";
    line3.innerHTML = "Mejor hora hoy: <b>" + bestHour + ":00</b> " +
      "(altura " + bestAlt.toFixed(0) + " grados).";
    mw.appendChild(line3);

    var line4 = el("div");
    line4.style.marginTop = "6px";
    line4.innerHTML = "Consejo: busca cielos oscuros, sin Luna, y " +
      "usa ISO 3200, f/2.8, 15-20s.";
    mw.appendChild(line4);
  }

  var eqRes = byId("eqResult");
  if (eqRes){
    clear(eqRes);
    var eq = null;
    try { eq = JSON.parse(storeGet("c7equipo") || "null"); } catch(e){}
    if (eq){
      if (eq.cam){ byId("eqCam").value = eq.cam; }
      if (eq.lens){ byId("eqLens").value = eq.lens; }
      if (eq.scope){ byId("eqScope").value = eq.scope; }
      eqRes.appendChild(el("div", null, "Equipo guardado."));
    } else {
      eqRes.appendChild(el("div", null, "Sin equipo guardado."));
    }
  }
}

function calcNPF(){
  var focal = parseFloat(byId("npfFocal").value);
  var fnum = parseFloat(byId("npfF").value);
  var pix = parseFloat(byId("npfPix").value);
  var dec = parseFloat(byId("npfDec").value) || 0;

  var res = byId("npfResult");
  if (!res){ return; }
  clear(res);

  if (isNaN(focal) || isNaN(fnum) || isNaN(pix)){
    res.appendChild(el("div", null, "Completa todos los campos."));
    return;
  }

  var decRad = dec * DEG;
  var cosDec = Math.cos(decRad);
  if (cosDec < 0.1){ cosDec = 0.1; }

  var npf = (35 * fnum + 30 * pix) / (focal * cosDec);
  var regla500 = 500 / focal;
  var regla300 = 300 / focal;

  var t1 = el("div");
  t1.innerHTML = "Tiempo maximo (NPF): <b>" +
    npf.toFixed(1) + " segundos</b>";
  res.appendChild(t1);

  var t2 = el("div");
  t2.style.marginTop = "6px";
  t2.innerHTML = "Regla 500: " + regla500.toFixed(1) + "s " +
    "(mas conservadora)";
  res.appendChild(t2);

  var t3 = el("div");
  t3.style.marginTop = "4px";
  t3.innerHTML = "Regla 300 (APS-C): " + regla300.toFixed(1) + "s";
  res.appendChild(t3);

  var t4 = el("div");
  t4.style.marginTop = "8px";
  if (npf < 5){
    t4.innerHTML = "<span class='bad'>Exposicion muy corta.</span> " +
      "Usa un objetivo mas angular o sube la apertura.";
  } else if (npf < 15){
    t4.innerHTML = "<span class='warn'>Exposicion corta.</span> " +
      "Aceptable pero vas a necesitar muchas tomas.";
  } else {
    t4.innerHTML = "<span class='ok'>Buen tiempo de exposicion.</span> " +
      "Aprovechalo.";
  }
  res.appendChild(t4);
}

function saveEquipo(){
  var eq = {
    cam: byId("eqCam").value.trim(),
    lens: byId("eqLens").value.trim(),
    scope: byId("eqScope").value.trim()
  };
  storeSet("c7equipo", JSON.stringify(eq));
  toast("Equipo guardado");
  renderAstro();
}

function exportPDF(){
  var now = new Date();
  var phases = nextMoonPhases(now);
  var meteors = nextMeteors(now);
  var lines = [];

  lines.push("<!DOCTYPE html><html><head>");
  lines.push("<meta charset='utf-8'>");
  lines.push("<title>Almanaque</title>");
  lines.push("<style>");
  lines.push("body{font-family:Georgia,serif;");
  lines.push("padding:30px;color:#111;line-height:1.5}");
  lines.push("h1{font-size:22px;");
  lines.push("border-bottom:2px solid #06c;padding-bottom:10px}");
  lines.push("h2{font-size:15px;margin-top:26px;color:#06c}");
  lines.push(".item{border-bottom:1px dotted #ccc;");
  lines.push("padding:8px 0;font-size:12px}");
  lines.push(".notes{background:#f8f8f8;padding:10px;");
  lines.push("border-left:3px solid #06c;margin:8px 0;font-size:12px}");
  lines.push("</style></head><body>");
  lines.push("<h1>ALMANAQUE DEL CIELO</h1>");
  lines.push("<p>Generado: " + now.toLocaleString("es") + "</p>");
  lines.push("<p>Ubicacion: " + state.lat.toFixed(2));
  lines.push(", " + state.lon.toFixed(2) + "</p>");
  lines.push("<h2>Proximos eventos</h2>");

  for (var i = 0; i < phases.length; i++){
    lines.push("<div class='item'><b>");
    lines.push(phases[i].date.toLocaleDateString("es"));
    lines.push("</b> " + phases[i].name + "</div>");
  }
  for (var m = 0; m < meteors.length; m++){
    lines.push("<div class='item'><b>");
    lines.push(meteors[m].date.toLocaleDateString("es"));
    lines.push("</b> Lluvia " + meteors[m].name);
    lines.push(" (ZHR " + meteors[m].zhr + ")</div>");
  }

  lines.push("<h2>Mi diario (" + journal.length + ")</h2>");
  for (var j = journal.length - 1; j >= 0; j--){
    var jj = journal[j];
    lines.push("<div class='item'><b>");
    lines.push(new Date(jj.ts).toLocaleString("es"));
    lines.push("</b> " + jj.title);
    if (jj.objects){
      lines.push("<br><i>Objetos: " + jj.objects + "</i>");
    }
    if (jj.notes){
      lines.push("<div class='notes'>" + jj.notes + "</div>");
    }
    lines.push("</div>");
  }
  lines.push("</body></html>");

  var w = window.open("", "_blank");
  if (!w){ toast("Permite ventanas emergentes"); return; }
  w.document.open();
  w.document.write(lines.join(""));
  w.document.close();
  setTimeout(function(){
    try { w.focus(); w.print(); } catch(e){}
  }, 500);
}

bootLog("B8");

function bindEvents(){
  var navEl = byId("nav");
  navEl.addEventListener("click", function(e){
    var t = e.target;
    while (t && t !== navEl){
      if (t.getAttribute && t.getAttribute("data-page")){
        go(t.getAttribute("data-page"), t);
        return;
      }
      t = t.parentNode;
    }
  });

  var tilesEl = byId("homeTiles");
  tilesEl.addEventListener("click", function(e){
    var t = e.target;
    while (t && t !== tilesEl){
      if (t.getAttribute && t.getAttribute("data-goto")){
        go(t.getAttribute("data-goto"));
        return;
      }
      t = t.parentNode;
    }
  });

  var chipsEl = document.querySelector(".chips");
  if (chipsEl){
    chipsEl.addEventListener("click", function(e){
      var t = e.target;
      if (!t || t.tagName !== "BUTTON"){ return; }
      if (t.getAttribute("data-layer")){
        toggleLayer(t.getAttribute("data-layer"), t);
      }
    });
  }

  byId("redBtn").addEventListener("click", toggleRedMode);
  byId("locBtn").addEventListener("click", openLoc);
  byId("btnExport").addEventListener("click", exportPDF);
  byId("btnSaveJ").addEventListener("click", saveJournal);
  byId("btnSaveLoc").addEventListener("click", saveLoc);
  byId("btnGps").addEventListener("click", gps);
  byId("btnCloseLoc").addEventListener("click", closeLoc);
  byId("chipNow").addEventListener("click", nowTime);
  byId("chipSpin").addEventListener("click", function(){ toggleSpin(this); });
  byId("chipReset").addEventListener("click", resetView);

  byId("timeSlider").addEventListener("input", function(){
    state.timeOffset = parseFloat(this.value);
    var h = state.timeOffset / 60;
    var lbl = byId("timeLabel");
    if (lbl){
      if (state.timeOffset === 0){ lbl.textContent = "Ahora"; }
      else { lbl.textContent = (h >= 0 ? "+" : "") + h.toFixed(1) + "h"; }
    }
    drawSky();
  });

  var jList = byId("journalList");
  jList.addEventListener("click", function(e){
    var t = e.target;
    while (t && t !== jList){
      if (t.getAttribute && t.getAttribute("data-jdel") !== null){
        var idx = parseInt(t.getAttribute("data-jdel"), 10);
        if (!isNaN(idx)){ delJournal(idx); }
        return;
      }
      t = t.parentNode;
    }
  });

  var catsEl = byId("wikiCats");
  catsEl.addEventListener("click", function(e){
    var t = e.target;
    if (!t || t.tagName !== "BUTTON"){ return; }
    var btns = catsEl.getElementsByTagName("button");
    for (var i = 0; i < btns.length; i++){ btns[i].className = "chip"; }
    t.className = "chip on";
    renderWikiList();
  });

  byId("wikiSearch").addEventListener("input", renderWikiList);

  byId("btnCalcNPF").addEventListener("click", calcNPF);
  byId("btnSaveEq").addEventListener("click", saveEquipo);

  // Calendario lunar
  byId("moonPrevBtn").addEventListener("click", function(){
    moonCal.month--;
    if (moonCal.month < 0){
      moonCal.month = 11;
      moonCal.year--;
    }
    moonCal.selected = -1;
    renderMoonCalendar(moonCal.year, moonCal.month);
  });
  byId("moonNextBtn").addEventListener("click", function(){
    moonCal.month++;
    if (moonCal.month > 11){
      moonCal.month = 0;
      moonCal.year++;
    }
    moonCal.selected = -1;
    renderMoonCalendar(moonCal.year, moonCal.month);
  });

  var moonGrid = byId("moonGrid");
  moonGrid.addEventListener("click", function(e){
    var t = e.target;
    while (t && t !== moonGrid){
      if (t.getAttribute && t.getAttribute("data-day")){
        var day = parseInt(t.getAttribute("data-day"), 10);
        moonCal.selected = day;
        renderMoonCalendar(moonCal.year, moonCal.month);
        renderMoonDayDetails(day);
        return;
      }
      t = t.parentNode;
    }
  });

  bindItemList("visibleList");
  bindItemList("planetsList");
  bindItemList("brightList");
  bindItemList("messierList");
  bindItemList("eventsList");

  byId("modal").addEventListener("click", function(e){
    if (e.target.id === "modal"){ closeLoc(); }
  });
  byId("modalInfo").addEventListener("click", function(e){
    if (e.target.id === "modalInfo"){ closeInfo(); }
  });
}

function bindItemList(id){
  var cont = byId(id);
  if (!cont){ return; }
  if (cont.getAttribute("data-bound")){ return; }
  cont.setAttribute("data-bound", "1");
  cont.addEventListener("click", function(e){
    var t = e.target;
    while (t && t !== cont){
      if (t.getAttribute && t.getAttribute("data-item")){
        openInfo(t.getAttribute("data-item"));
        return;
      }
      t = t.parentNode;
    }
  });
}

// ---------------- MODAL INFO ----------------
var ALIASES = {
  "luna nueva": "Fases lunares",
  "cuarto creciente": "Fases lunares",
  "luna llena": "Fases lunares",
  "cuarto menguante": "Fases lunares",
  "luna menguante": "Fases lunares",
  "luna creciente": "Fases lunares",
  "sol": "El Sol",
  "via lactea": "Via Lactea",
  "estrella polar": "Estrella polar",
  "polaris": "Polaris",
  "iss": "Estacion Espacial Internacional",
  "estacion espacial": "Estacion Espacial Internacional"
};

function findWikiItem(name){
  if (typeof WIKI === "undefined"){ return null; }
  var cats = [
    "estrellas","constelaciones","planetas","luna","sol","messier",
    "ngc","sistema","eventos","fenomenos","conceptos","historia"
  ];
  var target = name.toLowerCase().trim();
  var i, j, arr;

  for (i = 0; i < cats.length; i++){
    arr = WIKI[cats[i]];
    if (!arr){ continue; }
    for (j = 0; j < arr.length; j++){
      if (arr[j].n.toLowerCase() === target){ return arr[j]; }
    }
  }

  for (i = 0; i < cats.length; i++){
    arr = WIKI[cats[i]];
    if (!arr){ continue; }
    for (j = 0; j < arr.length; j++){
      var wn = arr[j].n.toLowerCase();
      if (wn.indexOf(target) >= 0 || target.indexOf(wn) >= 0){
        return arr[j];
      }
    }
  }

  if (ALIASES[target]){ return findWikiItem(ALIASES[target]); }

  if (target.indexOf("lluvia") >= 0){ return findWikiItem("Lluvias de meteoros"); }
  if (target.indexOf("eclipse") >= 0){
    if (target.indexOf("sol") >= 0){ return findWikiItem("Eclipses solares"); }
    return findWikiItem("Eclipses lunares");
  }
  if (target.indexOf("luna") === 0){ return findWikiItem("La Luna"); }
  if (target.indexOf("cometa") >= 0){ return findWikiItem("Cometas"); }
  return null;
}

function openInfo(name){
  var content = byId("sheetInfoContent");
  if (!content){ return; }
  clear(content);

  var item = findWikiItem(name);

  if (!item){
    content.appendChild(el("h2", null, name));
    content.appendChild(el("p", "wikicat", "Sin ficha en la wiki"));
    content.appendChild(el("p", null,
      "Este objeto todavia no tiene una ficha completa. " +
      "Podes consultar la wiki general para mas informacion."));
    var c1 = el("button", "btn ghost", "Cerrar");
    c1.addEventListener("click", closeInfo);
    content.appendChild(c1);
    byId("modalInfo").className = "on";
    return;
  }

  content.appendChild(el("h2", null, item.n));
  if (item.t){ content.appendChild(el("p", "wikicat", item.t)); }

  if (item.ra || item.dec || item.mag || item.dist){
    var data = el("div", "wikidata");
    if (item.ra){
      data.appendChild(el("div", "k", "AR"));
      data.appendChild(el("div", "v", item.ra));
    }
    if (item.dec){
      data.appendChild(el("div", "k", "Dec"));
      data.appendChild(el("div", "v", item.dec));
    }
    if (item.mag && item.mag !== "-"){
      data.appendChild(el("div", "k", "Magnitud"));
      data.appendChild(el("div", "v", item.mag));
    }
    if (item.dist && item.dist !== "-"){
      data.appendChild(el("div", "k", "Distancia"));
      data.appendChild(el("div", "v", item.dist));
    }
    content.appendChild(data);
  }
  if (item.desc){
    content.appendChild(el("h4", null, "Descripcion"));
    content.appendChild(el("p", null, item.desc));
  }
  if (item.ver){
    content.appendChild(el("h4", null, "Como verlo"));
    content.appendChild(el("p", null, item.ver));
  }
  if (item.cur){
    content.appendChild(el("h4", null, "Curiosidades"));
    content.appendChild(el("p", null, item.cur));
  }
  if (item.ejemplos){
    content.appendChild(el("h4", null, "Ejemplos"));
    content.appendChild(el("p", null, item.ejemplos));
  }
  var close = el("button", "btn ghost", "Cerrar");
  close.addEventListener("click", closeInfo);
  content.appendChild(close);

  byId("modalInfo").className = "on";
}

function closeInfo(){ byId("modalInfo").className = ""; }

bootLog("B9: eventos");

var lastAnim = 0;
function animLoop(t){
  requestAnimationFrame(animLoop);
  var sky = byId("page-sky");
  if (state.spin && sky && sky.className.indexOf("active") >= 0){
    state.timeOffset = (state.timeOffset + 3) % 1440;
    if (state.timeOffset > 720){ state.timeOffset -= 1440; }
    var sl = byId("timeSlider");
    if (sl){ sl.value = state.timeOffset; }
    var lbl = byId("timeLabel");
    if (lbl){
      var h = state.timeOffset / 60;
      lbl.textContent = (h >= 0 ? "+" : "") + h.toFixed(1) + "h";
    }
    if (t - lastAnim > 70){
      drawSky();
      lastAnim = t;
    }
  }
}

function init(){
  applyRedMode();
  bindEvents();

  updateLocLabel();
  renderHome();
  renderTonight();
  renderCalendar();
  renderJournal();

  requestAnimationFrame(animLoop);

  setInterval(function(){
    renderHome();
    var sky = byId("page-sky");
    if (sky && sky.className.indexOf("active") >= 0){ drawSky(); }
    var moon = byId("page-moon");
    if (moon && moon.className.indexOf("active") >= 0){ renderMoonCurrent(new Date()); }
  }, 60000);

  if (!storeGet("c7loc")){
    setTimeout(function(){
      if (!navigator.geolocation){ return; }
      navigator.geolocation.getCurrentPosition(
        function(pos){
          saveLocation(pos.coords.latitude, pos.coords.longitude);
        },
        function(){},
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
      );
    }, 800);
  }

  setTimeout(function(){
    var log = byId("bootlog");
    if (log){ log.style.display = "none"; }
  }, 2500);

  bootLog("Listo");
}

APP.go = go;
APP.init = init;

if (document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}