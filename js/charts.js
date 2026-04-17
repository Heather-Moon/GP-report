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

  // 점수 구간 배경 (불합격: 좌측 끝~80점 / 합격: 80점~우측 끝)
  svg.appendChild(svgEl('rect', { x:padL,   y:padT, width:sx(80)-padL,   height:cH, fill:'rgba(220,38,38,0.07)'  }));
  svg.appendChild(svgEl('rect', { x:sx(80), y:padT, width:W-padR-sx(80), height:cH, fill:'rgba(22,163,74,0.08)'  }));

  // 구간 레이블 — 차트 중간 높이에 배치
  const midY = padT + cH * 0.72;
  [
    ['불합격', sx(40), 'rgba(220,38,38,0.45)'],
    ['합격',   sx(90), 'rgba(22,163,74,0.55)'],
  ].forEach(([lbl, xv, fill]) => {
    const t = svgEl('text', {x:xv, y:midY, 'text-anchor':'middle',
      'font-size':'13', fill, 'font-weight':'700', 'letter-spacing':'1'});
    t.textContent = lbl; svg.appendChild(t);
  });

  // 합격선 (80점) — 초록 실선
  const passX = sx(80);
  svg.appendChild(svgEl('line', {x1:passX, y1:padT, x2:passX, y2:H-padB,
    stroke:'#16A34A', 'stroke-width':'2'}));

  // X축
  svg.appendChild(svgEl('line', {x1:padL, y1:H-padB, x2:W-padR, y2:H-padB, stroke:'#D1D5DB','stroke-width':'1'}));
  [0,20,40,60,80,100].forEach(v => {
    const isMark = v === 80;
    svg.appendChild(svgEl('line', {x1:sx(v), y1:H-padB, x2:sx(v), y2:H-padB+4, stroke: isMark ? '#9CA3AF' : '#D1D5DB','stroke-width': isMark ? '2' : '1'}));
    const t = svgEl('text', {x:sx(v), y:H-7, 'text-anchor':'middle', 'font-size':'11',
      fill: isMark ? '#6B7280' : '#9CA3AF', 'font-weight': isMark ? '700' : '500'});
    t.textContent = v; svg.appendChild(t);
  });

  // 채움 영역
  const fillD = [`M${sx(xs[0])},${sy(0)}`];
  xs.forEach((x,i) => fillD.push(`L${sx(x)},${sy(ys[i])}`));
  fillD.push(`L${sx(xs[nPts-1])},${sy(0)} Z`);
  svg.appendChild(svgEl('path', {d:fillD.join(' '), fill:hexAlpha(col, 0.22), stroke:'none'}));

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
  const W = 380, H = 170, padL = 36, padR = 16, padT = 16, padB = 32;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', H);

  const bins   = [0, 20, 40, 60, 80, 100];
  const nBins  = bins.length - 1;
  const counts = Array(nBins).fill(0);
  scores.forEach(s => {
    const i = Math.min(Math.floor(s / 20), nBins - 1);
    if (i >= 0) counts[i]++;
  });
  const maxC = Math.max(...counts, 1);
  // Y축 최대값: maxC보다 1 크게 (여백)
  const yMax = maxC + 1;
  const bW   = (W - padL - padR) / nBins;
  const cH   = H - padT - padB;
  const sx   = v => padL + (v / 100) * (W - padL - padR);
  const sy   = c => padT + cH - (c / yMax) * cH;

  // 합격/불합격 배경 (연하게)
  svg.appendChild(svgEl('rect', { x: padL, y: padT, width: sx(80) - padL, height: cH, fill: 'rgba(0,0,0,0.025)' }));
  svg.appendChild(svgEl('rect', { x: sx(80), y: padT, width: W - padR - sx(80), height: cH, fill: 'rgba(22,163,74,0.04)' }));

  // Y축 수평 그리드 + 눈금
  for (let v = 0; v <= maxC; v++) {
    const y = sy(v);
    svg.appendChild(svgEl('line', { x1: padL, y1: y, x2: W - padR, y2: y,
      stroke: v === 0 ? '#D1D5DB' : '#F3F4F6', 'stroke-width': v === 0 ? '1' : '1' }));
    const t = svgEl('text', { x: padL - 6, y: y, 'text-anchor': 'end', 'dominant-baseline': 'middle',
      'font-size': '10', fill: '#9CA3AF' });
    t.textContent = v;
    svg.appendChild(t);
  }

  // 막대 (단일 색상)
  counts.forEach((c, i) => {
    if (c === 0) return;
    const x  = padL + i * bW;
    const bH = (c / yMax) * cH;
    const y  = sy(c);
    svg.appendChild(svgEl('rect', { x: x + 3, y, width: bW - 6, height: bH,
      fill: '#1565C0', rx: 4, opacity: '0.82' }));
  });

  // X축 구간 레이블 (막대 하단 중앙)
  counts.forEach((_, i) => {
    const x   = padL + i * bW + bW / 2;
    const lbl = bins[i] + '~' + bins[i + 1];
    const t   = svgEl('text', { x, y: H - 10, 'text-anchor': 'middle',
      'font-size': '10', fill: '#6B7280' });
    t.textContent = lbl;
    svg.appendChild(t);
    // 구간 경계 눈금
    svg.appendChild(svgEl('line', { x1: padL + i * bW, y1: H - padB, x2: padL + i * bW, y2: H - padB + 4,
      stroke: '#D1D5DB', 'stroke-width': '1' }));
  });
  svg.appendChild(svgEl('line', { x1: W - padR, y1: H - padB, x2: W - padR, y2: H - padB + 4,
    stroke: '#D1D5DB', 'stroke-width': '1' }));

  // 합격선 (80점) — 초록 실선 + 레이블
  const passX = sx(80);
  svg.appendChild(svgEl('line', { x1: passX, y1: padT, x2: passX, y2: H - padB,
    stroke: '#16A34A', 'stroke-width': '2' }));
  const pt = svgEl('text', { x: passX + 4, y: padT + 11, 'font-size': '9', fill: '#16A34A', 'font-weight': '700' });
  pt.textContent = '합격선'; svg.appendChild(pt);

  // 평균선 — 주황 점선 + 레이블
  if (avgVal != null) {
    const ax = sx(avgVal);
    svg.appendChild(svgEl('line', { x1: ax, y1: padT, x2: ax, y2: H - padB,
      stroke: '#F59E0B', 'stroke-width': '2', 'stroke-dasharray': '5,3' }));
    const at = svgEl('text', { x: ax + 4, y: padT + 23, 'font-size': '9', fill: '#F59E0B', 'font-weight': '700' });
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
  const W = 380, H = 170, padL = 36, padR = 16, padT = 16, padB = 32;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('height', H);

  const numBins = 5;
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
    t.textContent = v;
    svg.appendChild(t);
  }

  // 막대 (단일 색상)
  counts.forEach((c, i) => {
    if (c === 0) return;
    const x  = padL + i * bW;
    const bH = (c / yMax) * cH;
    const y  = sy(c);
    svg.appendChild(svgEl('rect', { x: x + 3, y, width: bW - 6, height: bH,
      fill: '#1565C0', rx: 4, opacity: '0.82' }));
  });

  // X축 구간 레이블
  counts.forEach((_, i) => {
    const x   = padL + i * bW + bW / 2;
    const lo  = binMins[i], hi = binMins[i + 1];
    const lbl = lo + '~' + hi + '분';
    const t   = svgEl('text', { x, y: H - 10, 'text-anchor': 'middle',
      'font-size': '10', fill: '#6B7280' });
    t.textContent = lbl;
    svg.appendChild(t);
    svg.appendChild(svgEl('line', { x1: padL + i * bW, y1: H - padB, x2: padL + i * bW, y2: H - padB + 4,
      stroke: '#D1D5DB', 'stroke-width': '1' }));
  });
  svg.appendChild(svgEl('line', { x1: W - padR, y1: H - padB, x2: W - padR, y2: H - padB + 4,
    stroke: '#D1D5DB', 'stroke-width': '1' }));

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
