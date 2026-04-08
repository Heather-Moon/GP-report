/* ══════════════════════════════
   DATA (MLOps 엔지니어_260405)
══════════════════════════════ */
const EVALUATION = {
  title:     'MLOps 엔지니어_260405',
  period:    '2026.03.30 ~ 2026.04.05',
  timeLimit: '2시간 40분',
};

/* 트랙/스킬 메타데이터 (이름·설명·아이콘 등 고정값) */
const TRACKS_META = [
  {
    id: 1,
    name: '클라우드 & 분산 시스템 아키텍처',
    level: '중급', icon: '☁️',
    desc: '이 레벨은 클라우드 네이티브 및 분산 시스템 환경에서의 복잡한 요구사항을 해결하기 위해, 아키텍처를 직접 설계하고 운영 전략을 수립할 수 있는 실전 역량을 갖추는 단계입니다.',
    skills: [
      { name: '분산 시스템 설계',
        desc: '확장 가능한 분산 환경을 구축하기 위한 설계 능력을 검증합니다. 분산 시스템의 기초 개념을 바탕으로 노드 간 상호작용 원리를 이해하고, 적절한 설계 패턴을 적용하여 아키텍처를 구조화하는 능력을 평가합니다.' },
      { name: '고성능 시스템 아키텍처 설계',
        desc: '대규모 트래픽 환경에서도 안정적인 응답 속도를 유지하기 위한 최적화 능력을 검증합니다. 성능 측정 및 분석을 통해 시스템 병목 구간을 정확히 진단하고, 캐싱 전략 심화 기술을 적용하여 데이터 접근 속도를 극대화하는 능력을 평가합니다.' },
      { name: '고가용성 시스템 설계 및 운영',
        desc: '서비스의 연속성을 보장하기 위해 중단 없는 시스템을 설계하고 운영하는 능력을 검증합니다. 고가용성 확보 전략을 수립하여 SPOF를 제거하고, 로드밸런싱을 통해 트래픽을 효율적으로 분산하는 능력을 평가합니다.' },
      { name: '클라우드 네이티브 아키텍처 설계',
        desc: '클라우드 환경에 최적화된 유연하고 탄력적인 시스템을 구축하는 능력을 검증합니다. 클라우드 네이티브 개념을 바탕으로 MSA 및 DevOps 원칙을 이해하고, 컨테이너 기술을 활용하여 애플리케이션의 배포와 관리 효율성을 극대화하는 능력을 평가합니다.' },
      { name: '아키텍처 평가 및 개선',
        desc: '시스템의 현재 상태를 객관적으로 진단하고 지속 가능한 발전 방향을 설계하는 능력을 검증합니다. 아키텍처 평가 방법과 품질 속성을 활용하여 시스템의 구조적 적합성을 판별하고, 기술 부채를 관리하는 실무 역량을 포함합니다.' },
    ]
  },
  {
    id: 2,
    name: '클라우드 컴퓨팅',
    level: '중급', icon: '🌐',
    desc: '클라우드 컴퓨팅의 중급 수준 실무 역량을 종합적으로 검증합니다. 클라우드 아키텍처 설계 원칙과 핵심 구성 요소 이해를 바탕으로, 확장성과 비즈니스 연속성을 고려한 아키텍처 구성 능력을 평가합니다.',
    skills: [
      { name: '클라우드 컴퓨팅 개념과 구조',
        desc: '클라우드 컴퓨팅의 기본 개념과 구조적 원리를 이해하는 능력을 검증합니다. 클라우드 환경을 구성하는 핵심 요소와 그 상호 연관성을 파악하고, 클라우드 관리 및 보안의 기본 요소를 인식합니다.' },
      { name: '확장성과 복원력을 갖춘 클라우드 아키텍처 설계',
        desc: '확장성과 복원력을 갖춘 클라우드 아키텍처를 설계하는 능력을 검증합니다. 자동 확장, 로드 밸런싱, 멀티 AZ 설계 등의 개념을 적용하여 장애 복구와 재해 대응이 가능한 시스템을 구축합니다.' },
      { name: '실무 중심 클라우드 보안 및 규제 준수',
        desc: '실무 중심의 클라우드 보안 및 규제 준수 역량을 검증합니다. IAM 역할 및 정책 설정, 보안 네트워크 아키텍처 구축, 데이터 암호화 및 접근 제어 적용을 포함합니다.' },
      { name: '클라우드 네트워크 및 성능 최적화',
        desc: '클라우드 네트워크를 효율적이고 안정적으로 설계·관리·최적화하는 능력을 검증합니다. 보안 네트워크 구조 설계, DNS와 CDN을 활용한 트래픽 분산, 네트워크 성능 모니터링 및 비용 효율적 네트워크 전략 수립을 포함합니다.' },
    ]
  },
  {
    id: 3,
    name: 'Python',
    level: '전문가', icon: '🐍',
    desc: 'Python 언어의 고급 수준 실무 역량을 종합적으로 검증합니다. 데코레이터와 컨텍스트 매니저를 활용한 고급 언어 기능 구현, 람다와 고급 모듈을 통한 효율적인 코드 작성 능력을 평가합니다.',
    skills: [
      { name: '데코레이터',
        desc: 'Python에서 데코레이터를 이해하고 구현하는 능력을 검증합니다. 데코레이터 정의, 인자를 포함한 데코레이터 적용, 데코레이터 중첩, 클래스 기반 데코레이터를 포함합니다.' },
      { name: '고급 Python 모듈',
        desc: '고급 Python 모듈을 이해하고 활용하는 능력을 검증합니다. 알고리즘, 자료구조, 수학 연산, 날짜 및 시간 처리와 관련된 모듈을 포함합니다.' },
      { name: '람다',
        desc: 'Python에서 람다 함수를 정의하고 활용하는 능력을 검증합니다. 매개변수 처리, 반환값 처리, 간결한 연산을 위한 람다 함수 활용을 포함합니다.' },
      { name: '파일 입출력',
        desc: 'Python에서 파일 입출력 작업을 수행하는 능력을 검증합니다. 파일 읽기, 파일 쓰기, 파일 모드 관리, 파일 처리 중 예외 처리를 포함합니다.' },
      { name: 'JSON',
        desc: 'Python에서 JSON 데이터를 파싱하고 처리하는 능력을 검증합니다. JSON 데이터 읽기 및 쓰기, JSON 구조 이해, JSON 데이터 타입 처리를 포함합니다.' },
      { name: '멀티프로세싱',
        desc: 'Python에서 다중 프로세스를 생성하고 관리하는 능력을 검증합니다. 프로세스 생성 및 관리, 프로세스 간 통신, 동기화 기법, 멀티프로세싱 환경에서의 예외 처리를 포함합니다.' },
      { name: '멀티스레딩',
        desc: 'Python에서 멀티스레딩을 구현하는 능력을 검증합니다. 스레드 생성 및 관리, 스레드 간 통신, 동기화 기법, 스레드 프로그램에서의 예외 처리를 포함합니다.' },
    ]
  }
];

/*
  tracks[i].skillLevels 순서는 TRACKS_META[i].skills 순서와 동일:
  T1(5개): 분산시스템설계 / 고성능아키텍처 / 고가용성 / 클라우드네이티브 / 아키텍처평가
  T2(4개): 클라우드개념 / 확장성아키텍처 / 보안규제 / 네트워크최적화
  T3(7개): 데코레이터 / 고급모듈 / 람다 / 파일입출력 / JSON / 멀티프로세싱 / 멀티스레딩
*/
const EXAMINEES = [
  {
    id: 1,
    name: '덕인 손', email: 'dlwmznzl@gmail.com',
    status: 'completed', date: '2026.04.05',
    totalScore: 80, rate: 77.1, time: '2:18:43',
    tracks: [
      { score: 55, rate: 47.8, time: '0:08:20',
        skillLevels: ['partial','acquired','partial','acquired','missing'] },
      { score: 90, rate: 89.5, time: '0:20:11',
        skillLevels: ['acquired','acquired','acquired','partial'] },
      { score: 95, rate: 91.0, time: '1:50:12',
        skillLevels: ['acquired','acquired','acquired','acquired','acquired','partial','acquired'] },
    ]
  },
  {
    id: 2,
    name: '김지원', email: 'jiwon.kim@example.com',
    status: 'completed', date: '2026.04.04',
    totalScore: 92, rate: 88.5, time: '1:54:20',
    tracks: [
      { score: 88, rate: 80.0, time: '0:18:45',
        skillLevels: ['acquired','acquired','acquired','acquired','partial'] },
      { score: 95, rate: 93.8, time: '0:22:33',
        skillLevels: ['acquired','acquired','acquired','acquired'] },
      { score: 93, rate: 91.4, time: '1:13:02',
        skillLevels: ['acquired','acquired','acquired','acquired','acquired','acquired','partial'] },
    ]
  },
  {
    id: 3,
    name: '이준혁', email: 'junhyuk.lee@example.com',
    status: 'completed', date: '2026.04.04',
    totalScore: 65, rate: 62.5, time: '2:31:08',
    tracks: [
      { score: 48, rate: 40.0, time: '0:25:14',
        skillLevels: ['missing','acquired','partial','partial','missing'] },
      { score: 75, rate: 75.0, time: '0:28:50',
        skillLevels: ['acquired','acquired','partial','acquired'] },
      { score: 72, rate: 71.4, time: '1:37:04',
        skillLevels: ['acquired','partial','acquired','acquired','partial','missing','acquired'] },
    ]
  },
  {
    id: 4,
    name: '박소연', email: 'soyeon.park@example.com',
    status: 'completed', date: '2026.04.05',
    totalScore: 46, rate: 41.7, time: '2:38:51',
    tracks: [
      { score: 35, rate: 20.0, time: '0:31:22',
        skillLevels: ['missing','partial','missing','missing','missing'] },
      { score: 55, rate: 50.0, time: '0:29:17',
        skillLevels: ['acquired','partial','missing','partial'] },
      { score: 48, rate: 57.1, time: '1:38:12',
        skillLevels: ['acquired','partial','partial','missing','acquired','missing','partial'] },
    ]
  },
  {
    id: 5,
    name: '최민서', email: 'minseo.choi@example.com',
    status: 'completed', date: '2026.04.03',
    totalScore: 97, rate: 97.9, time: '1:22:05',
    tracks: [
      { score: 96, rate: 100.0, time: '0:14:38',
        skillLevels: ['acquired','acquired','acquired','acquired','acquired'] },
      { score: 98, rate: 100.0, time: '0:18:21',
        skillLevels: ['acquired','acquired','acquired','acquired'] },
      { score: 97, rate: 100.0, time: '0:49:06',
        skillLevels: ['acquired','acquired','acquired','acquired','acquired','acquired','acquired'] },
    ]
  },
  {
    id: 6,
    name: '정현우', email: 'hyunwoo.jung@example.com',
    status: 'completed', date: '2026.04.04',
    totalScore: 73, rate: 70.8, time: '2:15:33',
    tracks: [
      { score: 62, rate: 60.0, time: '0:22:10',
        skillLevels: ['acquired','acquired','partial','acquired','missing'] },
      { score: 82, rate: 81.3, time: '0:24:45',
        skillLevels: ['acquired','acquired','acquired','partial'] },
      { score: 75, rate: 71.4, time: '1:28:38',
        skillLevels: ['acquired','acquired','partial','acquired','partial','missing','acquired'] },
    ]
  },
  {
    id: 7,
    name: '강태양', email: 'taeyang.kang@example.com',
    status: 'completed', date: '2026.04.05',
    totalScore: 58, rate: 52.1, time: '2:29:44',
    tracks: [
      { score: 42, rate: 40.0, time: '0:27:30',
        skillLevels: ['missing','partial','missing','acquired','missing'] },
      { score: 68, rate: 62.5, time: '0:26:12',
        skillLevels: ['acquired','partial','acquired','missing'] },
      { score: 64, rate: 57.1, time: '1:36:02',
        skillLevels: ['acquired','acquired','partial','partial','acquired','missing','partial'] },
    ]
  },
  {
    id: 8,
    name: '윤서진', email: 'seojin.yoon@example.com',
    status: 'completed', date: '2026.04.03',
    totalScore: 86, rate: 83.3, time: '1:58:17',
    tracks: [
      { score: 78, rate: 80.0, time: '0:19:55',
        skillLevels: ['acquired','acquired','acquired','acquired','partial'] },
      { score: 92, rate: 93.8, time: '0:21:08',
        skillLevels: ['acquired','acquired','acquired','acquired'] },
      { score: 88, rate: 85.7, time: '1:17:14',
        skillLevels: ['acquired','acquired','acquired','acquired','acquired','partial','acquired'] },
    ]
  },
  {
    id: 9,
    name: '임채원', email: 'chaewon.lim@example.com',
    status: 'incomplete', date: '-',
    totalScore: null, rate: null, time: '-',
    tracks: []
  },
  {
    id: 10,
    name: '조아린', email: 'arin.jo@example.com',
    status: 'incomplete', date: '-',
    totalScore: null, rate: null, time: '-',
    tracks: []
  },
];

/* ══════════════════════════════
   CONSTANTS & HELPERS
══════════════════════════════ */
const LEVEL_LABEL = { acquired: '획득', partial: '보완 필요', missing: '미획득' };
const LEVEL_CLASS = { acquired: 'badge-acquired', partial: 'badge-partial', missing: 'badge-missing' };
const LEVEL_COLOR = { acquired: '#16A34A', partial: '#D97706', missing: '#DC2626' };

/* 점수 구간에 따른 트랙 컬러 */
function trackColor(score)   { return score >= 80 ? '#16A34A' : score >= 60 ? '#D97706' : '#DC2626'; }
function trackColorBg(score) { return score >= 80 ? '#F0FDF4' : score >= 60 ? '#FFFBEB' : '#FEF2F2'; }
function rateColor(rate)     { return rate  >= 80 ? 'var(--acquired)' : rate >= 60 ? 'var(--partial)' : 'var(--missing)'; }

/* 응시자 + TRACKS_META 병합 → 렌더용 트랙 배열 */
function buildTracks(examinee) {
  if (!examinee.tracks || examinee.tracks.length === 0) return [];
  return TRACKS_META.map((meta, i) => {
    const pt = examinee.tracks[i];
    return {
      ...meta,
      score: pt.score,
      rate:  pt.rate,
      time:  pt.time,
      color:   trackColor(pt.score),
      colorBg: trackColorBg(pt.score),
      skills: meta.skills.map((s, j) => ({ ...s, level: pt.skillLevels[j] })),
    };
  });
}
