/* ══════════════════════════════
   EXAMINEE DATA — 손덕인 (id: 1)
══════════════════════════════ */
const EXAMINEE_SONDEOKIN = {
    id: 1,
    name: '손덕인', email: 'dlwmznzl@gmail.com', organization: 'Codepresso',
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
        skillLevels: ['partial','acquired','partial','acquired','missing'],
        skillScores: [31.58, 86.14, 36.5, 83.5, 0],
        answers: [
          {
            qNum: 1, type: 'multiple', skill: '분산 시스템 설계',
            question: '분산 시스템에서 논리 시계(Logical Clock)를 사용하는 주된 목적은?',
            options: ['① 물리 시계의 정확한 시각 동기화', '② 이벤트 간 인과 관계(Causality) 추적', '③ 네트워크 대역폭 측정', '④ 노드 간 CPU 부하 분산'],
            answer: '① 물리 시계의 정확한 시각 동기화',
            correctAnswer: '② 이벤트 간 인과 관계(Causality) 추적',
          },
          {
            qNum: 2, type: 'multiple', skill: '분산 시스템 설계',
            question: 'Saga 패턴에서 분산 트랜잭션 실패 시 데이터 정합성을 회복하는 방법은?',
            options: ['① 2PC(Two-Phase Commit) 전환', '② 보상 트랜잭션(Compensating Transaction) 실행', '③ 전체 서비스 재시작', '④ 단일 데이터베이스 롤백'],
            answer: '③ 전체 서비스 재시작',
            correctAnswer: '② 보상 트랜잭션(Compensating Transaction) 실행',
          },
          {
            qNum: 3, type: 'short', skill: '고성능 시스템 아키텍처 설계',
            question: 'Cache-Aside(Lazy Loading) 패턴의 동작 원리와 Cache Stampede 방지 방법을 간략히 서술하시오.',
            answer: 'Cache-Aside 패턴은 애플리케이션이 캐시를 먼저 조회하고, 캐시 미스 발생 시 DB에서 조회한 후 캐시에 저장하는 방식입니다. Cache Stampede 방지를 위해 Mutex Lock을 적용하여 동시 요청이 DB를 한 번만 조회하도록 하거나, TTL에 랜덤 지터(Jitter)를 추가하여 동시 만료를 분산할 수 있습니다.',
          },
          {
            qNum: 4, type: 'essay', skill: '고성능 시스템 아키텍처 설계',
            question: '고빈도 거래 시스템에서 비동기 처리 패턴을 활용하여 처리량과 응답 시간을 최적화하는 설계 방안을 서술하시오.',
            answer: '고빈도 거래 시스템에서는 동기 호출 대신 메시지 큐(Kafka 등)를 이용한 비동기 처리로 서비스 간 결합도를 낮추고 피크 트래픽을 버퍼링합니다. 주문 처리와 같이 즉각적 응답이 필요한 경로는 캐시 레이어를 앞에 두어 DB 부하를 줄이고, 집계나 리포팅처럼 지연이 허용되는 처리는 이벤트 스트림으로 분리하여 백그라운드에서 수행합니다. 이를 통해 처리량을 높이고 응답 시간 안정성을 유지할 수 있습니다.',
          },
          {
            qNum: 5, type: 'multiple', skill: '클라우드 네이티브 아키텍처 설계',
            question: '불변 인프라(Immutable Infrastructure) 원칙에 따른 배포 방식으로 올바른 것은?',
            options: ['① 운영 중인 서버에 직접 패치 적용', '② 새 이미지로 서버를 교체하고 기존 서버는 폐기', '③ 서버 내부 설정 파일 수동 수정 후 재시작', '④ 공유 가상머신에 여러 버전 동시 운영'],
            answer: '② 새 이미지로 서버를 교체하고 기존 서버는 폐기',
            correctAnswer: '② 새 이미지로 서버를 교체하고 기존 서버는 폐기',
          },
          {
            qNum: 6, type: 'essay', skill: '아키텍처 평가 및 개선',
            question: '이벤트 기반 아키텍처(EDA)를 도입한 시스템의 확장성과 일관성을 평가하기 위한 품질 속성 기준과 평가 방법을 서술하시오.',
            answer: '이벤트 기반 아키텍처는 비동기 처리를 통해 서비스 간 결합도가 낮고 소비자를 독립적으로 확장할 수 있습니다. 확장성 평가는 처리량(TPS)이 컨슈머 추가에 따라 선형적으로 증가하는지, P99 지연 시간이 허용 범위를 벗어나지 않는지를 부하 테스트로 측정합니다. 일관성 평가는 이벤트 손실 여부, 중복 처리 방지(Idempotency) 적용 수준, 최종 일관성 도달 시간을 기준으로 합니다.',
          },
        ],
      },
      { score: 90, rate: 100.0, time: '0:20:11',
        skillLevels: ['acquired','acquired','acquired','acquired'],
        skillScores: [87.5, 94.83, 81.2, 94.4],
        answers: [
          {
            qNum: 1, type: 'multiple', skill: '클라우드 컴퓨팅 개념과 구조',
            question: '클라우드 서비스에서 사용량만큼 비용을 지불하는 과금 모델의 명칭과 주요 장점은?',
            options: ['① 고정 라이선스 — 예측 가능한 비용', '② Pay-as-you-go — 초기 비용 없이 실제 사용량 기반 과금', '③ Reserved Instance — 장기 약정으로 높은 유연성', '④ Spot Instance — 온디맨드보다 항상 저렴'],
            answer: '② Pay-as-you-go — 초기 비용 없이 실제 사용량 기반 과금',
            correctAnswer: '② Pay-as-you-go — 초기 비용 없이 실제 사용량 기반 과금',
          },
          {
            qNum: 2, type: 'essay', skill: '확장성과 복원력을 갖춘 클라우드 아키텍처 설계',
            question: '멀티 AZ(Availability Zone) 구성과 멀티 리전 구성의 차이를 설명하고, 각각의 적합한 사용 시나리오를 서술하시오.',
            answer: '멀티 AZ는 동일 리전 내 물리적으로 분리된 데이터센터에 자원을 이중화하여 단일 센터 장애에 대비하며, 낮은 지연으로 실시간 자동 Failover가 가능합니다. 대부분의 고가용성 요구사항을 충족합니다. 멀티 리전은 지리적으로 분리된 두 리전 이상에 서비스를 배포하여 리전 전체 장애나 자연재해에 대응합니다. 금융·의료처럼 RPO=0, RTO=수 분 이하가 필요하거나 글로벌 사용자에게 낮은 지연을 제공해야 하는 서비스에 적합합니다. 단, 데이터 일관성 유지와 비용 복잡도가 증가합니다.',
          },
          {
            qNum: 3, type: 'short', skill: '실무 중심 클라우드 보안 및 규제 준수',
            question: 'IAM 권한 에스컬레이션(Privilege Escalation) 공격을 방지하기 위한 두 가지 구체적인 방법을 서술하시오.',
            answer: '1. 권한 경계(Permission Boundary) 설정 — 사용자나 역할이 부여할 수 있는 최대 권한 범위를 명시적으로 제한하여 더 높은 권한을 스스로 부여하지 못하도록 합니다. 2. 조직 수준 SCP(Service Control Policy) 적용 — 계정 전체에서 특정 관리 작업(iam:CreateRole, iam:AttachRolePolicy 등)을 차단하여 정책 우회를 원천적으로 방지합니다.',
          },
          {
            qNum: 4, type: 'essay', skill: '클라우드 네트워크 및 성능 최적화',
            question: '글로벌 서비스에서 CDN과 지연 시간 기반 라우팅을 결합하여 사용자 응답 속도를 개선하고 네트워크 비용을 절감하는 방안을 서술하시오.',
            answer: 'CloudFront(CDN)를 활용하여 정적 자산과 자주 요청되는 API 응답을 엣지 로케이션에 캐싱하면 원본 서버 트래픽과 대역폭 비용을 줄일 수 있습니다. Route 53의 지연 시간 기반 라우팅(Latency-Based Routing)으로 각 사용자 요청을 응답 시간이 가장 짧은 리전으로 보내 체감 성능을 높입니다. 리전 간 데이터 전송 비용은 읽기 전용 데이터를 사용자 리전에 복제하여 크로스 리전 호출을 최소화하는 방식으로 줄이고, 엣지에서 캐싱 적중률을 높여 오리진 요청 자체를 감소시킵니다.',
          },
        ],
      },
      { score: 95, rate: 100.0, time: '1:50:12',
        skillLevels: ['acquired','acquired','acquired','acquired','acquired','acquired','acquired'],
        skillScores: [95.71, 100, 90, 85.64, 77, 100, 88.13],
        answers: [
          {
            qNum: 1, type: 'code', skill: '람다, 고급 Python 모듈',
            question: 'statistics 모듈과 람다 함수를 활용하여 데이터셋에서 짝수만 필터링한 후 평균·중앙값·표준편차를 반환하는 함수를 작성하시오.',
            solutionCode: `import statistics

def analyze_even_numbers(data):
    even_filter = lambda x: x % 2 == 0
    evens = list(filter(even_filter, data))

    if not evens:
        return None

    return {
        'mean': statistics.mean(evens),
        'median': statistics.median(evens),
        'std': round(statistics.stdev(evens) if len(evens) > 1 else 0, 2)
    }`,
            answer: `import statistics

def analyze_even_numbers(data):
    even_filter = lambda x: x % 2 == 0
    evens = list(filter(even_filter, data))

    if not evens:
        return None

    avg = statistics.mean(evens)
    med = statistics.median(evens)
    std = statistics.stdev(evens) if len(evens) > 1 else 0

    return {'mean': avg, 'median': med, 'std': round(std, 2)}`,
          },
          {
            qNum: 2, type: 'code', skill: '멀티스레딩, 데코레이터',
            question: '스레드 안전한 로깅 데코레이터를 구현하시오. 함수 실행 전후 경과 시간을 기록하고, threading.Lock으로 동시 출력 충돌을 방지해야 합니다.',
            solutionCode: `import threading
import time
from functools import wraps

_log_lock = threading.Lock()

def thread_safe_logger(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        with _log_lock:
            print(f"[{func.__name__}] {elapsed:.4f}s")
        return result
    return wrapper

@thread_safe_logger
def process_data(items):
    return [x * 2 for x in items]`,
            answer: `import threading
import time
from functools import wraps

_log_lock = threading.Lock()

def thread_safe_logger(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        with _log_lock:
            print(f"[{func.__name__}] {elapsed:.4f}s")
        return result
    return wrapper

@thread_safe_logger
def process_data(items):
    return [x * 2 for x in items]`,
          },
          {
            qNum: 3, type: 'code', skill: '파일 입출력',
            question: '대용량 로그 파일을 줄 단위로 읽어 ERROR 로그만 output_path에 저장하시오. 예외 발생 시 error.log에 기록해야 합니다.',
            solutionCode: `def filter_error_logs(input_path, output_path):
    try:
        with open(input_path, 'r', encoding='utf-8') as fin, \\
             open(output_path, 'w', encoding='utf-8') as fout:
            for line in fin:
                if 'ERROR' in line:
                    fout.write(line)
    except FileNotFoundError as e:
        with open('error.log', 'a', encoding='utf-8') as f:
            f.write(f"FileNotFoundError: {e}\\n")
    except IOError as e:
        with open('error.log', 'a', encoding='utf-8') as f:
            f.write(f"IOError: {e}\\n")`,
            answer: `def filter_error_logs(input_path, output_path):
    try:
        with open(input_path, 'r', encoding='utf-8') as fin, \\
             open(output_path, 'w', encoding='utf-8') as fout:
            for line in fin:
                if 'ERROR' in line:
                    fout.write(line)
    except FileNotFoundError as e:
        with open('error.log', 'a') as f:
            f.write(f"FileNotFoundError: {e}\\n")
    except IOError as e:
        with open('error.log', 'a') as f:
            f.write(f"IOError: {e}\\n")`,
          },
          {
            qNum: 4, type: 'code', skill: '데코레이터, 람다',
            question: 'access_control 데코레이터를 구현하시오. allowed_roles와 현재 역할을 비교하는 람다를 내부에서 사용하며, 접근 거부 시 로그를 출력해야 합니다.',
            solutionCode: `import threading
import functools

lock = threading.Lock()

def access_control(allowed_roles):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(user_role, *args, **kwargs):
            is_allowed = lambda role: role in allowed_roles
            if not is_allowed(user_role):
                with lock:
                    print(f"ACCESS DENIED: {user_role}")
                return None
            return func(user_role, *args, **kwargs)
        return wrapper
    return decorator

@access_control(['admin', 'manager'])
def run_task(user_role, task):
    return f"Running {task}"`,
            answer: `import threading
import functools

def access_control(allowed_roles):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(user_role, *args, **kwargs):
            is_allowed = lambda role: role in allowed_roles
            if not is_allowed(user_role):
                with lock:  # lock 미정의 — 런타임 오류
                    print(f"ACCESS DENIE: {user_role}")  # 오타
                return None

            def wrapper(*args, **kwargs):  # wrapper 중복 정의
                return func(user_role, *args, **kwargs)
            return wrapper(*args, **kwargs)
        return wrapper
    return decorator

@access_control(['admin', 'manager'])
def run_task(user_role, task):
    return f"Running {task}"`,
          },
          {
            qNum: 5, type: 'code', skill: '고급 Python 모듈, 파일 입출력',
            question: '상품 목록의 조합(combinations)을 생성하고 각 조합의 가격 통계를 계산하여 JSON 파일로 저장하는 프로그램을 작성하시오.',
            solutionCode: `import itertools
import statistics
import json

def calculate_statistics(prices):
    return {
        'mean': round(statistics.mean(prices), 2),
        'max': max(prices),
        'min': min(prices),
    }

def process_combinations(products, r=2):
    combinations_data = []
    for combo in itertools.combinations(products, r):
        prices = [item['price'] for item in combo]
        stats = calculate_statistics(prices)
        combinations_data.append({
            'items': [i['name'] for i in combo],
            'stats': stats
        })
    return combinations_data

def save_to_json(data, filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)`,
            answer: `import itertools
import statistics
import json
from collections import defaultdict

def calcurate_statistics(prices):  # 오타: calcurate
    return {
        'mean': round(statistics.mean(prices), 2),
        'max': max(prices),
        'min': min(prices),
    }

def process_combinations(products, r=2):
    combinattions_data = []  # 오타
    for combo in itertools.combinations(products, r):
        prices = [item['prodcut'] for item in combo]  # 오타: prodcut
        stas = calcurate_statistics(prices)
        combinattions_data.append({'items': list(combo), 'stats': stas})
    return combinattions_data

def save_to_json(data, filepath):
    with oepn(filepath, 'w') as f:  # 오타: oepn
        json.dump(data, f, ensure_ascii=False, indent=2)`,
          },
          {
            qNum: 6, type: 'code', skill: '멀티스레딩, 멀티프로세싱',
            question: 'Num_Threads개의 스레드로 데이터를 분할 정렬한 뒤 병합하는 함수를 구현하시오.',
            solutionCode: `import threading

NUM_THREADS = 4

def parallel_sort(data, num_threads=NUM_THREADS):
    chunk_size = max(1, len(data) // num_threads)
    chunks = [data[i*chunk_size:(i+1)*chunk_size]
              for i in range(num_threads)]
    sorted_chunks = [None] * num_threads

    def sort_chunk(idx, chunk):
        sorted_chunks[idx] = sorted(chunk)

    threads = []
    for i, chunk in enumerate(chunks):
        t = threading.Thread(target=sort_chunk, args=(i, chunk))
        threads.append(t)
        t.start()
    for t in threads:
        t.join()

    result = []
    for chunk in sorted_chunks:
        result.extend(chunk)
    return result

def calculate_average(numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)`,
            answer: `import threading

Num_Threads = 4

def parallel_sort(data, num_threads=Num_Threads):
    chunk_size = len(data) // num_threads
    chunks = [data[i*chunk_size:(i+1)*chunk_size] for i in range(num_threads)]
    sorted_chunks = [None] * num_threads

    def sort_chunk(idx, chunk):
        sorted_chunks[idx] = sorted(chunk)

    threads = []
    for i, chunk in enumerate(chunks):
        t = threading.Thread(target=sort_chunk, args=(i, chunk))
        threads.append(t)
        t.start()
    for t in threads:
        t.join()

    result = []
    for chunk in sorted_chunks:
        result.extend(chunk)
    print(result)  # return 없이 print만 사용

def calculate_average(numbers):
    return sum(numbers) / len(numbers)  # 빈 리스트 ZeroDivisionError 위험`,
          },
        ],
      },
    ],
    staticAnalysis: [
      {
        trackIdx: 2,
        trackName: 'Python',
        problems: [
      {
        problemNum: 1,
        title: '문제 1',
        fileName: 'main.py',
        summary: '전반적으로 코드 구조가 단순하고, 공통 기능(로깅)을 데코레이터로 분리해 중복을 줄인 점이 돋보입니다. 읽는 사람이 흐름을 따라가기 쉬워 유지보수 관점에서도 유리합니다. 다만 실행 중 문제가 생겼을 때(예외 발생) 오류를 기록만 하고 실패를 호출자에게 명확히 알리지 않으면, 프로그램이 정상적으로 끝난 것처럼 보이거나 결과가 누락되는 등 운영/테스트에서 위험이 커질 수 있습니다. 오류 상황에서의 동작을 더 분명하게 정의하면 신뢰성이 개선됩니다.',
        metrics: [
          { key: 'DUPLICATIONS',          label: '중복',        result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '함수 단위 코드 분리, 중복 코드 없음',
            detailDesc: '로깅 기능이 데코레이터로 분리되어 있어 동일한 로깅 로직을 여러 곳에 반복 작성하지 않습니다.' },
          { key: 'CYCLOMATIC_COMPLEXITY', label: '복잡도',      result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '단순 조건 분기, 전체 복잡도 양호',
            detailDesc: '함수 흐름이 단순하며, 조건 분기와 예외 처리 외에 복잡한 분기 구조가 거의 없습니다.' },
          { key: 'BUGS',                  label: '잠재 버그',   result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: '예외 발생 시 재전달 없음, 호출자 오인 위험',
            detailDesc: '예외가 발생했을 때 로그만 남기고 예외를 다시 발생시키지 않아, 호출 측에서 실패를 정상 동작으로 오해할 수 있고 결과가 반환되지 않을 수 있습니다.' },
          { key: 'CODING_STYLE',          label: '코딩 스타일', result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '구조 단순, 역할 분리, 이름 가독성 양호',
            detailDesc: '구조가 간단하고 역할이 분리되어 전반적으로 읽기 쉬우며, 함수와 변수 이름이 동작을 잘 설명합니다.' },
        ],
        strengths: [
          '로깅 기능을 데코레이터로 분리하여 같은 로직을 반복 작성하지 않고, 변경이 필요할 때 한 곳만 수정하면 되도록 구성했습니다.',
          '제어 흐름이 단순해 읽기 쉽고, 조건 분기/예외 처리 외에 복잡한 분기 구조가 거의 없어 유지보수 부담이 낮습니다.',
          '이름과 역할 분리가 비교적 명확하여 코드가 무엇을 하는지 빠르게 파악할 수 있습니다.',
        ],
        weaknesses: [
          '예외 발생 시 로그만 남기고 예외를 다시 전달하지 않으면, 호출 측에서 실패를 정상 동작으로 오해할 수 있고 결과가 반환되지 않는 등 오류가 숨겨질 위험이 있습니다.',
          '오류 상황에서 함수가 무엇을 반환/보장하는지(예: None 반환, 기본값 반환, 예외 재발생 등) 정책이 불명확하여, 사용하는 쪽 코드가 불안정해질 수 있습니다.',
        ],
        improvements: [
          '예외를 잡아 로그를 남긴 뒤에는 원칙적으로 예외를 다시 발생시키거나(raise), 호출자에게 실패를 명확히 알리는 반환 규약(예: (성공여부, 결과) 형태)을 일관되게 적용하세요.',
          '데코레이터에서 정상 결과와 오류 결과를 동일한 방식으로 기록하되, 오류의 경우에는 호출자가 후속 처리를 할 수 있도록 예외 타입/메시지를 유지한 채 전달하는 방식을 고려하세요.',
          '함수/데코레이터의 계약(입력, 출력, 예외 발생 가능성)을 간단한 주석이나 docstring으로 명시해, 다른 사람이 사용할 때 \'실패 시 어떻게 동작하는지\'를 예측 가능하게 만드세요.',
        ],
      },
      {
        problemNum: 2,
        title: '문제 2',
        fileName: 'main.py',
        summary: '전체적으로 기능 흐름(읽기→수정→저장)이 함수 단위로 나뉘어 있어 이해와 변경이 비교적 쉬운 편입니다. 다만, 파일을 열어 JSON을 읽는 과정에서 예외가 발생할 경우 파일이 정상적으로 닫히지 않을 수 있고, 동시에 여러 실행 주체가 같은 파일을 수정하면 결과가 뒤섞이거나 일부 변경이 사라질 위험이 있습니다. 또한 들여쓰기와 공백 규칙이 일부 구간에서 일관되지 않아, 시간이 지난 뒤 다른 사람이 코드를 읽고 유지보수할 때 비용이 증가할 수 있습니다.',
        metrics: [
          { key: 'DUPLICATIONS',          label: '중복',        result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '래퍼 함수 단위 분리, 중복 없음',
            detailDesc: '파일 읽기/쓰기와 데이터 갱신 로직이 함수로 분리되어 있으며, 동일한 로직을 반복해서 작성한 부분이 두드러지지 않습니다.' },
          { key: 'CYCLOMATIC_COMPLEXITY', label: '복잡도',      result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '함수 단위 분기 단순, 전체 흐름 이해 용이',
            detailDesc: '각 함수의 분기와 흐름이 단순한 편이며, 전체적으로 이해하기 쉬운 구조입니다.' },
          { key: 'BUGS',                  label: '잠재 버그',   result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: '파일 미닫힘 위험, 동시 수정 시 내용 유실 가능',
            detailDesc: 'json_file_manager에서 파일을 연 뒤 json.load 과정에서 예외가 발생하면 파일이 닫히지 않은 채로 종료될 수 있습니다. 또한 여러 프로세스가 같은 파일을 동시에 열어 수정할 수 있어, 실행 타이밍에 따라 파일 내용이 꼬이거나 일부 변경이 유실될 가능성이 있습니다.' },
          { key: 'CODING_STYLE',          label: '코딩 스타일', result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: '들여쓰기·공백 불일치로 가독성 저하',
            detailDesc: '들여쓰기 깊이와 공백 사용이 일부 구간에서 일관되지 않아 읽는 사람이 흐름을 따라가기 어려울 수 있습니다.' },
        ],
        strengths: [
          '중복 코드가 두드러지지 않도록 파일 입출력과 데이터 갱신 로직이 함수로 분리되어 있습니다.',
          '분기 구조가 단순하여 전반적인 흐름을 따라가기 쉽고, 복잡도가 과도하게 높지 않습니다.',
        ],
        weaknesses: [
          'JSON 로딩 중 예외가 발생하면 파일이 닫히지 않은 채로 남을 수 있어, 실행 안정성과 자원 관리 측면에서 위험이 있습니다.',
          '여러 프로세스/실행이 동시에 같은 파일을 수정할 경우, 저장 순서에 따라 내용이 꼬이거나 변경 사항이 유실될 수 있습니다.',
          '들여쓰기 깊이와 공백 사용이 일관되지 않은 구간이 있어 가독성과 유지보수성이 저하될 수 있습니다.',
        ],
        improvements: [
          '파일을 여는 코드는 with 문(컨텍스트 매니저)을 사용해 예외가 나더라도 자동으로 닫히도록 작성하고, JSON 파싱 실패(json.JSONDecodeError 등)와 파일 접근 오류(IOError / OSError)를 구분해 처리 흐름을 명확히 하세요.',
          '파일 갱신은 \'읽기→수정→쓰기\'가 하나의 원자적(한 번에 끝나는) 작업처럼 동작하도록 보호 장치를 두세요(예: 같은 파일을 동시에 수정하지 않도록 잠금 개념을 적용하거나, 저장 시점 충돌을 감지해 재시도/중단하는 로직을 두는 방식).',
          '들여쓰기(예: 공백 4칸)와 공백 규칙(연산자 주변, 줄바꿈 등)을 코드 전체에서 동일하게 맞추고, 함수/변수 이름도 일관된 규칙으로 정리해 읽는 사람이 \'규칙을 추측\'하지 않도록 하세요.',
          '예외 상황에서 사용자/호출자가 무엇을 기대해야 하는지(예: 실패 시 반환값, 예외 재발생 여부)를 함수 단위로 정하고, 그 계약(동작)을 코드로 일관되게 유지하세요.',
        ],
      },
      {
        problemNum: 3,
        title: '문제 3',
        fileName: 'main.py',
        summary: '전체적으로 코드는 처리 흐름이 단순하고(입력 확인 → 변환 시도 → 계산 → 출력), 파일별 처리 로직을 함수로 분리해 이해하기 쉬운 편입니다. 다만 예외를 너무 넓게 잡는 방식은 실제 문제 원인을 숨겨 운영/디버깅 시 위험을 키울 수 있고, 여러 프로세스가 동시에 같은 로그 파일에 기록하는 방식은 기록이 섞이거나 누락될 가능성이 있어 신뢰도를 떨어뜨릴 수 있습니다. 또한 사용되지 않는 import와 일부 스타일 불일치가 보여, 제출 코드의 완성도와 유지보수성을 높이기 위해 정리할 여지가 있습니다.',
        metrics: [
          { key: 'DUPLICATIONS',          label: '중복',        result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '파일 처리 로직이 함수로 분리, 중복 없음',
            detailDesc: '파일 처리 로직이 함수로 분리되어 있고, 동일한 코드 블록을 반복해서 복사한 흔적이 두드러지지 않습니다.' },
          { key: 'CYCLOMATIC_COMPLEXITY', label: '복잡도',      result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '단순 처리 단계, 분기 과도하지 않음',
            detailDesc: '주요 흐름이 입력 검증 → 변환 시도 → 계산 → 출력의 단순한 단계로 구성되어 있으며, 조건 분기와 반복이 과도하지 않습니다.' },
          { key: 'BUGS',                  label: '잠재 버그',   result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: 'except: 포괄적 처리, 동일 error.log 파일에 동시 기록 위험',
            detailDesc: '숫자 변환에서 모든 예외를 포괄적으로 처리하고 있어(예: except:) 실제 원인과 무관한 오류까지 같은 방식으로 숨겨질 수 있습니다. 또한 여러 프로세스가 동시에 같은 error.log 파일에 기록하므로 로그 내용이 섞이거나 일부가 누락되는 등 기록 품질이 떨어질 가능성이 있습니다.' },
          { key: 'CODING_STYLE',          label: '코딩 스타일', result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: 'defaultdict 미사용 import, 들여쓰기 불일치',
            detailDesc: '사용되지 않는 import (defaultdict)가 포함되어 있어 코드가 불필요하게 복잡해 보일 수 있습니다. 또한 들여쓰기와 공백 사용이 일부 구간에서 일관되지 않아 읽는 사람이 구조를 빠르게 파악하기 어려울 수 있습니다.' },
        ],
        strengths: [
          '중복 코드가 두드러지지 않으며 파일 처리 로직이 함수로 분리되어 재사용과 이해가 용이합니다.',
          '전체 흐름이 단순하고 단계가 명확하여 읽는 사람이 처리 과정을 빠르게 따라갈 수 있습니다.',
          '형식 오류/변환 오류를 로그로 남기려는 시도가 있어 운영 중 문제 추적에 도움이 될 기반이 있습니다.',
        ],
        weaknesses: [
          '예외를 포괄적으로 처리(예: except:)하여 실제 원인과 무관한 오류까지 동일하게 처리될 수 있고, 문제 원인 파악이 어려워질 수 있습니다.',
          '여러 프로세스가 동시에 동일한 error.log 파일에 기록할 경우 로그가 섞이거나 일부가 누락되는 등 기록 품질이 저하될 가능성이 있습니다.',
          '사용되지 않는 import(defaultdict) 및 들여쓰기/공백의 일관성 부족으로 코드가 불필요하게 복잡해 보이고 가독성이 떨어질 수 있습니다.',
        ],
        improvements: [
          '예외 처리는 가능한 한 구체적으로 분리하세요(예: 숫자 변환은 ValueError, 파일/입출력은 OSError 등). 이렇게 하면 \'무슨 문제가 났는지\'를 숨기지 않고 정확히 드러내어 디버깅과 유지보수가 쉬워집니다.',
          '예외를 기록할 때는 오류 메시지에 상황 정보를 함께 포함하세요(예: 어떤 입력/어떤 파일/어떤 줄에서 실패했는지). 같은 오류라도 원인 추적이 빨라져 운영 리스크가 줄어듭니다.',
          '동시 실행 가능성이 있는 코드라면, 여러 작업이 하나의 로그 파일에 동시에 쓰지 않도록 기록 방식을 신중히 다루세요(예: 기록 단위를 한 번에 쓰도록 구성하거나, 작업 단위로 구분 가능한 식별자를 로그에 포함). 이는 로그 신뢰도를 높이는 데 직접적으로 도움이 됩니다.',
          '사용되지 않는 import와 변수는 제거하고, 들여쓰기/공백 등 스타일을 일관되게 정리하세요. 코드가 짧더라도 \'정돈된 제출물\'은 리뷰와 유지보수 비용을 크게 낮춥니다.',
          '함수/변수 이름이 역할을 직접 설명하도록 점검하고(예: process_file, parse_number 등), 입력 검증/변환/계산/출력 단계를 함수 경계로 명확히 나누면 향후 요구사항 변경에도 수정 범위가 줄어듭니다.',
        ],
      },
      {
        problemNum: 4,
        title: '문제 4',
        fileName: 'main.py',
        summary: '전체적으로 접근 제어 목적은 명확하고 데코레이터 기반 설계 방향은 적절합니다. 그러나 lock 변수가 정의되지 않아 실행 시 즉시 오류가 발생하고, wrapper 함수가 중복 정의되어 있으며, 여러 조건 분기가 분산되어 있어 코드의 안정성과 가독성이 크게 저하됩니다. 또한 로그 메시지의 오타(ACCESS DENIE)와 들여쓰기 불일치가 완성도를 낮추고 있습니다.',
        metrics: [
          { key: 'DUPLICATIONS',          label: '중복',        result: 'fail',    counts: {pass:0,warning:0,fail:1,na:0}, desc: 'access_control 내부 wrapper 함수 중복 정의',
            detailDesc: 'access_control 데코레이터 내부에서 wrapper 함수가 동일한 이름으로 중복 정의되어 있어, 어떤 함수가 실제로 실행되는지 이해하기 어렵고 유지보수가 어려워집니다. 이는 "같은 이름의 부품을 두 개 만들어 놓고 하나를 덮어써 버리는" 상황과 유사해, 의도치 않은 동작 변경을 유발할 수 있습니다.' },
          { key: 'CYCLOMATIC_COMPLEXITY', label: '복잡도',      result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: '접근 허용/차단/임계치 등 여러 조건문으로 복잡도 증가',
            detailDesc: '접근 허용/차단/임계치 처리 등이 여러 조건문으로 나뉘어 있어, 흐름을 한눈에 파악하기 어렵고 향후 규칙이 추가될 때 실수 가능성이 커질 수 있습니다. 조건이 늘어날수록 "어떤 경우에 어떤 결과가 나오는지" 확인 비용이 급격히 증가합니다.' },
          { key: 'BUGS',                  label: '잠재 버그',   result: 'fail',    counts: {pass:0,warning:0,fail:1,na:0}, desc: 'lock 변수 정의 안됨(런타임 오류), \'ACCESS DENIE\' 오타',
            detailDesc: '스레드 동기화를 위해 사용한 lock 변수가 코드 내에서 정의되지 않아 실행 시 오류가 발생합니다. 또한 로그 메시지에 "ACCESS DENIE" 오타가 있어 운영 중 모니터링/감사 로그의 신뢰도를 떨어뜨릴 수 있습니다. 전자는 프로그램이 아예 실행되지 않는 수준의 문제이고, 후자는 문제 상황을 추적할 때 기록을 놓치게 만드는 위험이 있습니다.' },
          { key: 'CODING_STYLE',          label: '코딩 스타일', result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: '중첩 함수·람다 혼용, 들여쓰기 불일치',
            detailDesc: '중첩된 함수 정의와 람다 사용 등으로 코드 구조가 불필요하게 복잡해 보이며, 들여쓰기/구조가 일관되지 않아 읽기와 점검이 어려울 수 있습니다. 결과적으로 다른 사람이 코드를 인수인계받거나, 본인이 시간이 지난 뒤 다시 수정할 때 이해 비용이 커집니다.' },
        ],
        strengths: [
          '접근 제어 목적이 명확하고, 데코레이터를 활용해 권한 검사 로직을 분리하려는 설계 방향이 적절합니다.',
          '람다를 활용한 간결한 표현 시도와 역할 분리 의도가 코드 구조에서 확인됩니다.',
        ],
        weaknesses: [
          'lock 변수가 정의되지 않아 실행 시 즉시 NameError가 발생하는 치명적 버그가 존재합니다.',
          'wrapper 함수가 중복 정의되어 있어 어느 wrapper가 실제로 동작하는지 파악하기 어렵습니다.',
          '접근 허용/차단/임계치 등 여러 조건문이 분산되어 있어 복잡도가 높고 유지보수가 어렵습니다.',
          '로그 메시지에 오타(ACCESS DENIE)가 있고 중첩 함수·람다 혼용으로 가독성이 저하됩니다.',
        ],
        improvements: [
          'lock 변수는 함수 외부에서 threading.Lock()으로 먼저 정의한 뒤 데코레이터에서 참조하도록 수정하세요. 실행 전 반드시 모든 변수가 정의되어 있는지 확인하세요.',
          'wrapper 중복 정의를 제거하고, functools.wraps를 사용해 원본 함수의 메타데이터를 유지하는 하나의 wrapper만 남기세요.',
          '접근 제어 조건(허용/차단/임계치)을 별도 함수나 딕셔너리로 분리해 조건 추가·변경 시 한 곳만 수정하면 되도록 구성하세요.',
          '로그 메시지 오타를 수정하고, 들여쓰기와 코딩 스타일을 PEP 8 기준으로 일관되게 정리하세요.',
        ],
      },
      {
        problemNum: 5,
        title: '문제 5',
        fileName: 'main.py',
        summary: '역할별 함수 분리 시도와 전체적인 코드 구성 방향은 적절합니다. 그러나 item[\'prodcut\'] 키 오타, oepn 함수 오타, calcurate_statistics·combinattions_data·stas/stats 이름 불일치 등 다수의 철자 오류와 이름 불일치가 있어 실행 자체가 불가능한 수준입니다. 또한 append가 반복문 내부 잘못된 위치에 있어 결과 집계 로직도 오류를 포함하고 있습니다.',
        metrics: [
          { key: 'DUPLICATIONS',          label: '중복',        result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '역할별 함수 분리, 중복 없음',
            detailDesc: '함수들이 조합 생성, 통계 계산, 파일 저장, 스레드 실행 등 역할별로 분리되어 있으며, 동일한 로직이 여러 곳에 반복되어 나타나는 부분은 두드러지지 않습니다.' },
          { key: 'CYCLOMATIC_COMPLEXITY', label: '복잡도',      result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: 'process_combinations에 중첩 반복문 + 파일 저장 혼재',
            detailDesc: 'process_combinations 함수에 반복문이 중첩되어 있고(조합 반복 + 각 조합 원소 반복), 파일 저장까지 한 흐름에 묶어 있어 읽고 수정하기가 다소 어렵습니다.' },
          { key: 'BUGS',                  label: '잠재 버그',   result: 'fail',    counts: {pass:0,warning:0,fail:1,na:0}, desc: 'item[\'prodcut\'] 키 오타, oepn 함수 오타, calcurate_statistics·combinattions_data·stas/stats 이름 불일치, append 위치 오류',
            detailDesc: '실행 오류를 유발할 수 있는 오타와 이름 불일치가 존재합니다. 예: calculate_statistics에서 item[\'prodcut\'] 키 사용, combinattions_data 변수명 오타, save_combinations_to_json에서 oepn 오타, process_combinations에서 calcurate_statistics / stas·stats 변수명 불일치, 결과 append가 내부 루프에 있어 product가 완성되기 전에 여러 번 기록될 수 있습니다.' },
          { key: 'CODING_STYLE',          label: '코딩 스타일', result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: '이름 규칙 불일치(stas/stats), except: 포괄적, 불필요 주석 블록',
            detailDesc: '이름 규칙과 예외 처리 방식이 일관되지 않습니다. 예를 들어 변수명(stas/stats)과 함수명(calcurate_statistics)이 혼재되어 있고, 파일 읽기에서 모든 예외를 한 번에 처리하는 형태(except:)라 문제 원인 파악이 어려울 수 있습니다. 또한 주석 처리된 코드 블록이 길게 남아 있어 핵심 로직 파악을 방해할 수 있습니다.' },
        ],
        strengths: [
          '역할별로 함수를 분리하려는 구성 방향이 명확하여 코드의 의도를 파악하기 쉽습니다.',
          '중복 코드가 없는 구조로 같은 로직을 여러 곳에서 반복하지 않으려는 의도가 보입니다.',
        ],
        weaknesses: [
          '키 오타(prodcut), 함수명 오타(oepn, calcurate_statistics, combinattions_data), 변수명 불일치(stas/stats) 등 다수의 오류로 실행 시 즉시 오류가 발생합니다.',
          'append가 반복문 내부의 잘못된 위치에 있어 데이터 집계 결과가 의도와 다르게 동작합니다.',
          'process_combinations 함수에 중첩 반복문과 파일 저장 로직이 혼재되어 단일 책임 원칙에 위배됩니다.',
          'except: 포괄적 예외 처리와 불필요한 주석 블록으로 가독성과 안정성이 저하됩니다.',
        ],
        improvements: [
          '제출 전 코드를 실행하여 NameError, KeyError 등 기본 오류가 없는지 반드시 확인하세요. 오타는 정적 분석 도구(예: pylint, flake8)로 사전에 검출할 수 있습니다.',
          'append 위치를 반복문 외부로 이동하거나, 집계 로직을 별도 함수로 분리해 의도한 동작이 맞는지 단계별로 검증하세요.',
          'process_combinations에서 조합 생성과 파일 저장을 분리하여 각 함수가 하나의 책임만 갖도록 리팩터링하세요.',
          '변수·함수명을 코드 전체에서 일관되게 유지하고, except: 대신 구체적인 예외 타입을 명시해 오류 원인을 명확히 드러내세요.',
        ],
      },
      {
        problemNum: 6,
        title: '문제 6',
        fileName: 'main.py',
        summary: '전체적으로 기능이 \'나누기(분할)–정렬–합치기(병합)\'로 잘 구분되어 있어 중복이 적고 흐름이 단순합니다. 다만 계산 결과를 함수가 돌려주지 않고 화면 출력(print)에 의존하는 부분이 있어, 다른 코드에서 재사용하거나 자동 테스트로 검증하기가 어렵습니다. 또한 입력이 비어 있는 경우처럼 예외적인 상황에서 오류(0으로 나누기)가 발생할 가능성이 있어, 안정성 측면의 보완이 필요합니다. 마지막으로 상수처럼 보이는 이름 표기 규칙이 일관되지 않아, 장기적으로 읽기 쉬운 코드가 되도록 정리하는 것이 좋습니다.',
        metrics: [
          { key: 'DUPLICATIONS',          label: '중복',        result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '정렬·분할·병합 함수 분리, 중복 없음',
            detailDesc: '정렬, 분할, 병합 기능이 함수로 분리되어 있으며 동일한 로직을 반복해서 작성한 부분이 거의 보이지 않습니다. 이는 수정이 필요할 때 한 곳만 고치면 되는 구조에 가깝다는 의미입니다.' },
          { key: 'CYCLOMATIC_COMPLEXITY', label: '복잡도',      result: 'pass',    counts: {pass:1,warning:0,fail:0,na:0}, desc: '조건 분기 제한적, 전체 흐름 단순',
            detailDesc: '각 함수의 조건 분기 수가 제한적이고 전체 흐름이 단순합니다. 복잡한 예외 흐름이 많지 않아 이해와 변경이 비교적 쉽습니다.' },
          { key: 'BUGS',                  label: '잠재 버그',   result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: '정렬 결과 return 없이 print만, 빈 리스트 처리 시 0으로 나누기 위험',
            detailDesc: '정렬 결과를 함수에서 반환하지 않고 print로만 출력하는 방식은, 계산 결과를 프로그램의 다른 부분이 받아 쓰지 못하게 만들어 재사용과 검증(테스트)을 어렵게 합니다. 또한 입력이 빈 리스트인 경우 분할 크기 계산에서 0으로 나누는 상황이 발생할 수 있어 실행 중 오류 위험이 있습니다.' },
          { key: 'CODING_STYLE',          label: '코딩 스타일', result: 'warning', counts: {pass:0,warning:1,fail:0,na:0}, desc: 'Num_Threads 대문자 표기 불일치(PEP 8 snake_case 권고)',
            detailDesc: '전역 상수처럼 보이는 Num_Threads가 일반적인 상수 표기(예: 대문자 스네이크 케이스)와 다르게 혼용되어 있습니다. 이런 불일치는 코드를 처음 보는 사람이 규칙을 다시 학습하게 만들어, 읽기/유지보수 비용을 높일 수 있습니다.' },
        ],
        strengths: [
          '기능이 분할/정렬/병합으로 함수 단위로 나뉘어 있어 읽기와 수정이 비교적 쉽습니다.',
          '중복 코드가 거의 없어 같은 로직을 여러 곳에서 고치는 유지보수 비용이 낮습니다.',
          '분기(조건 처리)가 과도하지 않아 전체 흐름이 단순하고 이해하기 쉽습니다.',
        ],
        weaknesses: [
          '정렬 결과를 반환(return)하지 않고 출력(print)만 하는 구조라, 다른 코드에서 결과를 받아 활용하기 어렵고 테스트도 불편합니다.',
          '입력이 빈 리스트일 때 분할 크기 계산 과정에서 0으로 나누는 오류가 발생할 수 있어 안정성이 떨어집니다.',
          '상수처럼 사용되는 변수명(예: Num_Threads)의 표기 규칙이 일관되지 않아 팀/장기 유지보수 관점에서 혼란을 줄 수 있습니다.',
        ],
        improvements: [
          '핵심 함수는 print 대신 정렬 결과(리스트)를 반환하도록 바꾸고, 출력은 최상위 실행 구간에서만 수행해 재사용성과 테스트 용이성을 높이세요.',
          '빈 입력, 원소 1개, 스레드 수가 리스트 길이보다 큰 경우 등 경계 조건을 먼저 처리하도록 가드(예: if not data: return [])를 추가해 0으로 나누기 같은 런타임 오류를 예방하세요.',
          '상수로 쓰는 값은 대문자 스네이크 케이스(예: NUM_THREADS)처럼 일관된 규칙으로 통일하고, 의미가 드러나는 이름을 사용해 읽는 사람이 \'역할\'을 추측하지 않도록 하세요.',
          '분할 크기 계산과 분할 로직을 별도 함수로 명확히 캡슐화하고, 입력/출력 계약(무엇을 받아 무엇을 돌려주는지)을 주석이나 간단한 문서 문자열(docstring)로 명시해 변경 시 실수를 줄이세요.',
        ],
      },
        ] // end problems
      }, // end Python track
    ],
};
