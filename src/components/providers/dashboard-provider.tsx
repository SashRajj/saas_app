'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useUserSync } from '@/hooks/use-user-sync'
import type { Organization, User } from '@/lib/db/types'
import { Loader2 } from 'lucide-react'

interface DashboardContextType {
  user: User | null
  organization: Organization | null
  isLoading: boolean
  isNew: boolean
  error: string | null
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const syncState = useUserSync()

  if (syncState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (syncState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">{syncState.error}</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardContext.Provider value={syncState}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
