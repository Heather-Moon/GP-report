/* ══════════════════════════════
   STATE
══════════════════════════════ */
let currentPage      = 'main';
let selectedExaminee = null;
let selectedTrackIdx = 0;
let tableFilter      = 'all';
let tableCurrentPage = 1;
const ROWS_PER_PAGE  = 5;

/* ══════════════════════════════
   NAVIGATION
══════════════════════════════ */
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  currentPage = page;

  const bc = document.getElementById('breadcrumb');
  const pName = selectedExaminee ? selectedExaminee.name : '';
  if (page === 'main') {
    bc.innerHTML = '';
  } else if (page === 'person') {
    bc.innerHTML = `<span class="crumb-link" onclick="navigate('main')">대시보드</span>
      <span class="crumb-sep">›</span><span>${pName}</span>`;
  } else if (page === 'detail') {
    const tName = TRACKS_META[selectedTrackIdx].name;
    bc.innerHTML = `<span class="crumb-link" onclick="navigate('main')">대시보드</span>
      <span class="crumb-sep">›</span>
      <span class="crumb-link" onclick="navigate('person')">${pName}</span>
      <span class="crumb-sep">›</span><span>${tName}</span>`;
  }
  window.scrollTo(0, 0);
}

/* ══════════════════════════════
   TABLE
══════════════════════════════ */
function setFilter(f, el) {
  tableFilter = f;
  tableCurrentPage = 1;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderTable();
}

function renderTable() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const sortBy = document.getElementById('sort-select').value;

  let data = EXAMINEES.filter(e => {
    if (tableFilter === 'completed'  && e.status !== 'completed')  return false;
    if (tableFilter === 'incomplete' && e.status !== 'incomplete') return false;
    if (search && !e.name.toLowerCase().includes(search) && !e.email.toLowerCase().includes(search)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'score') return (b.totalScore || 0) - (a.totalScore || 0);
    if (sortBy === 'rate')  return (b.rate  || 0) - (a.rate  || 0);
    return 0;
  });

  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));
  if (tableCurrentPage > pages) tableCurrentPage = pages;
  const slice = data.slice((tableCurrentPage - 1) * ROWS_PER_PAGE, tableCurrentPage * ROWS_PER_PAGE);

  const tbody = document.getElementById('examinee-tbody');
  tbody.innerHTML = slice.map((e) => {
    const rank = e.status === 'completed'
      ? EXAMINEES.filter(x => x.status === 'completed')
          .sort((a,b) => (b.totalScore||0)-(a.totalScore||0))
          .findIndex(x => x.id === e.id) + 1
      : null;
    return `
    <tr>
      <td>
        <div style="font-weight:600;">${e.name}</div>
        <div style="font-size:0.76rem; color:var(--text-sub);">${e.email}</div>
      </td>
      <td>${e.status === 'completed'
        ? '<span class="badge badge-complete">완료</span>'
        : '<span class="badge" style="background:#F3F4F6; color:var(--text-sub);">미완료</span>'}</td>
      <td style="font-weight:800; color:var(--primary); font-size:1rem;">${e.totalScore !== null ? e.totalScore + '점' : '-'}</td>
      <td>
        ${e.rate !== null ? `
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="prog-bg" style="width:90px; height:7px;">
            <div class="prog-fill" style="width:${e.rate}%; background:${rateColor(e.rate)};"></div>
          </div>
          <span style="font-size:0.8rem; font-weight:700; color:${rateColor(e.rate)};">${e.rate}%</span>
        </div>` : '-'}
      </td>
      <td style="color:var(--text-sub);">${e.time}</td>
      <td><button class="td-btn" onclick="openPerson(${e.id})">결과 보기</button></td>
    </tr>`;
  }).join('') || `<tr><td colspan="6" style="text-align:center; color:var(--text-mute); padding:24px;">결과 없음</td></tr>`;

  // 페이지네이션
  document.getElementById('pg-info').textContent =
    `총 ${total}명 중 ${(tableCurrentPage-1)*ROWS_PER_PAGE+1}–${Math.min(tableCurrentPage*ROWS_PER_PAGE, total)}명`;
  const btns = document.getElementById('pg-btns');
  btns.innerHTML =
    `<button class="pg-btn" onclick="setPage(${tableCurrentPage-1})" ${tableCurrentPage===1?'disabled style="opacity:.4"':''}>‹</button>` +
    Array.from({length: pages}, (_,i) =>
      `<button class="pg-btn ${i+1===tableCurrentPage?'active':''}" onclick="setPage(${i+1})">${i+1}</button>`
    ).join('') +
    `<button class="pg-btn" onclick="setPage(${tableCurrentPage+1})" ${tableCurrentPage===pages?'disabled style="opacity:.4"':''}>›</button>`;
}

function setPage(p) {
  const pages = Math.ceil(EXAMINEES.length / ROWS_PER_PAGE);
  if (p < 1 || p > pages) return;
  tableCurrentPage = p;
  renderTable();
}

/* ══════════════════════════════
   개인 페이지
══════════════════════════════ */
function openPerson(id) {
  selectedExaminee = EXAMINEES.find(x => x.id === id);
  const e = selectedExaminee;

  // 헤더 채우기
  document.getElementById('p-avatar').textContent = e.name[1] || e.name[0];
  document.getElementById('p-name').textContent = e.name;
  document.getElementById('p-email').textContent = '✉ ' + e.email;
  document.getElementById('p-status').innerHTML = e.status === 'completed'
    ? '<span class="badge badge-complete">평가 완료</span>'
    : '<span class="badge" style="background:#F3F4F6;color:var(--text-sub);">미완료</span>';
  document.getElementById('p-date').textContent = '📅 ' + e.date;
  document.getElementById('p-time-meta').textContent = e.status === 'completed' ? '⏱ ' + e.time : '';

  // 행동 분석 패널 초기화
  document.getElementById('behavior-panel').style.display = 'none';

  // 탭 초기화
  setPersonTab(0);

  // 탭 콘텐츠 렌더
  renderSummaryTab(e);
  if (e.status === 'completed') {
    [0, 1, 2].forEach(ti => renderTrackTab(e, ti));
  } else {
    [1, 2, 3].forEach(i => {
      document.getElementById('ptab-' + i).innerHTML =
        `<div style="padding:40px;text-align:center;color:var(--text-mute);">아직 평가를 완료하지 않았습니다.</div>`;
    });
  }

  navigate('person');
}

function setPersonTab(i) {
  document.querySelectorAll('.person-tab-btn').forEach((b, j) => b.classList.toggle('active', i === j));
  [0, 1, 2, 3].forEach(j => {
    document.getElementById('ptab-' + j).style.display = j === i ? '' : 'none';
  });
}

function toggleBehaviorPanel() {
  const p = document.getElementById('behavior-panel');
  p.style.display = p.style.display === 'none' ? '' : 'none';
}

/* ══════════════════════════════
   트랙 세부 페이지
══════════════════════════════ */
function openDetail(idx) {
  selectedTrackIdx = idx;
  const t = buildTracks(selectedExaminee)[idx];
  const rc = rateColor(t.rate);

  document.getElementById('d-track-title').textContent = `${t.name} — ${t.level}`;
  document.getElementById('d-score').innerHTML = `${t.score}<small>/100</small>`;
  document.getElementById('d-score').style.color = t.color;
  document.getElementById('d-rate').innerHTML = `${t.rate}<small>%</small>`;
  document.getElementById('d-rate').style.color = rc;
  document.getElementById('d-time').textContent = t.time;
  document.getElementById('d-track-desc').textContent = t.desc;

  // 4th summary card: vs avg
  const completed2 = EXAMINEES.filter(x => x.status==='completed' && x.tracks.length>0);
  const trackScores2 = completed2.map(x => x.tracks[idx].score);
  const avgT2 = Math.round(trackScores2.reduce((s,v)=>s+v,0)/trackScores2.length);
  const diff2 = t.score - avgT2;
  const diffEl = document.getElementById('d-vs-avg');
  diffEl.innerHTML = `${diff2>=0?'+':''}${diff2}<small>점</small>`;
  diffEl.style.color = diff2 >= 0 ? 'var(--acquired)' : 'var(--missing)';
  document.getElementById('d-vs-avg-sub').textContent = `전체 평균 ${avgT2}점`;

  // 통계 비교 차트: 히스토그램
  renderHistogram('d-hist', trackScores2,
    Math.round(avgT2), Math.round(trackScores2.sort((a,b)=>a-b)[Math.floor(trackScores2.length/2)]),
    t.score);

  // 그룹 바 차트: 역량별 나 vs 전체 평균
  const skillRates2 = computeSkillAcqRates();
  const groupItems = t.skills.map((s, si) => ({
    label: s.name,
    me:    s.level === 'acquired' ? 100 : s.level === 'partial' ? 50 : 0,
    avg:   skillRates2[idx][si],
  }));
  renderGroupBar('d-group-bar', groupItems);

  // 평가 총평
  document.getElementById('d-assessment').innerHTML = assessmentHTML(generateTrackAssessment(selectedExaminee, idx));

  // 스킬 레벨 분포 바
  const acqCount  = t.skills.filter(s => s.level === 'acquired').length;
  const partCount = t.skills.filter(s => s.level === 'partial').length;
  const misCount  = t.skills.filter(s => s.level === 'missing').length;
  const total = t.skills.length;

  document.getElementById('d-level-bar').innerHTML = `
    <div class="level-bar-seg" style="width:${acqCount/total*100}%; background:var(--acquired);"></div>
    <div class="level-bar-seg" style="width:${partCount/total*100}%; background:var(--partial);"></div>
    <div class="level-bar-seg" style="width:${misCount/total*100}%; background:var(--missing);"></div>
  `;
  document.getElementById('d-level-legend').innerHTML = `
    <div class="legend-item"><div class="legend-dot" style="background:var(--acquired);"></div>획득 ${acqCount}개</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--partial);"></div>보완 필요 ${partCount}개</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--missing);"></div>미획득 ${misCount}개</div>
    <div class="legend-item" style="margin-left:auto; color:var(--text-mute);">전체 ${total}개 스킬</div>
  `;

  // 아코디언 (with per-skill acquisition rate)
  const skillRates3 = computeSkillAcqRates();
  document.getElementById('d-accordion').innerHTML = t.skills.map((s, si) => {
    const acqRate = skillRates3[idx][si];
    const rateCol = acqRate >= 80 ? 'var(--acquired)' : acqRate >= 50 ? 'var(--partial)' : 'var(--missing)';
    return `<div class="acc-item">
      <div class="acc-header" onclick="toggleAcc(this)">
        <span class="badge ${LEVEL_CLASS[s.level]}">${LEVEL_LABEL[s.level]}</span>
        <span class="acc-title">${s.name}</span>
        <div class="acc-right">
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;min-width:72px;">
            <span style="font-size:0.72rem;font-weight:700;color:${rateCol};">전체 획득률 ${acqRate}%</span>
            <div style="width:70px;height:4px;background:#F3F4F6;border-radius:99px;overflow:hidden;">
              <div style="width:${acqRate}%;height:100%;background:${rateCol};border-radius:99px;"></div>
            </div>
          </div>
          <span class="acc-arrow" style="margin-left:8px;">▼</span>
        </div>
      </div>
      <div class="acc-body">
        <div class="acc-inner">${s.desc}</div>
      </div>
    </div>`;
  }).join('');

  navigate('detail');
}

function toggleAcc(header) {
  header.classList.toggle('open');
  header.nextElementSibling.classList.toggle('open');
}

/* ══════════════════════════════
   MAIN PAGE TABS
══════════════════════════════ */
function setMainTab(tab) {
  ['results', 'examinees'].forEach(t => {
    document.getElementById('main-tab-' + t).style.display = t === tab ? '' : 'none';
    document.getElementById('main-tab-btn-' + t).classList.toggle('active', t === tab);
  });
  window.scrollTo(0, 0);
}

/* ══════════════════════════════
   INIT
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  renderMainStats();
  renderInsightCharts();
});
