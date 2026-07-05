'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mic, Camera, CalendarCheck, Volume2, Eye, Heart, UserCircle } from 'lucide-react'

/* ── Design tokens (ported from onboarding_handoff redesign) ────── */
const GOLD = '#B87514'
const GOLD_LIGHT = '#D9922A'
const INK = '#241A0E'
const INK2 = '#7A6A55'
const CREAM = '#FDF9F1'
const CREAM_SOFT = '#FBF0DA'
const LINE = '#F0E7D6'
const BADGE_BG = '#F5E7CB'
const BADGE_TEXT = '#9A6A12'

const btnBase: React.CSSProperties = {
  width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  fontSize: 16, fontWeight: 700, borderRadius: 15, padding: '16px 20px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
}
const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
  color: '#fff',
  boxShadow: '0 10px 26px rgba(184,117,20,0.34)',
}

const skipLink: React.CSSProperties = {
  position: 'absolute', top: 34, right: 20, zIndex: 21,
  background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  fontSize: 13.5, fontWeight: 600, color: 'rgba(122,106,85,0.85)', padding: 8,
}

const MOCKUP = {
  woman: { src: '/onboarding-intro/woman-mockup.png', w: 762, h: 1474 },
  man: { src: '/onboarding-intro/man-mockup.png', w: 752, h: 1472 },
} as const

const DEMO_WORDS = ['나는', '매일', '성장하고', '있다']
type Person = 'man' | 'woman'
const DEMO_THRESHOLDS: Record<Person, number[]> = {
  woman: [0.123, 0.374, 0.549, 0.681],
  man: [0.553, 0.661, 0.770, 0.918],
}
const DEMO_VIDEO_SRC: Record<Person, string> = {
  woman: '/onboarding-intro/woman-speak.mp4',
  man: '/onboarding-intro/man-speak.mp4',
}

const QUOTES = [
  '왜 이렇게 열심히 살았지',
  '이렇게 해서 얻은 건 뭐지',
  '내가 추구해 온 것들, 잘 해내고 있나',
  '앞으로는 어떻게 살아야 하지',
]

const HOW_STEPS = [
  { num: '01', title: '오늘의 말을 골라요', desc: '카테고리별 확언 중 오늘 마주할 성공의 말을 만나요.', icon: Mic },
  { num: '02', title: '카메라를 보며 말해요', desc: '소리 내어 말하면 인식된 단어가 하나씩 밝아져요.', icon: Camera },
  { num: '03', title: '기록으로 이어져요', desc: '완료한 외침이 달력과 연속 기록으로 쌓여요.', icon: CalendarCheck },
]

const EVIDENCE = [
  { title: '소리 내어 말하기', desc: '소리 내어 말하면 눈으로 읽을 때보다 더 오래 기억에 남아요.', icon: Volume2, chipBg: '#FBF0DA', chipColor: GOLD },
  { title: '보면서 말하기', desc: '보면서 말하면 기억이 더 잘 형성될 수 있어요.', icon: Eye, chipBg: '#EAF2FB', chipColor: '#1E88E5' },
  { title: '나의 가치를 떠올리기', desc: '나의 가치를 자주 떠올리면 마음이 더 안정돼요.', icon: Heart, chipBg: '#EEF4E6', chipColor: '#5E8A2E' },
  { title: '내 얼굴을 마주하기', desc: '내 얼굴과 관련된 정보는 더 빠르고 강하게 기억돼요.', icon: UserCircle, chipBg: '#F3ECFB', chipColor: '#7A5AD9' },
]

const TOTAL_STEPS = 5

export default function OnboardingIntroPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const skipToOnboarding = useCallback(() => router.push('/onboarding'), [router])

  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100dvh',
      background: CREAM,
      fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      <ProgressBar step={step} />
      {step === 0 && <HeroStep onNext={() => setStep(1)} onSkip={skipToOnboarding} />}
      {step === 1 && <MidlifeStep onNext={() => setStep(2)} onSkip={skipToOnboarding} />}
      {step === 2 && <DemoStep onNext={() => setStep(3)} />}
      {step === 3 && <WhyItWorksStep onNext={() => setStep(4)} onSkip={skipToOnboarding} />}
      {step === 4 && <HowAndCtaStep onStart={skipToOnboarding} />}
    </div>
  )
}

/* ── 상단 진행률 바 (5칸) ────────────────────────────────────────── */
function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ position: 'absolute', top: 16, left: 20, right: 20, zIndex: 20, display: 'flex', gap: 5 }}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 3.5, borderRadius: 2,
          background: i <= step ? GOLD : 'rgba(184,117,20,0.18)',
          transition: 'background 0.3s ease',
        }} />
      ))}
    </div>
  )
}

/* ── Reusable: static mockup screenshot, shown at its real width/ratio (no crop) ── */
function MockupImage({ person, delay = 0 }: { person: keyof typeof MOCKUP; delay?: number }) {
  const m = MOCKUP[person]
  return (
    <Image
      src={m.src}
      alt=""
      width={m.w}
      height={m.h}
      sizes="140px"
      style={{
        width: 140, height: 'auto', maxHeight: '94%', objectFit: 'contain', display: 'block',
        borderRadius: 32, boxShadow: '0 24px 56px -20px rgba(65,36,2,0.5)',
        animation: `floatY 5.5s ease-in-out ${delay}s infinite`,
      }}
    />
  )
}

/* ── Step 0: Hero + 두 목업 이미지(남/여) — 스크롤 없이 한 화면에 ─── */
function HeroStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <button style={skipLink} onClick={onSkip}>건너뛰기</button>

      <div style={{ padding: '34px 20px 0' }}>
        <div style={{ position: 'relative', width: 76, height: 76, borderRadius: 19, overflow: 'hidden', marginBottom: 16, boxShadow: '0 10px 24px -6px rgba(65,36,2,0.34)' }}>
          <Image src="/splash-icon.png" alt="이뤄" width={76} height={76} style={{ borderRadius: 19 }} />
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, background: BADGE_BG,
          padding: '6px 13px', borderRadius: 999, marginBottom: 18,
        }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill={BADGE_TEXT}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" /></svg>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: BADGE_TEXT }}>성공의 말 습관 만들기</span>
        </div>
        <h1 style={{ fontSize: 37, fontWeight: 800, lineHeight: 1.24, letterSpacing: '-1px', margin: '0 0 12px', color: INK }}>
          흔들리는 시기,<br /><span style={{ color: GOLD }}>다시 나를 세우는</span><br />한 문장
        </h1>
        <p style={{ fontSize: 13.5, lineHeight: 1.62, color: INK2, margin: 0 }}>
          AI가 모든 것을 바꾸는 시대, 미래가 불안한 요즘.<br />나를 마주 보고 오늘의 성공의 말을 소리 내어 말해요.
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px 20px' }}>
        <MockupImage person="woman" delay={0} />
        <MockupImage person="man" delay={0.8} />
      </div>

      <div style={{ padding: '8px 20px 24px' }}>
        <button style={btnPrimary} onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

/* ── Step 1: MIDLIFE dark section ──────────────────────────────── */
function MidlifeStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(168deg,#2A1E0E,#150C03)', color: '#fff',
    }}>
      <button style={{ ...skipLink, color: 'rgba(255,255,255,0.65)' }} onClick={onSkip}>건너뛰기</button>
      <div style={{ flex: 1, overflowY: 'auto', padding: '74px 26px 18px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', lineHeight: 1.3, margin: '0 0 14px' }}>
          요즘, 이런 마음이<br />스치나요?
        </h2>
        <p style={{ fontSize: 14.5, lineHeight: 1.62, color: 'rgba(255,255,255,0.68)', margin: '0 0 24px' }}>
          AI가 일과 미래를 빠르게 바꾸는 시대.<br />열심히 달려온 나, 문득 마음이 흔들립니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {QUOTES.map((q, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(230,192,122,0.18)',
              borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 13,
            }}>
              <span style={{ fontSize: 30, fontWeight: 800, color: 'rgba(230,192,122,0.42)', lineHeight: 1, fontFamily: 'Georgia,serif', flexShrink: 0 }}>&ldquo;</span>
              <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.94)', lineHeight: 1.45 }}>{q}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#FFF4DC', fontWeight: 600, margin: '26px 0 0', textAlign: 'center' }}>
          그 소용돌이에서 다시 나를 추스르는 방법.<br /><span style={{ color: '#E6C07A' }}>긍정의 언어, 오늘의 성공의 말</span>로.
        </p>
      </div>
      <div style={{ padding: '12px 22px 40px' }}>
        <button style={btnPrimary} onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

/* ── Step 2: Standalone video demo — 남녀 번갈아 재생 (no skip link) ── */
function DemoStep({ onNext }: { onNext: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const personRef = useRef<Person>('woman')
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'celebrate'>('idle')
  const [lit, setLit] = useState(0)

  useEffect(() => () => {
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current)
  }, [])

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const p = v.currentTime / v.duration
    const thresholds = DEMO_THRESHOLDS[personRef.current]
    let next = 0
    for (let i = 0; i < thresholds.length; i++) if (p >= thresholds[i]) next = i + 1
    setLit((prev) => (prev === next ? prev : next))
    if (next >= DEMO_WORDS.length && p >= thresholds[thresholds.length - 1] + 0.02) {
      setPhase((prev) => (prev === 'playing' ? 'celebrate' : prev))
    }
  }, [])

  const switchPerson = useCallback(() => {
    switchTimerRef.current = setTimeout(() => {
      const next: Person = personRef.current === 'woman' ? 'man' : 'woman'
      personRef.current = next
      setLit(0)
      setPhase('playing')
      const v = videoRef.current
      if (v) {
        v.src = DEMO_VIDEO_SRC[next]
        v.currentTime = 0
        v.play().catch(() => {})
      }
    }, 1700)
  }, [])

  const handlePlayTap = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setPhase('playing')
    } else {
      v.pause()
      setPhase('idle')
    }
  }, [])

  const handleAdvance = useCallback(() => {
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current)
    onNext()
  }, [onNext])

  const words = DEMO_WORDS.map((w, i) => ({ text: w, on: i < lit }))
  const playLabel = phase === 'idle' ? '재생' : '완료'

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: INK }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '36px 20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E6C07A', letterSpacing: 1, marginBottom: 8 }}>이렇게 말해요</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.4px' }}>나를 보며 성공의 말을 해요</h2>
        </div>
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '340 / 718',
          borderRadius: 40, padding: 10,
          background: 'linear-gradient(150deg,#2A1E0E,#1a0f04)',
          boxShadow: '0 24px 56px -20px rgba(65,36,2,0.5)',
        }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden', background: '#140D06' }}>
            <video
              ref={videoRef}
              src="/onboarding-intro/woman-speak.mp4"
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={switchPerson}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%' }}
            />
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, rgba(20,13,6,0.5) 0%, rgba(20,13,6,0.12) 36%, rgba(20,13,6,0.72) 100%)',
            }} />
            <div style={{
              position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
              width: 90, height: 22, background: '#000', borderRadius: 12, zIndex: 20,
            }} />

            <div style={{ position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 12 }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>1 / 3</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(194,60,40,0.85)', borderRadius: 20, padding: '4px 10px', fontSize: 10.5, fontWeight: 700, color: '#fff' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                녹음 중
              </div>
            </div>

            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 12 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginBottom: 20 }}>
                {words.map((w, i) => (
                  <span key={i} style={{
                    fontSize: 19, fontWeight: 700, padding: '6px 12px', borderRadius: 10,
                    background: w.on ? 'linear-gradient(135deg,#F0D28E,#E6C07A)' : 'rgba(255,255,255,0.12)',
                    color: w.on ? INK : 'rgba(255,255,255,0.92)',
                    boxShadow: w.on ? '0 0 20px rgba(230,192,122,0.45)' : 'none',
                    transition: 'all 0.35s ease',
                  }}>
                    {w.text}
                  </span>
                ))}
              </div>
              {phase === 'playing' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.72)', fontSize: 12.5 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 16 }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} style={{
                        width: 3, borderRadius: 2, background: '#E6C07A', height: 5,
                        animation: `waveBar 0.5s ease-in-out ${i * 0.08}s infinite`,
                      }} />
                    ))}
                  </div>
                  인식 중...
                </div>
              )}
            </div>

            {phase === 'celebrate' && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 22, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(20,13,6,0.55), rgba(20,13,6,0.85))',
              }}>
                <div style={{ position: 'relative', width: 66, height: 66, marginBottom: 14 }}>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '2px solid rgba(230,192,122,0.7)',
                    animation: 'ring 1.1s ease-out infinite',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#E6C07A,#B87514)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(184,117,20,0.5)',
                  }}>
                    <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#FFF4DC', letterSpacing: '-0.4px', marginBottom: 6 }}>잘하셨어요!</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,244,220,0.78)' }}>오늘의 성공의 말 완료</div>
              </div>
            )}

            <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, zIndex: 14 }}>
              <button
                onClick={handlePlayTap}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 16px', borderRadius: 16, border: 'none', cursor: 'pointer',
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#fff',
                  fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                  boxShadow: '0 8px 20px rgba(184,117,20,0.4)',
                }}
              >
                {phase === 'idle' ? (
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                ) : (
                  <svg width={14} height={14} viewBox="0 0 16 16" fill="#fff"><rect x="3" y="2" width="4" height="12" rx="1.5" /><rect x="9" y="2" width="4" height="12" rx="1.5" /></svg>
                )}
                {playLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 22px 40px' }}>
        <button style={btnPrimary} onClick={handleAdvance}>다음</button>
      </div>
    </div>
  )
}

/* ── Step 3: WHY IT WORKS (content shortened) ──────────────────── */
function WhyItWorksStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#F7F0E2' }}>
      <button style={skipLink} onClick={onSkip}>건너뛰기</button>
      <div style={{ flex: 1, overflow: 'hidden', padding: '34px 22px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.28, margin: '0 0 9px', color: INK }}>
            보고, 말하면,<br />더 오래 기억됩니다
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: INK2, margin: 0 }}>인지심리학 연구·이론을 바탕으로 설계했어요.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {EVIDENCE.map((e) => {
            const Icon = e.icon
            return (
              <div key={e.title} style={{
                background: '#fff', border: '1px solid #EDE3D0', borderRadius: 16, padding: '15px 16px',
                display: 'flex', alignItems: 'center', gap: 13, boxShadow: '0 4px 14px rgba(65,36,2,0.05)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: e.chipBg, color: e.chipColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 15.5, fontWeight: 800, margin: '0 0 3px', color: INK }}>{e.title}</h3>
                  <p style={{ fontSize: 12, lineHeight: 1.42, color: INK2, margin: 0 }}>{e.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ padding: '12px 24px 34px' }}>
        <button style={btnPrimary} onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

/* ── Step 4: HOW IT WORKS + CTA (merged, final) ─────────────────── */
function HowAndCtaStep({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: CREAM }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '34px 24px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', margin: 0, color: INK }}>하루 30초면 충분해요</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 24 }}>
          {HOW_STEPS.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.num} style={{
                background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, padding: 19,
                display: 'flex', alignItems: 'center', gap: 15, boxShadow: '0 4px 16px rgba(65,36,2,0.04)',
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 15, flexShrink: 0,
                  background: 'linear-gradient(135deg,#FBE6BE,#F4C876)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8600A',
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#DDB05F' }}>{s.num}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: INK }}>{s.title}</h3>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: INK2, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{
          borderRadius: 22, padding: '30px 22px', textAlign: 'center',
          background: `radial-gradient(ellipse 90% 120% at 50% 0%, ${CREAM_SOFT}, ${CREAM})`,
          border: `1px solid ${LINE}`,
        }}>
          <h2 style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-0.4px', lineHeight: 1.34, margin: 0, color: INK }}>
            오늘의 성공의 말,<br />지금 말해보세요
          </h2>
        </div>
      </div>
      <div style={{ padding: '12px 24px 34px' }}>
        <button style={btnPrimary} onClick={onStart}>이뤄 시작하기</button>
      </div>
    </div>
  )
}
