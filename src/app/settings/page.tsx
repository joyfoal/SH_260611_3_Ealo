import { getRemoteFeatureFlags } from '@/lib/featureFlagsRemote'
import { SettingsClient } from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const { showToggleMenu } = await getRemoteFeatureFlags()
  return <SettingsClient initialShowToggleMenu={showToggleMenu} />
}
