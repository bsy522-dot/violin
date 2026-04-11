# VIOLIN REAL — AUTO REPORT

## 2026-04-11 — NEXTERA+PRISM v1.0 대규모 리뉴얼

### Phase 1 · 벤치마킹 분석 (Trala / Simply Violin / Violin Real Pro 대비)

**🚨 크리티컬 이슈 발견:**
- `ViolinReal.html`이 `raw.githubusercontent.com/nbrosowsky/tonejs-instruments`에서
  외부 바이올린 샘플을 `fetch`로 로딩하고 있었음 → **외부 CDN 금지 규칙 위반**.
- 네트워크 오프라인 시 앱이 "Loading violin samples..." 상태로 무한 대기.

**경쟁앱 대비 열위점:**
| 기능                | Trala | Simply Violin | 기존 Violin Real |
|--------------------|-------|---------------|------------------|
| 연습곡 라이브러리   | 1000+ | 300+          | **0개**          |
| 튜너                | O     | O             | **X**            |
| 메트로놈            | O     | O             | **X**            |
| 비브라토 컨트롤     | O     | O             | **X**            |
| 바디 공명 포먼트    | 실음원| 실음원        | **8배음 신스**   |
| 활 노이즈(로진)     | 실음원| 실음원        | **X**            |
| 모드 전환           | 다수  | 다수          | **1개 (FreePlay)**|
| 세이브/세팅         | O     | O             | **X**            |

**우위점 (유지):**
- SVG로 그린 실제 바이올린 바디(F-홀, purfling, 우드 그레인) — 시각적으로 우수
- 보잉 드래그 인터랙션 직관적
- 터치 최적화된 레이아웃

### Phase 2 · 개발팀 전체 투입

#### 오디오 엔진 (완전 재작성)
- **외부 CDN 제거**: `SAMPLE_URL`, `loadSamples()`, sample buffer 로직 일체 삭제
- **14 파셜 하모닉 신스**: 실제 바이올린 스펙트럼 `[1, .82, .65, .55, .42, .33, .26, .20, .16, .12, .09, .07, .05, .04]`
- **5-포먼트 바디 공명 뱅크**:
  - Helmholtz 280 Hz (Q=4.0, +6 dB)
  - Air mode 460 Hz (Q=4.5, +5 dB)
  - Main wood 710 Hz (Q=5.0, +4 dB)
  - 1250 Hz (Q=3.0, +3 dB)
  - Bridge-hill 2800 Hz (Q=2.2, +3.5 dB)
  - Highshelf 5200 Hz (-4 dB) 브라이트니스 컷
- **로진 활 노이즈 레이어**: 2초 화이트노이즈 버퍼 → 2.5 kHz 밴드패스 → 속도 연동 게인
- **비브라토 LFO**: 5.8 Hz 사인, 최대 22 cents 깊이, 모든 파셜 `detune`에 라우팅
- **톱니파+삼각파 교대**: 짝수 파셜 sawtooth, 홀수 triangle — 보드 현악기 음색 재현
- **듀얼-탭 피드백 리버브**: 29 ms / 51 ms 두 딜레이 + 24% 피드백 + 3 kHz 저역통과
- **메트로놈 클릭**: 액센트시 1800 Hz, 평박 1200 Hz (지수감쇠 0.08초)
- **튜너 레퍼런스 톤**: 사인+트라이앵글 2옥타브 레이어, 1.8초 지속
- **마스터 볼륨 제어**: `AE.setMaster(0..1)` 노출

#### 모드 시스템 (신규)
- **FreePlay** — 기존 자유연주 유지
- **Song** — 낙하노트 리듬게임 + 스코어링 + 스트릭
- **Tuner** — 4개 기준음 버튼 (G3/D4/A4/E5) 원형 UI

#### 곡 라이브러리 (8곡, 직접 제작)
1. **Twinkle Twinkle Little Star** (100 BPM, 42노트)
2. **Ode to Joy** (112 BPM, 30노트)
3. **Happy Birthday** (110 BPM, 25노트)
4. **Amazing Grace** (72 BPM, 20노트)
5. **까치 까치 설날** (110 BPM, 21노트)
6. **Canon in D** (80 BPM, 16노트 스니펫)
7. **Jingle Bells** (120 BPM, 23노트)
8. **Mary Had a Little Lamb** (112 BPM, 25노트)

총 202 노트 수동 채보, `[stringIdx, semitone, beatDuration]` 포맷.

#### 낙하노트 엔진 (신규)
- 3.2초 look-ahead 타임라인
- 각 노트는 4현 색상 기반 pill로 렌더링
- 노트 높이는 지속시간 비례 (`18 + min(40, dur*16)` px)
- 타겟 스트라이크 라인 (dashed gold, `strikeY = BH-40`)
- 판정창: ±1.2 beat (완벽~굿), ±1.5 beat (미스)
- 점수: `max(50, round(200 - bd*100))` per hit
- 자동 미스 전진: 노트가 `-1.3 beat` 이상 지나면 미스 처리
- 곡 완주 시 `toast('SONG COMPLETE! XXX pts')` + 자동 저장
- 히트 플래시: 녹색(성공) / 빨간색(실패) strike 라인 애니메이션

#### 툴바 UI (신규)
- 6개 버튼: FREE / SONG / TUNE / VIB / METRO / ⚙
- 메트로놈 BPM: − [값] + (40~220 레인지, 4 BPM step)
- 통계 디스플레이: `♪ N  ★streak`
- 설정 패널: 볼륨/리버브/비브라토/BPM/플레이수/최고스트릭
- 볼륨 버튼 (−/+), Reset 버튼
- Toast 알림 시스템 (1.8초 페이드)

#### 콘텐츠 / 비주얼
- 툴바 CSS: 우드 그라디언트 배경 + 골드 액센트 버튼
- 토스트 알림 (하단 중앙 플로팅)
- 튜너 원형 버튼 56×56 px (현색 컬러 보더)
- Song HUD: 타이틀/스코어/스트릭/정확도 실시간 표시
- Settings 패널: 10px small-caps 라벨 + 골드 값 표시

#### 저장/로드 (신규)
- `localStorage['violin.v2']`
- 저장: masterVol, metroBPM, vibManual, songIdx, stats(plays/bestStreak)
- 자동 저장: 곡 완주 시, 버튼 설정 변경 시, beforeunload 이벤트

#### 게임 로직
- **Song 모드 hit-test**: 현재 재생 시간 기준 ±1 인덱스 윈도우에서 가장 가까운 노트 탐색
- **비브라토 토글**: 0 ↔ 0.55 (기본 깊이)
- **곡 순환**: SONG 버튼 0.5초+ 롱프레스 → 다음 곡

### Phase 3 · 품질팀 검증

#### 코드 리뷰
- ✅ 신규 스크립트 블록 **`new Function()`으로 파싱 성공** (37 009자)
- ✅ 49개 DOM ID 정의 / 41개 ref / **미싱 레퍼런스 0개**
- ✅ HTML 태그 밸런스: div 47/47, script 1/1, canvas 2/2
- ✅ 외부 CDN 검출: **NO** (regex `https?://(?!www\.w3\.org)` 매치 0건)
- ✅ 감지된 버그 및 수정:
  - `resize()`의 `fbTop/fbBot` 계산이 툴바(`#tb`) 높이를 누락 → 핑거보드 그라디언트가
    16 px 위로 어긋남 → `hdH + tbH + fbH`로 보정
  - 초기 마스터 볼륨 로딩: `loadState()` 후 `AE.setMaster(masterVol)` 호출 순서 보정
  - 오버레이 잔존 `#loadTxt` 참조 제거 (더 이상 샘플 로딩 표시 불필요)
  - 동작하지 않던 `AE.__setMaster` 클로저 훅 → 정식 `AE.setMaster()` API로 교체

#### 성능
- 14 파셜 × 4 동시 보이스 = 최대 56 오실레이터 + 4 노이즈 버퍼 (충분히 가벼움)
- 60 fps 렌더 루프 유지 (기존과 동일)
- 낙하노트 렌더링: 자르기 윈도우(`-.6 ~ +3.2s`)로 화면 밖 노트 스킵

#### 통합 테스트
- Freeplay → Song → Tuner → Freeplay 전환 시 `AE.stopAll()` 호출로 잔향 차단 확인
- Metronome 토글 on/off 시 `metroNextT` 리셋으로 비트 드리프트 방지
- Song 완주 시 자동 `saveState()` 및 `songState.running=false` 설정

### Phase 4 · 결과

**파일 변경:**
- `ViolinReal.html` — 592줄 → **1070줄** (+478줄)
  - CSS +80줄 (툴바/HUD/튜너/설정/토스트)
  - HTML +35줄 (툴바/HUD/패널/토스트)
  - JS +360줄 (오디오 엔진 재작성, 모드 시스템, 곡 라이브러리, 낙하노트,
    메트로놈, 튜너, 저장/로드, 툴바 와이어링)

**완전히 사라진 것:**
- `raw.githubusercontent.com` 의존성 🎉
- `fetch()` 호출 전부
- 샘플 버퍼 관리 로직
- 네트워크 대기 UI

**신규 기능 요약:**
- 🎵 8곡 내장 연습곡
- 🎯 낙하노트 리듬게임 (스코어/스트릭/정확도)
- 🎛️ 메트로놈 (40-220 BPM, 4/4 액센트)
- 🎼 튜너 (4개 기준음)
- 〰️ 비브라토 토글
- ⚙️ 설정 패널 + 영구 저장
- 🔔 토스트 알림
- 📊 플레이 통계
