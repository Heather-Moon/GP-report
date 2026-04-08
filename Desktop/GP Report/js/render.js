/* ══════════════════════════════
   STATS HELPERS
══════════════════════════════ */
function computeStats() {
  const scores = EXAMINEES.filter(e => e.status === 'completed').map(e => e.totalScore).sort((a,b) => a-b);
  const n = scores.length;
  if (!n) return null;
  const avg = scores.reduce((s,v) => s+v,0) / n;
  const median = n % 2 === 0 ? (scores[n/2-1]+scores[n/2])/2 : scores[Math.floor(n/2)];
  const std = Math.sqrt(scores.reduce((s,v) => s+(v-avg)**2,0)/n);
  const q1 = scores[Math.floor(n*0.25)];
  const q3 = scores[Math.floor(n*0.75)];
  return { scores, n, avg: Math.round(avg*10)/10, median, std: Math.round(std*10)/10,
           min: scores[0], max: scores[n-1], q1, q3 };
}

function computeTrackStats() {
  const completed = EXAMINEES.filter(e => e.status === 'completed' && e.tracks.length > 0);
  return TRACKS_META.map((meta, i) => {
    const vals = completed.map(e => e.tracks[i].score);
    const avg = vals.reduce((s,v) => s+v,0) / vals.length;
    const std = Math.sqrt(vals.reduce((s,v) => s+(v-avg)**2,0)/vals.length);
    return { name: meta.name, avg: Math.round(avg*10)/10, std: Math.round(std*10)/10 };
  });
}

function computeSkillAcqRates() {
  // Returns [trackIdx][skillIdx] => rate 0-100
  const completed = EXAMINEES.filter(e => e.status === 'completed' && e.tracks.length > 0);
  return TRACKS_META.map((meta, ti) =>
    meta.skills.map((_, si) => {
      const acq = completed.filter(e => e.tracks[ti].skillLevels[si] === 'acquired').length;
      return Math.round(acq / completed.length * 100);
    })
  );
}

function getPercentile(score, sortedScores) {
  const below = sortedScores.filter(s => s < score).length;
  const pct = Math.round(below / sortedScores.length * 100);
  return `상위 ${100 - pct}%`;
}

function timeToSec(t) {
  if (!t || t === '-') return 0;
  const p = t.split(':').map(Number);
  return (p[0]||0)*3600 + (p[1]||0)*60 + (p[2]||0);
}

/* ══════════════════════════════
   ASSESSMENT GENERATOR
══════════════════════════════ */
function generatePersonAssessment(e) {
  const tracks = buildTracks(e);
  const allSkills = tracks.flatMap(t => t.skills);
  const acq = allSkills.filter(s => s.level === 'acquired').length;
  const total = allSkills.length;
  const rate = Math.round(acq/total*100);
  const completed = EXAMINEES.filter(x => x.status==='completed');
  const avgScore = Math.round(completed.reduce((s,x)=>s+x.totalScore,0)/completed.length);
  const diff = e.totalScore - avgScore;
  const diffStr = diff >= 0 ? `+${diff}점` : `${diff}점`;

  const strongTracks = tracks.filter(t => t.score >= 80);
  const weakTracks   = tracks.filter(t => t.score <  60);

  const text = `${e.name}님은 총 ${total}개 스킬 중 ${acq}개를 획득하여 ${rate}%의 역량 확보율을 기록했습니다. ` +
    `전체 평균 대비 ${diffStr} (평균 ${avgScore}점)으로 ` +
    (diff >= 10 ? '우수한' : diff >= 0 ? '평균 수준의' : '개선이 필요한') +
    ` 성과를 보였습니다.` +
    (strongTracks.length ? ` ${strongTracks.map(t=>t.name).join(', ')} 분야에서 강점을 발휘했습니다.` : '') +
    (weakTracks.length   ? ` ${weakTracks.map(t=>t.name).join(', ')} 분야의 보완이 권장됩니다.` : '');

  const strengths  = strongTracks.map(t => t.name);
  const improvements = weakTracks.map(t => t.name);
  // add missing skills to improvement
  tracks.forEach(t => t.skills.filter(s => s.level === 'missing').forEach(s => {
    if (!improvements.includes(s.name)) improvements.push(s.name);
  }));

  return { text, strengths, improvements: improvements.slice(0,5) };
}

function generateTrackAssessment(e, trackIdx) {
  const t = buildTracks(e)[trackIdx];
  const completed = EXAMINEES.filter(x => x.status==='completed' && x.tracks.length>0);
  const trackScores = completed.map(x => x.tracks[trackIdx].score);
  const avgT = Math.round(trackScores.reduce((s,v)=>s+v,0)/trackScores.length);
  const diff = t.score - avgT;
  const diffStr = diff >= 0 ? `+${diff}점` : `${diff}점`;
  const acq = t.skills.filter(s=>s.level==='acquired').length;
  const total = t.skills.length;

  const strengths    = t.skills.filter(s => s.level === 'acquired').map(s => s.name);
  const improvements = t.skills.filter(s => s.level !== 'acquired').map(s => s.name);

  const text = `${t.name} 평가에서 ${t.score}점을 획득하였으며, ` +
    `전체 평균(${avgT}점) 대비 ${diffStr}을 기록했습니다. ` +
    `총 ${total}개 역량 중 ${acq}개를 획득했습니다(확보율 ${t.rate}%).` +
    (strengths.length    ? ` 강점: ${strengths.slice(0,3).join(', ')}.`    : '') +
    (improvements.length ? ` 보완 필요: ${improvements.slice(0,3).join(', ')}.` : '');

  return { text, strengths: strengths.slice(0,4), improvements: improvements.slice(0,4) };
}

/* ══════════════════════════════
   ASSESSMENT HTML BUILDER
══════════════════════════════ */
function assessmentHTML(assessment) {
  return `<div class="comment-text">${assessment.text}</div>
    ${assessment.strengths.length ? `<div class="tag-section-lbl">✅ 강점</div>
    <div class="tag-group">${assessment.strengths.map(s=>`<span class="tag tag-strength">✔ ${s}</span>`).join('')}</div>` : ''}
    ${assessment.improvements.length ? `<div class="tag-section-lbl" style="margin-top:8px;">📈 개선 필요</div>
    <div class="tag-group">${assessment.improvements.map(s=>`<span class="tag tag-improve">△ ${s}</span>`).join('')}</div>` : ''}`;
}

/* ══════════════════════════════
   INSIGHT STATE
══════════════════════════════ */
let insightTrackIdx = 0;

function setInsightTrack(i) {
  insightTrackIdx = i;
  document.querySelectorAll('.ins-track-tab').forEach((b,j) => b.classList.toggle('active', i===j));
  renderInsightTrackCurve(i);
}

function renderInsightTrackCurve(i) {
  const completed = EXAMINEES.filter(e => e.status==='completed' && e.tracks.length>0);
  const trackScores = completed.map(e => e.tracks[i].score);
  const sorted = [...trackScores].sort((a,b)=>a-b);
  const avg = Math.round(trackScores.reduce((s,v)=>s+v,0)/trackScores.length*10)/10;
  const n = sorted.length;
  const median = n%2===0 ? (sorted[n/2-1]+sorted[n/2])/2 : sorted[Math.floor(n/2)];
  const col = trackColor(avg);
  const short = ['분산 아키텍처','클라우드 컴퓨팅','Python'][i];
  document.getElementById('ins-track-stat-val').innerHTML =
    `<div class="ins-stat"><span class="ins-stat-val" style="color:${col};">${avg}점</span><span class="ins-stat-lbl">${short} 평균</span></div>` +
    `<div class="ins-stat"><span class="ins-stat-val" style="color:#7C3AED;">${median}점</span><span class="ins-stat-lbl">중앙값</span></div>` +
    `<div class="ins-stat"><span class="ins-stat-val">${sorted[0]}~${sorted[n-1]}점</span><span class="ins-stat-lbl">범위</span></div>`;
  renderKDECurve('ins-track-curve', trackScores, avg, median, null, col);
}

function renderSkillDonuts() {
  const completed = EXAMINEES.filter(e => e.status==='completed' && e.tracks.length>0);
  const totalSkills = TRACKS_META.reduce((s,m)=>s+m.skills.length,0);
  let totalAcq=0;
  completed.forEach(e => e.tracks.forEach((t,ti)=>t.skillLevels.forEach(lv=>{if(lv==='acquired')totalAcq++;})));
  const totalPossible = completed.length * totalSkills;

  // Per-track acq count
  const trackDonuts = TRACKS_META.map((meta,ti) => {
    let acq=0;
    completed.forEach(e => e.tracks[ti].skillLevels.forEach(lv=>{if(lv==='acquired')acq++;}));
    const tot = completed.length * meta.skills.length;
    const pct = Math.round(acq/tot*100);
    const avgAcqT = Math.round(acq/completed.length*10)/10;
    return { label: ['분산 아키텍처','클라우드 컴퓨팅','Python'][ti],
      acq, tot, color: trackColor(pct),
      labelInner: `${avgAcqT}/${meta.skills.length}` };
  });

  // 전체 도넛: 인당 평균 획득수 / 전체 스킬수 형식
  const avgAcqPerson = Math.round(totalAcq / completed.length * 10) / 10;
  const allDonuts = [
    { label:'전체', acq:totalAcq, tot:totalPossible, color:'#1565C0',
      labelInner: `${avgAcqPerson}/${totalSkills}` },
    ...trackDonuts
  ];

  document.getElementById('ins-skill-stats').innerHTML = [
    { val: Math.round(totalAcq/totalPossible*100)+'%', lbl: '전체 획득률' },
    { val: Math.round(totalAcq/completed.length*10)/10+'개', lbl: '인당 평균 획득' },
    { val: totalSkills+'개', lbl: '전체 스킬' },
  ].map(s=>`<div class="ins-stat"><span class="ins-stat-val">${s.val}</span><span class="ins-stat-lbl">${s.lbl}</span></div>`).join('');

  const container = document.getElementById('ins-skill-donuts');
  container.innerHTML = allDonuts.map((_,i)=>
    `<div class="donut-item">
      <svg id="ins-donut-${i}" width="90" height="90" viewBox="0 0 90 90"></svg>
      <div class="donut-item-label">${allDonuts[i].label}</div>
    </div>`
  ).join('');

  allDonuts.forEach((d,i) => {
    const svg = document.getElementById(`ins-donut-${i}`);
    const cx=45,cy=45,r=34,sw=13;
    const circ=2*Math.PI*r;
    const pct=d.tot>0?d.acq/d.tot:0;
    svg.appendChild(svgEl('circle',{cx,cy,r,fill:'none',stroke:'#F1F5F9','stroke-width':sw}));
    const arc=svgEl('circle',{cx,cy,r,fill:'none',stroke:d.color,'stroke-width':sw,
      'stroke-dasharray':`${pct*circ} ${(1-pct)*circ}`,
      'stroke-dashoffset':circ/4,'stroke-linecap':'round'});
    svg.appendChild(arc);
    const pv=svgEl('text',{x:cx,y:cy-5,'text-anchor':'middle','dominant-baseline':'middle','font-size':'14','fill':'#111827','font-weight':'900'});
    pv.textContent=Math.round(pct*100)+'%'; svg.appendChild(pv);
    const sv2=svgEl('text',{x:cx,y:cy+11,'text-anchor':'middle','dominant-baseline':'middle','font-size':'8.5','fill':'#6B7280'});
    sv2.textContent= d.labelInner || `${d.acq}/${d.tot}`; svg.appendChild(sv2);
  });
}

/* ══════════════════════════════
   그룹 총평 생성 (메인 페이지용)
══════════════════════════════ */
function generateGroupAssessment() {
  const completed = EXAMINEES.filter(e => e.status === 'completed' && e.tracks.length > 0);
  const stats = computeStats();
  const trackStats = computeTrackStats();
  const skillRates = computeSkillAcqRates();

  // 점수 분포 특성
  const skew = stats.avg > stats.median ? '상위권 집중' : stats.avg < stats.median ? '하위권 집중' : '고른 분포';

  // 과목별 강/약
  const sortedTracks = [...trackStats].sort((a,b) => b.avg - a.avg);
  const strongTracks = trackStats.filter(t => t.avg >= 80).map(t => t.name);
  const weakTracks   = trackStats.filter(t => t.avg <  65).map(t => t.name);

  // 역량별 강/약 (획득률 기준)
  const allSkillRates = TRACKS_META.flatMap((meta, ti) =>
    meta.skills.map((s, si) => ({ name: s.name, rate: skillRates[ti][si] }))
  );
  const strongSkills = allSkillRates.filter(s => s.rate >= 75).map(s => s.name);
  const weakSkills   = allSkillRates.filter(s => s.rate <  40).map(s => s.name);

  const totalSkills = TRACKS_META.reduce((s, m) => s + m.skills.length, 0);
  let totalAcq = 0;
  completed.forEach(e => e.tracks.forEach(t => t.skillLevels.forEach(lv => { if (lv === 'acquired') totalAcq++; })));
  const acqRate = Math.round(totalAcq / (completed.length * totalSkills) * 100);

  const text =
    `전체 ${completed.length}명의 완료 응시자 평가 결과, 평균 ${stats.avg}점(중앙값 ${stats.median}점, 표준편차 σ${stats.std})으로 ${skew} 양상을 보입니다. ` +
    `전체 역량 획득률은 ${acqRate}%이며, 과목별로는 ${sortedTracks.map(t => `${t.name.replace('클라우드 & 분산 시스템 아키텍처','분산 아키텍처')} ${t.avg}점`).join(' / ')} 순입니다. ` +
    (strongTracks.length ? `${strongTracks.join(', ')} 과목에서 전반적으로 높은 성과를 보였습니다. ` : '') +
    (weakTracks.length   ? `${weakTracks.join(', ')} 과목은 전체 평균이 낮아 교육 보완이 권장됩니다. ` : '') +
    (weakSkills.length   ? `특히 ${weakSkills.slice(0, 3).join(', ')} 역량의 획득률이 낮아 집중적인 개선이 필요합니다.` : '');

  return {
    text,
    strengths:    strongSkills.slice(0, 5),
    improvements: weakSkills.slice(0, 5),
  };
}

/* ══════════════════════════════
   RENDER: 메인 인사이트 차트
══════════════════════════════ */
function renderInsightCharts() {
  const stats = computeStats();
  if (!stats) return;

  // ─ 점수 분포 KDE 곡선 ─
  document.getElementById('ins-score-stats').innerHTML = [
    { val: stats.avg+'점', lbl: '평균' },
    { val: stats.median+'점', lbl: '중앙값' },
    { val: stats.min+'~'+stats.max+'점', lbl: '범위' },
    { val: 'σ '+stats.std, lbl: '표준편차' },
  ].map(s=>`<div class="ins-stat"><span class="ins-stat-val">${s.val}</span><span class="ins-stat-lbl">${s.lbl}</span></div>`).join('');
  renderKDECurve('ins-score-curve', stats.scores, stats.avg, stats.median, null, '#1565C0');

  // ─ 과목별 탭 버튼 초기화 ─
  document.getElementById('ins-track-tabs').innerHTML = TRACKS_META.map((m,i)=>
    `<button class="ins-tab-btn ins-track-tab${i===0?' active':''}" onclick="setInsightTrack(${i})">${['분산 아키텍처','클라우드 컴퓨팅','Python'][i]}</button>`
  ).join('');
  renderInsightTrackCurve(0);

  // ─ 역량 획득 도넛 ─
  renderSkillDonuts();

  // ─ 그룹 총평 ─
  const ga = generateGroupAssessment();
  const gaEl = document.getElementById('ins-group-assessment');
  if (gaEl) gaEl.innerHTML = `<div class="comment-text">${ga.text}</div>`;
}

/* ══════════════════════════════
   RENDER: 개인 페이지 추가 섹션
══════════════════════════════ */
function renderPersonSections(e) {
  if (e.status !== 'completed') {
    ['p-track-scores','p-vs-avg','p-assessment'].forEach(id => {
      const el = document.getElementById(id); if (el) el.innerHTML = '';
    });
    document.querySelector('.radar-card') && (document.querySelector('#p-radar').innerHTML = '');
    return;
  }
  const tracks = buildTracks(e);
  const completed = EXAMINEES.filter(x => x.status==='completed');
  const avgScore = completed.reduce((s,x)=>s+x.totalScore,0)/completed.length;

  // 과목별 점수 bars
  document.getElementById('p-track-scores').innerHTML = tracks.map(t => {
    const col = trackColor(t.score);
    return `<div class="track-score-bar">
      <div class="tsb-label">${t.icon} ${t.name}</div>
      <div class="tsb-bar-bg"><div class="tsb-bar-fill" style="width:${t.score}%;background:${col};"></div></div>
      <div class="tsb-val" style="color:${col};">${t.score}<span style="font-size:0.7em;font-weight:500;color:var(--text-mute);">/100</span></div>
    </div>`;
  }).join('');

  // 레이더 (person vs avg)
  const skillRates = computeSkillAcqRates();
  const radarAxes = TRACKS_META.map((meta, ti) => {
    const avgR = Math.round(skillRates[ti].reduce((s,v)=>s+v,0)/skillRates[ti].length);
    return {
      label: meta.name.replace('클라우드 & 분산 시스템 아키텍처','분산 아키텍처').replace('클라우드 컴퓨팅','클라우드').replace('Python','Python'),
      value: e.tracks[ti].rate,
      color: trackColor(e.tracks[ti].score),
    };
  });
  renderRadar('p-radar', radarAxes, '#1565C0', 'p-radar-legend');

  // 전체 평균 대비
  const avgTime  = completed.reduce((s,x)=>s+timeToSec(x.time),0)/completed.length;
  const myTime   = timeToSec(e.time);
  const allSkills = tracks.flatMap(t=>t.skills);
  const myAcq = allSkills.filter(s=>s.level==='acquired').length;
  const avgAcqArr = completed.map(x => {
    if (!x.tracks.length) return 0;
    return buildTracks(x).flatMap(t=>t.skills).filter(s=>s.level==='acquired').length;
  });
  const avgAcq = Math.round(avgAcqArr.reduce((s,v)=>s+v,0)/avgAcqArr.length*10)/10;
  const scoreDiff  = Math.round((e.totalScore - avgScore)*10)/10;
  const timeDiff   = myTime - avgTime;
  const timeDiffStr = (timeDiff >= 0 ? '+' : '') + Math.round(timeDiff/60) + '분';

  document.getElementById('p-vs-avg').innerHTML = `
    <div class="track-score-bar">
      <div class="tsb-label">총점</div>
      <div class="tsb-bar-bg"><div class="tsb-bar-fill" style="width:${e.totalScore}%;background:${trackColor(e.totalScore)};"></div></div>
      <div class="tsb-val" style="color:${trackColor(e.totalScore)};">${e.totalScore}점
        <span style="font-size:0.72em;font-weight:600;color:${scoreDiff>=0?'var(--acquired)':'var(--missing)'};">(${scoreDiff>=0?'+':''}${scoreDiff})</span>
      </div>
    </div>
    <div class="track-score-bar">
      <div class="tsb-label">전체평균 총점</div>
      <div class="tsb-bar-bg"><div class="tsb-bar-fill" style="width:${Math.round(avgScore)}%;background:#CBD5E1;"></div></div>
      <div class="tsb-val" style="color:var(--text-sub);">${Math.round(avgScore)}점</div>
    </div>
    <div style="height:8px;"></div>
    <div style="display:flex;gap:24px;flex-wrap:wrap;">
      <div class="ins-stat">
        <span class="ins-stat-val ${myAcq >= avgAcq ? 'good' : 'warn'}">${myAcq}개</span>
        <span class="ins-stat-lbl">획득 역량 (평균 ${avgAcq}개)</span>
      </div>
      <div class="ins-stat">
        <span class="ins-stat-val ${timeDiff <= 0 ? 'good' : 'warn'}">${e.time}</span>
        <span class="ins-stat-lbl">소요시간 (평균 대비 ${timeDiffStr})</span>
      </div>
    </div>`;

  // 총평
  document.getElementById('p-assessment').innerHTML = assessmentHTML(generatePersonAssessment(e));
}

/* ══════════════════════════════
   RENDER: 메인 통계 (개요 바)
══════════════════════════════ */
function renderMainStats() {
  const total     = EXAMINEES.length;
  const completed = EXAMINEES.filter(e => e.status === 'completed');
  const compRate  = Math.round(completed.length / total * 100);
  const avgRate   = completed.length
    ? Math.round(completed.reduce((s,e) => s + e.rate, 0) / completed.length * 10) / 10
    : 0;

  const totalEl = document.getElementById('main-esi-total');
  if (totalEl) totalEl.innerHTML = `${total}<span style="font-size:0.75em;font-weight:600;color:var(--text-sub);">명</span>`;
  const doneEl = document.getElementById('main-esi-done');
  if (doneEl) doneEl.innerHTML = `${completed.length}<span style="font-size:0.75em;font-weight:600;color:var(--text-sub);">명</span>`;
  const pctEl = document.getElementById('main-esi-rate-pct');
  if (pctEl) pctEl.textContent = `(${compRate}%)`;
  const rateEl = document.getElementById('main-esi-rate');
  if (rateEl) {
    rateEl.innerHTML = `${avgRate}<span style="font-size:0.75em;font-weight:600;">%</span>`;
    rateEl.className = 'esi-val ' + (avgRate >= 80 ? 'good' : avgRate >= 60 ? '' : 'warn');
  }
}

/* ══════════════════════════════
   RENDER: 메인 레이더 차트
══════════════════════════════ */
function renderMainRadar() {
  const completed = EXAMINEES.filter(e => e.status === 'completed' && e.tracks.length > 0);
  if (!completed.length) return;
  const avgRates = TRACKS_META.map((meta, i) => {
    const avg = completed.reduce((s, e) => s + e.tracks[i].rate, 0) / completed.length;
    return {
      label: meta.name.replace('클라우드 & 분산 시스템 아키텍처', '분산 시스템 아키텍처'),
      value: Math.round(avg * 10) / 10,
      color: trackColor(avg),
    };
  });
  renderRadar('main-radar', avgRates, '#1565C0', 'main-radar-legend');
}
