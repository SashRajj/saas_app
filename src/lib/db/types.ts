export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PlanType = 'trial' | 'text_ai' | 'voice_ai' | 'full_ai'
export type PlanStatus = 'trialing' | 'active' | 'past_due' | 'canceled'
export type ConversationType = 'call' | 'text'
export type ConversationStatus = 'active' | 'closed' | 'archived'
export type Direction = 'inbound' | 'outbound'
export type Sentiment = 'positive' | 'neutral' | 'negative'
export type MessageRole = 'user' | 'assistant' | 'system'
export type ScriptType = 'greeting' | 'voicemail' | 'hold' | 'transfer' | 'closing'
export type UsageType = 'call_minute' | 'sms' | 'ai_edit' | 'ai_regen'
export type UserRole = 'owner' | 'admin' | 'member'

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          owner_clerk_id: string
          phone_number: string | null
          plan: PlanType
          plan_status: PlanStatus
          trial_ends_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          balance_cents: number
          auto_reload_enabled: boolean
          auto_reload_threshold_cents: number
          auto_reload_amount_cents: number
          free_edits_remaining: number
          free_regens_remaining: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_clerk_id: string
          phone_number?: string | null
          plan?: PlanType
          plan_status?: PlanStatus
          trial_ends_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          balance_cents?: number
          auto_reload_enabled?: boolean
          auto_reload_threshold_cents?: number
          auto_reload_amount_cents?: number
          free_edits_remaining?: number
          free_regens_remaining?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>
      }
      users: {
        Row: {
          id: string
          clerk_id: string
          organization_id: string | null
          email: string
          first_name: string | null
          last_name: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          organization_id?: string | null
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      contacts: {
        Row: {
          id: string
          organization_id: string
          phone_number: string
          name: string | null
          email: string | null
          opted_out: boolean
          opted_out_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          phone_number: string
          name?: string | null
          email?: string | null
          opted_out?: boolean
          opted_out_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          organization_id: string
          contact_id: string | null
          type: ConversationType
          status: ConversationStatus
          direction: Direction | null
          started_at: string
          ended_at: string | null
          duration_seconds: number | null
          summary: string | null
          sentiment: Sentiment | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          contact_id?: string | null
          type: ConversationType
          status?: ConversationStatus
          direction?: Direction | null
          started_at?: string
          ended_at?: string | null
          duration_seconds?: number | null
          summary?: string | null
          sentiment?: Sentiment | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: MessageRole
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: MessageRole
          content: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      ai_scripts: {
        Row: {
          id: string
          organization_id: string
          type: ScriptType
          content: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          type: ScriptType
          content: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['ai_scripts']['Insert']>
      }
      knowledge_base: {
        Row: {
          id: string
          organization_id: string
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['knowledge_base']['Insert']>
      }
      usage: {
        Row: {
          id: string
          organization_id: string
          type: UsageType
          quantity: number
          cost_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          type: UsageType
          quantity?: number
          cost_cents?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['usage']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenient type aliases
export type Organization = Tables<'organizations'>
export type User = Tables<'users'>
export type Contact = Tables<'contacts'>
export type Conversation = Tables<'conversations'>
export type Message = Tables<'messages'>
export type AIScript = Tables<'ai_scripts'>
export type KnowledgeBase = Tables<'knowledge_base'>
export type Usage = Tables<'usage'>
