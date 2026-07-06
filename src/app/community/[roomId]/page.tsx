'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AppLayout } from '@/components/ui/AppLayout'
import { ChevronLeft, Trophy, BookmarkPlus, Share2, X, Check, LogOut, Heart, ThumbsUp, Flame, Dumbbell, Sparkles, Star, HeartHandshake, PartyPopper, CheckCircle2, Zap, Leaf, Rainbow, MessageCircle, Trash2, Info, type LucideIcon } from 'lucide-react'
import { getAffirmations, saveAffirmation, type Affirmation } from '@/lib/storage'
import { isDevModeEnabled } from '@/lib/devMode'

type RoomTab = '성공의 말 나누기' | '함께 도전'

const MOCK_ROOM_INFO: Record<string, { name: string }> = {
  r1: { name: '아침 확언 클럽' },
  r2: { name: '취업 성공 방' },
  r3: { name: '자존감 키우기' },
  r4: { name: '다이어트 확언단' },
}

type EmojiKey = '😍' | '👏' | '🔥' | '💪' | '✨' | '🌟' | '💛' | '🙌' | '💯' | '💫' | '🌿' | '🌈'
type Reactions = Record<EmojiKey, number>

interface FeedItem {
  id: string
  nickname: string
  initial: string
  emailId: string
  profileImage?: string | null
  content: string
  daysCount: number
  reactions: Reactions
  createdAtMs: number
  isMe?: boolean
}

interface Participant {
  nickname: string
  initial: string
  daysCount: number
  reactions: Reactions
}

interface Challenge {
  content: string
  participants: Participant[]
}

type JoinedEntry = { content: string; participant: Participant }

type FeedSort = '외침 많음' | '외침 적음' | '칭찬 많음' | '칭찬 적음' | '이름' | '날짜(최신)'
const FEED_SORTS: FeedSort[] = ['외침 많음', '외침 적음', '칭찬 많음', '칭찬 적음', '이름', '날짜(최신)']

interface UserProfile {
  nickname: string
  profileImage: string | null
  googleEmail?: string
}

const ZERO_REACTIONS: Reactions = { '😍': 0, '👏': 0, '🔥': 0, '💪': 0, '✨': 0, '🌟': 0, '💛': 0, '🙌': 0, '💯': 0, '💫': 0, '🌿': 0, '🌈': 0 }

const MOCK_FEED: FeedItem[] = [
  { id: 'f1', nickname: '햇살이', initial: '햇', emailId: 'sunshine_haet', content: '나는 오늘도 최선을 다하고 있다', daysCount: 23, reactions: { ...ZERO_REACTIONS, '😍': 4, '👏': 2, '🔥': 1, '🙌': 3 }, createdAtMs: Date.now() - 2 * 60 * 60 * 1000 },
  { id: 'f2', nickname: '별빛나', initial: '별', emailId: 'starlight_byeol', content: '나는 매일 성장하고 있다', daysCount: 11, reactions: { ...ZERO_REACTIONS, '😍': 1, '👏': 3, '💛': 2, '✨': 1 }, createdAtMs: Date.now() - 5 * 60 * 60 * 1000 },
  { id: 'f3', nickname: '파란봄', initial: '파', emailId: 'blue_spring_pa', content: '나는 나를 믿는다', daysCount: 8, reactions: { ...ZERO_REACTIONS, '💪': 1, '🌈': 2 }, createdAtMs: Date.now() - 26 * 60 * 60 * 1000 },
]

const MOCK_CHALLENGE: Challenge[] = [
  {
    content: '나는 매일 성장하고 있다',
    participants: [
      { nickname: '별빛나', initial: '별', daysCount: 11, reactions: { ...ZERO_REACTIONS, '😍': 1, '👏': 3, '💪': 2 } },
      { nickname: '하늘맑음', initial: '하', daysCount: 9, reactions: { ...ZERO_REACTIONS, '🔥': 1, '✨': 2 } },
    ],
  },
  {
    content: '나는 오늘도 최선을 다하고 있다',
    participants: [
      { nickname: '햇살이', initial: '햇', daysCount: 23, reactions: { ...ZERO_REACTIONS, '😍': 4, '👏': 2, '🔥': 1, '🙌': 3 } },
    ],
  },
  {
    content: '나는 나를 믿는다',
    participants: [
      { nickname: '파란봄', initial: '파', daysCount: 8, reactions: { ...ZERO_REACTIONS, '💪': 1, '🌈': 2 } },
    ],
  },
]

const EMOJIS: Array<{ emoji: EmojiKey; label: string }> = [
  { emoji: '😍', label: '멋져요' },
  { emoji: '👏', label: '잘했어요' },
  { emoji: '🔥', label: '대단해요' },
  { emoji: '💪', label: '할 수 있어요' },
  { emoji: '✨', label: '빛나요' },
  { emoji: '🌟', label: '최고예요' },
  { emoji: '💛', label: '응원해요' },
  { emoji: '🙌', label: '화이팅' },
  { emoji: '💯', label: '완벽해요' },
  { emoji: '💫', label: '반짝여요' },
  { emoji: '🌿', label: '성장해요' },
  { emoji: '🌈', label: '희망이에요' },
]

const REACTION_ICONS: Record<EmojiKey, { Icon: LucideIcon; color: string }> = {
  '😍': { Icon: Heart,          color: '#E53935' },
  '👏': { Icon: ThumbsUp,       color: '#1E88E5' },
  '🔥': { Icon: Flame,          color: '#FF6F00' },
  '💪': { Icon: Dumbbell,       color: '#7B1FA2' },
  '✨': { Icon: Sparkles,       color: '#F9A825' },
  '🌟': { Icon: Star,           color: '#FDD835' },
  '💛': { Icon: HeartHandshake, color: '#FFB300' },
  '🙌': { Icon: PartyPopper,    color: '#00897B' },
  '💯': { Icon: CheckCircle2,   color: '#43A047' },
  '💫': { Icon: Zap,            color: '#FB8C00' },
  '🌿': { Icon: Leaf,           color: '#2E7D32' },
  '🌈': { Icon: Rainbow,        color: '#039BE5' },
}

function ReactionIcon({ emoji, size = 14, active = false }: { emoji: EmojiKey; size?: number; active?: boolean }) {
  const { Icon, color } = REACTION_ICONS[emoji]
  return <Icon size={size} color={active ? 'white' : color} />
}

function totalReactions(r: Reactions) {
  return Object.values(r).reduce((s, v) => s + v, 0)
}

function totalDays(challenge: Challenge) {
  return challenge.participants.reduce((s, p) => s + p.daysCount, 0)
}

// 이메일 전체 대신 @ 앞 아이디만 표시
function emailId(email: string): string {
  return email.split('@')[0] || email
}


function Avatar({ nickname, initial, profileImage, size = 36, isMe = false }: {
  nickname: string; initial: string; profileImage?: string | null; size?: number; isMe?: boolean
}) {
  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={nickname}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: isMe ? '2px solid var(--color-community-accent)' : 'none' }}
      />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: isMe ? 'var(--color-community-accent)' : 'var(--color-community-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700,
      color: isMe ? 'white' : 'var(--color-community-text)',
      flexShrink: 0,
    }}>
      {initial}
    </div>
  )
}

export default function RoomPage() {
  const router = useRouter()
  const params = useParams()
  const roomId = params.roomId as string
  const room = MOCK_ROOM_INFO[roomId] ?? { name: '방' }

  const [activeTab, setActiveTab] = useState<RoomTab>('성공의 말 나누기')
  const [feed, setFeed] = useState<FeedItem[]>(() => {
    try {
      const saved = localStorage.getItem(`ealo-room-feed-${roomId}`)
      const myItems: FeedItem[] = saved ? (JSON.parse(saved) as FeedItem[]) : []
      const myIds = new Set(myItems.map(i => i.id))
      return [...myItems, ...MOCK_FEED.filter(i => !myIds.has(i.id))]
    } catch { return MOCK_FEED }
  })
  const [feedSortBy, setFeedSortBy] = useState<FeedSort>('외침 많음')
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = localStorage.getItem(`ealo-room-joined-${roomId}`)
      const joined: JoinedEntry[] = saved ? (JSON.parse(saved) as JoinedEntry[]) : []
      let next = MOCK_CHALLENGE.map(c => ({ ...c, participants: [...c.participants] }))
      joined.forEach(({ content, participant }) => {
        const idx = next.findIndex(c => c.content === content)
        if (idx === -1) next = [...next, { content, participants: [participant] }]
        else if (!next[idx].participants.some(p => p.nickname === participant.nickname)) {
          next = next.map((c, i) => i === idx ? { ...c, participants: [...c.participants, participant] } : c)
        }
      })
      return next
    } catch { return MOCK_CHALLENGE }
  })
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`ealo-room-joined-${roomId}`)
      const joined: JoinedEntry[] = saved ? (JSON.parse(saved) as JoinedEntry[]) : []
      return new Set(joined.map(j => j.content))
    } catch { return new Set() }
  })
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null)

  // 사용자 프로필 — 로그인 여부(구글 아이디 존재) 판단이 첫 렌더부터 필요해 지연 초기화 사용
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ealo-user-profile')
      if (saved) return JSON.parse(saved) as UserProfile
    } catch {}
    return { nickname: '', profileImage: null }
  })
  const isLoggedIn = !!userProfile.googleEmail || isDevModeEnabled()

  // 공유하기
  const [showShareSheet, setShowShareSheet] = useState(false)
  const [myPhrases, setMyPhrases] = useState<Affirmation[]>([])
  const [sharedIds, setSharedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`ealo-room-shared-${roomId}`)
      return saved ? (JSON.parse(saved) as string[]) : []
    } catch { return [] }
  })

  // 가져오기
  const [importedContents, setImportedContents] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState('')

  // 내 칭찬 선택 상태 (토글)
  const [myFeedReactions, setMyFeedReactions] = useState<Record<string, Set<EmojiKey>>>({})
  const [myChallengeReactions, setMyChallengeReactions] = useState<Record<string, Set<EmojiKey>>>({})

  // 방 나가기 확인 모달
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  // 이 방의 참여 여부
  const [isMember, setIsMember] = useState(false)

  // 로그인 안 됐으면 목록 화면(로그인 게이트)으로
  useEffect(() => {
    if (!isLoggedIn) router.replace('/community')
  }, [isLoggedIn, router])

  // 참여 여부 확인
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ealo-my-rooms')
      if (saved) setIsMember((JSON.parse(saved) as string[]).includes(roomId))
    } catch {}
  }, [roomId])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2000)
      return () => clearTimeout(t)
    }
  }, [toast])

  const showToast = (msg: string) => setToast(msg)

  // 방 나가기
  const handleLeaveRoom = () => {
    try {
      const saved = localStorage.getItem('ealo-my-rooms')
      if (saved) {
        const rooms = JSON.parse(saved) as string[]
        localStorage.setItem('ealo-my-rooms', JSON.stringify(rooms.filter(r => r !== roomId)))
      }
      localStorage.removeItem(`ealo-room-feed-${roomId}`)
      localStorage.removeItem(`ealo-room-shared-${roomId}`)
    } catch {}
    router.back()
  }

  const handleOpenShare = () => {
    setMyPhrases(getAffirmations())
    setShowShareSheet(true)
  }

  const handleSharePhrase = (aff: Affirmation) => {
    if (sharedIds.length >= 3 || sharedIds.includes(aff.id)) return
    const displayName = userProfile.nickname || '나'
    const newItem: FeedItem = {
      id: `my-${aff.id}`,
      nickname: displayName,
      initial: displayName[0],
      emailId: userProfile.googleEmail ? emailId(userProfile.googleEmail) : '',
      profileImage: userProfile.profileImage,
      content: aff.text,
      daysCount: aff.completedDates.length,
      reactions: { ...ZERO_REACTIONS },
      createdAtMs: Date.now(),
      isMe: true,
    }
    setFeed(prev => {
      const next = [newItem, ...prev]
      try { localStorage.setItem(`ealo-room-feed-${roomId}`, JSON.stringify(next.filter(i => i.isMe))) } catch {}
      return next
    })
    setSharedIds(prev => {
      const next = [...prev, aff.id]
      try { localStorage.setItem(`ealo-room-shared-${roomId}`, JSON.stringify(next)) } catch {}
      return next
    })
    setShowShareSheet(false)
    showToast('성공의 말을 방에 공유했어요')
  }

  const handleImport = (content: string) => {
    const existing = getAffirmations()
    if (existing.some(a => a.text === content)) {
      showToast('이미 내 성공의 말에 있어요')
      return
    }
    const now = new Date().toISOString()
    saveAffirmation({ id: `imported-${Date.now()}`, text: content, category: '나 자신', createdAt: now, completedDates: [] })
    setImportedContents(prev => new Set(prev).add(content))
    showToast('내 성공의 말에 추가됐어요')
  }

  const handleJoinChallenge = (content: string) => {
    if (joinedChallenges.has(content)) return
    const displayName = userProfile.nickname || '나'
    const matchingAff = getAffirmations().find(a => a.text === content)
    const participant: Participant = {
      nickname: displayName,
      initial: displayName[0],
      daysCount: matchingAff ? matchingAff.completedDates.length : 0,
      reactions: { ...ZERO_REACTIONS },
    }

    setChallenges(prev => {
      const idx = prev.findIndex(c => c.content === content)
      if (idx === -1) return [...prev, { content, participants: [participant] }]
      return prev.map((c, i) => i === idx ? { ...c, participants: [...c.participants, participant] } : c)
    })

    setJoinedChallenges(prev => {
      const next = new Set(prev)
      next.add(content)
      try {
        const saved = localStorage.getItem(`ealo-room-joined-${roomId}`)
        const joined: JoinedEntry[] = saved ? (JSON.parse(saved) as JoinedEntry[]) : []
        joined.push({ content, participant })
        localStorage.setItem(`ealo-room-joined-${roomId}`, JSON.stringify(joined))
      } catch {}
      return next
    })

    showToast('함께 도전에 참여했어요')
  }

  const handleFeedReaction = (feedId: string, emoji: EmojiKey) => {
    const selected = myFeedReactions[feedId] ?? new Set<EmojiKey>()
    const isOn = selected.has(emoji)
    const next = new Set(selected)
    if (isOn) { next.delete(emoji) } else { next.add(emoji) }
    setMyFeedReactions(r => ({ ...r, [feedId]: next }))
    setFeed(prev => prev.map(item =>
      item.id === feedId
        ? { ...item, reactions: { ...item.reactions, [emoji]: Math.max(0, item.reactions[emoji] + (isOn ? -1 : 1)) } }
        : item
    ))
  }

  const handleChallengeReaction = (challengeContent: string, participantNickname: string, emoji: EmojiKey) => {
    const key = `${challengeContent}::${participantNickname}`
    const selected = myChallengeReactions[key] ?? new Set<EmojiKey>()
    const isOn = selected.has(emoji)
    const next = new Set(selected)
    if (isOn) { next.delete(emoji) } else { next.add(emoji) }
    setMyChallengeReactions(r => ({ ...r, [key]: next }))
    setChallenges(prevChallenges => prevChallenges.map(c =>
      c.content === challengeContent
        ? { ...c, participants: c.participants.map(p =>
            p.nickname === participantNickname
              ? { ...p, reactions: { ...p.reactions, [emoji]: Math.max(0, p.reactions[emoji] + (isOn ? -1 : 1)) } }
              : p
          )}
        : c
    ))
  }

  const sortedChallenges = [...challenges].sort((a, b) => totalDays(b) - totalDays(a))

  const sortedFeed = [...feed].sort((a, b) => {
    switch (feedSortBy) {
      case '외침 많음': return b.daysCount - a.daysCount
      case '외침 적음': return a.daysCount - b.daysCount
      case '칭찬 많음': return totalReactions(b.reactions) - totalReactions(a.reactions)
      case '칭찬 적음': return totalReactions(a.reactions) - totalReactions(b.reactions)
      case '이름': return a.nickname.localeCompare(b.nickname, 'ko')
      case '날짜(최신)': return b.createdAtMs - a.createdAtMs
    }
  })

  const tabStyle = (tab: RoomTab) => ({
    flex: 1,
    padding: '9px 0',
    background: activeTab === tab ? 'var(--color-bg-card)' : 'transparent',
    border: 'none',
    borderRadius: '11px',
    color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
    fontSize: '13.5px',
    fontWeight: activeTab === tab ? 700 : 500,
    boxShadow: activeTab === tab ? '0 2px 6px rgba(65,36,2,0.1)' : 'none',
    cursor: 'pointer',
  })

  if (!isLoggedIn) return null

  return (
    <AppLayout activeTab="함께">
      <div style={{ paddingBottom: '32px' }}>
        {/* 헤더 */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(255,252,248,0.92)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 16px 12px' }}>
            <button
              onClick={() => router.back()}
              style={{
                width: '36px', height: '36px', borderRadius: '11px',
                border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0, flexShrink: 0,
              }}
            >
              <ChevronLeft size={20} color="var(--color-text-primary)" />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              {isMember && (
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: 'var(--color-community-text)',
                  background: 'var(--color-community-bg)', padding: '2px 8px', borderRadius: '999px',
                }}>
                  내 방
                </span>
              )}
              <h1 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--color-text-primary)', margin: '3px 0 0', letterSpacing: '-0.4px' }}>
                {room.name}
              </h1>
            </div>

            {/* 닉네임 + 구글아이디 + 프로필 아바타 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {(userProfile.nickname || userProfile.googleEmail) && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.25 }}>
                  {userProfile.nickname && (
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {userProfile.nickname}
                    </span>
                  )}
                  {userProfile.googleEmail && (
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                      {emailId(userProfile.googleEmail)}
                    </span>
                  )}
                </div>
              )}
              {userProfile.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt="내 프로필"
                  style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-community-accent)', flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-community-accent-mid), var(--color-community-accent))',
                  border: '2px solid var(--color-community-accent-mid)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '15px', fontWeight: 700, flexShrink: 0,
                }}>
                  {userProfile.nickname ? userProfile.nickname[0] : '?'}
                </div>
              )}
            </div>
          </div>

          {/* 세그먼트 탭 */}
          <div style={{ margin: '0 16px 14px', display: 'flex', gap: '4px', background: '#F1E7D6', borderRadius: '14px', padding: '4px' }}>
            {(['성공의 말 나누기', '함께 도전'] as RoomTab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {/* 성공의 말 나누기 피드 */}
          {activeTab === '성공의 말 나누기' && (
            <div>
              {/* 공유하기 버튼 */}
              <button
                onClick={handleOpenShare}
                disabled={!isMember || sharedIds.length >= 3 || !userProfile.nickname}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: !isMember || sharedIds.length >= 3 || !userProfile.nickname ? 'var(--color-border)' : 'var(--color-community-accent)',
                  color: !isMember || sharedIds.length >= 3 || !userProfile.nickname ? 'var(--color-text-muted)' : 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: !isMember || sharedIds.length >= 3 || !userProfile.nickname ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  marginBottom: '14px',
                }}
              >
                <Share2 size={15} />
                {!isMember ? '방에 참여하면 공유할 수 있어요' : sharedIds.length >= 3 ? '최대 3개까지 공유할 수 있어요' : '나의 성공의 말 공유하기'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)', minWidth: 0 }}>
                  <Info size={13} style={{ flexShrink: 0 }} />
                  <span>자유 댓글 없이 정해진 응원만 보낼 수 있어요</span>
                </div>
                <select
                  value={feedSortBy}
                  onChange={e => setFeedSortBy(e.target.value as FeedSort)}
                  style={{
                    flexShrink: 0,
                    padding: '5px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {FEED_SORTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '14px' }}>
                {sortedFeed.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--color-bg-card)',
                      borderRadius: '20px',
                      padding: '17px',
                      border: item.isMe ? '1.5px solid var(--color-community-accent)' : '1px solid var(--color-border)',
                      boxShadow: '0 4px 16px rgba(65,36,2,0.05)',
                    }}
                  >
                    {/* 작성자 */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', flexWrap: 'wrap', rowGap: '8px' }}>
                      <Avatar
                        nickname={item.nickname}
                        initial={item.initial}
                        profileImage={item.profileImage}
                        size={36}
                        isMe={item.isMe}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {item.nickname}{item.isMe && ' (나)'}
                          </span>
                          <span style={{
                            fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
                            color: 'var(--color-community-text)', background: 'var(--color-community-bg)', padding: '2px 9px', borderRadius: '999px',
                          }}>
                            {item.daysCount}일 외침
                          </span>
                        </div>
                        {item.emailId && (
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{item.emailId}</div>
                        )}
                      </div>
                      {!item.isMe && (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <button
                            onClick={() => handleImport(item.content)}
                            disabled={importedContents.has(item.content)}
                            style={{
                              flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px',
                              padding: '6px 10px', borderRadius: '10px',
                              background: importedContents.has(item.content) ? 'var(--color-success-bg-mint)' : 'var(--color-bg-card)',
                              border: importedContents.has(item.content) ? '1px solid #6EE7B7' : '1px solid var(--color-border)',
                              color: importedContents.has(item.content) ? 'var(--color-success-mid)' : 'var(--color-text-muted)',
                              fontSize: '12px', fontWeight: 500,
                              cursor: importedContents.has(item.content) ? 'default' : 'pointer',
                            }}
                          >
                            {importedContents.has(item.content) ? <Check size={13} /> : <BookmarkPlus size={13} />}
                            {importedContents.has(item.content) ? '가져옴' : '가져오기'}
                          </button>
                          <button
                            onClick={() => handleJoinChallenge(item.content)}
                            disabled={joinedChallenges.has(item.content)}
                            style={{
                              flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px',
                              padding: '6px 10px', borderRadius: '10px',
                              background: joinedChallenges.has(item.content) ? 'var(--color-community-accent)' : 'var(--color-community-bg)',
                              border: `1px solid ${joinedChallenges.has(item.content) ? 'var(--color-community-accent-dark)' : 'var(--color-community-accent-mid)'}`,
                              color: joinedChallenges.has(item.content) ? 'white' : 'var(--color-community-text)',
                              fontSize: '12px', fontWeight: 500,
                              cursor: joinedChallenges.has(item.content) ? 'default' : 'pointer',
                            }}
                          >
                            {joinedChallenges.has(item.content) ? <Check size={13} /> : <Trophy size={13} />}
                            {joinedChallenges.has(item.content) ? '참여 중' : '함께 도전'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 성공의 말 문구 */}
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.55,
                      marginBottom: '14px',
                      padding: '14px 16px',
                      background: 'var(--color-community-bg-deep)',
                      borderRadius: '12px',
                    }}>
                      {item.content}
                    </p>

                    {/* 칭찬 집계 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                      {EMOJIS.filter(e => item.reactions[e.emoji] > 0).map(e => (
                        <span key={e.emoji} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <ReactionIcon emoji={e.emoji} size={14} />{item.reactions[e.emoji]}
                        </span>
                      ))}
                      {totalReactions(item.reactions) === 0 && '아직 응원이 없어요'}
                    </div>

                    {/* 칭찬 버튼 한 줄 */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                      {EMOJIS.map(e => {
                        const isOn = (myFeedReactions[item.id] ?? new Set()).has(e.emoji)
                        return (
                          <button
                            key={e.emoji}
                            onClick={() => handleFeedReaction(item.id, e.emoji)}
                            style={{
                              flexShrink: 0,
                              padding: '6px 10px',
                              background: isOn ? 'var(--color-community-accent)' : 'var(--color-community-bg)',
                              border: `1px solid ${isOn ? 'var(--color-community-accent-dark)' : 'var(--color-community-accent-mid)'}`,
                              borderRadius: '999px',
                              fontSize: '12px',
                              color: isOn ? 'white' : 'var(--color-community-text)',
                              cursor: 'pointer',
                              fontWeight: isOn ? 700 : 500,
                              whiteSpace: 'nowrap',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <ReactionIcon emoji={e.emoji} size={15} active={isOn} /> {e.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* 방 지우기 */}
              <button
                onClick={() => setShowLeaveConfirm(true)}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: 'none',
                  border: '1px solid #F3C9C4',
                  borderRadius: '13px',
                  fontSize: '14px',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  marginTop: '8px',
                  fontWeight: 600,
                }}
              >
                <LogOut size={15} />
                방 지우기
              </button>
            </div>
          )}

          {/* 함께 도전 챌린지 */}
          {activeTab === '함께 도전' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sortedChallenges.map((challenge, idx) => {
                  const isFirst = idx === 0
                  const days = totalDays(challenge)
                  const isExpanded = expandedChallenge === challenge.content

                  const sortedParticipants = [...challenge.participants].sort(
                    (a, b) => totalReactions(a.reactions) - totalReactions(b.reactions)
                  )

                  return (
                    <div key={challenge.content}>
                      <button
                        onClick={() => setExpandedChallenge(isExpanded ? null : challenge.content)}
                        style={{
                          width: '100%',
                          background: 'var(--color-bg-card)',
                          borderRadius: isExpanded ? '18px 18px 0 0' : '18px',
                          padding: '17px',
                          border: isFirst ? '2px solid var(--color-community-accent)' : '1px solid var(--color-border)',
                          boxShadow: '0 4px 16px rgba(65,36,2,0.05)',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        {isFirst && (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '11px',
                            background: 'linear-gradient(135deg,#FBE6BE,#F4C876)', padding: '4px 11px', borderRadius: '999px',
                          }}>
                            <Trophy size={13} color="#8A5A0C" />
                            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#8A5A0C' }}>1위</span>
                          </div>
                        )}
                        <p style={{
                          fontSize: '15.5px',
                          color: 'var(--color-text-primary)',
                          fontWeight: 700,
                          marginBottom: '12px',
                          lineHeight: 1.5,
                        }}>
                          {challenge.content}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            참여 {challenge.participants.length}명
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--color-community-text)', fontWeight: 700 }}>
                            총 {days}일 외침
                          </span>
                          <span style={{
                            marginLeft: 'auto', fontSize: '16px', color: '#C9B99A',
                            transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s',
                          }}>
                            ⌄
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div style={{
                          background: 'var(--color-bg-card)',
                          borderRadius: '0 0 18px 18px',
                          padding: '12px 16px 16px',
                          border: '1px solid var(--color-border)',
                          borderTop: 'none',
                        }}>
                          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '12px', textAlign: 'center' }}>
                            칭찬이 적은 순서로 보여요
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {sortedParticipants.map(participant => (
                              <div key={participant.nickname}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                  <div style={{
                                    width: '34px', height: '34px', borderRadius: '50%',
                                    background: 'var(--color-community-bg)', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--color-community-text)',
                                  }}>
                                    {participant.initial}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                      {participant.nickname}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--color-community-text)' }}>
                                      {participant.daysCount}일째
                                    </div>
                                  </div>
                                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    {totalReactions(participant.reactions) === 0
                                      ? <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>아직 칭찬이 없어요</span>
                                      : EMOJIS.filter(e => participant.reactions[e.emoji] > 0).map(e => (
                                          <span key={e.emoji} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                            <ReactionIcon emoji={e.emoji} size={13} />{participant.reactions[e.emoji]}
                                          </span>
                                        ))
                                    }
                                  </div>
                                </div>
                                {/* 챌린지 칭찬 버튼 한 줄 */}
                                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingLeft: '44px', scrollbarWidth: 'none' }}>
                                  {EMOJIS.map(e => {
                                    const cKey = `${challenge.content}::${participant.nickname}`
                                    const isOn = (myChallengeReactions[cKey] ?? new Set()).has(e.emoji)
                                    return (
                                      <button
                                        key={e.emoji}
                                        onClick={() => handleChallengeReaction(challenge.content, participant.nickname, e.emoji)}
                                        style={{
                                          flexShrink: 0,
                                          padding: '5px 10px',
                                          background: isOn ? 'var(--color-community-accent)' : 'var(--color-community-bg)',
                                          border: `1px solid ${isOn ? 'var(--color-community-accent-dark)' : 'var(--color-community-accent-mid)'}`,
                                          borderRadius: '999px',
                                          fontSize: '11px',
                                          color: isOn ? 'white' : 'var(--color-community-text)',
                                          cursor: 'pointer',
                                          fontWeight: isOn ? 700 : 500,
                                          whiteSpace: 'nowrap',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '5px',
                                        }}
                                      >
                                        <ReactionIcon emoji={e.emoji} size={14} active={isOn} /> {e.label}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 공유하기 바텀시트 ── */}
      {showShareSheet && (
        <>
          <div onClick={() => setShowShareSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', zIndex: 50,
            background: 'var(--color-bg-primary)',
            borderRadius: '24px 24px 0 0',
            padding: '20px 16px 40px',
            maxHeight: '70vh',
            overflowY: 'auto',
          }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--color-border)', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                나의 성공의 말 공유하기
              </h3>
              <button onClick={() => setShowShareSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                <X size={20} color="var(--color-text-muted)" />
              </button>
            </div>

            {sharedIds.length >= 3 && (
              <p style={{ fontSize: '13px', color: 'var(--color-community-text)', background: 'var(--color-community-bg)', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px' }}>
                방당 최대 3개까지 공유할 수 있어요
              </p>
            )}

            {myPhrases.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <MessageCircle size={40} color="var(--color-text-muted)" style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  아직 저장한 성공의 말이 없어요
                </p>
                <button
                  onClick={() => { setShowShareSheet(false); router.push('/create') }}
                  style={{ padding: '10px 24px', background: 'var(--color-community-accent)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                >
                  성공의 말 만들러 가기
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myPhrases.map(aff => {
                  const alreadyShared = sharedIds.includes(aff.id)
                  return (
                    <button
                      key={aff.id}
                      onClick={() => handleSharePhrase(aff)}
                      disabled={alreadyShared || sharedIds.length >= 3}
                      style={{
                        padding: '16px',
                        background: alreadyShared ? '#F0FDF4' : 'var(--color-bg-card)',
                        border: alreadyShared ? '1px solid #6EE7B7' : '1px solid var(--color-border)',
                        borderRadius: '16px',
                        textAlign: 'left',
                        cursor: alreadyShared || sharedIds.length >= 3 ? 'default' : 'pointer',
                        opacity: !alreadyShared && sharedIds.length >= 3 ? 0.5 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontSize: '14px',
                          color: 'var(--color-text-primary)',
                          marginBottom: '4px',
                          lineHeight: 1.5,
                        }}>
                          {aff.text}
                        </p>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {aff.category} · {aff.completedDates.length}일 외침
                        </span>
                      </div>
                      {alreadyShared
                        ? <Check size={16} color="var(--color-success-mid)" style={{ flexShrink: 0 }} />
                        : <span style={{ fontSize: '12px', color: 'var(--color-community-accent)', fontWeight: 600, flexShrink: 0 }}>공유</span>
                      }
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── 방 지우기 확인 모달 ── */}
      {showLeaveConfirm && (
        <>
          <div onClick={() => setShowLeaveConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', zIndex: 50,
            background: 'var(--color-bg-primary)',
            borderRadius: '24px 24px 0 0',
            padding: '28px 16px 30px',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', background: '#FBEAE8',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
              }}>
                <Trash2 size={26} color="var(--color-danger)" />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                방을 지울까요?
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                지우면 이 방의 성공의 말 공유가 취소되고<br />내 방 목록에서도 사라져요.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                style={{
                  flex: 1, padding: '14px',
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  fontSize: '15px', fontWeight: 600,
                  color: 'var(--color-text-muted)', cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                onClick={handleLeaveRoom}
                style={{
                  flex: 1, padding: '14px',
                  background: 'var(--color-danger)',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '15px', fontWeight: 700,
                  color: 'white', cursor: 'pointer',
                }}
              >
                지우기
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--color-text-primary)', color: 'white',
          padding: '11px 20px', borderRadius: '999px',
          fontSize: '13px', fontWeight: 600,
          zIndex: 100, whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {toast}
        </div>
      )}

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </AppLayout>
  )
}
