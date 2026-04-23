/* ══════════════════════════════
   STATE
══════════════════════════════ */
let currentPage      = 'main';
let selectedExaminee = null;
let selectedTrackIdx = 0;
let tableFilter      = 'all';
let tableCurrentPage = 1;
let ROWS_PER_PAGE    = 5;

/* ══════════════════════════════
   NAVIGATION
══════════════════════════════ */
function goMain(tab) {
  navigate('main');
  setMainTab(tab || 'results');
}

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  currentPage = page;

  const bc = document.getElementById('breadcrumb');
  const pName = selectedExaminee ? selectedExaminee.name : '';
  if (page === 'main') {
    bc.innerHTML = '';
  } else if (page === 'person') {
    bc.innerHTML = `<span class="crumb-link" onclick="goMain('results')">대시보드</span>
      <span class="crumb-sep">›</span><span>${pName}</span>`;
  } else if (page === 'detail') {
    const tName = TRACKS_META[selectedTrackIdx].name;
    bc.innerHTML = `<span class="crumb-link" onclick="goMain('results')">대시보드</span>
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

    const trackDetailHTML = e.status === 'completed' && e.tracks.length
      ? `<td colspan="7" style="padding:0;">
          <table class="track-detail-table">
            <thead>
              <tr>
                <th>트랙</th>
                <th>점수</th>
                <th>합격 여부</th>
                <th>스킬 확보율</th>
                <th>획득 스킬</th>
                <th>소요시간</th>
              </tr>
            </thead>
            <tbody>
              ${e.tracks.map((t, ti) => {
                const meta = TRACKS_META[ti];
                const col  = TRACK_COLORS[ti];
                const pass = t.score >= 80;
                const totalSkills = meta.skills.length;
                const acqSkills   = t.skillLevels.filter(l => l === 'acquired').length;
                return `<tr>
                  <td style="font-weight:600;color:var(--text);">${meta.name}</td>
                  <td style="font-weight:800;color:var(--primary);">${t.score}<span style="font-size:0.72rem;font-weight:400;color:var(--text-sub);margin-left:2px;">점</span></td>
                  <td><span style="display:inline-block;font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:99px;white-space:nowrap;
                    background:${pass?'#F0FDF4':'#FEF2F2'};color:${pass?'#16A34A':'#DC2626'};border:1px solid ${pass?'#BBF7D0':'#FECACA'};">${pass?'합격':'불합격'}</span></td>
                  <td style="font-weight:700;color:${rateColor(t.rate)};">${t.rate}%</td>
                  <td>
                    <span style="font-weight:700;color:var(--text);">${acqSkills}</span>
                    <span style="color:var(--text-mute);font-size:0.78rem;"> / ${totalSkills} 스킬</span>
                  </td>
                  <td style="color:var(--text-sub);">${t.time}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </td>`
      : `<td colspan="7" style="padding:12px 20px;font-size:0.82rem;color:var(--text-mute);">평가 미완료 — 트랙 정보 없음</td>`;

    return `
    <tr class="examinee-row" data-eid="${e.id}">
      <td>
        <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:8px;">
          <div>
            <div style="font-weight:600;">${e.name}</div>
            <div style="font-size:0.76rem; color:var(--text-sub);">${e.email}</div>
          </div>
          ${e.status === 'completed' ? `<button class="td-expand-btn" id="expand-btn-${e.id}" onclick="toggleTrackDetail(${e.id})">상세보기</button>` : ''}
        </div>
      </td>
      <td>${e.status === 'completed'
        ? '<span class="badge badge-complete">완료</span>'
        : '<span class="badge" style="background:#F3F4F6; color:var(--text-sub);">미완료</span>'}</td>
      <td style="color:var(--text-sub); font-size:0.82rem;">${e.date || '-'}</td>
      <td style="font-weight:800; color:var(--primary); font-size:1rem;">${e.totalScore !== null ? e.totalScore + '점' : '-'}</td>
      <td>
        ${e.rate !== null ? `<span style="font-size:0.88rem; font-weight:700; color:${rateColor(e.rate)};">${e.rate}%</span>` : '-'}
      </td>
      <td style="color:var(--text-sub);">${e.time}</td>
      <td style="white-space:nowrap;">
        <button class="td-btn" onclick="openPerson(${e.id})">결과 보기</button>
      </td>
    </tr>
    <tr class="track-detail-row" id="track-detail-${e.id}" style="display:none;">
      ${trackDetailHTML}
    </tr>`;
  }).join('') || `<tr><td colspan="7" style="text-align:center; color:var(--text-mute); padding:24px;">결과 없음</td></tr>`;

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

function toggleTrackDetail(id) {
  const row = document.getElementById('track-detail-' + id);
  const btn = document.getElementById('expand-btn-' + id);
  if (!row) return;
  const open = row.style.display === 'none' || row.style.display === '';
  row.style.display = open ? 'table-row' : 'none';
  if (btn) btn.textContent = open ? '닫기' : '상세보기';
}

function setPage(p) {
  const pages = Math.ceil(EXAMINEES.length / ROWS_PER_PAGE);
  if (p < 1 || p > pages) return;
  tableCurrentPage = p;
  renderTable();
}

function setRowsPerPage(v) {
  ROWS_PER_PAGE = parseInt(v, 10);
  tableCurrentPage = 1;
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

  // 탭 초기화
  setPersonTab(0);

  // 탭 콘텐츠 렌더
  renderSummaryTab(e);
  if (e.status === 'completed') {
    [0, 1, 2].forEach(ti => renderTrackTab(e, ti));
    renderBehaviorPrintTab(e);
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

/* ══════════════════════════════
   행동 분석 모달
══════════════════════════════ */
const BEHAVIOR_EVENTS = [
  { time:'00:03:12', label:'화면 전환', detail:'외부 앱으로 전환 (4.1초)', severity:'high' },
  { time:'00:08:47', label:'붙여넣기',  detail:'Ctrl+V 감지 — 코드 에디터', severity:'high' },
  { time:'00:15:03', label:'복사',      detail:'Ctrl+C 감지', severity:'medium' },
  { time:'00:22:58', label:'탭 전환',   detail:'브라우저 새 탭 이동 (7.8초)', severity:'medium' },
  { time:'00:31:20', label:'붙여넣기',  detail:'Ctrl+V 감지 — 답안 영역', severity:'high' },
  { time:'00:44:05', label:'화면 전환', detail:'외부 앱으로 전환 (12.3초)', severity:'high' },
  { time:'00:52:34', label:'우클릭',    detail:'컨텍스트 메뉴 사용', severity:'low' },
  { time:'01:05:18', label:'복사',      detail:'Ctrl+C 감지', severity:'medium' },
  { time:'01:12:44', label:'탭 전환',   detail:'브라우저 새 탭 이동 (5.2초)', severity:'medium' },
  { time:'01:21:09', label:'붙여넣기',  detail:'Ctrl+V 감지 — 코드 에디터', severity:'high' },
  { time:'01:38:27', label:'화면 전환', detail:'외부 앱으로 전환 (9.6초)', severity:'high' },
  { time:'01:49:53', label:'우클릭',    detail:'컨텍스트 메뉴 사용', severity:'low' },
  { time:'02:01:31', label:'복사',      detail:'Ctrl+C 감지', severity:'medium' },
  { time:'02:11:08', label:'붙여넣기',  detail:'Ctrl+V 감지 — 답안 영역', severity:'high' },
];

const SEVERITY_COLOR = {
  high:   { dot:'#DC2626', badge:'#FEF2F2', text:'#991B1B', label:'위험' },
  medium: { dot:'#D97706', badge:'#FFFBEB', text:'#92400E', label:'주의' },
  low:    { dot:'#1565C0', badge:'#EBF3FF', text:'#1565C0', label:'참고' },
};

function toggleBehaviorPanel() {
  const modal = document.getElementById('behavior-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // 응시자 이름 표시
  const nameEl = document.getElementById('bm-name');
  if (selectedExaminee) nameEl.textContent = selectedExaminee.name;

  // 타임라인 렌더링
  const list = document.getElementById('bm-timeline-list');
  const events = (selectedExaminee && selectedExaminee.behaviorEvents != null)
    ? selectedExaminee.behaviorEvents
    : BEHAVIOR_EVENTS;

  if (events.length === 0) {
    list.innerHTML = `<div style="padding:32px 16px; text-align:center; color:var(--text-mute); font-size:0.875rem;">
      관찰된 특이사항이 없습니다.
    </div>`;
  } else {
    list.innerHTML = events.map(ev => {
      const s = SEVERITY_COLOR[ev.severity];
      return `<div class="bm-event">
        <div class="bm-event-dot-wrap">
          <div class="bm-event-dot" style="background:${s.dot};"></div>
          <div class="bm-event-line"></div>
        </div>
        <div class="bm-event-content">
          <div class="bm-event-time">${ev.time}</div>
          <div class="bm-event-label">${ev.label}</div>
          <div class="bm-event-detail">${ev.detail}</div>
          <span class="bm-badge" style="background:${s.badge};color:${s.text};">${s.label}</span>
        </div>
      </div>`;
    }).join('');
  }
}

function closeBehaviorModal(e) {
  if (e && e.target !== document.getElementById('behavior-modal')) return;
  document.getElementById('behavior-modal').style.display = 'none';
  document.body.style.overflow = '';
}

function toggleBmPlay(btn) {
  btn.textContent = btn.textContent === '▶' ? '⏸' : '▶';
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

function toggleTrackDesc(idx) {
  const body = document.getElementById('track-desc-body-' + idx);
  const btn  = body.previousElementSibling;
  const open = body.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
  btn.querySelector('.tdc-arrow').style.transform = open ? 'rotate(180deg)' : '';
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
   PRINT
══════════════════════════════ */
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('#page-person .person-tab-content').forEach(t => {
    t.dataset.prevDisplay = t.style.display;
    t.style.display = 'block';
  });
});

window.addEventListener('afterprint', () => {
  document.querySelectorAll('#page-person .person-tab-content').forEach(t => {
    t.style.display = t.dataset.prevDisplay || '';
    delete t.dataset.prevDisplay;
  });
  // ptab-4는 항상 화면에서 숨김 유지
  const ptab4 = document.getElementById('ptab-4');
  if (ptab4) ptab4.style.display = 'none';
});

/* ══════════════════════════════
   INIT
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  renderMainStats();
  renderInsightCharts();
});
