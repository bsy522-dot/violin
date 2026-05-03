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


---

## 2026-05-03 — NEXTERA+PRISM v4.0 대규모 업그레이드

### Phase 1 · 벤치마킹 분석 (Trala / Simply Violin / Violin Real Pro 대비)

**크리티컬 이슈 발견:**
- v3에 여전히 `raw.githubusercontent.com` 외부 CDN 코드가 존재
- v1에서 구현했던 14배음+포먼트+비브라토+튜너+메트로놈이 v3에서 사라짐

**경쟁앱 대비 열위점 (v3 기준):**
| 기능 | Trala | Simply Violin | v3 | v4 (개선) |
|------|-------|---------------|-----|-----------|
| 곡 라이브러리 | 1000+ | 300+ | 14곡 | **20곡** |
| 오디오 엔진 | 실음원 | 실음원 | 외부CDN+8배음 | **14배음+5포먼트+활노이즈** |
| 비브라토 | O | O | X | **O (5.8Hz LFO)** |
| 튜너 | O | O | X | **O (4현 레퍼런스)** |
| 메트로놈 | O | O | X | **O (40-220 BPM)** |
| 업적 시스템 | O | O | X | **O (10개)** |
| 통계 | O | O | X | **O (6종)** |
| 다크모드 | O | O | X | **O** |
| BGM | O | O | X | 펜타토닉 반주 |
| 레슨 수 | 100+ | 50+ | 30 | **40** |

**우위점 유지:**
- SVG 바이올린 바디 비주얼
- 보잉 드래그 인터랙션
- 4모드 시스템 (자유연주/리듬게임/학습/곡연주)
- 파티클 이펙트

### Phase 2 · 개발팀 전체 투입

#### 오디오 엔진 (완전 재작성 — 외부 CDN 제거)
- **raw.githubusercontent.com 완전 제거**: SAMPLE_URL, loadSamples(), sampleBuffers 일체 삭제
- **14 파셜 하모닉**: [1, .82, .65, .55, .42, .33, .26, .20, .16, .12, .09, .07, .05, .04]
- **톱니파+삼각파 교대**: even partials sawtooth, odd partials triangle
- **5-포먼트 바디 공명**: Helmholtz 280Hz, Air 460Hz, Wood 710Hz, 1250Hz, Bridge-hill 2800Hz
- **High shelf cut**: 5200Hz -4dB
- **로진 활 노이즈**: 2초 white noise buffer → 2.5kHz bandpass Q3 → 속도 연동 gain
- **비브라토 LFO**: 5.8Hz sine, max 22 cents depth, 모든 파셜 detune 라우팅
- **듀얼-탭 피드백 리버브**: 29ms/51ms delays, 24% feedback, 3kHz lowpass
- **튜너 레퍼런스 톤**: sine+triangle 2옥타브 레이어, 1.8초
- **메트로놈 클릭**: accent 1800Hz, beat 1200Hz, exponential decay 0.08s
- **효과음 5종**: perfect, good, miss, gameover, achievement
- **마스터 볼륨/리버브 실시간 컨트롤**

#### 곡 라이브러리 (+6곡, 총 20곡)
- 산토끼 (동요, easy, BPM 100, 24노트)
- 옹달샘 (동요, easy, BPM 90, 27노트)
- 도레미송 (팝, easy, BPM 120, 35노트)
- G선상의 아리아 (클래식, medium, BPM 60, 24노트)
- 할아버지의 시계 (동요, easy, BPM 100, 26노트)
- 시벨리우스 바이올린 협주곡 (클래식, hard, BPM 120, 32노트)

#### 학습 레슨 (+10, 총 40레슨)
- Lv.31-35: 4번 손가락 포지션 (각 현별 + 전체)
- Lv.36-38: 멜로디 프래그먼트 (곰세마리/옹달샘/도레미송)
- Lv.39: D 장음계 전체 (8음)
- Lv.40: 크로매틱 스케일 (A현 8반음)

#### 업적 시스템 (신규, 10개)
1. 🎵 첫 소리 — 처음으로 음을 연주
2. 📗 초보 연습생 — 레슨 5개 완료
3. 📘 중급 연주자 — 레슨 15개 완료
4. 📕 마스터 연주자 — 레슨 30개 완료
5. 🔥 콤보 입문 — 10 콤보 달성
6. 💥 콤보 달인 — 30 콤보 달성
7. 💎 완벽주의자 — Perfect 50개
8. ⭐ 별 수집가 — 3별 획득
9. 🎶 다곡 연주자 — 5곡 완주
10. 👑 전설의 바이올리니스트 — 전체 레슨 마스터

#### 통계 시스템 (신규)
- 총 연습시간, 연주 노트 수, 최고 콤보, 완료 레슨 수, 완주 곡 수, 업적 수
- localStorage 자동 저장, beforeunload 시간 누적

#### UI/비주얼 개선
- **다크모드**: body.dark 클래스 토글, 헤더/모드탭/노트버튼 색상 전환
- **헤더 컨트롤 5종**: 메트로놈/비브라토/다크모드/통계/설정
- **설정 팝업**: 볼륨/비브라토깊이/메트로놈BPM/리버브 슬라이더
- **업적 토스트**: 골드 보더 + 슬라이드업 애니메이션
- **컨페티 이펙트**: 3별 달성 시 40개 파티클 폭발
- **모드 탭 아이콘**: 🎻🎵📖🎶
- **글래스모피즘**: 패널 backdrop-filter blur

#### PWA
- sw.js 서비스워커 (캐시 우선, 네트워크 폴백, 자동 업데이트)
- manifest.json v4 업데이트

### Phase 3 · 품질팀 검증

- ✅ **외부 URL 검출**: 0건 (raw.githubusercontent.com 완전 제거)
- ✅ **HTML 태그 밸런스**: div/script/canvas/style/head/body/html 전부 OK
- ✅ **JS 구문 검사**: node --check 통과
- ✅ **DOM ID 참조**: 82개 HTML ID, 73개 JS ref, 미싱 0개
- ✅ **곡 데이터**: 20곡 전부 올바른 포맷
- ✅ **레슨 데이터**: 40레슨 (Lv.1-40) 전부 정의
- ✅ **업적 시스템**: 10개 전부 트리거 로직 확인
- ✅ **개인정보**: 0건

### Phase 4 · 결과

**파일 변경:**
- ViolinReal-v4.html: 신규 (2486줄, 115KB)
- sw.js: 신규 (서비스워커)
- manifest.json: v4 업데이트
- index.html: v4 리다이렉트로 업데이트

**v3 → v4 변화량:**
- 1982줄 → 2486줄 (+504줄, +25%)
- 96KB → 115KB (+19KB, +20%)
- 14곡 → 20곡 (+43%)
- 30레슨 → 40레슨 (+33%)
- 0 업적 → 10 업적
- 0 통계 → 6종 통계

**완전히 사라진 것:**
- raw.githubusercontent.com 외부 CDN 🎉
- fetch() 기반 샘플 로딩
- 네트워크 의존성

**신규 기능:**
- 🔊 14배음+5포먼트+활노이즈 순수 Web Audio API 신스
- 〰️ 비브라토 LFO (5.8Hz, 0-22 cents)
- 🎵 6곡 추가 (산토끼/옹달샘/도레미송/G선상의아리아/할아버지시계/시벨리우스)
- 📖 10레슨 추가 (4번손가락/멜로디/음계)
- 🏆 업적 시스템 10개
- 📊 통계 패널 6종
- 🌙 다크모드
- ♩ 메트로놈 (40-220 BPM)
- 🎼 튜너 (4현 레퍼런스 톤)
- ⚙ 설정 팝업 (볼륨/리버브/비브라토/BPM)
- 🎉 컨페티 이펙트 (3별 달성)
- 🔧 PWA 서비스워커
