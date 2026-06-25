# 모님(Mornim) 디자인 스펙 v1.0

---

## 1. 테마 시스템

설정에서 3가지 테마 중 선택 가능. 기본값은 시안 A (웜 미니멀).

```
설정 → 테마 선택
  → A. 웜 미니멀 (기본)
  → B. 다크 에너지
  → C. 소프트 그린
```

테마 값은 Supabase user_settings 또는 localStorage에 저장한다.

---

## 2. 테마 컬러 토큰

### A — 웜 미니멀

```js
warm: {
  bg: {
    primary:   '#FFFAF5',  // 전체 앱 배경
    card:      '#FAEEDA',  // 카드, 확언 영역
    dark:      '#1A0E05',  // 카메라 화면 배경
    surface:   '#412402',  // 딥 서피스
  },
  text: {
    primary:   '#412402',  // 메인 텍스트
    secondary: '#854F0B',  // 서브 텍스트
    muted:     '#888780',  // 힌트 텍스트
    onDark:    '#FAEEDA',  // 어두운 배경 위 텍스트
  },
  accent: {
    primary:   '#BA7517',  // 메인 포인트
    secondary: '#EF9F27',  // 서브 포인트
    light:     '#FAC775',  // 연한 포인트
    highlight: '#BA7517',  // STT 하이라이트
  },
  border: '#D3D1C7',
  tab: {
    active:   '#854F0B',
    inactive: '#888780',
  }
}
```

### B — 다크 에너지

```js
dark: {
  bg: {
    primary:   '#1a1a2e',
    card:      '#26215C',
    dark:      '#0D0D1F',
    surface:   '#13132B',
  },
  text: {
    primary:   '#EEEDFE',
    secondary: '#AFA9EC',
    muted:     '#5F5E5A',
    onDark:    '#EEEDFE',
  },
  accent: {
    primary:   '#534AB7',
    secondary: '#7F77DD',
    light:     '#CECBF6',
    highlight: '#534AB7',
  },
  border: '#3C3489',
  tab: {
    active:   '#AFA9EC',
    inactive: '#5F5E5A',
  }
}
```

### C — 소프트 그린

```js
green: {
  bg: {
    primary:   '#F4F9F0',
    card:      '#EAF3DE',
    dark:      '#0F2010',
    surface:   '#162E18',
  },
  text: {
    primary:   '#173404',
    secondary: '#3B6D11',
    muted:     '#888780',
    onDark:    '#EAF3DE',
  },
  accent: {
    primary:   '#639922',
    secondary: '#97C459',
    light:     '#C0DD97',
    highlight: '#3B6D11',
  },
  border: '#C0DD97',
  tab: {
    active:   '#3B6D11',
    inactive: '#888780',
  }
}
```

---

## 3. 공통 스펙

### 뷰포트

```
max-width: 430px
margin: 0 auto
기준 디바이스: iPhone 14 (390 × 844px)
```

### 폰트

```
font-family: 'Pretendard', sans-serif  // 한국어 최적화
font-weight: 400 (regular), 500 (medium)
```

### Border Radius

```
카드:         20px
버튼 (pill):  28px
태그·뱃지:    20px
달력 셀:       8px
소형 요소:    10px
```

### 애니메이션

```
slideUp:  translateY(20px) → translateY(0)
          duration: 0.4s, ease: ease-out

fadeIn:   opacity 0 → 1
          duration: 0.3s

pulse:    scale 1 → 1.2 → 1
          duration: 1.2s, repeat: infinite

bounce:   translateY(0) → translateY(-4px) → translateY(0)
          duration: 1.5s, repeat: infinite
```

### 화면 전환

```
swipe transition: transform translateX
방향: 좌→우 (뒤로), 우→좌 (앞으로)
```

---

## 4. 화면별 스펙

### 4-1. 동적 텍스트 화면 (첫 번째 화면)

```
배경: theme.bg.dark
레이아웃: 세로 중앙 정렬, 수평 중앙 정렬
패딩: 0 32px
```

**텍스트 구조**

확언 문장을 의미 단위로 끊어 줄별 배치. 핵심 단어는 크게, 조사·부사는 작게.

예시 — "나는 오늘도 충분히 잘하고 있다"

```
줄1: "나는"        font-size: 18px  color: theme.text.secondary  weight: 400
줄2: "오늘도"      font-size: 36px  color: theme.text.onDark     weight: 500
줄3: "충분히"      font-size: 20px  color: theme.accent.light    weight: 400
줄4: "잘하고 있다"  font-size: 22px  color: theme.accent.secondary weight: 500
```

```
letter-spacing: -0.5px
line-height: 1.9
```

**애니메이션**

각 줄 slideUp + fadeIn, delay 0.2s 간격으로 순서대로 등장.

**하단 스와이프 안내**

```
텍스트: "아래로 스와이프"
font-size: 12px
color: theme.accent.primary
background: theme.bg.surface (반투명 pill)
border-radius: 20px
padding: 4px 14px
animation: bounce 반복
```

---

### 4-2. 카메라 말하기 화면 (두 번째 화면)

```
레이아웃: 전체 화면 카메라 뷰
  position: absolute
  top: 0 / left: 0 / right: 0 / bottom: 0

카메라:
  전면 카메라 (facingMode: 'user')
  object-fit: cover (전체 화면 커버)
  transform: scaleX(-1) (거울 효과)
```

**상단 오버레이 — 진행 표시**

```
내용: "1 / 3"
position: absolute
top: 52px
정렬: 수평 중앙
background: rgba(0, 0, 0, 0.4)
padding: 4px 12px
border-radius: 20px
font-size: 12px
color: theme.text.onDark
```

**하단 오버레이 — 확언 텍스트 + 버튼**

```
position: absolute
bottom: 0 / left: 0 / right: 0
background: transparent (완전 투명)
padding: 16px 20px 40px
```

확언 텍스트

```
각 단어를 개별 <span>으로 분리

기본 상태:
  color: #FFFFFF
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8)

STT 인식된 단어:
  background: theme.accent.highlight
  color: theme.text.onDark
  border-radius: 6px
  padding: 2px 6px

font-size: 18px
font-weight: 500
line-height: 2
text-align: center
```

STT 상태 표시

```
녹음 점: width/height 6px, border-radius: 50%
         color: theme.accent.secondary
         animation: pulse 반복
텍스트: "듣고 있어요..."
        font-size: 12px
        color: theme.accent.light
```

완료 버튼

```
background: theme.text.onDark
color: theme.bg.surface
border-radius: 28px
padding: 12px 0
font-size: 15px
font-weight: 500
width: 100%
margin-top: 12px
```

**카메라 없을 때 대안 모드**

```
배경: theme.bg.dark
확언 텍스트: 화면 중앙에 동적 텍스트 화면과 동일하게 표시
나머지 UI: 동일
```

---

### 4-3. 홈 화면

```
배경: theme.bg.primary
```

**상단 인사**

```
텍스트: "좋은 아침이에요 ☀" (또는 시간대별 변경)
font-size: 14px
color: theme.text.muted
padding: 16px 16px 0
```

**확언 카드**

```
background: theme.bg.card
border-radius: 20px
padding: 20px 16px
margin: 12px 16px

텍스트: 동적 텍스트 화면과 동일한 줄 구조 (축소 버전)
  줄1: font-size: 12px
  줄2: font-size: 20px
  줄3: font-size: 14px
  줄4: font-size: 15px

재생 버튼:
  width: 44px / height: 44px
  border-radius: 50%
  background: theme.accent.primary
  아이콘: 재생 아이콘, color: theme.text.onDark
```

**달력**

```
background: theme.bg.primary (또는 #FFFFFF)
border: 0.5px solid theme.border
border-radius: 16px
margin: 8px 16px
padding: 12px

날짜 셀: 28px × 28px, border-radius: 8px

완료 표시 (진하기):
  1–2개: theme.accent.light   (연함)
  3–5개: theme.accent.secondary (중간)
  6–7개: theme.accent.primary  (진함)

오늘 날짜:
  border: 1.5px solid theme.accent.primary
  color: theme.accent.primary
```

**하단 바로가기 버튼**

```
display: flex, gap: 8px
margin: 8px 16px

각 버튼:
  flex: 1
  background: theme.bg.card (또는 white)
  border: 0.5px solid theme.border
  border-radius: 12px
  padding: 10px
  font-size: 12px
  color: theme.text.secondary
  text-align: center

항목: 확언 만들기 / 게임
```

**하단 탭바**

```
background: theme.bg.primary
border-top: 0.5px solid theme.border
padding: 8px 0 12px

아이콘: 20px
활성: theme.tab.active
비활성: theme.tab.inactive
font-size: 10px (레이블)

탭 항목: 홈 / 확언 / 게임 / 함께 / 설정
```

---

### 4-4. 칭찬 완료 화면

```
확언 1개 완료 시 표시
배경: theme.bg.dark
중앙: 칭찬 텍스트 + 애니메이션

칭찬 텍스트 예시:
  "잘했어요!"
  "멋져요!"
  "오늘도 해냈어요!"
  font-size: 28px, font-weight: 500, color: theme.text.onDark

서브 텍스트:
  "1 / 3 완료"
  font-size: 14px, color: theme.accent.light

애니메이션:
  칭찬 텍스트: scaleUp (0.5 → 1) + fadeIn
  duration: 0.5s

1.5초 후 자동으로 다음 확언 동적 텍스트 화면으로 전환
3개 모두 완료 시: 달력 체크 반영 + 특별 칭찬 화면 표시
```

---

### 4-5. 설정 — 테마 선택 화면

```
항목: 테마
레이아웃: 3개 미리보기 카드 가로 나열

각 카드:
  width: calc(33% - 8px)
  border-radius: 16px
  overflow: hidden
  해당 테마 색상으로 미니 홈 화면 미리보기 표시

선택된 카드:
  border: 2px solid theme.accent.primary

저장: Supabase user_settings.theme 또는 localStorage['mornim-theme']
```

---

## 5. 확언 카테고리 색상

달력 및 확언 태그에 사용되는 카테고리별 색상.

| 카테고리 | 색상 (light) | 색상 (dark) |
|------|------|------|
| 나 자신 | #FAEEDA (앰버) | #412402 |
| 일과 커리어 | #E6F1FB (블루) | #0C447C |
| 돈과 풍요 | #EAF3DE (그린) | #173404 |
| 관계와 사랑 | #FBEAF0 (핑크) | #4B1528 |
| 건강과 몸 | #E1F5EE (틸) | #04342C |
| 용기와 도전 | #FCEBEB (레드) | #501313 |
| 마음과 평온 | #EEEDFE (퍼플) | #26215C |
| 오늘 하루 | #FAEEDA (앰버 라이트) | #633806 |

---

## 6. 컴포넌트 목록

개발 시 공통 컴포넌트로 분리할 항목.

```
ThemeProvider         // 테마 컨텍스트 관리
DynamicText           // 동적 텍스트 애니메이션
AffirmationCard       // 홈 확언 카드
CameraView            // 카메라 말하기 화면
SpeakingOverlay       // 카메라 위 텍스트 오버레이
WordHighlight         // STT 단어 하이라이트
CompletionScreen      // 칭찬 완료 화면
CalendarView          // 달력 (진하기 표시)
ProgressIndicator     // 1/3 진행 표시
TabBar                // 하단 탭바
ThemeSelector         // 설정 테마 선택 카드
CategoryTag           // 확언 카테고리 태그
```
