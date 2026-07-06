import { get } from '@vercel/edge-config'

export type RemoteFeatureFlags = {
  showGame: boolean
  showSuccessImageMaker: boolean
  showRecentRecGlobal: boolean
  showToggleMenu: boolean
}

const DEFAULTS: RemoteFeatureFlags = {
  showGame: true,
  showSuccessImageMaker: true,
  showRecentRecGlobal: true,
  showToggleMenu: true,
}

export async function getRemoteFeatureFlags(): Promise<RemoteFeatureFlags> {
  try {
    const entries = await Promise.all(
      (Object.keys(DEFAULTS) as (keyof RemoteFeatureFlags)[]).map(async (k) => [k, await get<boolean>(k)] as const)
    )
    const result = { ...DEFAULTS }
    for (const [k, v] of entries) {
      if (typeof v === 'boolean') result[k] = v
    }
    return result
  } catch {
    return DEFAULTS
  }
}

export async function setRemoteFeatureFlag(key: keyof RemoteFeatureFlags, value: boolean): Promise<void> {
  const edgeConfigId = process.env.EDGE_CONFIG_ID
  const token = process.env.VERCEL_API_TOKEN
  if (!edgeConfigId || !token) {
    throw new Error('Edge Config가 아직 설정되지 않았어요 (EDGE_CONFIG_ID / VERCEL_API_TOKEN 필요)')
  }
  const teamQuery = process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : ''
  const res = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamQuery}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ operation: 'upsert', key, value }] }),
  })
  if (!res.ok) {
    throw new Error(`Edge Config 업데이트 실패 (${res.status})`)
  }
}
