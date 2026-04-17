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
    timeLimit: '0:40:00',
    level: '중급', icon: '☁️',
    desc: '이 레벨은 클라우드 네이티브 및 분산 시스템 환경에서의 복잡한 요구사항을 해결하기 위해, 아키텍처를 직접 설계하고 운영 전략을 수립할 수 있는 실전 역량을 갖추는 단계입니다.',

    skills: [
      { name: '분산 시스템 설계',
        desc: '본 역량은 확장 가능한 분산 환경을 구축하기 위한 설계 능력을 검증합니다. 분산 시스템의 기초 개념을 바탕으로 노드 간 상호작용 원리를 이해하고, 적절한 설계 패턴을 적용하여 아키텍처를 구조화하는 능력을 평가합니다. 또한, 트랜잭션 관리 심화 기술을 통해 복잡한 네트워크 상황에서도 데이터 정합성을 보장하는 실무 역량을 포함합니다.' },
      { name: '고성능 시스템 아키텍처 설계',
        desc: '본 역량은 대규모 트래픽 환경에서도 안정적인 응답 속도를 유지하기 위한 최적화 능력을 검증합니다. 성능 측정 및 분석을 통해 시스템 병목 구간을 정확히 진단하고, 캐싱 전략 심화 기술을 적용하여 데이터 접근 속도를 극대화하는 능력을 평가합니다. 또한, 비동기 처리 심화 설계 역량을 바탕으로 시스템 간 결합도를 낮추고 처리 효율을 최적화하는 실무 능력을 포함합니다.' },
      { name: '고가용성 시스템 설계 및 운영',
        desc: '본 역량은 서비스의 연속성을 보장하기 위해 중단 없는 시스템을 설계하고 운영하는 능력을 검증합니다. 고가용성 확보 전략을 수립하여 단일 장애 지점(SPOF)을 제거하고, 로드밸런싱을 통해 트래픽을 효율적으로 분산하여 시스템 부하를 관리하는 능력을 평가합니다. 또한, 장애 복구 전략을 바탕으로 비상 상황 발생 시 서비스를 신속하게 정상화하는 실무 대응 역량을 포함합니다.' },
      { name: '클라우드 네이티브 아키텍처 설계',
        desc: '본 역량은 클라우드 환경에 최적화된 유연하고 탄력적인 시스템을 구축하는 능력을 검증합니다. 클라우드 네이티브 개념을 바탕으로 MSA 및 DevOps 원칙을 이해하고, 컨테이너 기술을 활용하여 애플리케이션의 배포와 관리 효율성을 극대화하는 능력을 평가합니다. 또한, 서버리스 컴퓨팅 설계를 통해 인프라 관리 부담을 최소화하고 자원을 효율적으로 운영하는 실무 역량을 포함합니다.' },
      { name: '아키텍처 평가 및 개선',
        desc: '본 역량은 시스템의 현재 상태를 객관적으로 진단하고 지속 가능한 발전 방향을 설계하는 능력을 검증합니다. 아키텍처 평가 방법과 품질 속성을 활용하여 시스템의 구조적 적합성을 판별하고, 아키텍처 개선 전략을 통해 도출된 문제점을 체계적으로 해결하는 능력을 평가합니다. 또한, 누적된 기술 부채를 관리하고 중장기적 기술 로드맵을 수립하여 비즈니스 변화에 유연하게 대응하는 실무 역량을 포함합니다.' },
    ]
  },
  {
    id: 2,
    name: '클라우드 컴퓨팅',
    timeLimit: '0:30:00',
    level: '중급', icon: '🌐',
    desc: '본 트랙은 클라우드 컴퓨팅의 중급 수준 실무 역량을 종합적으로 검증합니다. 클라우드 아키텍처 설계 원칙과 핵심 구성 요소 이해를 바탕으로, 확장성과 비즈니스 연속성을 고려한 아키텍처 구성 능력을 평가합니다. 또한 실무 보안 및 컴플라이언스 적용, 고성능·비용 효율적 네트워크 설계와 운영 역량을 함께 진단합니다.\n본 트랙을 통해 응시자가 현업에서 요구되는 중급 클라우드 컴퓨팅 역량을 실무 수준으로 보유하고 있는지 진단할 수 있습니다.',
    skills: [
      { name: '클라우드 컴퓨팅 개념과 구조',
        desc: '본 역량은 클라우드 컴퓨팅의 기본 개념과 구조적 원리를 이해하는 능력을 검증합니다. 클라우드 환경을 구성하는 핵심 요소와 그 상호 연관성을 파악하고, 클라우드 관리 및 보안의 기본 요소를 인식하는 것이 포함됩니다.' },
      { name: '확장성과 복원력을 갖춘 클라우드 아키텍처 설계',
        desc: '본 역량은 확장성과 복원력을 갖춘 클라우드 아키텍처를 설계하는 능력을 검증합니다. 자동 확장, 로드 밸런싱, 멀티 AZ 설계 등의 개념을 적용하여 장애 복구와 재해 대응이 가능한 시스템을 구축하는 것이 포함됩니다.' },
      { name: '실무 중심 클라우드 보안 및 규제 준수',
        desc: '본 역량은 실무 중심의 클라우드 보안 및 규제 준수 역량을 검증합니다. IAM 역할 및 정책 설정, 보안 네트워크 아키텍처 구축, 데이터 암호화 및 접근 제어 적용, 안전한 클라우드 운영을 위한 규제 요구사항 이해가 포함됩니다.' },
      { name: '클라우드 네트워크 및 성능 최적화',
        desc: '본 역량은 클라우드 네트워크를 효율적이고 안정적으로 설계·관리·최적화하는 능력을 검증합니다. 보안 네트워크 구조 설계, DNS와 CDN을 활용한 트래픽 분산, 네트워크 성능 모니터링 및 문제 해결, 비용 효율적 네트워크 전략 수립이 포함됩니다.' },
    ]
  },
  {
    id: 3,
    name: 'Python',
    timeLimit: '2:00:00',
    level: '전문가', icon: '🐍',
    desc: '본 트랙은 Python 언어의 고급 수준 실무 역량을 종합적으로 검증합니다. 데코레이터와 컨텍스트 매니저를 활용한 고급 언어 기능 구현, 람다와 고급 모듈을 통한 효율적인 코드 작성 능력을 평가합니다. 또한 파일 처리와 JSON 데이터 관리, 멀티스레딩·멀티프로세싱 기반 병렬 처리 역량을 함께 진단합니다.\n본 트랙을 통해 응시자가 현업 Python 개발자로서 요구되는 고급 언어 역량을 실무 수준으로 보유하고 있는지 진단할 수 있습니다.',
    skills: [
      { name: '데코레이터',
        desc: '본 역량은 Python에서 데코레이터를 이해하고 구현하는 능력을 검증합니다. 데코레이터 정의, 인자를 포함한 데코레이터 적용, 데코레이터 중첩, 클래스 기반 데코레이터와 같은 대표적인 내용을 포함합니다.' },
      { name: '고급 Python 모듈',
        desc: '본 역량은 고급 Python 모듈을 이해하고 활용하는 능력을 검증합니다. 알고리즘, 자료구조, 수학 연산, 날짜 및 시간 처리와 관련된 모듈과 같은 내용을 포함합니다.' },
      { name: '람다',
        desc: '본 역량은 Python에서 람다 함수를 정의하고 활용하는 능력을 검증합니다. 매개변수 처리, 반환값 처리, 간결한 연산을 위한 람다 함수 활용과 같은 내용을 포함합니다.' },
      { name: '파일 입출력',
        desc: '본 역량은 Python에서 파일 입출력 작업을 수행하는 능력을 검증합니다. 파일 읽기, 파일 쓰기, 파일 모드 관리, 파일 처리 중 예외 처리와 같은 내용을 포함합니다.' },
      { name: 'JSON',
        desc: '본 역량은 Python에서 JSON 데이터를 파싱하고 처리하는 능력을 검증합니다. JSON 데이터 읽기 및 쓰기, JSON 구조 이해, JSON 데이터 타입 처리를 포함합니다.' },
      { name: '멀티프로세싱',
        desc: '본 역량은 Python에서 다중 프로세스를 생성하고 관리하는 능력을 검증합니다. 프로세스 생성 및 관리, 프로세스 간 통신, 동기화 기법, 멀티프로세싱 환경에서의 예외 처리를 포함합니다.' },
      { name: '멀티스레딩',
        desc: '본 역량은 Python에서 멀티스레딩을 구현하는 능력을 검증합니다. 스레드 생성 및 관리, 스레드 간 통신, 동기화 기법, 스레드 프로그램에서의 예외 처리를 포함합니다.' },
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
    name: '손덕인', email: 'dlwmznzl@gmail.com',
    status: 'completed', date: '2026.04.04',
    totalScore: 80, rate: 81.3, time: '2:19:30',
    behaviorRisk: { level: 'normal', highCount: 0, medCount: 0 },
    assessment: '본 응시자는 Python, Cloud & Distributed Systems Architecture, Cloud Computing 트랙 역량 진단을 완료했습니다.\n\nPython 트랙에서는 고급 Python 모듈, 파일 입출력, 데코레이터, 람다, 멀티프로세싱, 멀티스레딩 전 영역에서 요구 역량이 확인되며, 표준 라이브러리와 동시성 도구를 활용해 구조화된 코드를 설계하는 능력이 드러납니다.\n\nCloud & Distributed Systems Architecture 트랙에서는 고성능 시스템 아키텍처 설계와 클라우드 네이티브 아키텍처 설계에서 캐시와 비동기 처리, 불변 인프라와 컨테이너 보안을 이해하고 있으나, 분산 시스템 설계, 고가용성 시스템 설계 및 운영, 아키텍처 평가 및 개선 역량은 보완이 필요합니다.\n\nCloud Computing 트랙에서는 클라우드 컴퓨팅 개념과 구조, 실무 중심 클라우드 보안 및 규제 준수, 클라우드 네트워크 및 성능 최적화, 확장성과 복원력을 갖춘 클라우드 아키텍처 설계 전반에서 높은 수준의 설계 역량이 확인됩니다.\n\n종합적으로, 구현과 클라우드 설계 역량은 강점이며, 분산 시스템 이론과 아키텍처 평가 역량을 강화하면 전체적인 아키텍처 역할 수행 폭이 넓어질 것입니다.',
    trackAssessments: [
      {
        // 클라우드 & 분산 시스템 아키텍처
        text: 'Cloud & Distributed Systems Architecture 트랙에서 응시자는 고성능 시스템 아키텍처 설계와 클라우드 네이티브 아키텍처 설계에서 캐시 전략, 비동기 처리, 불변 인프라와 컨테이너 보안 개념을 이해하고 있습니다. 이를 통해 처리량과 응답 시간을 고려한 구조를 구상하는 역량이 확인됩니다.\n다만 분산 시스템 설계에서는 고성능 아키텍처 설계 패턴과 분산 트랜잭션 보상 전략 설계 역량이 부족하며, 고가용성 시스템 설계 및 운영에서도 대규모 트래픽 로드밸런싱과 장애 복구 전략 설계 능력이 충분히 드러나지 않습니다. 아키텍처 평가 및 개선에서는 이벤트 기반 아키텍처의 확장성과 일관성 평가, Canary·병렬 운영 전략 이해가 미흡해 구조 진단과 개선 역량 보완이 필요합니다.\n전체적으로 이 트랙에서는 일부 성능·클라우드 네이티브 영역에서 강점이 있으나, 분산 시스템 전반의 구조 설계와 고가용성, 아키텍처 평가 역량이 부족한 상태입니다. 분산 패턴과 보상 트랜잭션, 로드밸런싱과 DR 전략, 품질 속성 기반 평가 기법을 중심으로 학습을 강화하는 것이 바람직합니다.',
        skillTexts: {
          '분산 시스템 설계':          '분산 환경의 시간 동기화 문제 개념은 이해하고 있으나, 고성능 시스템의 아키텍처 설계 패턴을 선택하고 적용하는 역량은 충분히 드러나지 않습니다. 분산 트랜잭션 보상 전략 설계에서도 일관된 전략을 구성하는 능력이 부족해, 확장성과 일관성을 함께 고려한 구조 설계 역량을 보완할 필요가 있습니다.',
          '고성능 시스템 아키텍처 설계': '캐시 성능 문제를 진단하고 분석하는 개념을 이해하고 있으며, 고빈도 거래 환경을 가정한 캐싱 전략 설계와 비동기 처리 패턴을 통해 처리량과 응답 시간을 안정적으로 유지하는 구조를 떠올릴 수 있는 역량이 확인됩니다. 실시간 부하를 캐시와 비동기 흐름으로 분산하는 설계 관점이 드러납니다.',
          '고가용성 시스템 설계 및 운영': '모니터링과 경보 전략 개념은 이해하고 있으나, 대규모 트래픽 환경의 로드밸런싱 전략을 체계적으로 선택하고 장애 복구 전략을 설계하는 역량은 부족합니다. 트래픽 분산과 복구 시나리오를 구조적으로 연결해 단일 장애 지점을 제거하는 설계 능력을 강화할 필요가 있습니다.',
          '클라우드 네이티브 아키텍처 설계': '불변 인프라 특징과 컨테이너 보안 강화 방법을 이해하고 있어, 이미지 기반 배포와 자동화를 전제로 한 구조를 떠올릴 수 있는 역량이 확인됩니다. 다만 서버리스 기반 DevOps 파이프라인 설계 전략 이해는 제한적이어서, 서버리스 환경에서 배포와 운영을 통합하는 설계 경험을 넓힐 여지가 있습니다.',
          '아키텍처 평가 및 개선':      '이벤트 기반 아키텍처의 확장성과 일관성을 평가하는 개념 이해가 부족하며, Canary·병렬 운영과 같은 점진적 배포 전환 전략을 활용해 위험을 통제하는 접근도 충분히 드러나지 않습니다. 품질 속성을 기준으로 구조를 진단하고 개선 경로를 설계하는 역량을 전반적으로 강화할 필요가 있습니다.',
        },
      },
      {
        // 클라우드 컴퓨팅
        text: 'Cloud Computing 트랙에서 응시자는 클라우드 컴퓨팅 개념과 구조 역량을 통해 멀티리전·Failover·DR 개념과 자동 사용량 측정·과금 모델을 이해하고 있으며, KMS·SSE·공개 접근 점검을 연계해 데이터 보호를 설계하는 능력을 보여주었습니다. 기본 구조와 운영 메커니즘을 함께 고려하는 역량이 확인됩니다.\n확장성과 복원력을 갖춘 클라우드 아키텍처 설계와 클라우드 네트워크 및 성능 최적화 역량에서는 다중 데이터센터와 멀티리전 구성을 전제로 자동 확장, 이중 로드밸런싱, 자동 Failover를 결합해 비즈니스 연속성을 확보하는 설계가 드러납니다. 실무 중심 클라우드 보안 및 규제 준수 역량에서도 암호화, RBAC, 로그와 규제 기준을 연계해 보안과 거버넌스를 함께 설계하는 능력이 확인됩니다.\n전체적으로 이 트랙에서는 성능, 복원력, 보안, 비용 구조를 함께 고려한 클라우드 아키텍처 설계 역량이 강점으로 나타납니다. 다중 리전과 멀티클라우드 환경에서 네트워크와 보안, DR을 통합적으로 설계할 수 있는 기반이 갖추어져 있어, 대규모 클라우드 환경에서도 구조 설계와 운영에 기여할 수 있는 수준으로 평가됩니다.',
        skillTexts: {
          '클라우드 컴퓨팅 개념과 구조':         '단일 리전 장애와 멀티리전·Failover·DR 개념을 이해하고 있으며, 자동 사용량 측정과 과금 모델을 파악해 아키텍처와 비용 구조를 함께 고려하는 능력이 확인됩니다. 비암호화 민감 데이터에 대해 KMS·SSE·공개 접근 점검을 연계해 데이터 보호를 설계하는 역량도 보유하고 있습니다.',
          '확장성과 복원력을 갖춘 클라우드 아키텍처 설계': '다중 데이터센터와 멀티클라우드 환경을 전제로 한 이중 로드밸런싱과 자동 복구 구조를 설계하는 능력이 확인됩니다. 수요 기반 자동 확장과 글로벌 트래픽 분산을 통해 장애 복원과 용량 관리를 정책 기반으로 운영하려는 관점이 드러나며, 이를 비즈니스 연속성과 직접 연결하는 역량을 갖추었습니다.',
          '실무 중심 클라우드 보안 및 규제 준수':  '전송 구간과 저장 구간 암호화를 플랫폼 키 관리 서비스와 연계해 설계하고, RBAC와 최소 권한 원칙으로 관리자 권한을 통제하는 능력이 확인됩니다. 중앙 집중 로그와 정기적인 규제 기준 점검을 통해 거버넌스를 유지하려는 관점도 드러나, 보안과 컴플라이언스를 구조적으로 바라보는 역량을 보유하고 있습니다.',
          '클라우드 네트워크 및 성능 최적화':      '글로벌 CDN 아키텍처와 지연 시간 기반 라우팅, 엣지 캐싱을 활용해 전 세계 사용자 응답 시간을 개선하는 능력이 확인됩니다. 비용 효율 DR과 멀티리전 구성·자동 Failover를 결합해 가용성과 비용을 함께 고려하고, 사설 연결과 암호화 통신, 지표 기반 튜닝을 통해 보안과 성능을 동시에 관리하는 역량을 갖추었습니다.',
        },
      },
      {
        // Python
        text: '본 응시자는 Python 트랙에서 고급 Python 모듈과 파일 입출력, 데코레이터와 람다, 멀티프로세싱과 멀티스레딩 전반에 걸쳐 요구 역량을 충족했습니다. 표준 라이브러리를 목적에 맞게 선택하고, 자원 관리를 컨텍스트 기반으로 처리하며, 동시성 구조를 설계하는 능력이 확인됩니다.\n또한 JSON 처리에서도 파일 포인터 제어와 안전한 덮어쓰기를 통해 데이터 무결성을 유지하고, 데코레이터를 활용해 접근 제어와 로깅을 구조적으로 분리하는 등 언어 기능을 설계 관점에서 활용하는 역량이 드러납니다. 멀티프로세싱과 멀티스레딩에서는 작업 분할과 생명주기 관리를 안정적으로 수행하고 있습니다.\n전체적으로 Python 트랙에서는 고급 모듈 활용, 파일 기반 데이터 처리, 함수형 기능, 동시성 제어를 아우르는 구현 역량이 확인됩니다. 요구된 기능을 모듈화하고 여러 실행 단위를 조합해 동작시키는 능력이 검증되어, 실무 환경에서도 Python을 활용해 안정적인 서비스를 구성할 수 있는 기반을 갖추었다고 판단됩니다.',
        skillTexts: {
          '데코레이터':       '함수를 인자로 받아 감싸는 구조를 이해하고, 접근 제어와 로깅처럼 여러 함수에 공통 적용되는 동작을 데코레이터로 분리하는 능력이 확인됩니다. 래퍼에서 인자를 전달하고 반환값을 유지하며, 예외 상황을 함께 처리하는 등 교차 관심사를 구조적으로 관리하는 역량을 갖추었습니다.',
          '고급 Python 모듈': '표준 라이브러리를 상황에 맞게 선택해 활용하는 능력이 확인됩니다. 알고리즘과 수치 계산, 통계 처리, 멀티프로세싱과 멀티스레딩을 연계해 문제를 구조적으로 분해하고, 컨텍스트 관리로 자원 수명을 명확히 구분하는 설계가 드러납니다. 요구된 기능을 여러 모듈을 조합해 안정적으로 구현할 수 있는 역량을 갖추었습니다.',
          '람다':             '단일 목적의 간결한 연산을 람다 표현식으로 정의하고, 필요한 인자를 받아 불리언 판단에 활용하는 능력이 확인됩니다. 접근 제어와 같이 조건 판단이 중요한 위치에 람다를 배치해 로직을 분리하고, 주변 구조와 조화롭게 통합하는 등 람다를 적절한 범위에서 활용하는 역량을 보유하고 있습니다.',
          '파일 입출력':      '컨텍스트 관리를 통해 파일을 안전하게 열고 닫으며, 읽기·쓰기 모드를 목적에 맞게 선택하는 능력이 확인됩니다. 대용량 데이터를 줄 단위로 처리해 메모리 사용을 통제하고, 오류 정보를 별도 로그로 남기는 등 파일을 데이터 처리 흐름 속에 자연스럽게 통합하는 역량을 갖추었습니다.',
          'JSON':             '파일을 열고 JSON 데이터를 파이썬 구조로 변환한 뒤 수정하고 다시 저장하는 흐름을 안정적으로 구성하는 능력이 확인됩니다. 컨텍스트 관리로 파일 수명을 관리하고, 포인터 이동과 잘림 처리를 통해 이전 내용이 남지 않도록 제어하는 등 실제 환경에서 요구되는 JSON 파일 입출력 역량을 보유하고 있습니다.',
          '멀티프로세싱':     '작업을 독립 단위로 나누고 프로세스 풀을 통해 병렬 실행하는 구조를 설계하는 능력이 확인됩니다. 프로세스 생명주기를 컨텍스트 기반으로 관리하며, 풀과 매핑 기능을 활용해 여러 입력을 균등하게 분배하는 등 프로세스 생성과 정리를 안정적으로 수행할 수 있는 역량을 보유하고 있습니다.',
          '멀티스레딩':       '작업을 여러 스레드로 나누고 생성·시작·대기를 명확히 구분해 제어하는 능력이 확인됩니다. 공유 자료와 파일 접근 구간에 잠금을 적용해 경쟁 상태를 예방하고, 정해진 위치에 결과를 모으는 구조를 설계하는 등 스레드 기반 병렬 처리를 안전하게 구성하는 역량을 보유하고 있습니다.',
        },
      },
    ],
    tracks: [
      { score: 55, rate: 40.0, time: '0:08:20',
        skillLevels: ['partial','acquired','partial','acquired','missing'] },
      { score: 90, rate: 100.0, time: '0:20:11',
        skillLevels: ['acquired','acquired','acquired','acquired'] },
      { score: 95, rate: 100.0, time: '1:50:12',
        skillLevels: ['acquired','acquired','acquired','acquired','acquired','acquired','acquired'] },
    ]
  },
  {
    id: 2,
    name: '김지원', email: 'jiwon.kim@example.com',
    status: 'completed', date: '2026.04.04',
    totalScore: 92, rate: 88.5, time: '1:54:20',
    behaviorRisk: { level: 'normal', highCount: 0, medCount: 0 },
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
    behaviorRisk: { level: 'warning', highCount: 1, medCount: 2 },
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
    behaviorRisk: { level: 'warning', highCount: 2, medCount: 1 },
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
    behaviorRisk: { level: 'normal', highCount: 0, medCount: 0 },
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
    behaviorRisk: { level: 'normal', highCount: 0, medCount: 1 },
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
    behaviorRisk: { level: 'warning', highCount: 1, medCount: 2 },
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
    behaviorRisk: { level: 'normal', highCount: 0, medCount: 0 },
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
    behaviorRisk: { level: 'normal', highCount: 0, medCount: 0 },
    tracks: []
  },
  {
    id: 10,
    name: '조아린', email: 'arin.jo@example.com',
    status: 'incomplete', date: '-',
    totalScore: null, rate: null, time: '-',
    behaviorRisk: { level: 'normal', highCount: 0, medCount: 0 },
    tracks: []
  },
];

/* ══════════════════════════════
   CONSTANTS & HELPERS
══════════════════════════════ */
const LEVEL_LABEL = { acquired: '획득', partial: '보완 필요', missing: '미획득' };
const LEVEL_CLASS = { acquired: 'badge-acquired', partial: 'badge-partial', missing: 'badge-missing' };
const LEVEL_COLOR = { acquired: '#16A34A', partial: '#D97706', missing: '#DC2626' };

/* 이상행동 위험도 배지 */
const RISK_META = {
  danger:  { label: '위험',  bg: '#FEF2F2', color: '#991B1B', dot: '#DC2626' },
  warning: { label: '주의',  bg: '#FFFBEB', color: '#92400E', dot: '#D97706' },
  normal:  { label: '정상',  bg: '#F0FDF4', color: '#166534', dot: '#16A34A' },
};
function riskBadgeHTML(risk, large = false) {
  if (!risk) return '';
  const m = RISK_META[risk.level] || RISK_META.normal;
  const detail = risk.level !== 'normal'
    ? ` <span style="font-size:0.68em;opacity:0.75;">(위험 ${risk.highCount} / 주의 ${risk.medCount})</span>`
    : '';
  const pad = large ? '6px 16px' : '3px 9px';
  const fs  = large ? '0.88rem' : '0.72rem';
  return `<span style="display:inline-flex;align-items:center;gap:5px;background:${m.bg};color:${m.color};padding:${pad};border-radius:99px;font-size:${fs};font-weight:700;white-space:nowrap;">
    <span style="width:7px;height:7px;border-radius:50%;background:${m.dot};flex-shrink:0;"></span>${m.label}${detail}</span>`;
}

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
