'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import type { Organization, User } from '@/lib/db/types'

interface SyncState {
  user: User | null
  organization: Organization | null
  isLoading: boolean
  isNew: boolean
  error: string | null
}

export function useUserSync() {
  const { isLoaded, isSignedIn } = useUser()
  const [state, setState] = useState<SyncState>({
    user: null,
    organization: null,
    isLoading: true,
    isNew: false,
    error: null,
  })

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !isSignedIn) {
        setState(prev => ({ ...prev, isLoading: false }))
        return
      }

      try {
        const response = await fetch('/api/user/sync', {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('Failed to sync user')
        }

        const data = await response.json()

        setState({
          user: data.user,
          organization: data.organization || null,
          isLoading: false,
          isNew: data.isNew,
          error: null,
        })
      } catch (error) {
        console.error('Error syncing user:', error)
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to sync user data',
        }))
      }
    }

    syncUser()
  }, [isLoaded, isSignedIn])

  return state
}
