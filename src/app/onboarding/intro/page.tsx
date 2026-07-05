'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mic, Camera, CalendarCheck } from 'lucide-react'

/* ── Design tokens (ported from ealo-landing mobile.html) ──────── */
const GOLD = '#BA7517'
const GOLD_LIGHT = '#D98A1C'
const INK = '#2A1801'
const INK2 = '#7A6A55'
const CREAM = '#FFFCF8'
const CREAM_SOFT = '#FBF0DA'
const LINE = '#F0E7D6'

const btnBase: React.CSSProperties = {
  width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  fontSize: 16, fontWeight: 700, borderRadius: 15, padding: '16px 20px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
}
const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
  color: '#fff',
  boxShadow: '0 10px 26px rgba(186,117,23,0.34)',
}

const skipLink: React.CSSProperties = {
  position: 'absolute', top: 18, right: 20, zIndex: 5,
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
  { tag: 'PRODUCTION EFFECT', title: '소리 내어 말하기', desc: '소리 내어 말하면 눈으로 읽을 때보다 더 오래 기억에 남아요.', source: '참고: MacLeod et al. (2010) — 산출 효과', chipBg: '#FBF0DA', chipColor: '#BA7517' },
  { tag: 'DUAL CODING THEORY', title: '보면서 말하기', desc: '보면서 말하면 기억이 더 잘 형성될 수 있어요.', source: '참고: 이중부호화 이론 (Paivio)', chipBg: '#EAF2FB', chipColor: '#1E88E5' },
  { tag: 'SELF-AFFIRMATION', title: '나의 가치를 떠올리기', desc: '나의 가치를 자주 떠올리면 마음이 더 안정돼요.', source: '참고: 자기확언 이론', chipBg: '#EEF4E6', chipColor: '#5E8A2E' },
  { tag: 'SELF-REFERENCE EFFECT', title: '내 얼굴을 마주하기', desc: '내 얼굴과 관련된 정보는 더 빠르고 강하게 기억돼요.', source: '참고: 자기참조 효과', chipBg: '#F3ECFB', chipColor: '#7A5AD9' },
]

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
      {step === 0 && <HeroStep onNext={() => setStep(1)} onSkip={skipToOnboarding} />}
      {step === 1 && <MidlifeStep onNext={() => setStep(2)} onSkip={skipToOnboarding} />}
      {step === 2 && <DemoStep onNext={() => setStep(3)} />}
      {step === 3 && <WhyItWorksStep onNext={() => setStep(4)} onSkip={skipToOnboarding} />}
      {step === 4 && <HowAndCtaStep onStart={skipToOnboarding} onSkip={skipToOnboarding} />}
    </div>
  )
}

/* ── Reusable: static mockup screenshot, shown at its real width/ratio (no crop) ── */
function MockupImage({ person }: { person: keyof typeof MOCKUP }) {
  const m = MOCKUP[person]
  return (
    <Image
      src={m.src}
      alt=""
      width={m.w}
      height={m.h}
      sizes="100vw"
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 32, boxShadow: '0 24px 56px -20px rgba(65,36,2,0.5)' }}
    />
  )
}

/* ── Step 0: Hero + 두 목업 이미지(남/여) — 스크롤 없이 한 화면에 ─── */
function HeroStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <button style={skipLink} onClick={onSkip}>건너뛰기</button>

      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px 0' }}>
        <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, overflow: 'hidden' }}>
          <Image src="/splash-icon.png" alt="이뤄" width={36} height={36} style={{ borderRadius: 10 }} />
        </div>
      </div>

      <div style={{ padding: '10px 20px 12px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, background: CREAM_SOFT,
          padding: '5px 11px', borderRadius: 999, marginBottom: 10,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>성공의 말 습관 만들기</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.24, letterSpacing: '-0.6px', margin: '0 0 8px', color: INK }}>
          흔들리는 시기,<br /><span style={{ color: GOLD }}>다시 나를 세우는</span><br />한 문장
        </h1>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, color: INK2, margin: 0 }}>
          AI가 모든 것을 바꾸는 시대, 미래가 불안한 요즘.<br />나를 마주 보고 오늘의 성공의 말을 소리 내어 말해요.
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px' }}>
        <div style={{ flex: 1, minWidth: 0 }}><MockupImage person="woman" /></div>
        <div style={{ flex: 1, minWidth: 0 }}><MockupImage person="man" /></div>
      </div>

      <div style={{ padding: '10px 20px 24px' }}>
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
      background: 'linear-gradient(165deg,#2A1801,#160C03)', color: '#fff',
    }}>
      <button style={{ ...skipLink, color: 'rgba(255,255,255,0.65)' }} onClick={onSkip}>건너뛰기</button>
      <div style={{ flex: 1, overflowY: 'auto', padding: '64px 24px 24px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#E9C877', letterSpacing: 1, marginBottom: 12 }}>MIDLIFE, AGE OF AI</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', lineHeight: 1.3, margin: '0 0 14px' }}>
          요즘, 이런 마음이<br />스치나요?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.72)', margin: '0 0 22px' }}>
          AI가 일과 미래를 빠르게 바꾸는 시대.<br />열심히 달려온 나, 문득 마음이 흔들립니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {QUOTES.map((q, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,200,119,0.16)',
              borderRadius: 14, padding: '15px 17px', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: 'rgba(233,200,119,0.4)', lineHeight: 1, fontFamily: 'Georgia,serif' }}>&ldquo;</span>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.45 }}>{q}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#FFF4DC', fontWeight: 600, margin: '24px 0 0', textAlign: 'center' }}>
          그 소용돌이에서 다시 나를 추스르는 방법.<br /><span style={{ color: '#E9C877' }}>긍정의 언어, 오늘의 성공의 말</span>로.
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
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 20px 0' }}>
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '340 / 718',
        borderRadius: 40, padding: 10,
        background: 'linear-gradient(150deg,#2A1801,#1a0f04)',
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
                  background: w.on ? 'linear-gradient(135deg,#F0D28E,#E9C877)' : 'rgba(255,255,255,0.12)',
                  color: w.on ? INK : 'rgba(255,255,255,0.92)',
                  boxShadow: w.on ? '0 0 20px rgba(233,200,119,0.45)' : 'none',
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
                      width: 3, borderRadius: 2, background: '#E9C877', height: 5,
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
              <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 14 }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#E9C877,#BA7517)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(186,117,23,0.5)',
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
                boxShadow: '0 8px 20px rgba(186,117,23,0.4)',
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
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#FBF5EA' }}>
      <button style={skipLink} onClick={onSkip}>건너뛰기</button>
      <div style={{ flex: 1, overflowY: 'auto', padding: '64px 24px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#5E8A2E', letterSpacing: 1, marginBottom: 10 }}>WHY IT WORKS</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.3, margin: '0 0 10px', color: INK }}>
            보고, 말하면,<br />더 오래 기억됩니다
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: INK2, margin: 0 }}>
            기억과 자기참조에 관한 인지심리학 연구·이론을 바탕으로 설계되었습니다.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EVIDENCE.map((e) => (
            <div key={e.tag} style={{
              background: '#fff', border: '1px solid #EDE3D0', borderRadius: 18, padding: 18,
              boxShadow: '0 4px 16px rgba(65,36,2,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: e.chipBg, color: e.chipColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800,
                }}>
                  {e.title[0]}
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#A0937E', marginBottom: 2 }}>{e.tag}</div>
                  <h3 style={{ fontSize: 15.5, fontWeight: 800, margin: 0, color: INK }}>{e.title}</h3>
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: INK2, margin: '0 0 9px' }}>{e.desc}</p>
              <div style={{ fontSize: 11, color: '#A99B84', borderTop: '1px dashed #EBDDC5', paddingTop: 9 }}>{e.source}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 22px 40px' }}>
        <button style={btnPrimary} onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

/* ── Step 4: HOW IT WORKS + CTA (merged, final) ─────────────────── */
function HowAndCtaStep({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: CREAM }}>
      <button style={skipLink} onClick={onSkip}>건너뛰기</button>
      <div style={{ flex: 1, overflowY: 'auto', padding: '64px 24px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 10 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', margin: 0, color: INK }}>하루 30초면 충분해요</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {HOW_STEPS.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.num} style={{
                background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, padding: 18,
                display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 16px rgba(65,36,2,0.04)',
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg,#FBE6BE,#F4C876)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8600A',
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: '#E0B764' }}>{s.num}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: INK }}>{s.title}</h3>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: INK2, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{
          borderRadius: 24, padding: '32px 24px', textAlign: 'center',
          background: 'radial-gradient(ellipse 90% 120% at 50% 0%, #FBF0DA, #FFFCF8)',
          border: `1px solid ${LINE}`,
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.32, margin: '0 0 12px', color: INK }}>
            오늘의 성공의 말,<br />지금 말해보세요
          </h2>
          <p style={{ fontSize: 13.5, color: INK2, margin: 0, lineHeight: 1.55 }}>
            하루 30초, 목표를 더 자주 기억하도록 돕는 습관이에요.
          </p>
        </div>
      </div>
      <div style={{ padding: '12px 22px 40px' }}>
        <button style={btnPrimary} onClick={onStart}>이뤄 시작하기</button>
      </div>
    </div>
  )
}
