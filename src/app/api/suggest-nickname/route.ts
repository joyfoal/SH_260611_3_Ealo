import { NextRequest, NextResponse } from 'next/server'
import { hasOpenRouterKey, withOpenRouter } from '@/lib/openrouter'
import { generateFallbackNickname } from '@/lib/nicknameWords'

export async function POST(_req: NextRequest) {
  try {
    if (!hasOpenRouterKey()) {
      return NextResponse.json({ nickname: generateFallbackNickname() })
    }

    const completion = await withOpenRouter((openai) => openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 커뮤니티 앱의 닉네임 작명가입니다. 밝고 긍정적인 느낌의 한국어 닉네임을 하나만 만드세요. 12자 이내, 욕설·비속어·부정적 표현 절대 금지. JSON 객체로만 응답하세요: {"nickname": "닉네임"}',
        },
        { role: 'user', content: '긍정적인 닉네임 하나 추천해줘.' },
      ],
      temperature: 0.9,
      max_tokens: 50,
    }))

    const content = completion.choices[0]?.message?.content ?? ''
    const match = content.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ nickname: generateFallbackNickname() })

    const parsed: unknown = JSON.parse(match[0])
    const nickname = parsed && typeof parsed === 'object' && typeof (parsed as { nickname?: unknown }).nickname === 'string'
      ? (parsed as { nickname: string }).nickname.trim().slice(0, 12)
      : ''
    return NextResponse.json({ nickname: nickname || generateFallbackNickname() })
  } catch {
    return NextResponse.json({ nickname: generateFallbackNickname() })
  }
}
