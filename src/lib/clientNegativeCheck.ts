import { check } from 'korcen'
import { KNU_NEGATIVE_WORDS } from './knuNegativeWords'

// korcen이 놓치는 주요 욕설 보완 목록
const EXTRA_PROFANITY = ['씨발', '존나', '미친놈', '미친년', '죽어', '개씨발', '꺼져버려', '썅']

// 부정어 → 긍정 대안 규칙 (API 없을 때 사용)
const NEGATIVE_TO_POSITIVE: [string, string][] = [
  ['못해', '할 수 있다'],
  ['못하', '잘하'],
  ['안 돼', '할 수 있다'],
  ['안돼', '할 수 있다'],
  ['없다', '있다'],
  ['없어', '있어'],
  ['없는', '있는'],
  ['불안하', '안정되어 있'],
  ['불안', '평온하'],
  ['걱정', '평온하'],
  ['두렵', '용감하'],
  ['힘들', '강하'],
  ['포기', '계속 나아가'],
  ['실패', '성공을 향해 나아가'],
  ['우울', '밝고 활기차'],
  ['절망', '희망이 있'],
  ['고통', '평화롭'],
  ['싫다', '좋다'],
  ['싫어', '좋아'],
  ['지쳐', '에너지가 넘쳐'],
  ['모르겠', '알아가고 있'],
  ['못하겠', '해낼 수 있'],
  ['그만', '계속'],
  ['화나', '평온하'],
  ['무섭', '용감하'],
  ['슬프', '행복하'],
  ['외롭', '사랑받고 있'],
  ['못', '잘'],
  ['않', '잘'],
]

function buildAlternative(text: string): string {
  for (const [neg, pos] of NEGATIVE_TO_POSITIVE) {
    if (text.includes(neg)) return text.replace(neg, pos)
  }
  return ''
}

export function clientNegativeCheck(text: string): {
  isNegative: boolean
  alternative: string | null
  suggestedCategory?: string
} {
  // 1. korcen + 보완 목록: 욕설/비속어 → 하드블록
  if (check(text) || EXTRA_PROFANITY.some((w) => text.includes(w))) {
    return { isNegative: true, alternative: null }
  }

  // 2. KnuSentiLex -2: 부정어 → 소프트블록 + 규칙 기반 대안
  if (KNU_NEGATIVE_WORDS.some((w) => text.includes(w))) {
    return { isNegative: true, alternative: buildAlternative(text) }
  }

  return { isNegative: false, alternative: null }
}
