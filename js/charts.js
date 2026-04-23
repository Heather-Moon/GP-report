/* ══════════════════════════════
   SVG HELPERS
══════════════════════════════ */
const NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs) {
  const el = document.createElementNS(NS, tag);
  for (const [k,v] of Object.entries(attrs||{})) el.setAttribute(k,v);
  return el;
}

function svgTxt(svg, text, x, y, attrs) {
  const t = svgEl('text', { x, y, 'text-anchor':'middle', 'dominant-baseline':'middle', ...attrs });
  t.textContent = text;
  svg.appendChild(t);
}

function clearSvg(id) {
  const el = document.getElementById(id);
  if (el) { el.innerHTML = ''; return el; }
  return null;
}

function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ══════════════════════════════
   CHART: KDE 곡선 (smooth curve)
   scores: number[], avgVal, medVal: lines
   markerScore: optional red marker
   color: stroke color
══════════════════════════════ */
function renderKDECurve(svgId, scores, avgVal, medVal, markerScore, color) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W=360, H=parseInt(svg.getAttribute('height')||'160'),
        padL=32, padR=10, padT=22, padB=28;
  const xMin=0, xMax=100, nPts=150;
  const bw = Math.max(7, 10 - scores.length * 0.3);
  const col = color || '#1565C0';

  // KDE density
  const xs = Array.from({length:nPts}, (_,i) => xMin + (i/(nPts-1))*(xMax-xMin));
  const ys = xs.map(x => scores.reduce((s,v) => {
    const z=(x-v)/bw; return s + Math.exp(-0.5*z*z);
  }, 0));
  const maxY = Math.max(...ys, 0.001);
  const cW = W-padL-padR, cH = H-padT-padB;
  const sx = x => padL + ((x-xMin)/(xMax-xMin))*cW;
  const sy = y => padT + cH - (y/maxY)*cH;

  // X축
  svg.appendChild(svgEl('line', {x1:padL, y1:H-padB, x2:W-padR, y2:H-padB, stroke:'#D1D5DB','stroke-width':'1'}));
  [0,20,40,60,80,100].forEach(v => {
    const isMark = v === 80;
    svg.appendChild(svgEl('line', {x1:sx(v), y1:H-padB, x2:sx(v), y2:H-padB+4, stroke: isMark ? '#9CA3AF' : '#D1D5DB','stroke-width': isMark ? '2' : '1'}));
    const t = svgEl('text', {x:sx(v), y:H-7, 'text-anchor':'middle', 'font-size':'11',
      fill: isMark ? '#6B7280' : '#9CA3AF', 'font-weight': isMark ? '700' : '500'});
    t.textContent = v; svg.appendChild(t);
  });

  // 히스토그램 막대 (KDE 아래 배경)
  const nBins = 10, binPx = cW / nBins;
  const binCounts = Array(nBins).fill(0);
  scores.forEach(s => { const bi = Math.min(Math.floor(s / 10), nBins - 1); if (bi >= 0) binCounts[bi]++; });
  const maxBinCount = Math.max(...binCounts, 1);
  binCounts.forEach((c, i) => {
    if (c === 0) return;
    const bH = (c / maxBinCount) * cH * 0.82;
    const binFill = i >= 8 ? 'rgba(22,163,74,0.22)' : 'rgba(220,38,38,0.18)';
    const binStroke = i >= 8 ? 'rgba(22,163,74,0.40)' : 'rgba(220,38,38,0.35)';
    svg.appendChild(svgEl('rect', { x: padL + i * binPx + 1.5, y: padT + cH - bH, width: binPx - 3, height: bH,
      fill: binFill, stroke: binStroke, 'stroke-width': '0.5', rx: 2 }));
  });

  // 커브 선
  const lineD = xs.map((x,i) => `${i===0?'M':'L'}${sx(x).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join(' ');
  svg.appendChild(svgEl('path', {d:lineD, fill:'none', stroke:col, 'stroke-width':'3',
    'stroke-linecap':'round', 'stroke-linejoin':'round'}));

  // 평균선 — 주황 점선
  if (avgVal != null) {
    const ax = sx(avgVal);
    svg.appendChild(svgEl('line', {x1:ax, y1:padT, x2:ax, y2:H-padB,
      stroke:'#F59E0B', 'stroke-width':'2', 'stroke-dasharray':'5,3'}));
  }

  // 응시자 마커
  if (markerScore != null) {
    const px = sx(markerScore);

    // 커브 위 점의 y값 계산
    const markerDensity = scores.reduce((s,v) => {
      const z = (markerScore - v) / bw; return s + Math.exp(-0.5*z*z);
    }, 0);
    const dotY = sy(markerDensity);

    // 커브 위 점 (흰 테두리 강조)
    svg.appendChild(svgEl('circle', {cx:px, cy:dotY, r:'7', fill:'#fff', stroke:col, 'stroke-width':'3'}));
    svg.appendChild(svgEl('circle', {cx:px, cy:dotY, r:'3.5', fill:col}));

    // 콜아웃 박스 (점 위에 떠 있는 형태)
    const boxW = 72, boxH = 36, boxR = 8;
    // 콜아웃 x 위치: 오른쪽으로 치우치면 왼쪽으로
    const boxX = px + boxW/2 + 6 > W - padR ? px - boxW/2 - 6 : px + 6;
    const boxY = dotY - boxH - 10;
    const arrowX = px;
    const arrowY = dotY - 10;

    svg.appendChild(svgEl('rect', {x:boxX - boxW/2, y:boxY, width:boxW, height:boxH, rx:boxR, fill:col}));
    // 화살표 삼각형
    svg.appendChild(svgEl('polygon', {
      points:`${arrowX},${arrowY} ${arrowX-6},${boxY+boxH} ${arrowX+6},${boxY+boxH}`,
      fill:col
    }));
    // "응시자" 라벨
    const lbl1 = svgEl('text', {x:boxX, y:boxY+13, 'text-anchor':'middle',
      'font-size':'10', fill:'rgba(255,255,255,0.85)', 'font-weight':'600'});
    lbl1.textContent = '응시자'; svg.appendChild(lbl1);
    // 점수
    const lbl2 = svgEl('text', {x:boxX, y:boxY+28, 'text-anchor':'middle',
      'font-size':'13', fill:'#fff', 'font-weight':'800'});
    lbl2.textContent = markerScore+'점'; svg.appendChild(lbl2);
  }
}

/* ══════════════════════════════
   CHART: MAIN SCORE HISTOGRAM (0~100 고정)
   단일 색상 막대, Y축 정수 눈금, 합격선/평균선
══════════════════════════════ */
function renderMainScoreHistogram(svgId, scores, avgVal, markerScore) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W = 380, H = 220, padL = 36, padR = 16, padT = 16, padB = 32;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', H);

  const bins  = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const nBins = bins.length - 1;  // 10
  const counts = Array(nBins).fill(0);
  scores.forEach(s => {
    const i = Math.min(Math.floor(s / 10), nBins - 1);
    if (i >= 0) counts[i]++;
  });
  const maxC = Math.max(...counts, 1);
  const yMax = maxC + 1;
  const bW   = (W - padL - padR) / nBins;
  const cH   = H - padT - padB;
  const sx   = v => padL + (v / 100) * (W - padL - padR);
  const sy   = c => padT + cH - (c / yMax) * cH;

  // Y축 수평 그리드 + 눈금
  for (let v = 0; v <= maxC; v++) {
    const y = sy(v);
    svg.appendChild(svgEl('line', { x1: padL, y1: y, x2: W - padR, y2: y,
      stroke: v === 0 ? '#D1D5DB' : '#F3F4F6', 'stroke-width': '1' }));
    const t = svgEl('text', { x: padL - 6, y: y, 'text-anchor': 'end', 'dominant-baseline': 'middle',
      'font-size': '10', fill: '#9CA3AF' });
    t.textContent = v; svg.appendChild(t);
  }

  // 막대 (합격 80↑ 초록 / 불합격 빨강)
  counts.forEach((c, i) => {
    if (c === 0) return;
    const x  = padL + i * bW;
    const bH = (c / yMax) * cH;
    const y  = sy(c);
    const fill = bins[i] >= 80 ? '#16A34A' : '#DC2626';
    svg.appendChild(svgEl('rect', { x: x + 3, y, width: bW - 6, height: bH,
      fill, rx: 4, opacity: '0.80' }));
  });

  // X축 경계 눈금 + 레이블 (짝수 경계만 표시: 0, 20, 40, 60, 80, 100)
  bins.forEach((b, i) => {
    const x = padL + i * bW;
    svg.appendChild(svgEl('line', { x1: x, y1: H - padB, x2: x, y2: H - padB + 4,
      stroke: '#D1D5DB', 'stroke-width': '1' }));
    if (i % 2 === 0) {
      const t = svgEl('text', { x, y: H - 10, 'text-anchor': 'middle',
        'font-size': '9', fill: '#6B7280' });
      t.textContent = b; svg.appendChild(t);
    }
  });

  // KDE 확률 분포 곡선 오버레이
  if (scores.length > 1) {
    const bwK = Math.max(6, 12 - scores.length * 0.4);
    const nPts = 120;
    const kxs = Array.from({length: nPts}, (_, i) => (i / (nPts - 1)) * 100);
    const kys = kxs.map(x => scores.reduce((s, v) => { const z = (x-v)/bwK; return s + Math.exp(-0.5*z*z); }, 0));
    const kMax = Math.max(...kys, 0.001);
    const kx = v => padL + (v / 100) * (W - padL - padR);
    const ky = d => padT + cH - (d / kMax) * (maxC / yMax) * cH;
    const fpts = kxs.map((x, i) => `${i===0?'M':'L'}${kx(x).toFixed(1)},${ky(kys[i]).toFixed(1)}`).join(' ');
    svg.appendChild(svgEl('path', { d: fpts + ` L${kx(100)},${padT+cH} L${kx(0)},${padT+cH} Z`,
      fill: 'rgba(21,101,192,0.09)', stroke: 'none' }));
    const lpts = kxs.map((x, i) => `${i===0?'M':'L'}${kx(x).toFixed(1)},${ky(kys[i]).toFixed(1)}`).join(' ');
    svg.appendChild(svgEl('path', { d: lpts, fill: 'none', stroke: '#1565C0', 'stroke-width': '2.5',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  }

  // 평균선 — 주황 점선 + 레이블
  if (avgVal != null) {
    const ax = sx(avgVal);
    svg.appendChild(svgEl('line', { x1: ax, y1: padT, x2: ax, y2: H - padB,
      stroke: '#F59E0B', 'stroke-width': '2', 'stroke-dasharray': '5,3' }));
    const at = svgEl('text', { x: ax + 4, y: padT + 11, 'font-size': '9', fill: '#F59E0B', 'font-weight': '700' });
    at.textContent = '평균(' + avgVal + '점)'; svg.appendChild(at);
  }

  // 개인 마커 (응시자 개인 페이지용)
  if (markerScore != null) {
    const px = sx(markerScore);
    svg.appendChild(svgEl('line', { x1: px, y1: padT, x2: px, y2: H - padB,
      stroke: '#DC2626', 'stroke-width': '2' }));
    const mt = svgEl('text', { x: px, y: padT + 5, 'text-anchor': 'middle',
      'font-size': '9', fill: '#DC2626', 'font-weight': '700' });
    mt.textContent = '나'; svg.appendChild(mt);
  }
}

/* ══════════════════════════════
   CHART: HISTOGRAM + AVG/MEDIAN
   markerScore: optional personal score
══════════════════════════════ */
function renderHistogram(svgId, scores, avgVal, medVal, markerScore) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W=360, H=100, padL=28, padR=10, padT=8, padB=22;
  const bins = [40,50,60,70,80,90,100];
  const counts = Array(bins.length-1).fill(0);
  scores.forEach(s => {
    const i = Math.min(Math.floor((s-40)/10), counts.length-1);
    if (i >= 0) counts[i]++;
  });
  const maxC = Math.max(...counts, 1);
  const cW = (W - padL - padR) / counts.length;
  const cH = H - padT - padB;

  // bars
  counts.forEach((c, i) => {
    const bH = (c / maxC) * cH;
    const x = padL + i * cW;
    const y = padT + cH - bH;
    const col = i >= 5 ? '#16A34A' : i >= 3 ? '#D97706' : '#DC2626';
    svg.appendChild(svgEl('rect', { x: x+2, y, width: cW-4, height: bH,
      fill: col, rx:3, opacity:'0.75' }));
    if (c > 0) {
      const t = svgEl('text', { x: x+cW/2, y: y-3, 'text-anchor':'middle',
        'font-size':'9', fill:'#374151', 'font-weight':'600' });
      t.textContent = c;
      svg.appendChild(t);
    }
    // x-axis label
    const tl = svgEl('text', { x: x+cW/2, y: H-5, 'text-anchor':'middle',
      'font-size':'8.5', fill:'#9CA3AF' });
    tl.textContent = bins[i];
    svg.appendChild(tl);
  });

  // KDE 확률 분포 곡선 오버레이
  if (scores.length > 1) {
    const bwK = Math.max(4, 8 - scores.length * 0.2);
    const nPts = 80;
    const kxs = Array.from({length: nPts}, (_, i) => 40 + (i / (nPts - 1)) * 60);
    const kys = kxs.map(x => scores.reduce((s, v) => { const z = (x-v)/bwK; return s + Math.exp(-0.5*z*z); }, 0));
    const kMax = Math.max(...kys, 0.001);
    const kx = v => padL + ((v - 40) / 60) * (W - padL - padR);
    const ky = d => padT + cH - (d / kMax) * cH;
    const fpts = kxs.map((x, i) => `${i===0?'M':'L'}${kx(x).toFixed(1)},${ky(kys[i]).toFixed(1)}`).join(' ');
    svg.appendChild(svgEl('path', { d: fpts + ` L${kx(100)},${padT+cH} L${kx(40)},${padT+cH} Z`,
      fill: 'rgba(21,101,192,0.09)', stroke: 'none' }));
    const lpts = kxs.map((x, i) => `${i===0?'M':'L'}${kx(x).toFixed(1)},${ky(kys[i]).toFixed(1)}`).join(' ');
    svg.appendChild(svgEl('path', { d: lpts, fill: 'none', stroke: '#1565C0', 'stroke-width': '1.8',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  }

  // avg line
  const aX = padL + ((avgVal - 40) / 60) * (W - padL - padR);
  svg.appendChild(svgEl('line', { x1:aX, y1:padT, x2:aX, y2:H-padB, stroke:'#1565C0', 'stroke-width':'1.5', 'stroke-dasharray':'4,3' }));
  const at = svgEl('text', { x:aX+3, y:padT+8, 'font-size':'8', fill:'#1565C0', 'font-weight':'700' });
  at.textContent = '평균';
  svg.appendChild(at);

  // median line
  const mX = padL + ((medVal - 40) / 60) * (W - padL - padR);
  svg.appendChild(svgEl('line', { x1:mX, y1:padT, x2:mX, y2:H-padB, stroke:'#7C3AED', 'stroke-width':'1.5', 'stroke-dasharray':'4,3' }));
  const mt = svgEl('text', { x:mX+3, y:padT+17, 'font-size':'8', fill:'#7C3AED', 'font-weight':'700' });
  mt.textContent = '중앙';
  svg.appendChild(mt);

  // personal marker
  if (markerScore != null) {
    const px = padL + ((markerScore - 40) / 60) * (W - padL - padR);
    svg.appendChild(svgEl('line', { x1:px, y1:padT, x2:px, y2:H-padB, stroke:'#DC2626', 'stroke-width':'2' }));
    const pt2 = svgEl('text', { x:px, y:padT+4, 'text-anchor':'middle', 'font-size':'8', fill:'#DC2626', 'font-weight':'700' });
    pt2.textContent = '나';
    svg.appendChild(pt2);
  }
}

/* ══════════════════════════════
   CHART: BOX PLOT
══════════════════════════════ */
function renderBoxPlot(svgId, stats) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W=360, H=44, padL=28, padR=10, py=22;
  const scale = x => padL + ((x-30)/(105-30)) * (W-padL-padR);

  svg.appendChild(svgEl('line', { x1:scale(stats.min), y1:py, x2:scale(stats.q1), y2:py, stroke:'#9CA3AF', 'stroke-width':'1.5' }));
  svg.appendChild(svgEl('line', { x1:scale(stats.q3),  y1:py, x2:scale(stats.max), y2:py, stroke:'#9CA3AF', 'stroke-width':'1.5' }));
  // whisker ticks
  [stats.min, stats.max].forEach(v => {
    svg.appendChild(svgEl('line', { x1:scale(v), y1:py-6, x2:scale(v), y2:py+6, stroke:'#6B7280', 'stroke-width':'1.5' }));
  });
  // IQR box
  svg.appendChild(svgEl('rect', { x:scale(stats.q1), y:py-9, width:scale(stats.q3)-scale(stats.q1), height:18,
    fill:'#EBF3FF', stroke:'#1565C0', 'stroke-width':'1.5', rx:'3' }));
  // median
  svg.appendChild(svgEl('line', { x1:scale(stats.median), y1:py-9, x2:scale(stats.median), y2:py+9,
    stroke:'#7C3AED', 'stroke-width':'2' }));
  // labels
  [[stats.min,'min'],[stats.q1,'Q1'],[stats.median,'중앙'],[stats.q3,'Q3'],[stats.max,'max']].forEach(([v,lbl]) => {
    const t = svgEl('text', { x:scale(v), y:py+18, 'text-anchor':'middle', 'font-size':'7.5', fill:'#6B7280' });
    t.textContent = lbl+'('+v+')';
    svg.appendChild(t);
  });
}

/* ══════════════════════════════
   CHART: HORIZONTAL BAR (with error bar)
══════════════════════════════ */
function renderHBarChart(svgId, items, maxVal, showErrorBar) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W=360, padL=130, padR=50, rowH=30;
  const H = items.length * rowH + 10;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', H);
  const bW = W - padL - padR;

  items.forEach((item, i) => {
    const y = i * rowH + rowH/2;
    const bLen = (item.avg / maxVal) * bW;
    const col = trackColor(item.avg);
    // label
    const tl = svgEl('text', { x:padL-6, y:y+1, 'text-anchor':'end', 'dominant-baseline':'middle',
      'font-size':'9.5', fill:'#374151' });
    tl.textContent = item.name.length > 14 ? item.name.slice(0,13)+'…' : item.name;
    svg.appendChild(tl);
    // bar
    svg.appendChild(svgEl('rect', { x:padL, y:y-8, width:Math.max(bLen,2), height:16,
      fill:col, rx:3, opacity:'0.8' }));
    // error bar
    if (showErrorBar && item.std != null) {
      const cx = padL + bLen;
      const eW = (item.std / maxVal) * bW;
      svg.appendChild(svgEl('line', { x1:Math.max(padL,cx-eW), y1:y, x2:cx+eW, y2:y,
        stroke:'#374151', 'stroke-width':'1.5' }));
      svg.appendChild(svgEl('line', { x1:cx-eW, y1:y-4, x2:cx-eW, y2:y+4, stroke:'#374151', 'stroke-width':'1.5' }));
      svg.appendChild(svgEl('line', { x1:cx+eW, y1:y-4, x2:cx+eW, y2:y+4, stroke:'#374151', 'stroke-width':'1.5' }));
    }
    // value label
    const vl = svgEl('text', { x:padL+bLen+6, y:y+1, 'dominant-baseline':'middle',
      'font-size':'9', fill:col, 'font-weight':'700' });
    vl.textContent = item.avg + (showErrorBar ? ' ±'+item.std : '%');
    svg.appendChild(vl);
  });
}

/* ══════════════════════════════
   CHART: DONUT
══════════════════════════════ */
function renderDonut(svgId, acquired, total, colorAcq, colorMis) {
  const svg = clearSvg(svgId); if (!svg) return;
  const cx=42, cy=42, r=32, sw=12;
  const pct = total > 0 ? acquired/total : 0;
  const circ = 2 * Math.PI * r;
  const dashAcq = pct * circ;

  svg.appendChild(svgEl('circle', { cx, cy, r, fill:'none', stroke: colorMis||'#FEE2E2', 'stroke-width':sw }));
  const arc = svgEl('circle', { cx, cy, r, fill:'none', stroke: colorAcq||'#16A34A', 'stroke-width':sw,
    'stroke-dasharray': `${dashAcq} ${circ - dashAcq}`,
    'stroke-dashoffset': circ/4,
    'stroke-linecap':'round' });
  svg.appendChild(arc);
  // center text
  const pv = svgEl('text', { x:cx, y:cy-4, 'text-anchor':'middle', 'dominant-baseline':'middle',
    'font-size':'13', fill:'#111827', 'font-weight':'800' });
  pv.textContent = Math.round(pct*100)+'%';
  svg.appendChild(pv);
  const sub = svgEl('text', { x:cx, y:cy+10, 'text-anchor':'middle', 'dominant-baseline':'middle',
    'font-size':'8', fill:'#6B7280' });
  sub.textContent = `${acquired}/${total}`;
  svg.appendChild(sub);
}

/* ══════════════════════════════
   CHART: CDF
══════════════════════════════ */
function renderCDF(svgId, scores) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W=360, H=110, padL=28, padR=16, padT=8, padB=24;
  const sorted = [...scores].sort((a,b)=>a-b);
  const n = sorted.length;
  const cW = W-padL-padR, cH = H-padT-padB;
  const sx = v => padL + ((v-30)/(105-30))*cW;
  const sy = p => padT + cH - p*cH;

  // grid lines
  [0.25,0.5,0.75,1.0].forEach(p => {
    svg.appendChild(svgEl('line', { x1:padL, y1:sy(p), x2:W-padR, y2:sy(p),
      stroke:'#E5E7EB', 'stroke-width':'1' }));
    const t = svgEl('text', { x:padL-4, y:sy(p), 'text-anchor':'end', 'dominant-baseline':'middle',
      'font-size':'8', fill:'#9CA3AF' });
    t.textContent = Math.round(p*100)+'%';
    svg.appendChild(t);
  });
  // x-axis ticks
  [40,50,60,70,80,90,100].forEach(v => {
    const t = svgEl('text', { x:sx(v), y:H-6, 'text-anchor':'middle', 'font-size':'8', fill:'#9CA3AF' });
    t.textContent = v;
    svg.appendChild(t);
  });

  // CDF line (step function)
  let pts = [`M${sx(sorted[0])},${sy(0)}`];
  sorted.forEach((s, i) => {
    const p = (i+1)/n;
    const prevP = i/n;
    pts.push(`L${sx(s)},${sy(prevP)}`);
    pts.push(`L${sx(s)},${sy(p)}`);
  });
  pts.push(`L${W-padR},${sy(1)}`);
  const path = svgEl('path', { d: pts.join(' '), fill:'none', stroke:'#1565C0', 'stroke-width':'2.5', 'stroke-linejoin':'round' });
  svg.appendChild(path);

  // fill area
  const fillPts = [`M${sx(sorted[0])},${sy(0)}`];
  sorted.forEach((s,i) => {
    const p=(i+1)/n, prevP=i/n;
    fillPts.push(`L${sx(s)},${sy(prevP)}`);
    fillPts.push(`L${sx(s)},${sy(p)}`);
  });
  fillPts.push(`L${W-padR},${sy(1)} L${W-padR},${sy(0)} Z`);
  const fill = svgEl('path', { d: fillPts.join(' '), fill:'#EBF3FF', opacity:'0.5', stroke:'none' });
  svg.insertBefore(fill, path);

  // reference lines 70 / 80
  [{v:70, col:'#D97706'}, {v:80, col:'#16A34A'}].forEach(({v, col}) => {
    const below = sorted.filter(s=>s<=v).length/n;
    svg.appendChild(svgEl('line', { x1:sx(v), y1:sy(0), x2:sx(v), y2:sy(below),
      stroke:col, 'stroke-width':'1.2', 'stroke-dasharray':'3,3' }));
    const t2 = svgEl('text', { x:sx(v), y:H-padB-4, 'text-anchor':'middle', 'font-size':'8', fill:col, 'font-weight':'700' });
    t2.textContent = v+'점';
    svg.appendChild(t2);
  });
}

/* ══════════════════════════════
   CHART: GROUP BAR (나 vs 전체 평균)
   items: [{label, me, avg}]   0-100
══════════════════════════════ */
function renderGroupBar(svgId, items) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W=280, padL=90, padR=12, rowH=22;
  const H = items.length * rowH + 10;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', H);
  const bW = W - padL - padR;

  items.forEach((item, i) => {
    const y = i * rowH + rowH/2;
    // label
    const tl = svgEl('text', { x:padL-5, y:y, 'text-anchor':'end', 'dominant-baseline':'middle',
      'font-size':'9', fill:'#374151' });
    tl.textContent = item.label.length > 12 ? item.label.slice(0,11)+'…' : item.label;
    svg.appendChild(tl);
    // avg bar (background)
    const avgW = (item.avg/100)*bW;
    svg.appendChild(svgEl('rect', { x:padL, y:y-4, width:Math.max(avgW,2), height:8,
      fill:'#CBD5E1', rx:2 }));
    // me bar (foreground, thinner)
    const meW = (item.me/100)*bW;
    const meCol = item.me >= 80 ? '#16A34A' : item.me >= 50 ? '#D97706' : '#DC2626';
    svg.appendChild(svgEl('rect', { x:padL, y:y-7, width:Math.max(meW,2), height:6,
      fill:meCol, rx:2, opacity:'0.9' }));
    // value label
    const vl = svgEl('text', { x:padL+Math.max(meW,2)+4, y:y, 'dominant-baseline':'middle',
      'font-size':'8.5', fill:meCol, 'font-weight':'700' });
    vl.textContent = item.me+'%';
    svg.appendChild(vl);
  });
}

/* ══════════════════════════════
   SVG 레이더 차트
══════════════════════════════ */
function renderRadar(svgId, axes, color, legendId) {
  const svg = document.getElementById(svgId);
  svg.innerHTML = '';
  const cx = 110, cy = 110, R = 80, n = axes.length;
  const step = (2 * Math.PI) / n;
  const start = -Math.PI / 2;

  function pt(i, r) {
    const a = start + i * step;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  // 격자 (5단계)
  [20, 40, 60, 80, 100].forEach((pct, idx) => {
    const r = R * pct / 100;
    const pts = Array.from({ length: n }, (_, i) => pt(i, r).join(',')).join(' ');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', pts);
    poly.setAttribute('fill', idx % 2 === 0 ? '#F8FAFD' : 'none');
    poly.setAttribute('stroke', '#E5E7EB');
    poly.setAttribute('stroke-width', '1');
    svg.appendChild(poly);
  });

  // 축 선
  axes.forEach((_, i) => {
    const [x, y] = pt(i, R);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', x);  line.setAttribute('y2', y);
    line.setAttribute('stroke', '#DDE3EF'); line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  });

  // 데이터 폴리곤
  const dpts = axes.map((a, i) => pt(i, R * Math.max(0, a.value) / 100).join(',')).join(' ');
  const dp = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  dp.setAttribute('points', dpts);
  dp.setAttribute('fill', hexAlpha(color, 0.12));
  dp.setAttribute('stroke', color);
  dp.setAttribute('stroke-width', '2');
  svg.appendChild(dp);

  // 각 축별 색상 점
  axes.forEach((a, i) => {
    const [x, y] = pt(i, R * Math.max(0, a.value) / 100);
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '5');
    c.setAttribute('fill', a.color || color);
    c.setAttribute('stroke', 'white'); c.setAttribute('stroke-width', '2');
    svg.appendChild(c);
  });

  // 라벨
  axes.forEach((a, i) => {
    const [x, y] = pt(i, R + 22);
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', x); t.setAttribute('y', y + 4);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('font-size', '10.5');
    t.setAttribute('fill', '#374151');
    t.setAttribute('font-weight', '600');
    t.textContent = a.label;
    svg.appendChild(t);
  });

  // 범례
  if (legendId) {
    const leg = document.getElementById(legendId);
    leg.innerHTML = axes.map(a => `
      <div class="radar-legend-item">
        <div class="rl-dot" style="background:${a.color || color};"></div>
        <span class="rl-name">${a.label}</span>
        <span class="rl-val" style="color:${a.color || color};">${a.value}%</span>
      </div>`).join('');
  }
}

/* ══════════════════════════════
   CHART: 소요시간 히스토그램
   timesInSec: number[], limitSec: number
   단일 색상 막대, Y축 정수 눈금, 평균선
══════════════════════════════ */
function renderTimeHistogram(svgId, timesInSec, limitSec) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W = 380, H = 220, padL = 36, padR = 16, padT = 16, padB = 32;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', H);

  const numBins = 10;
  const binSec  = limitSec / numBins;
  const counts  = Array(numBins).fill(0);
  const validTimes = timesInSec.filter(t => t > 0);
  validTimes.forEach(t => {
    const i = Math.min(Math.floor(t / binSec), numBins - 1);
    if (i >= 0) counts[i]++;
  });
  const maxC = Math.max(...counts, 1);
  const yMax = maxC + 1;
  const bW   = (W - padL - padR) / numBins;
  const cH   = H - padT - padB;
  const sy   = c => padT + cH - (c / yMax) * cH;

  // 구간 경계 분 단위
  const binMins = Array.from({ length: numBins + 1 }, (_, i) => Math.round(binSec * i / 60));

  // Y축 수평 그리드 + 눈금
  for (let v = 0; v <= maxC; v++) {
    const y = sy(v);
    svg.appendChild(svgEl('line', { x1: padL, y1: y, x2: W - padR, y2: y,
      stroke: v === 0 ? '#D1D5DB' : '#F3F4F6', 'stroke-width': '1' }));
    const t = svgEl('text', { x: padL - 6, y: y, 'text-anchor': 'end', 'dominant-baseline': 'middle',
      'font-size': '10', fill: '#9CA3AF' });
    t.textContent = v; svg.appendChild(t);
  }

  // 막대 (시간대별 단색: 빠를수록 초록 → 느릴수록 빨강)
  counts.forEach((c, i) => {
    if (c === 0) return;
    const x  = padL + i * bW;
    const bH = (c / yMax) * cH;
    const y  = sy(c);
    svg.appendChild(svgEl('rect', { x: x + 3, y, width: bW - 6, height: bH,
      fill: '#1565C0', rx: 4, opacity: '0.82' }));
  });

  // X축 경계 눈금 + 레이블 (짝수 경계만 표시)
  for (let i = 0; i <= numBins; i++) {
    const x = padL + i * bW;
    svg.appendChild(svgEl('line', { x1: x, y1: H - padB, x2: x, y2: H - padB + 4,
      stroke: '#D1D5DB', 'stroke-width': '1' }));
    if (i % 2 === 0) {
      const t = svgEl('text', { x, y: H - 10, 'text-anchor': 'middle',
        'font-size': '9', fill: '#6B7280' });
      t.textContent = binMins[i] + '분'; svg.appendChild(t);
    }
  }

  // KDE 확률 분포 곡선 오버레이
  if (validTimes.length > 1) {
    const bwK = Math.max(limitSec * 0.04, limitSec * 0.09 - validTimes.length * (limitSec * 0.003));
    const nPts = 120;
    const kxs = Array.from({length: nPts}, (_, i) => (i / (nPts - 1)) * limitSec);
    const kys = kxs.map(x => validTimes.reduce((s, v) => { const z = (x-v)/bwK; return s + Math.exp(-0.5*z*z); }, 0));
    const kMax = Math.max(...kys, 0.001);
    const kx = v => padL + (v / limitSec) * (W - padL - padR);
    const ky = d => padT + cH - (d / kMax) * (maxC / yMax) * cH;
    const fpts = kxs.map((x, i) => `${i===0?'M':'L'}${kx(x).toFixed(1)},${ky(kys[i]).toFixed(1)}`).join(' ');
    svg.appendChild(svgEl('path', { d: fpts + ` L${kx(limitSec)},${padT+cH} L${kx(0)},${padT+cH} Z`,
      fill: 'rgba(21,101,192,0.09)', stroke: 'none' }));
    const lpts = kxs.map((x, i) => `${i===0?'M':'L'}${kx(x).toFixed(1)},${ky(kys[i]).toFixed(1)}`).join(' ');
    svg.appendChild(svgEl('path', { d: lpts, fill: 'none', stroke: '#1565C0', 'stroke-width': '2.5',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  }

  // 평균선 — 주황 점선
  if (validTimes.length) {
    const avgSec = validTimes.reduce((s, v) => s + v, 0) / validTimes.length;
    const ax = padL + (avgSec / limitSec) * (W - padL - padR);
    svg.appendChild(svgEl('line', { x1: ax, y1: padT, x2: ax, y2: H - padB,
      stroke: '#F59E0B', 'stroke-width': '2', 'stroke-dasharray': '5,3' }));
    const avgMin = Math.round(avgSec / 60);
    const at = svgEl('text', { x: ax + 4, y: padT + 11, 'font-size': '9', fill: '#F59E0B', 'font-weight': '700' });
    at.textContent = '평균(' + avgMin + '분)'; svg.appendChild(at);
  }
}

/* ══════════════════════════════
   CHART: 시간 버블(스트립) 차트
   items: [{name, timeSec}], limitSec: number
══════════════════════════════ */
function renderTimeBubble(svgId, items, limitSec) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W = 380, H = 170, padL = 40, padR = 16, padT = 20, padB = 36;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', H);

  const cW = W - padL - padR, cH = H - padT - padB;
  const sx = t => padL + (t / limitSec) * cW;
  const valid = items.filter(d => d.timeSec > 0);

  // X축
  svg.appendChild(svgEl('line', { x1: padL, y1: H - padB, x2: W - padR, y2: H - padB, stroke: '#D1D5DB', 'stroke-width': '1' }));
  [0, 0.25, 0.5, 0.75, 1.0].forEach(pct => {
    const x = padL + pct * cW;
    const mins = Math.round(pct * limitSec / 60);
    svg.appendChild(svgEl('line', { x1: x, y1: H - padB, x2: x, y2: H - padB + 4, stroke: '#D1D5DB', 'stroke-width': '1' }));
    const t = svgEl('text', { x, y: H - padB + 14, 'text-anchor': 'middle', 'font-size': '9', fill: '#9CA3AF' });
    t.textContent = mins + '분'; svg.appendChild(t);
  });

  // 버블 (3-레인 스트립)
  const R = 7;
  const sorted = [...valid].sort((a, b) => a.timeSec - b.timeSec);
  const laneY = [0.28, 0.55, 0.78];
  sorted.forEach((item, i) => {
    const cx = sx(item.timeSec);
    const cy = padT + laneY[i % 3] * cH;
    svg.appendChild(svgEl('circle', { cx, cy, r: R, fill: '#1565C0', opacity: '0.75',
      stroke: 'white', 'stroke-width': '1.5' }));
  });

  // 평균선
  if (valid.length) {
    const avgSec = valid.reduce((s, d) => s + d.timeSec, 0) / valid.length;
    const ax = sx(avgSec);
    svg.appendChild(svgEl('line', { x1: ax, y1: padT, x2: ax, y2: H - padB,
      stroke: '#F59E0B', 'stroke-width': '1.8', 'stroke-dasharray': '5,3' }));
    const at = svgEl('text', { x: ax + 3, y: padT + 18, 'font-size': '8.5', fill: '#F59E0B', 'font-weight': '700' });
    at.textContent = '평균(' + Math.round(avgSec / 60) + '분)'; svg.appendChild(at);
  }
}

/* ══════════════════════════════
   CHART: 시간 구간 도넛 차트
   items: [{name, timeSec}], limitSec: number
══════════════════════════════ */
function renderTimeZoneDonut(svgId, items, limitSec) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W = 380, H = 170;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', H);

  const cx = 85, cy = 83, R = 58, sw = 22;
  const zones = [
    { from: 0,    to: 0.40, color: '#1565C0' },
    { from: 0.40, to: 0.70, color: '#7C3AED' },
    { from: 0.70, to: 0.90, color: '#0D9488' },
    { from: 0.90, to: 1.01, color: '#6B7280' },
  ];

  const valid = items.filter(d => d.timeSec > 0);
  const total = valid.length || 1;
  const counts = zones.map(z =>
    valid.filter(d => { const p = d.timeSec / limitSec; return p >= z.from && p < z.to; }).length
  );

  // 배경 링 (비어있는 회색)
  const circ = 2 * Math.PI * R;
  svg.appendChild(svgEl('circle', { cx, cy, r: R, fill: 'none', stroke: '#F3F4F6', 'stroke-width': sw }));

  // 세그먼트
  let cumDash = 0;
  counts.forEach((c, i) => {
    if (c === 0) { cumDash += (c / total) * circ; return; }
    const segLen = (c / total) * circ;
    const gap = circ - segLen;
    const dashOffset = circ / 4 - cumDash;
    svg.appendChild(svgEl('circle', { cx, cy, r: R, fill: 'none',
      stroke: zones[i].color, 'stroke-width': sw,
      'stroke-dasharray': `${segLen - 2} ${gap + 2}`,
      'stroke-dashoffset': dashOffset }));
    cumDash += segLen;
  });

  // 중앙 텍스트 (평균 소요시간)
  const avgSec = valid.length ? valid.reduce((s, d) => s + d.timeSec, 0) / valid.length : 0;
  const avgMin = Math.floor(avgSec / 60), avgS = Math.round(avgSec % 60);
  const ct = svgEl('text', { x: cx, y: cy - 7, 'text-anchor': 'middle',
    'font-size': '13', fill: '#111827', 'font-weight': '800' });
  ct.textContent = `${avgMin}:${String(avgS).padStart(2, '0')}`; svg.appendChild(ct);
  const cs = svgEl('text', { x: cx, y: cy + 9, 'text-anchor': 'middle',
    'font-size': '8.5', fill: '#6B7280' });
  cs.textContent = '평균 소요시간'; svg.appendChild(cs);
  const cn = svgEl('text', { x: cx, y: cy + 22, 'text-anchor': 'middle',
    'font-size': '8', fill: '#9CA3AF' });
  cn.textContent = `(${valid.length}명)`; svg.appendChild(cn);

  // 범례 (오른쪽) — 실제 시간 범위만
  const legX = 182, legGap = 36;
  zones.forEach((z, i) => {
    const y = 22 + i * legGap;
    svg.appendChild(svgEl('rect', { x: legX, y: y, width: 13, height: 13, rx: 3, fill: z.color }));

    const fromMin = Math.round(z.from * limitSec / 60);
    const toMin   = Math.round(Math.min(z.to, 1) * limitSec / 60);
    const rangeStr = z.from === 0 ? `~${toMin}분` : `${fromMin}~${toMin}분`;

    const rng = svgEl('text', { x: legX + 19, y: y + 9, 'dominant-baseline': 'middle',
      'font-size': '10', fill: '#374151', 'font-weight': '600' });
    rng.textContent = rangeStr; svg.appendChild(rng);

    const pct = Math.round(counts[i] / total * 100);
    const cnt = svgEl('text', { x: W - 12, y: y + 9, 'text-anchor': 'end', 'dominant-baseline': 'middle',
      'font-size': '10', fill: zones[i].color, 'font-weight': '700' });
    cnt.textContent = `${counts[i]}명  ${pct}%`; svg.appendChild(cnt);
  });
}

/* ══════════════════════════════
   CHART: 소요시간 롤리팝 차트
   items: [{name, timeSec}], limitSec: number
══════════════════════════════ */
function renderTimeLollipop(svgId, items, limitSec) {
  const svg = clearSvg(svgId); if (!svg) return;
  const valid = [...items.filter(d => d.timeSec > 0)].sort((a, b) => a.timeSec - b.timeSec);
  if (!valid.length) return;

  const n = valid.length;
  const rowH = 28, padL = 92, padR = 54, padT = 12, padB = 28;
  const W = 380, H = n * rowH + padT + padB;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', Math.min(H, 400));

  const cW = W - padL - padR;
  const sx = t => padL + (t / limitSec) * cW;

  // 배경 구간
  [
    { from: 0, to: 0.40, fill: 'rgba(22,163,74,0.05)' },
    { from: 0.40, to: 0.70, fill: 'rgba(245,158,11,0.05)' },
    { from: 0.70, to: 0.90, fill: 'rgba(234,88,12,0.06)' },
    { from: 0.90, to: 1.00, fill: 'rgba(220,38,38,0.07)' },
  ].forEach(z => svg.appendChild(svgEl('rect', {
    x: padL + z.from * cW, y: padT,
    width: (z.to - z.from) * cW, height: n * rowH, fill: z.fill,
  })));

  // X축 그리드 + 눈금
  [0, 0.25, 0.5, 0.75, 1.0].forEach(pct => {
    const x = padL + pct * cW;
    svg.appendChild(svgEl('line', { x1: x, y1: padT, x2: x, y2: padT + n * rowH,
      stroke: '#E5E7EB', 'stroke-width': '1', 'stroke-dasharray': '3,3' }));
    svg.appendChild(svgEl('line', { x1: x, y1: H - padB, x2: x, y2: H - padB + 4,
      stroke: '#D1D5DB', 'stroke-width': '1' }));
    const t = svgEl('text', { x, y: H - padB + 14, 'text-anchor': 'middle', 'font-size': '9', fill: '#9CA3AF' });
    t.textContent = Math.round(pct * limitSec / 60) + '분'; svg.appendChild(t);
  });
  svg.appendChild(svgEl('line', { x1: padL, y1: H - padB, x2: W - padR, y2: H - padB, stroke: '#D1D5DB', 'stroke-width': '1' }));

  // 평균선
  const avgSec = valid.reduce((s, d) => s + d.timeSec, 0) / valid.length;
  const ax = sx(avgSec);
  svg.appendChild(svgEl('line', { x1: ax, y1: padT, x2: ax, y2: H - padB,
    stroke: '#F59E0B', 'stroke-width': '1.5', 'stroke-dasharray': '4,3' }));

  // 롤리팝
  valid.forEach((item, i) => {
    const cy = padT + i * rowH + rowH / 2;
    const cx = sx(item.timeSec);
    const pct = item.timeSec / limitSec;
    const col = pct < 0.4 ? '#16A34A' : pct < 0.7 ? '#D97706' : pct < 0.9 ? '#EA580C' : '#DC2626';

    // 이름 (왼쪽)
    const nl = svgEl('text', { x: padL - 8, y: cy + 1, 'text-anchor': 'end', 'dominant-baseline': 'middle',
      'font-size': '9', fill: '#374151' });
    nl.textContent = item.name.length > 8 ? item.name.slice(0, 7) + '…' : item.name;
    svg.appendChild(nl);

    // 줄기
    svg.appendChild(svgEl('line', { x1: padL, y1: cy, x2: cx, y2: cy,
      stroke: col, 'stroke-width': '1.5', opacity: '0.45' }));
    // 점
    svg.appendChild(svgEl('circle', { cx, cy, r: 5.5, fill: col, stroke: 'white', 'stroke-width': '1.5' }));

    // 시간 레이블 (오른쪽)
    const m = Math.floor(item.timeSec / 60), s2 = Math.round(item.timeSec % 60);
    const tl = svgEl('text', { x: cx + 9, y: cy + 1, 'dominant-baseline': 'middle',
      'font-size': '8.5', fill: col, 'font-weight': '700' });
    tl.textContent = `${m}:${String(s2).padStart(2, '0')}`; svg.appendChild(tl);
  });
}

/* ══════════════════════════════
   CHART: 소요시간 vs 점수 산점도
   items: [{name, timeSec, score}], limitSec: number
══════════════════════════════ */
function renderTimeScatter(svgId, items, limitSec) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W = 380, H = 220, padL = 36, padR = 16, padT = 16, padB = 32;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', H);

  const valid = items.filter(d => d.timeSec > 0 && d.score != null);
  if (!valid.length) return;

  const cW = W - padL - padR, cH = H - padT - padB;
  const sx = t => padL + (t / limitSec) * cW;
  const sy = s => padT + cH - (s / 100) * cH;


  // Y축 그리드 + 눈금
  [0, 25, 50, 75, 100].forEach(s => {
    const y = sy(s);
    svg.appendChild(svgEl('line', { x1: padL, y1: y, x2: W - padR, y2: y,
      stroke: s === 0 ? '#D1D5DB' : '#F3F4F6', 'stroke-width': '1' }));
    const t = svgEl('text', { x: padL - 5, y, 'text-anchor': 'end', 'dominant-baseline': 'middle',
      'font-size': '9', fill: '#9CA3AF' });
    t.textContent = s; svg.appendChild(t);
  });

  // X축
  svg.appendChild(svgEl('line', { x1: padL, y1: H - padB, x2: W - padR, y2: H - padB, stroke: '#D1D5DB', 'stroke-width': '1' }));
  [0, 0.25, 0.5, 0.75, 1.0].forEach(pct => {
    const x = padL + pct * cW;
    svg.appendChild(svgEl('line', { x1: x, y1: H - padB, x2: x, y2: H - padB + 4, stroke: '#D1D5DB', 'stroke-width': '1' }));
    const t = svgEl('text', { x, y: H - padB + 13, 'text-anchor': 'middle', 'font-size': '9', fill: '#9CA3AF' });
    t.textContent = Math.round(pct * limitSec / 60) + '분'; svg.appendChild(t);
  });


  // 평균 소요시간 선
  const avgSec = valid.reduce((s, d) => s + d.timeSec, 0) / valid.length;
  svg.appendChild(svgEl('line', { x1: sx(avgSec), y1: padT, x2: sx(avgSec), y2: H - padB,
    stroke: '#F59E0B', 'stroke-width': '1.5', 'stroke-dasharray': '4,3' }));
  const at = svgEl('text', { x: sx(avgSec) + 3, y: padT + 11, 'font-size': '8', fill: '#F59E0B', 'font-weight': '700' });
  at.textContent = '평균(' + Math.round(avgSec / 60) + '분)'; svg.appendChild(at);

  // Y축 레이블
  const yl = svgEl('text', { x: 10, y: padT + cH / 2, 'text-anchor': 'middle',
    'font-size': '8.5', fill: '#9CA3AF', transform: `rotate(-90,10,${padT + cH / 2})` });
  yl.textContent = '점수'; svg.appendChild(yl);

  // 점
  valid.forEach(item => {
    const cx = sx(item.timeSec), cy2 = sy(item.score);
    const col = item.score >= 80 ? '#16A34A' : '#DC2626';
    svg.appendChild(svgEl('circle', { cx, cy: cy2, r: 6, fill: col, opacity: '0.80',
      stroke: 'white', 'stroke-width': '1.5' }));
  });
}

/* ══════════════════════════════
   CHART: TIME HEATMAP (소요시간 × 점수 구간 밀도)
   items: [{timeSec, score}], limitSec: number
══════════════════════════════ */
function renderTimeHeatmap(svgId, items, limitSec) {
  const svg = clearSvg(svgId); if (!svg) return;
  const W = 420, H = 220, padL = 42, padR = 90, padT = 20, padB = 36;
  svg.setAttribute('width', W); svg.setAttribute('height', H);
  const valid = items.filter(d => d.timeSec != null && d.score != null);
  if (!valid.length) return;

  const xBins = 8, yBins = 5;
  const xStep = limitSec / xBins;
  const yRanges = [[0,20],[20,40],[40,60],[60,80],[80,100]];

  // 셀 카운트
  const grid = Array.from({length: yBins}, () => Array(xBins).fill(0));
  valid.forEach(({ timeSec, score }) => {
    const xi = Math.min(Math.floor(timeSec / xStep), xBins - 1);
    const yi = score === 100 ? yBins - 1 : yRanges.findIndex(([lo, hi]) => score >= lo && score < hi);
    if (xi >= 0 && yi >= 0) grid[yi][xi]++;
  });
  const maxCount = Math.max(...grid.flat(), 1);

  const cW = W - padL - padR, cH = H - padT - padB;
  const cellW = cW / xBins, cellH = cH / yBins;

  // 셀 렌더 (숫자 없음)
  grid.forEach((row, yi) => {
    row.forEach((count, xi) => {
      const x = padL + xi * cellW;
      const y = padT + (yBins - 1 - yi) * cellH;
      const intensity = count / maxCount;
      const isPass = yRanges[yi][0] >= 80;
      const baseR = isPass ? 22 : 21, baseG = isPass ? 163 : 101, baseB = isPass ? 74 : 192;
      const alpha = count === 0 ? 0.04 : 0.08 + intensity * 0.72;
      svg.appendChild(svgEl('rect', { x: x+1, y: y+1, width: cellW-2, height: cellH-2,
        fill: `rgba(${baseR},${baseG},${baseB},${alpha.toFixed(2)})`, rx: 3 }));
    });
  });

  // 격자선
  for (let xi = 0; xi <= xBins; xi++) {
    const x = padL + xi * cellW;
    svg.appendChild(svgEl('line', { x1:x, y1:padT, x2:x, y2:H-padB, stroke:'#E5E7EB', 'stroke-width':'1' }));
  }
  for (let yi = 0; yi <= yBins; yi++) {
    const y = padT + yi * cellH;
    svg.appendChild(svgEl('line', { x1:padL, y1:y, x2:padL+cW, y2:y, stroke:'#E5E7EB', 'stroke-width':'1' }));
  }

  // 합격선 (80점) 강조
  const passY = padT + (yBins - yRanges.findIndex(([lo])=>lo>=80)) * cellH;
  svg.appendChild(svgEl('line', { x1:padL, y1:passY, x2:padL+cW, y2:passY,
    stroke:'#16A34A', 'stroke-width':'1.8', 'stroke-dasharray':'4,3' }));

  // X축 레이블
  const toMin = s => Math.round(s/60);
  for (let xi = 0; xi <= xBins; xi++) {
    const x = padL + xi * cellW;
    const t = svgEl('text', { x, y: H-padB+12, 'text-anchor':'middle', 'font-size':'9', fill:'#6B7280' });
    t.textContent = toMin(xi * xStep) + '분'; svg.appendChild(t);
  }

  // Y축 레이블
  yRanges.forEach(([lo, hi], yi) => {
    const y = padT + (yBins - 1 - yi) * cellH + cellH/2;
    const t = svgEl('text', { x: padL-6, y, 'text-anchor':'end', 'dominant-baseline':'middle', 'font-size':'9', fill:'#6B7280' });
    t.textContent = `${lo}~${hi}`; svg.appendChild(t);
  });

  // 축 레이블
  const xl = svgEl('text', { x: padL + cW/2, y: H-2, 'text-anchor':'middle', 'font-size':'9', fill:'#9CA3AF' });
  xl.textContent = '소요시간'; svg.appendChild(xl);
  const yl = svgEl('text', { x: 8, y: padT + cH/2, 'text-anchor':'middle', 'dominant-baseline':'middle',
    'font-size':'9', fill:'#9CA3AF', transform:`rotate(-90,8,${padT+cH/2})` });
  yl.textContent = '점수'; svg.appendChild(yl);

  // 오른쪽 범례
  const lx = padL + cW + 12;

  // 색상 구분 범례
  const categories = [
    { label: '합격 구간', r:22, g:163, b:74 },
    { label: '불합격 구간', r:21, g:101, b:192 },
  ];
  categories.forEach(({ label, r, g, b }, i) => {
    const ly = padT + i * 22;
    svg.appendChild(svgEl('rect', { x: lx, y: ly, width: 12, height: 12,
      fill: `rgba(${r},${g},${b},0.65)`, rx: 2 }));
    const t = svgEl('text', { x: lx+16, y: ly+6, 'dominant-baseline':'middle', 'font-size':'9', fill:'#374151' });
    t.textContent = label; svg.appendChild(t);
  });

  // 밀도 그라디언트 범례 (합격 / 불합격 각각)
  const gradY = padT + 54, gradH = (cH - 54) / 2 - 6, gradW = 10;
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  const gradConfigs = [
    { id: svgId+'-grad-pass', darkColor: 'rgba(22,163,74,0.80)',  label: '합격',   offsetY: 0 },
    { id: svgId+'-grad-fail', darkColor: 'rgba(21,101,192,0.80)', label: '불합격', offsetY: gradH + 14 },
  ];

  gradConfigs.forEach(({ id, darkColor, label, offsetY }) => {
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', id);
    grad.setAttribute('x1','0'); grad.setAttribute('y1','1');
    grad.setAttribute('x2','0'); grad.setAttribute('y2','0');
    [['0%','rgba(100,100,100,0.06)'],['100%', darkColor]].forEach(([offset, color]) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset); stop.setAttribute('stop-color', color);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);

    const gy = gradY + offsetY;
    svg.appendChild(svgEl('rect', { x: lx, y: gy, width: gradW, height: gradH,
      fill: `url(#${id})`, rx: 2 }));
    svg.appendChild(svgEl('rect', { x: lx, y: gy, width: gradW, height: gradH,
      fill: 'none', stroke: '#E5E7EB', 'stroke-width': '0.8', rx: 2 }));

    const tTop = svgEl('text', { x: lx+gradW+4, y: gy, 'dominant-baseline':'middle', 'font-size':'8', fill:'#6B7280' });
    tTop.textContent = '많음'; svg.appendChild(tTop);
    const tBot = svgEl('text', { x: lx+gradW+4, y: gy+gradH, 'dominant-baseline':'middle', 'font-size':'8', fill:'#6B7280' });
    tBot.textContent = '적음'; svg.appendChild(tBot);
    const tLbl = svgEl('text', { x: lx+gradW+4, y: gy+gradH/2, 'dominant-baseline':'middle', 'font-size':'8', fill:'#9CA3AF' });
    tLbl.textContent = label; svg.appendChild(tLbl);
  });

  defs.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'desc')); // flush
  svg.appendChild(defs);
}

/* ══════════════════════════════
   CHART: DUAL RADAR (나 vs 전체 평균)
   labels: string[], meVals: number[], avgVals: number[], color: string
   tooltipId: 툴팁 div id
══════════════════════════════ */
function renderDualRadar(svgId, labels, meVals, avgVals, color, tooltipId) {
  const svg = document.getElementById(svgId); if (!svg) return;
  svg.innerHTML = '';
  svg.setAttribute('overflow', 'visible');
  const n = labels.length;
  const W = parseInt(svg.getAttribute('width') || '240');
  const H = parseInt(svg.getAttribute('height') || '240');
  const cx = W / 2, cy = H / 2;
  const R = Math.min(cx, cy) - 62;
  const step = (2 * Math.PI) / n;
  const start = -Math.PI / 2;

  function pt(i, pct) {
    const a = start + i * step;
    const r = R * Math.max(0, pct) / 100;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  // 격자
  [20, 40, 60, 80, 100].forEach((pct, idx) => {
    const pts = Array.from({length: n}, (_, i) => pt(i, pct).join(',')).join(' ');
    svg.appendChild(svgEl('polygon', { points: pts,
      fill: idx % 2 === 0 ? '#F8FAFD' : 'none', stroke: '#E5E7EB', 'stroke-width': '1' }));
  });

  // 축선
  labels.forEach((_, i) => {
    const [x, y] = pt(i, 100);
    svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: x, y2: y, stroke: '#DDE3EF', 'stroke-width': '1' }));
  });

  // 전체 평균 폴리곤 (옅은색, 점선)
  const avgPts = avgVals.map((v, i) => pt(i, v).join(',')).join(' ');
  svg.appendChild(svgEl('polygon', { points: avgPts,
    fill: 'rgba(203,213,225,0.25)', stroke: '#94A3B8', 'stroke-width': '1.5', 'stroke-dasharray': '4,3' }));

  // 내 폴리곤 (짙은색)
  const mePts = meVals.map((v, i) => pt(i, v).join(',')).join(' ');
  svg.appendChild(svgEl('polygon', { points: mePts,
    fill: hexAlpha(color, 0.18), stroke: color, 'stroke-width': '2.2' }));

  // 라벨 + 점
  const tip = tooltipId ? document.getElementById(tooltipId) : null;

  labels.forEach((lbl, i) => {
    const a = start + i * step;
    const lx = cx + (R + 22) * Math.cos(a);
    const ly = cy + (R + 22) * Math.sin(a);
    const anchor = Math.abs(Math.cos(a)) < 0.15 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';

    // 공백 기준으로 두 줄 분리, 없으면 중간에서 분리
    let lines;
    const spaceIdx = lbl.indexOf(' ');
    if (lbl.length <= 8) {
      lines = [lbl];
    } else if (spaceIdx > 0 && spaceIdx < lbl.length - 1) {
      lines = [lbl.slice(0, spaceIdx), lbl.slice(spaceIdx + 1)];
    } else {
      const mid = Math.ceil(lbl.length / 2);
      lines = [lbl.slice(0, mid), lbl.slice(mid)];
    }

    const lineH = 12;
    const totalH = lines.length * lineH;
    const t = svgEl('text', { x: lx, y: ly - totalH / 2 + 4, 'text-anchor': anchor,
      'font-size': '10', fill: '#374151', 'font-weight': '600', style: 'cursor:pointer; user-select:none;' });

    lines.forEach((line, li) => {
      const ts = svgEl('tspan', { x: lx, dy: li === 0 ? '0' : `${lineH}` });
      ts.textContent = line;
      t.appendChild(ts);
    });

    t.addEventListener('mouseenter', () => {
      if (tip) {
        tip.innerHTML = `<strong>${lbl}</strong><br>나&nbsp;${meVals[i]}%&nbsp;&nbsp;|&nbsp;&nbsp;전체 평균&nbsp;${avgVals[i]}%`;
        tip.style.display = 'block';
      }
    });
    t.addEventListener('mouseleave', () => { if (tip) tip.style.display = 'none'; });
    svg.appendChild(t);
  });

  // 점 (dot only, 히트 영역 제거)
  labels.forEach((lbl, i) => {
    const [mx, my] = pt(i, meVals[i]);
    const [ax, ay] = pt(i, avgVals[i]);
    svg.appendChild(svgEl('circle', { cx: ax, cy: ay, r: '3.5', fill: '#94A3B8', stroke: 'white', 'stroke-width': '1.5' }));
    svg.appendChild(svgEl('circle', { cx: mx, cy: my, r: '4.5', fill: color, stroke: 'white', 'stroke-width': '2' }));
  });
}
