import { NextRequest, NextResponse } from 'next/server'

const FALLBACK_AFFIRMATIONS = [
  '나는 오늘도 충분히 잘하고 있다',
  '나는 내가 하는 일에서 가치를 만든다',
  '나는 두려워도 한 발 내딛을 수 있다',
  '나는 매일 더 나은 나로 성장하고 있다',
  '나는 풍요와 기쁨을 받아들일 준비가 되어 있다',
]

export async function POST(req: NextRequest) {
  try {
    const { prompt, category } = await req.json() as { prompt?: string; category?: string }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_key_here') {
      return NextResponse.json({ affirmations: FALLBACK_AFFIRMATIONS })
    }

    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const categoryPart = category ? ` 카테고리: ${category}.` : ''
    const userMessage = `${prompt || ''}${categoryPart} 한국어 긍정 확언 5개를 JSON 배열로만 응답하세요. 예: ["확언1","확언2","확언3","확언4","확언5"]`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 긍정 확언 전문가입니다. 사용자의 고민이나 감정에 맞는 한국어 긍정 확언을 생성하세요. 확언은 반드시 현재형, 1인칭(\'나는...\')으로 작성하세요. JSON 배열 형식으로만 응답하세요.',
        },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.8,
    })

    const content = completion.choices[0]?.message?.content ?? ''
    const match = content.match(/\[[\s\S]*\]/)
    if (!match) {
      return NextResponse.json({ affirmations: FALLBACK_AFFIRMATIONS })
    }
    const affirmations = JSON.parse(match[0]) as string[]
    return NextResponse.json({ affirmations })
  } catch {
    return NextResponse.json({ affirmations: FALLBACK_AFFIRMATIONS })
  }
}
