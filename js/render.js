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
    (strongTracks.length ? ` 강점: ${strongTracks.map(t=>t.name).join(', ')}.` : '') +
    (weakTracks.length   ? ` 개선 필요: ${weakTracks.map(t=>t.name).join(', ')}.` : '');

  return { text };
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
  return `<div class="comment-text">${assessment.text}</div>`;
}

/* ══════════════════════════════
   INSIGHT STATE (점수 분포 탭)
══════════════════════════════ */
let scoreTabIdx = 0;

function setScoreTab(i) {
  scoreTabIdx = i;
  document.querySelectorAll('.ins-score-tab').forEach((b,j) => b.classList.toggle('active', i===j));
  renderScoreCurve(i);
}

function renderScoreCurve(i) {
  const statsEl = document.getElementById('ins-score-stats');
  const svg = document.getElementById('ins-score-curve');

  if (i === 0) {
    const stats = computeStats();
    statsEl.innerHTML = [
      { lbl: '평균',    val: stats.avg+'점',              color: '#1565C0' },
      { lbl: '중앙값',  val: stats.median+'점',           color: '#7C3AED' },
      { lbl: '범위',    val: stats.min+'~'+stats.max+'점' },
      { lbl: '표준편차', val: 'σ '+stats.std },
    ].map(s=>`<div class="ins-stat"><span class="ins-stat-lbl">${s.lbl}</span><span class="ins-stat-val"${s.color?' style="color:'+s.color+';"':''}>${s.val}</span></div>`).join('');
    renderMainScoreHistogram('ins-score-curve', stats.scores, stats.avg, null);
  } else {
    const trackIdx = i - 1;
    const completed = EXAMINEES.filter(e => e.status==='completed' && e.tracks.length>0);
    const trackScores = completed.map(e => e.tracks[trackIdx].score);
    const sorted = [...trackScores].sort((a,b)=>a-b);
    const avg = Math.round(trackScores.reduce((s,v)=>s+v,0)/trackScores.length*10)/10;
    const n = sorted.length;
    const median = n%2===0 ? (sorted[n/2-1]+sorted[n/2])/2 : sorted[Math.floor(n/2)];
    const col = trackColor(avg);
    const std = Math.round(Math.sqrt(trackScores.reduce((s,v)=>s+(v-avg)**2,0)/trackScores.length)*10)/10;
    statsEl.innerHTML = [
      { lbl: '평균',    val: avg+'점',                        color: col },
      { lbl: '중앙값',  val: median+'점',                     color: '#7C3AED' },
      { lbl: '범위',    val: sorted[0]+'~'+sorted[n-1]+'점' },
      { lbl: '표준편차', val: 'σ '+std },
    ].map(s=>`<div class="ins-stat"><span class="ins-stat-lbl">${s.lbl}</span><span class="ins-stat-val"${s.color?' style="color:'+s.color+';"':''}>${s.val}</span></div>`).join('');
    renderMainScoreHistogram('ins-score-curve', trackScores, avg, null);
  }
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
      acq, tot, color: TRACK_COLORS[ti],
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
    (i === 1 ? `<div class="donut-separator"></div>` : '') +
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
   소요시간 분포 렌더
══════════════════════════════ */
let timeTabIdx = 0;

function renderTimeCharts() {
  const tabLabels = ['전체 평가', '분산 아키텍처', '클라우드 컴퓨팅', 'Python'];
  const tabGroup = document.getElementById('ins-time-tabs');
  if (!tabGroup) return;
  tabGroup.innerHTML = tabLabels.map((lbl, i) =>
    `<button class="ins-tab-btn ins-time-tab${i===0?' active':''}" onclick="setTimeTab(${i})">${lbl}</button>`
  ).join('');
  renderTimeTab(0);
}

function setTimeTab(i) {
  timeTabIdx = i;
  document.querySelectorAll('.ins-time-tab').forEach((b,j) => b.classList.toggle('active', i===j));
  renderTimeTab(i);
}

function renderTimeTab(i) {
  const completed = EXAMINEES.filter(e => e.status === 'completed');
  let items, limitSec;

  if (i === 0) {
    limitSec = timeToSec('2:40:00');
    items = completed.map(e => ({
      name: e.name,
      timeSec: timeToSec(e.time),
      timeStr: e.time,
      score: e.totalScore,
    })).sort((a, b) => a.timeSec - b.timeSec);
  } else {
    const ti = i - 1;
    const meta = TRACKS_META[ti];
    limitSec = timeToSec(meta.timeLimit);
    items = completed.map(e => ({
      name: e.name,
      timeSec: e.tracks.length ? timeToSec(e.tracks[ti].time) : 0,
      timeStr: e.tracks.length ? e.tracks[ti].time : '-',
      score: e.tracks.length ? e.tracks[ti].score : null,
    })).sort((a, b) => a.timeSec - b.timeSec);
  }

  renderTimeHistogram('ins-time-chart', items.map(d => d.timeSec), limitSec);
  renderTimeBubble('ins-time-bubble', items, limitSec);
  renderTimeZoneDonut('ins-time-donut', items, limitSec);
  renderTimeScatter('ins-time-scatter', items, limitSec);
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

  // 트랙별 총평
  const trackAssessments = trackStats.map((t, ti) => {
    const tSkillRates = skillRates[ti];
    const tStrongSkills = TRACKS_META[ti].skills.filter((_,si) => tSkillRates[si] >= 75).map(s => s.name);
    const tWeakSkills   = TRACKS_META[ti].skills.filter((_,si) => tSkillRates[si] <  40).map(s => s.name);
    const tText =
      `평균 ${t.avg}점(σ ${t.std})으로 ` +
      (t.avg >= 80 ? '우수한 성과를 보였습니다.' : t.avg >= 65 ? '전반적으로 양호한 수준입니다.' : '전체 평균이 낮아 보완이 필요합니다.') +
      (tStrongSkills.length ? ` ${tStrongSkills.slice(0,3).join(', ')} 역량에서 높은 획득률을 보였습니다.` : '') +
      (tWeakSkills.length   ? ` ${tWeakSkills.slice(0,3).join(', ')} 역량의 집중 학습이 권장됩니다.` : '');
    return { name: t.name, text: tText, color: TRACK_COLORS[ti] };
  });

  return {
    text,
    strengths:    strongSkills.slice(0, 5),
    improvements: weakSkills.slice(0, 5),
    trackAssessments,
  };
}

/* ══════════════════════════════
   RENDER: 메인 인사이트 차트
══════════════════════════════ */
function renderInsightCharts() {
  const stats = computeStats();
  if (!stats) return;

  // ─ 점수 분포 탭 버튼 초기화 ─
  const tabLabels = ['전체 평가 결과', '분산 아키텍처', '클라우드 컴퓨팅', 'Python'];
  document.getElementById('ins-score-tabs').innerHTML = tabLabels.map((lbl, i) =>
    `<button class="ins-tab-btn ins-score-tab${i===0?' active':''}" onclick="setScoreTab(${i})">${lbl}</button>`
  ).join('');
  renderScoreCurve(0);

  // ─ 소요시간 분포 ─
  renderTimeCharts();

  // ─ 역량 획득 도넛 ─
  renderSkillDonuts();

  // ─ 평가 구성 ─
  const evalConfigEl = document.getElementById('ins-eval-config');
  if (evalConfigEl) {
    evalConfigEl.innerHTML = `<div class="ss-block-title">평가 구성</div>` +
      TRACKS_META.map((meta, i) => `
        <div style="${i > 0 ? 'border-top:1px solid var(--border); margin-top:12px; padding-top:12px;' : ''}">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span style="font-size:0.86rem; font-weight:700; color:var(--text);">${meta.name}</span>
            <span class="badge badge-level" style="flex-shrink:0;">${meta.level}</span>
          </div>
          <div style="font-size:0.82rem; line-height:1.75; color:var(--text-sub);">${meta.desc.replace(/\n/g, '<br><br>')}</div>
        </div>
      `).join('');
  }

  // ─ 그룹 총평 ─
  const ga = generateGroupAssessment();
  const gaEl = document.getElementById('ins-group-assessment');
  if (gaEl) {
    const trackRows = ga.trackAssessments.map(t =>
      `<div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--border);">
        <div style="font-size:0.78rem; font-weight:700; color:${t.color}; margin-bottom:4px;">${t.name}</div>
        <div class="comment-text">${t.text}</div>
      </div>`
    ).join('');
    gaEl.innerHTML = `<div class="comment-text">${ga.text}</div>${trackRows}`;
  }
}

/* ══════════════════════════════
   RENDER: 결과 요약 탭 (ptab-0)
══════════════════════════════ */
function renderSummaryTab(e) {
  const el = document.getElementById('ptab-0');
  if (e.status !== 'completed') {
    el.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-mute);">아직 평가를 완료하지 않았습니다.</div>`;
    return;
  }
  const tracks = buildTracks(e);
  const allSkills = tracks.flatMap(t => t.skills);
  const acq  = allSkills.filter(s => s.level === 'acquired').length;
  const total = allSkills.length;
  const completedSorted = EXAMINEES.filter(x => x.status === 'completed')
    .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  const rank = completedSorted.findIndex(x => x.id === e.id) + 1;
  const n = completedSorted.length;
  const scoreCol = trackColor(e.totalScore);

  // 전체 제한시간을 H:MM:SS 형식으로 변환
  const tlH = (EVALUATION.timeLimit.match(/(\d+)시간/) || ['','0'])[1];
  const tlM = (EVALUATION.timeLimit.match(/(\d+)분/)   || ['','0'])[1];
  const timeLimitHMS = `${tlH}:${String(tlM).padStart(2,'0')}:00`;

  // 점수 분포 계산
  const totalScores = completedSorted.map(x => x.totalScore).sort((a,b) => a-b);
  const avg = Math.round(totalScores.reduce((s,v) => s+v, 0) / totalScores.length * 10) / 10;
  const mid = Math.floor(totalScores.length / 2);
  const median = totalScores.length % 2 === 0
    ? (totalScores[mid-1] + totalScores[mid]) / 2
    : totalScores[mid];
  const std = Math.round(Math.sqrt(totalScores.reduce((s,v) => s+(v-avg)**2, 0) / totalScores.length) * 10) / 10;

  el.innerHTML = `
    <div class="compare-card" style="margin-bottom:16px;">
      <div class="ss-block-title">평가 결과</div>
      <!-- Row 1: 총점 + 트랙별 점수 -->
      <div style="display:grid; grid-template-columns:repeat(4,1fr);" class="summary-score-grid">
        <div class="ss-card-flat" style="border-right:1px solid var(--border);">
          <div class="ss-val" style="color:${scoreCol};">${e.totalScore}<small>점</small></div>
          <div class="ss-label">총점</div>
          <div class="ss-sub">${e.totalScore >= 70 ? '합격 기준 충족' : '합격 기준 미달'}</div>
        </div>
        ${tracks.map(t => {
          const shortName = t.name.replace('클라우드 & 분산 시스템 아키텍처','클라우드 & 분산 시스템');
          return `<div class="ss-card-flat">
            <div class="ss-val" style="color:${t.color};">${t.score}<small>점</small></div>
            <div class="ss-label">${shortName}</div>
          </div>`;
        }).join('')}
      </div>
      <div class="ss-divider"></div>
      <!-- Row 2: 순위 + 소요시간 + 부정행위 지표 -->
      <div style="display:grid; grid-template-columns:repeat(3,1fr);" class="summary-meta-grid">
        <div class="ss-card-flat">
          <div class="ss-val">${rank}<small>/${n}명</small></div>
          <div class="ss-sub">${getPercentile(e.totalScore, totalScores)}</div>
          <div class="ss-label">순위</div>
        </div>
        <div class="ss-card-flat">
          <div class="ss-val" style="font-size:1.25rem; line-height:1.3;">${e.time || '-'}<br><small style="font-size:0.6em; color:var(--text-mute);">/ ${timeLimitHMS}</small></div>
          <div class="ss-label">소요시간</div>
        </div>
        <div class="ss-card-flat">
          <div class="ss-val" style="font-size:1rem;">${e.behaviorRisk ? riskBadgeHTML(e.behaviorRisk, true) : '-'}</div>
          <span onclick="toggleBehaviorPanel()" style="font-size:0.72rem; color:var(--primary); cursor:pointer; font-weight:600; opacity:0.8; margin-bottom:4px; display:inline-block;">행동 분석 →</span>
          <div class="ss-label" style="display:flex;align-items:center;gap:4px;justify-content:center;">부정행위 지표 ${tooltipIcon('시험 중 감지된 이상행동을 종합한 위험도 지표입니다.<br><strong style=\\"color:#86efac;\\">정상</strong> 위험 이벤트 0건 + 주의 1건 이하<br><strong style=\\"color:#fcd34d;\\">주의</strong> 위험 이벤트 1~2건 또는 주의 2건 이상<br><strong style=\\"color:#fca5a5;\\">위험</strong> 위험 이벤트 3건 이상')}</div>
        </div>
      </div>
    </div>

    <div class="compare-card" style="margin-bottom:16px;">
      <div class="ss-block-title" style="display:flex;align-items:center;gap:6px;">점수 분포 ${tooltipIcon('전체 응시자의 점수 분포를 커브 그래프로 시각화합니다. 점선(황색)은 평균, 실선(초록)은 합격선(80점)을 나타내며, 커브 위 색상 점과 점수 박스가 본인 점수의 위치입니다.')}</div>
      <div class="kde-outer">
        <div class="kde-graph-area">
          <svg id="p-sum-kde" class="chart-svg" height="160" viewBox="0 0 360 160"></svg>
          <div class="kde-legend">
            <div class="kde-legend-item">
              <span class="kde-leg-bar" style="background:rgba(22,163,74,0.22);border:1px solid rgba(22,163,74,0.4);"></span>합격 (80점↑)
            </div>
            <div class="kde-legend-item">
              <span class="kde-leg-bar" style="background:rgba(220,38,38,0.18);border:1px solid rgba(220,38,38,0.35);"></span>불합격
            </div>
            <div class="kde-legend-item">
              <span class="kde-leg-line" style="border-color:#1565C0; border-style:solid;"></span>확률 분포
            </div>
            <div class="kde-legend-item">
              <span class="kde-leg-line" style="border-color:#F59E0B; border-style:dashed;"></span>평균
            </div>
          </div>
        </div>
        <div class="kde-stats-panel">
          <div class="kde-stat">
            <div class="kde-stat-val">${avg}점</div>
            <div class="kde-stat-lbl">평균</div>
          </div>
          <div class="kde-stat">
            <div class="kde-stat-val">${median}점</div>
            <div class="kde-stat-lbl">중앙값</div>
          </div>
          <div class="kde-stat">
            <div class="kde-stat-val">${std}점</div>
            <div class="kde-stat-lbl">표준편차</div>
          </div>
        </div>
      </div>
      <div class="ss-divider"></div>
      <div class="ss-block-title" style="display:flex;align-items:center;gap:6px;">획득 역량 ${tooltipIcon('응시자가 획득한 역량 수를 전체 역량 수 대비 도넛 차트로 표시합니다.')}</div>
      <div class="donut-row">
        <div class="donut-item">
          <svg id="p-sum-donut-all" width="84" height="84" viewBox="0 0 84 84"></svg>
          <div class="donut-item-label" style="color:${scoreCol};">전체</div>
        </div>
        <div class="donut-separator"></div>
        ${tracks.map((t, ti) => {
          const shortName = t.name.replace('클라우드 & 분산 시스템 아키텍처','클라우드 & 분산 시스템');
          return `<div class="donut-item">
            <svg id="p-sum-donut-${ti}" width="84" height="84" viewBox="0 0 84 84"></svg>
            <div class="donut-item-label" style="color:${t.color};">${shortName}</div>
          </div>
          ${ti < tracks.length - 1 ? '<div class="donut-separator"></div>' : ''}`;
        }).join('')}
      </div>
    </div>

    <!-- 평가 구성 -->
    <div class="compare-card" style="margin-bottom:16px;">
      <div class="ss-block-title">평가 구성</div>
      ${TRACKS_META.map((meta, i) => `
        <div style="${i > 0 ? 'border-top:1px solid var(--border); margin-top:12px; padding-top:12px;' : ''}">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span style="font-size:0.86rem; font-weight:700; color:var(--text);">${meta.name}</span>
            <span class="badge badge-level" style="flex-shrink:0;">${meta.level}</span>
          </div>
          <div style="font-size:0.82rem; line-height:1.75; color:var(--text-sub);">${meta.desc.replace(/\n/g, '<br><br>')}</div>
        </div>
      `).join('')}
    </div>

    <div class="sec-title">시험 결과 총평</div>
    <div class="comment-box">${e.assessment
      ? `<div class="comment-text">${e.assessment.replace(/\n/g, '<br>')}</div>`
      : assessmentHTML(generatePersonAssessment(e))
    }</div>
  `;

  // 차트 렌더링 (innerHTML 설정 후)
  renderKDECurve('p-sum-kde', totalScores, avg, median, e.totalScore, scoreCol);
  renderDonut('p-sum-donut-all', acq, total, scoreCol, '#E5E7EB');
  tracks.forEach((t, ti) => {
    const acqCount = t.skills.filter(s => s.level === 'acquired').length;
    renderDonut(`p-sum-donut-${ti}`, acqCount, t.skills.length, t.color, t.colorBg);
  });
}

/* ══════════════════════════════
   RENDER: 트랙별 탭 (ptab-1~3)
══════════════════════════════ */
function renderTrackTab(e, trackIdx) {
  const el = document.getElementById('ptab-' + (trackIdx + 1));
  const track = buildTracks(e)[trackIdx];
  const meta = TRACKS_META[trackIdx];

  const completed = EXAMINEES.filter(x => x.status === 'completed' && x.tracks.length > 0);
  const trackScores = completed.map(x => x.tracks[trackIdx].score).sort((a,b) => a-b);
  const n = trackScores.length;
  const avg = Math.round(trackScores.reduce((s,v) => s+v, 0) / n * 10) / 10;
  const median = n % 2 === 0
    ? (trackScores[n/2-1] + trackScores[n/2]) / 2
    : trackScores[Math.floor(n/2)];
  const std = Math.round(Math.sqrt(trackScores.reduce((s,v) => s+(v-avg)**2, 0) / n) * 10) / 10;

  const sorted = [...completed].sort((a,b) => b.tracks[trackIdx].score - a.tracks[trackIdx].score);
  const rank = sorted.findIndex(x => x.id === e.id) + 1;

  const acq = track.skills.filter(s => s.level === 'acquired').length;
  const total = track.skills.length;

  const skillRates = computeSkillAcqRates();
  const trackSkillRates = skillRates[trackIdx];

  const meVals  = track.skills.map(s => s.level === 'acquired' ? 100 : s.level === 'partial' ? 50 : 0);
  const avgVals = trackSkillRates;

  const timeLimitHMS = TRACKS_META[trackIdx].timeLimit || '0:00:00';

  const svgSize = total >= 6 ? 320 : 300;
  const radarId = `p-radar-t${trackIdx}`;
  const tipId   = `p-radar-t${trackIdx}-tip`;
  const kdeId   = `p-kde-t${trackIdx}`;

  // 정적분석 요약 + 세부 계산
  const SA_RM = {
    pass:    { label: '통과', bg: '#F0FDF4', color: '#166534', dot: '#16A34A' },
    warning: { label: '주의', bg: '#FFFBEB', color: '#92400E', dot: '#D97706' },
    fail:    { label: '실패', bg: '#FEF2F2', color: '#991B1B', dot: '#DC2626' },
  };
  const SA_ML = {
    DUPLICATIONS:          '중복 (Duplications)',
    CYCLOMATIC_COMPLEXITY: '순환 복잡도 (Cyclomatic Complexity)',
    BUGS:                  '잠재 버그 (Bugs)',
    CODING_STYLE:          '코딩 스타일 (Coding Style)',
  };

  const saEntry = e.staticAnalysis && e.staticAnalysis.find(x => x.trackIdx === trackIdx);
  let saStatHTML, saDetailHTML = '';

  if (saEntry) {
    const saUid  = `sa_${e.id}_t${trackIdx}`;
    const probs  = saEntry.problems;
    const saPass = probs.reduce((s,p) => s + p.metrics.filter(m => m.result==='pass').length, 0);
    const saWarn = probs.reduce((s,p) => s + p.metrics.filter(m => m.result==='warning').length, 0);
    const saFail = probs.reduce((s,p) => s + p.metrics.filter(m => m.result==='fail').length, 0);
    const saTotal = saPass + saWarn + saFail;
    const saRate  = saTotal ? Math.round(saPass / saTotal * 100) : 0;
    const saColor = saRate >= 70 ? '#16A34A' : saRate >= 50 ? '#D97706' : '#DC2626';

    function saProbOverall(prob) {
      const fc = prob.metrics.filter(m => m.result === 'fail').length;
      const wc = prob.metrics.filter(m => m.result === 'warning').length;
      return fc > 0 ? 'fail' : wc > 0 ? 'warning' : 'pass';
    }

    saStatHTML = `
      <div class="ss-val" style="color:${saColor};">${saRate}<small>%</small></div>
      <div class="ss-sub" style="font-size:0.7rem;">통과 ${saPass} · 주의 ${saWarn} · 실패 ${saFail}</div>
      <div style="margin-top:8px;">
        <button id="${saUid}_toggle" class="sa-detail-toggle" onclick="toggleStaticDetail('${saUid}')"
          style="font-size:0.73rem;font-weight:700;color:var(--primary);background:none;border:1px solid var(--primary);border-radius:6px;padding:3px 10px;cursor:pointer;">
          세부 결과 ▾
        </button>
      </div>
      <div class="ss-label" style="margin-top:4px;">정적분석</div>`;

    const probBtnsHTML = probs.map((p, pi) => {
      const res = saProbOverall(p);
      const rm  = SA_RM[res];
      return `<button
        id="${saUid}_btn_${pi}" data-result="${res}"
        onclick="selectStaticProblem('${saUid}', ${pi}, ${probs.length})"
        style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:8px;border:2px solid ${pi===0?rm.dot:'var(--border)'};background:${pi===0?rm.bg:'var(--card)'};color:${pi===0?rm.color:'var(--text)'};font-size:0.80rem;font-weight:700;cursor:pointer;transition:all .15s;">
        <span style="width:6px;height:6px;border-radius:50%;background:${rm.dot};flex-shrink:0;"></span>${p.title}
      </button>`;
    }).join('');

    const probPanelsHTML = probs.map((p, pi) => {
      const res = saProbOverall(p);
      const rm  = SA_RM[res];
      const pC  = p.metrics.filter(m=>m.result==='pass').length;
      const wC  = p.metrics.filter(m=>m.result==='warning').length;
      const fC  = p.metrics.filter(m=>m.result==='fail').length;
      const metricsHTML = p.metrics.map(m => {
        const mr = SA_RM[m.result] || SA_RM.warning;
        return `<div style="display:flex;align-items:flex-start;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);">
          <span style="width:8px;height:8px;border-radius:50%;background:${mr.dot};margin-top:5px;flex-shrink:0;"></span>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
              <span style="font-size:0.81rem;font-weight:700;color:var(--text);">${SA_ML[m.key]||m.label}</span>
              <span style="padding:1px 8px;border-radius:99px;font-size:0.71rem;font-weight:700;background:${mr.bg};color:${mr.color};">${mr.label}</span>
            </div>
            <div style="font-size:0.79rem;color:var(--text-sub);line-height:1.6;">${m.desc}</div>
          </div>
        </div>`;
      }).join('');
      const swHTML = (p.strengths&&p.strengths.length)||(p.weaknesses&&p.weaknesses.length) ? `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
          ${p.strengths&&p.strengths.length?`<div style="background:#F0FDF4;border-radius:8px;padding:10px 12px;"><div style="font-size:0.74rem;font-weight:700;color:#166534;margin-bottom:5px;">강점</div>${p.strengths.map(s=>`<div style="font-size:0.77rem;color:#166534;line-height:1.6;">• ${s}</div>`).join('')}</div>`:''}
          ${p.weaknesses&&p.weaknesses.length?`<div style="background:#FEF2F2;border-radius:8px;padding:10px 12px;"><div style="font-size:0.74rem;font-weight:700;color:#991B1B;margin-bottom:5px;">개선 필요</div>${p.weaknesses.map(s=>`<div style="font-size:0.77rem;color:#991B1B;line-height:1.6;">• ${s}</div>`).join('')}</div>`:''}
        </div>` : '';
      return `<div id="${saUid}_panel_${pi}" style="${pi!==0?'display:none;':''}">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="font-size:0.88rem;font-weight:800;color:var(--text);">${p.title}</span>
          <span style="display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:99px;font-size:0.73rem;font-weight:700;background:${rm.bg};color:${rm.color};">
            <span style="width:5px;height:5px;border-radius:50%;background:${rm.dot};flex-shrink:0;"></span>${rm.label}
          </span>
          <span style="margin-left:auto;font-size:0.73rem;color:var(--text-mute);">통과 ${pC} · 주의 ${wC} · 실패 ${fC}</span>
        </div>
        <div style="font-size:0.80rem;color:var(--text-sub);margin-bottom:8px;line-height:1.6;">${p.summary}</div>
        <div>${metricsHTML}</div>
        ${swHTML}
      </div>`;
    }).join('');

    saDetailHTML = `
      <div id="${saUid}_detail" style="display:none;margin-bottom:16px;">
        <div class="compare-card">
          <div class="ss-block-title" style="margin-bottom:12px;">정적분석 세부 결과</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">${probBtnsHTML}</div>
          <div style="border-top:1px solid var(--border);padding-top:12px;">${probPanelsHTML}</div>
        </div>
      </div>`;
  } else {
    saStatHTML = `
      <div class="ss-val" style="color:var(--text-mute);">-</div>
      <div class="ss-label">정적분석</div>`;
  }

  el.innerHTML = `
  <table class="print-track-table">
    <thead><tr><td><div class="print-track-title">${meta.name}</div></td></tr></thead>
    <tbody><tr><td>

    <div class="compare-card compare-card-sm" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div class="ss-block-title" style="margin:0;">평가 결과</div>
        <button class="answers-open-btn" onclick="openAnswersDrawer(${e.id}, ${trackIdx})">📄 답안 보기</button>
      </div>
      <div class="track-stat-grid track-stat-grid-4">
        <div class="ss-card-flat">
          <div class="ss-val" style="color:${track.color};">${track.score}<small>점</small></div>
          <div class="ss-label">트랙 점수</div>
        </div>
        <div class="ss-card-flat">
          <div class="ss-val">${rank}<small>/${n}명</small></div>
          <div class="ss-sub">${getPercentile(track.score, trackScores)}</div>
          <div class="ss-label">순위</div>
        </div>
        <div class="ss-card-flat">
          <div class="ss-val" style="color:${rateColor(track.rate)};">${acq}<small>/${total}개</small></div>
          <div class="ss-label">역량 확보</div>
        </div>
        <div class="ss-card-flat">
          <div class="ss-val" style="color:${rateColor(track.rate)};">${track.rate}<small>%</small></div>
          <div class="ss-label">역량 획득률</div>
        </div>
      </div>
      <div style="border-top:1px solid var(--border); margin-top:12px; padding-top:12px; display:grid; grid-template-columns:1fr 1fr; gap:0;">
        <div class="ss-card-flat" style="border-right:1px solid var(--border); padding-right:16px;">
          <div class="ss-val" style="font-size:1.25rem; line-height:1.3;">${track.time}<br><small style="font-size:0.6em;color:var(--text-mute);">/ ${e.time}</small></div>
          <div class="ss-label">소요시간</div>
        </div>
        <div class="ss-card-flat" style="padding-left:16px;">
          ${saStatHTML}
        </div>
      </div>
    </div>

    ${saDetailHTML}

    <div class="compare-card" style="margin-bottom:16px;">
      <div class="ss-block-title" style="display:flex;align-items:center;gap:6px;">점수 분포 ${tooltipIcon('해당 트랙 응시자의 점수 분포를 커브 그래프로 시각화합니다. 점선(황색)은 평균, 실선(초록)은 합격선(80점)을 나타내며, 커브 위 색상 점과 점수 박스가 본인 점수의 위치입니다.')}</div>
      <div class="kde-outer">
        <div class="kde-graph-area">
          <svg id="${kdeId}" class="chart-svg" height="160" viewBox="0 0 360 160"></svg>
          <div class="kde-legend">
            <div class="kde-legend-item">
              <span class="kde-leg-bar" style="background:rgba(22,163,74,0.22);border:1px solid rgba(22,163,74,0.4);"></span>합격 (80점↑)
            </div>
            <div class="kde-legend-item">
              <span class="kde-leg-bar" style="background:rgba(220,38,38,0.18);border:1px solid rgba(220,38,38,0.35);"></span>불합격
            </div>
            <div class="kde-legend-item">
              <span class="kde-leg-line" style="border-color:#1565C0; border-style:solid;"></span>확률 분포
            </div>
            <div class="kde-legend-item">
              <span class="kde-leg-line" style="border-color:#F59E0B; border-style:dashed;"></span>평균
            </div>
          </div>
        </div>
        <div class="kde-stats-panel">
          <div class="kde-stat">
            <div class="kde-stat-val">${avg}점</div>
            <div class="kde-stat-lbl">평균</div>
          </div>
          <div class="kde-stat">
            <div class="kde-stat-val">${median}점</div>
            <div class="kde-stat-lbl">중앙값</div>
          </div>
          <div class="kde-stat">
            <div class="kde-stat-val">${std}점</div>
            <div class="kde-stat-lbl">표준편차</div>
          </div>
        </div>
      </div>
      <div class="ss-divider"></div>
      <div class="ss-block-title" style="display:flex;align-items:center;gap:6px;">역량별 분석 ${tooltipIcon('각 역량의 획득 여부를 레이더(방사형) 차트로 시각화합니다. 색상선은 본인, 회색 점선은 전체 평균을 나타냅니다. 꼭짓점에 마우스를 올리면 역량명을 확인할 수 있습니다.')}</div>
      <div class="radar-center-wrap">
        <div class="radar-wrap">
          <svg id="${radarId}" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}"></svg>
          <div id="${tipId}" class="radar-tip"></div>
        </div>
        <div class="radar-legend-row" style="justify-content:center; margin-top:10px;">
          <div class="radar-legend-item"><div class="rl-dot" style="background:${track.color};"></div>나</div>
          <div class="radar-legend-item"><div class="rl-dot" style="background:#94A3B8; border:1px dashed #94A3B8;"></div>전체 평균</div>
        </div>
        <div class="track-skill-status-grid">
          ${track.skills.map(s => {
            const lvlColor = s.level === 'acquired' ? 'var(--acquired)' : s.level === 'partial' ? 'var(--partial)' : 'var(--missing)';
            const lvlLabel = s.level === 'acquired' ? '획득' : s.level === 'partial' ? '보완' : '미획득';
            return `<div class="track-skill-status-row">
              <div class="track-skill-dot" style="background:${lvlColor};"></div>
              <span class="track-skill-name">${s.name}</span>
              <span class="track-skill-lvl" style="color:${lvlColor};">${lvlLabel}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="sec-title">평가 총평</div>
    <div class="comment-box">${(() => {
      const real = e.trackAssessments && e.trackAssessments[trackIdx];
      const text = real ? real.text : generateTrackAssessment(e, trackIdx).text;
      return `<div class="comment-text">${text.replace(/\n/g, '<br><br>')}</div>`;
    })()}</div>

    <div class="sec-title" style="margin-top:16px;">스킬별 세부 결과</div>
    <div class="skill-detail-list">
      ${track.skills.map((s, si) => {
        const rate = trackSkillRates[si];
        const rateCol = rate >= 75 ? 'var(--acquired)' : rate >= 40 ? 'var(--partial)' : 'var(--missing)';
        const realSkill = e.trackAssessments && e.trackAssessments[trackIdx] &&
          e.trackAssessments[trackIdx].skillTexts && e.trackAssessments[trackIdx].skillTexts[s.name];
        const verdict = s.level === 'acquired'
          ? { cls: 'verdict-good', label: '강점',
              text: realSkill || ('역량을 성공적으로 확보했습니다.' + (rate < 50 ? ' 응시자 평균 획득률이 낮은 난이도 높은 역량으로, 높은 수준의 실력을 입증했습니다.' : '')) }
          : s.level === 'partial'
          ? { cls: 'verdict-warn', label: '약점',
              text: realSkill || '역량의 일부를 확보했습니다. 추가 학습을 통해 완전한 획득을 권장합니다.' }
          : { cls: 'verdict-bad', label: '약점',
              text: realSkill || ('역량 확보가 이루어지지 않았습니다. ' + (rate >= 60 ? '전체 응시자 중 상당수가 획득한 역량으로 집중적인 보완이 필요합니다.' : '높은 난이도의 역량이므로 심층 학습을 권장합니다.')) };
        return `<div class="skill-detail-card">
          <div class="sdc-header">
            <span class="badge ${LEVEL_CLASS[s.level]}">${LEVEL_LABEL[s.level]}</span>
            <span class="sdc-name">${s.name}</span>
          </div>
          <div class="sdc-desc">${s.desc}</div>
          <div class="sdc-verdict ${verdict.cls}"><span class="verdict-label">${verdict.label}</span>${verdict.text}</div>
        </div>`;
      }).join('')}
    </div>

    ${buildStaticAnalysisPrintHTML(saEntry)}

    </td></tr></tbody>
  </table>
  `;

  renderKDECurve(kdeId, trackScores, avg, median, track.score, track.color);
  renderDualRadar(radarId, track.skills.map(s => s.name), meVals, avgVals, track.color, tipId);
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

/* ══════════════════════════════
   답안 확인 섹션
══════════════════════════════ */
/* ══════════════════════════════
   PDF 전용 — 정적분석 렌더
══════════════════════════════ */
const _SA_RM = {
  pass:    { label: '통과', dot: '#16A34A', bg: '#F0FDF4', color: '#166534' },
  warning: { label: '주의', dot: '#D97706', bg: '#FFFBEB', color: '#92400E' },
  fail:    { label: '실패', dot: '#DC2626', bg: '#FEF2F2', color: '#991B1B' },
};
const _SA_ML = {
  DUPLICATIONS:          '중복',
  CYCLOMATIC_COMPLEXITY: '순환 복잡도',
  BUGS:                  '잠재 버그',
  CODING_STYLE:          '코딩 스타일',
};

function buildStaticAnalysisPrintHTML(saEntry) {
  if (!saEntry) return '';
  const probs = saEntry.problems;

  function probOverall(p) {
    return p.metrics.some(m => m.result === 'fail') ? 'fail'
         : p.metrics.some(m => m.result === 'warning') ? 'warning' : 'pass';
  }

  const totalPass = probs.reduce((s,p) => s + p.metrics.filter(m=>m.result==='pass').length, 0);
  const totalWarn = probs.reduce((s,p) => s + p.metrics.filter(m=>m.result==='warning').length, 0);
  const totalFail = probs.reduce((s,p) => s + p.metrics.filter(m=>m.result==='fail').length, 0);
  const totalAll  = totalPass + totalWarn + totalFail;
  const passRate  = totalAll ? Math.round(totalPass / totalAll * 100) : 0;
  const rateColor = passRate >= 70 ? '#16A34A' : passRate >= 50 ? '#D97706' : '#DC2626';

  const probsHTML = probs.map(p => {
    const res = probOverall(p);
    const rm  = _SA_RM[res];
    const pC  = p.metrics.filter(m=>m.result==='pass').length;
    const wC  = p.metrics.filter(m=>m.result==='warning').length;
    const fC  = p.metrics.filter(m=>m.result==='fail').length;

    const metricsHTML = p.metrics.map(m => {
      const mr = _SA_RM[m.result] || _SA_RM.warning;
      return `<div style="background:${mr.bg};border-radius:6px;padding:6px 10px;">
        <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px;">
          <span style="width:6px;height:6px;border-radius:50%;background:${mr.dot};flex-shrink:0;"></span>
          <span style="font-size:0.75rem;font-weight:700;color:${mr.color};">${mr.label}</span>
        </div>
        <div style="font-size:0.72rem;font-weight:600;color:var(--text);margin-bottom:1px;">${_SA_ML[m.key]||m.label}</div>
        <div style="font-size:0.71rem;color:var(--text-sub);line-height:1.4;">${m.desc}</div>
      </div>`;
    }).join('');

    const swHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;">
        ${p.strengths&&p.strengths.length ? `<div style="background:#F0FDF4;border-radius:6px;padding:7px 10px;">
          <div style="font-size:0.71rem;font-weight:700;color:#166534;margin-bottom:4px;">강점</div>
          ${p.strengths.map(s=>`<div style="font-size:0.71rem;color:#166534;line-height:1.5;">• ${s}</div>`).join('')}
        </div>` : ''}
        ${p.weaknesses&&p.weaknesses.length ? `<div style="background:#FEF2F2;border-radius:6px;padding:7px 10px;">
          <div style="font-size:0.71rem;font-weight:700;color:#991B1B;margin-bottom:4px;">개선 필요</div>
          ${p.weaknesses.map(s=>`<div style="font-size:0.71rem;color:#991B1B;line-height:1.5;">• ${s}</div>`).join('')}
        </div>` : ''}
      </div>`;

    return `<div style="border:1px solid var(--border);border-radius:8px;padding:12px 14px;margin-bottom:10px;break-inside:avoid;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
        <span style="font-size:0.84rem;font-weight:800;color:var(--text);">${p.title}</span>
        <span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:99px;font-size:0.71rem;font-weight:700;background:${rm.bg};color:${rm.color};">
          <span style="width:5px;height:5px;border-radius:50%;background:${rm.dot};flex-shrink:0;"></span>${rm.label}
        </span>
        <span style="margin-left:auto;font-size:0.71rem;color:var(--text-mute);">통과 ${pC} · 주의 ${wC} · 실패 ${fC}</span>
      </div>
      <div style="font-size:0.78rem;color:var(--text-sub);margin-bottom:8px;line-height:1.5;">${p.summary}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">${metricsHTML}</div>
      ${swHTML}
    </div>`;
  }).join('');

  return `
  <div class="print-sa-section">
    <div class="sec-title" style="margin-top:0;">정적분석 결과</div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding:10px 14px;background:var(--bg);border-radius:8px;">
      <span style="font-size:1.1rem;font-weight:900;color:${rateColor};">${passRate}%</span>
      <span style="font-size:0.78rem;color:var(--text-sub);">통과율</span>
      <span style="margin-left:auto;font-size:0.78rem;color:var(--text-sub);">통과 ${totalPass} · 주의 ${totalWarn} · 실패 ${totalFail}</span>
    </div>
    ${probsHTML}
  </div>`;
}

/* ══════════════════════════════
   PDF 전용 — 부정행위 분석 탭
══════════════════════════════ */
const BEHAVIOR_GRADE_INFO = [
  { grade: 5, name: '부정행위 없음',
    desc: '평가 도중 의심스러운 행동이나 부정행위 기록 없이, 응시자는 모든 규정을 철저히 준수했습니다.',
    color: '#166534', bg: '#F0FDF4', border: '#16A34A' },
  { grade: 4, name: '경미한 의심 행동',
    desc: '평가 도중 약간의 의심스러운 행동이 있었으나, 명백한 부정행위로 단정할 수 없으며, 전반적으로 규정을 잘 준수했습니다.',
    color: '#92400E', bg: '#FFFBEB', border: '#D97706' },
  { grade: 3, name: '의심스러운 행동',
    desc: '평가 도중 부정행위로 의심될 만한 행동이 확인되었으며, 추가적인 수동 검증이 필요합니다.',
    color: '#92400E', bg: '#FFFBEB', border: '#D97706' },
  { grade: 2, name: '명백한 부정행위 시도',
    desc: '평가 도중 부정행위를 시도한 명확한 증거가 확인되었으나, 성공적으로 이루어지지는 않았습니다.',
    color: '#991B1B', bg: '#FEF2F2', border: '#DC2626' },
  { grade: 1, name: '부정행위 확인',
    desc: '평가 도중 명백한 부정행위가 발생했으며, 그로 인해 테스트 결과의 신뢰성이 크게 손상되었습니다.',
    color: '#991B1B', bg: '#FEF2F2', border: '#DC2626' },
];

function getBehaviorGrade(risk) {
  if (!risk) return 5;
  const { level, highCount = 0, medCount = 0 } = risk;
  if (level === 'danger' && highCount >= 5) return 1;
  if (level === 'danger') return 2;
  if (level === 'warning') return 3;
  if (medCount >= 1) return 4;
  return 5;
}

function renderBehaviorPrintTab(e) {
  const el = document.getElementById('ptab-4');
  if (!el) return;

  const currentGrade = getBehaviorGrade(e.behaviorRisk);
  const gi = BEHAVIOR_GRADE_INFO.find(g => g.grade === currentGrade);

  const events = (e.behaviorEvents != null)
    ? e.behaviorEvents
    : (e.behaviorRisk && e.behaviorRisk.level !== 'normal' ? (typeof BEHAVIOR_EVENTS !== 'undefined' ? BEHAVIOR_EVENTS : []) : []);

  const SEV = {
    high:   { label: '위험', dot: '#DC2626', bg: '#FEF2F2', color: '#991B1B' },
    medium: { label: '주의', dot: '#D97706', bg: '#FFFBEB', color: '#92400E' },
    low:    { label: '참고', dot: '#1565C0', bg: '#EBF3FF', color: '#1565C0' },
  };

  const reasonHTML = currentGrade === 5
    ? `<div style="font-size:0.82rem;color:var(--text-sub);line-height:1.7;">본 평가에서 부정행위가 확인되지 않았습니다.</div>`
    : events.length === 0
      ? `<div style="font-size:0.82rem;color:var(--text-sub);">기록된 이벤트가 없습니다.</div>`
      : `<table style="width:100%;border-collapse:collapse;font-size:0.79rem;">
          <thead>
            <tr style="background:var(--bg);">
              <th style="padding:6px 10px;text-align:left;font-weight:700;color:var(--text-sub);border-bottom:1px solid var(--border);">시간</th>
              <th style="padding:6px 10px;text-align:left;font-weight:700;color:var(--text-sub);border-bottom:1px solid var(--border);">유형</th>
              <th style="padding:6px 10px;text-align:left;font-weight:700;color:var(--text-sub);border-bottom:1px solid var(--border);">내용</th>
              <th style="padding:6px 10px;text-align:center;font-weight:700;color:var(--text-sub);border-bottom:1px solid var(--border);">등급</th>
            </tr>
          </thead>
          <tbody>
            ${events.map((ev, i) => {
              const s = SEV[ev.severity] || SEV.low;
              return `<tr style="border-bottom:1px solid #E5E7EB;background:${i%2===0?'#ffffff':'#F9FAFB'};">
                <td style="padding:6px 10px;color:#6B7280;white-space:nowrap;">${ev.time}</td>
                <td style="padding:6px 10px;font-weight:600;">${ev.label}</td>
                <td style="padding:6px 10px;color:#6B7280;">${ev.detail}</td>
                <td style="padding:6px 10px;text-align:center;">
                  <span style="display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border-radius:99px;font-size:0.70rem;font-weight:700;background:${s.bg};color:${s.color};">
                    <span style="width:5px;height:5px;border-radius:50%;background:${s.dot};flex-shrink:0;"></span>${s.label}
                  </span>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>`;

  const tableRowsHTML = BEHAVIOR_GRADE_INFO.map(g => {
    const isCurrent = g.grade === currentGrade;
    return `<tr style="border-bottom:1px solid var(--border);${isCurrent ? `background:${g.bg};` : ''}">
      <td style="padding:14px 16px;text-align:center;font-size:1rem;font-weight:800;color:${isCurrent?g.color:'var(--text-sub)'};">${g.grade}</td>
      <td style="padding:14px 16px;font-weight:700;font-size:0.88rem;color:${isCurrent?g.color:'var(--text)'};">
        ${g.name}${isCurrent ? ' <span style="font-size:0.75rem;font-weight:400;opacity:0.7;">← 현재</span>' : ''}
      </td>
      <td style="padding:14px 16px;font-size:0.82rem;line-height:1.65;color:${isCurrent?g.color:'var(--text-sub)'};">
        ${g.desc}
        ${isCurrent ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid ${g.border}30;">
          <div style="font-size:0.77rem;font-weight:700;margin-bottom:6px;">• 사유</div>
          ${reasonHTML}
        </div>` : ''}
      </td>
    </tr>`;
  }).join('');

  el.innerHTML = `
  <div class="print-behavior-page">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid var(--primary);">
      <div>
        <div style="font-size:1.1rem;font-weight:900;color:var(--text);">부정행위 분석 결과</div>
        <div style="font-size:0.82rem;color:var(--text-sub);margin-top:3px;">${e.name} · ${e.email}</div>
      </div>
      <div>${riskBadgeHTML(e.behaviorRisk, true)}</div>
    </div>

    <table style="width:100%;border-collapse:collapse;border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:0;">
      <thead>
        <tr style="background:var(--bg);">
          <th style="padding:10px 16px;text-align:center;font-size:0.78rem;font-weight:700;color:var(--text-sub);border-bottom:1px solid var(--border);width:48px;">#</th>
          <th style="padding:10px 16px;text-align:left;font-size:0.78rem;font-weight:700;color:var(--text-sub);border-bottom:1px solid var(--border);width:160px;">등급</th>
          <th style="padding:10px 16px;text-align:left;font-size:0.78rem;font-weight:700;color:var(--text-sub);border-bottom:1px solid var(--border);">설명</th>
        </tr>
      </thead>
      <tbody>${tableRowsHTML}</tbody>
    </table>
  </div>`;
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function buildAnswerCardHTML(a) {
  /* ── 객관식 ── */
  if (a.type === 'multiple') {
    const hasKey = !!a.correctAnswer;
    const isCorrect = hasKey && a.answer === a.correctAnswer;
    const verdictBadge = hasKey
      ? `<span style="padding:2px 10px;border-radius:99px;font-size:0.74rem;font-weight:700;
          background:${isCorrect ? '#DCFCE7' : '#FEE2E2'};
          color:${isCorrect ? '#166534' : '#991B1B'};">
          ${isCorrect ? '✓ 정답' : '✗ 오답'}</span>`
      : '';

    const optionsHTML = (a.options || []).map(o => {
      const isCorrectOpt  = hasKey && o === a.correctAnswer;
      const isExamineeOpt = o === a.answer;
      const isWrong       = isExamineeOpt && !isCorrectOpt;

      let bg = '#F8FAFC', color = 'var(--text)', border = '#E5E7EB', tag = '';
      if (isCorrectOpt && !isExamineeOpt) {
        bg = '#DCFCE7'; color = '#166534'; border = '#16A34A';
        tag = `<span style="margin-left:auto;font-size:0.70rem;font-weight:700;color:#16A34A;white-space:nowrap;">정답</span>`;
      } else if (isCorrectOpt) {
        bg = '#DCFCE7'; color = '#166534'; border = '#16A34A';
        tag = `<span style="margin-left:auto;font-size:0.70rem;font-weight:700;color:#16A34A;white-space:nowrap;">✓ 정답</span>`;
      } else if (isWrong) {
        bg = '#FEE2E2'; color = '#991B1B'; border = '#DC2626';
        tag = `<span style="margin-left:auto;font-size:0.70rem;font-weight:700;color:#DC2626;white-space:nowrap;">✗ 선택</span>`;
      }
      return `<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;
        border:1px solid ${border};background:${bg};color:${color};font-size:0.80rem;">
        <span style="flex:1;">${o}</span>${tag}
      </div>`;
    }).join('');

    return `
    <div class="answer-card">
      <div class="answer-card-meta">
        <span class="answer-qnum">Q${a.qNum}</span>
        <span class="answer-skill-tag">${a.skill}</span>
        ${verdictBadge}
      </div>
      <div class="answer-question">${a.question}</div>
      <div style="display:flex;flex-direction:column;gap:5px;margin-top:8px;">${optionsHTML}</div>
    </div>`;
  }

  /* ── 코드 ── */
  if (a.type === 'code') {
    const bodyHTML = a.solutionCode
      ? `<div class="code-split">
          <div class="code-panel">
            <div class="code-panel-label" style="color:#166534;">정답 코드</div>
            <pre class="answer-code">${escapeHTML(a.solutionCode)}</pre>
          </div>
          <div class="code-panel">
            <div class="code-panel-label" style="color:var(--primary);">평가자 답안</div>
            <pre class="answer-code">${escapeHTML(a.answer)}</pre>
          </div>
        </div>`
      : `<pre class="answer-code">${escapeHTML(a.answer)}</pre>`;
    return `
    <div class="answer-card">
      <div class="answer-card-meta">
        <span class="answer-qnum">Q${a.qNum}</span>
        <span class="answer-skill-tag">${a.skill}</span>
      </div>
      <div class="answer-question">${a.question}</div>
      <div class="answer-divider"></div>
      ${bodyHTML}
    </div>`;
  }

  /* ── 주관식 / 서술형 ── */
  return `
  <div class="answer-card">
    <div class="answer-card-meta">
      <span class="answer-qnum">Q${a.qNum}</span>
      <span class="answer-skill-tag">${a.skill}</span>
    </div>
    <div class="answer-question">${a.question}</div>
    <div class="answer-divider"></div>
    <div class="answer-response-label">답안</div>
    <div class="answer-text">${a.answer.replace(/\n/g, '<br>')}</div>
  </div>`;
}

function openAnswersDrawer(eId, trackIdx) {
  const e = EXAMINEES.find(x => x.id === eId);
  if (!e) return;
  const track = e.tracks && e.tracks[trackIdx];
  const answers = track && track.answers;

  document.getElementById('answers-drawer-track').textContent = TRACKS_META[trackIdx].name;

  const body = document.getElementById('answers-drawer-body');
  body.innerHTML = (!answers || answers.length === 0)
    ? `<div style="padding:40px 20px;text-align:center;color:var(--text-mute);font-size:0.85rem;">답안 데이터가 없습니다.</div>`
    : answers.map(buildAnswerCardHTML).join('');

  document.getElementById('answers-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeAnswersDrawer(ev) {
  if (ev && ev.target !== document.getElementById('answers-overlay')) return;
  document.getElementById('answers-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

/* ══════════════════════════════
   정적분석 인터랙션
══════════════════════════════ */
function toggleStaticDetail(uid) {
  const detail = document.getElementById(uid + '_detail');
  const btn    = document.getElementById(uid + '_toggle');
  if (!detail) return;
  const open = detail.style.display !== 'none';
  detail.style.display = open ? 'none' : '';
  if (btn) btn.textContent = open ? '세부 결과 ▾' : '세부 결과 ▴';
}

function selectStaticProblem(uid, pi, total) {
  const RM = {
    pass:    { bg: '#F0FDF4', color: '#166534', dot: '#16A34A' },
    warning: { bg: '#FFFBEB', color: '#92400E', dot: '#D97706' },
    fail:    { bg: '#FEF2F2', color: '#991B1B', dot: '#DC2626' },
  };
  for (let i = 0; i < total; i++) {
    const panel = document.getElementById(`${uid}_panel_${i}`);
    const btn   = document.getElementById(`${uid}_btn_${i}`);
    if (!panel || !btn) continue;
    panel.style.display = i === pi ? '' : 'none';
    const rm = RM[btn.dataset.result] || { bg: 'var(--card)', color: 'var(--text)', dot: '#94A3B8' };
    btn.style.borderColor = i === pi ? rm.dot  : 'var(--border)';
    btn.style.background  = i === pi ? rm.bg   : 'var(--card)';
    btn.style.color       = i === pi ? rm.color : 'var(--text)';
  }
}

