import { NextResponse } from 'next/server'
import { getRemoteFeatureFlags, setRemoteFeatureFlag, type RemoteFeatureFlags } from '@/lib/featureFlagsRemote'

export async function GET() {
  const flags = await getRemoteFeatureFlags()
  return NextResponse.json(flags)
}

export async function POST(req: Request) {
  const { key, value } = (await req.json()) as { key: keyof RemoteFeatureFlags; value: boolean }
  try {
    await setRemoteFeatureFlag(key, value)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류'
    return NextResponse.json({ ok: false, message }, { status: 400 })
  }
}
