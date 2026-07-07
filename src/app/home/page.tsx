import { getRemoteFeatureFlags } from '@/lib/featureFlagsRemote'
import { HomeClient } from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const remoteFlags = await getRemoteFeatureFlags()
  return <HomeClient initialRemoteFlags={remoteFlags} />
}
