export const CATEGORIES = [
  '나 자신',
  '일과 커리어',
  '돈과 풍요',
  '관계와 사랑',
  '건강과 몸',
  '용기와 도전',
  '마음과 평온',
  '오늘 하루',
] as const

export type CategoryName = string

const COLOR_PALETTE: { light: string; dark: string }[] = [
  { light: '#FAEEDA', dark: '#412402' },
  { light: '#E6F1FB', dark: '#0C447C' },
  { light: '#EAF3DE', dark: '#173404' },
  { light: '#FBEAF0', dark: '#4B1528' },
  { light: '#E1F5EE', dark: '#04342C' },
  { light: '#FCEBEB', dark: '#501313' },
  { light: '#EEEDFE', dark: '#26215C' },
  { light: '#FFF3E0', dark: '#633806' },
  { light: '#F3E5F5', dark: '#4A148C' },
  { light: '#E3F2FD', dark: '#0D47A1' },
]

export function getCategoryColor(name: string, allCategories?: string[]): { light: string; dark: string } {
  if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name]
  const idx = allCategories ? allCategories.indexOf(name) : 0
  return COLOR_PALETTE[Math.abs(idx) % COLOR_PALETTE.length]
}

export const CATEGORY_COLORS: Record<string, { light: string; dark: string }> = {
  '나 자신': { light: '#FAEEDA', dark: '#412402' },
  '일과 커리어': { light: '#E6F1FB', dark: '#0C447C' },
  '돈과 풍요': { light: '#EAF3DE', dark: '#173404' },
  '관계와 사랑': { light: '#FBEAF0', dark: '#4B1528' },
  '건강과 몸': { light: '#E1F5EE', dark: '#04342C' },
  '용기와 도전': { light: '#FCEBEB', dark: '#501313' },
  '마음과 평온': { light: '#EEEDFE', dark: '#26215C' },
  '오늘 하루': { light: '#FAEEDA', dark: '#633806' },
}

export const CATEGORY_EXAMPLES: Record<string, string> = {
  '나 자신': '나는 오늘도 충분히 잘하고 있다',
  '일과 커리어': '나는 내가 하는 일에서 가치를 만든다',
  '돈과 풍요': '나는 풍요를 받아들일 준비가 되어 있다',
  '관계와 사랑': '나는 좋은 사람들을 내 삶으로 끌어당긴다',
  '건강과 몸': '나의 몸은 매일 더 강해지고 있다',
  '용기와 도전': '나는 두려워도 한 발 내딛을 수 있다',
  '마음과 평온': '나는 흔들려도 다시 중심을 찾는다',
  '오늘 하루': '오늘은 좋은 일이 나에게 일어난다',
}
