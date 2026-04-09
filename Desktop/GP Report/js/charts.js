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
  const W=360, H=parseInt(svg.getAttribute('height')||'120'),
        padL=28, padR=6, padT=14, padB=24;
  const xMin=30, xMax=102, nPts=120;
  const bw = Math.max(7, 10 - scores.length * 0.3); // adaptive bandwidth
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


  // Fill area — rgba 직접 사용 (file:// 프로토콜에서도 안전하게 동작)
  const fillD = [`M${sx(xs[0])},${sy(0)}`];
  xs.forEach((x,i) => fillD.push(`L${sx(x)},${sy(ys[i])}`));
  fillD.push(`L${sx(xs[nPts-1])},${sy(0)} Z`);
  svg.appendChild(svgEl('path', {d:fillD.join(' '), fill:hexAlpha(col||'#1565C0', 0.15), stroke:'none'}));

  // Curve
  const lineD = xs.map((x,i) => `${i===0?'M':'L'}${sx(x).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join(' ');
  svg.appendChild(svgEl('path', {d:lineD, fill:'none', stroke:col, 'stroke-width':'2.5',
    'stroke-linecap':'round', 'stroke-linejoin':'round'}));

  // X축 선 + 눈금 + 레이블
  svg.appendChild(svgEl('line', {x1:padL, y1:H-padB, x2:W-padR, y2:H-padB, stroke:'#E5E7EB', 'stroke-width':'1'}));
  [40,50,60,70,80,90,100].forEach(v => {
    svg.appendChild(svgEl('line', {x1:sx(v), y1:H-padB, x2:sx(v), y2:H-padB+3, stroke:'#D1D5DB','stroke-width':'1'}));
    const t = svgEl('text', {x:sx(v), y:H-6, 'text-anchor':'middle', 'font-size':'8.5', fill:'#9CA3AF'});
    t.textContent = v; svg.appendChild(t);
  });

  // Avg line
  if (avgVal != null) {
    const ax = sx(avgVal);
    svg.appendChild(svgEl('line', {x1:ax, y1:padT, x2:ax, y2:H-padB, stroke:'#1565C0','stroke-width':'1.5','stroke-dasharray':'4,3'}));
    const at = svgEl('text', {x:ax+3, y:padT+9, 'font-size':'8','fill':'#1565C0','font-weight':'700'});
    at.textContent='평균 '+avgVal; svg.appendChild(at);
  }
  // Median line
  if (medVal != null && Math.abs(sx(medVal)-sx(avgVal)) > 4) {
    const mx = sx(medVal);
    svg.appendChild(svgEl('line', {x1:mx, y1:padT, x2:mx, y2:H-padB, stroke:'#7C3AED','stroke-width':'1.5','stroke-dasharray':'4,3'}));
    const mt = svgEl('text', {x:mx+3, y:padT+18, 'font-size':'8','fill':'#7C3AED','font-weight':'700'});
    mt.textContent='중앙 '+medVal; svg.appendChild(mt);
  } else if (medVal != null) {
    const mx = sx(medVal);
    const mt = svgEl('text', {x:mx-3, y:padT+18, 'text-anchor':'end','font-size':'8','fill':'#7C3AED','font-weight':'700'});
    mt.textContent='중앙 '+medVal; svg.appendChild(mt);
  }
  // Personal marker
  if (markerScore != null) {
    const px = sx(markerScore);
    svg.appendChild(svgEl('line', {x1:px, y1:padT, x2:px, y2:H-padB, stroke:'#DC2626','stroke-width':'2'}));
    const pt2 = svgEl('text', {x:px, y:padT+5, 'text-anchor':'middle','font-size':'8','fill':'#DC2626','font-weight':'700'});
    pt2.textContent='나'; svg.appendChild(pt2);
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
