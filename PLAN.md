# AI Receptionist & Follow-Up SaaS - Complete Implementation Plan

## Project Overview

**Product**: AI Receptionist & AI Follow-Up SaaS
**Tagline**: "Upload → Approve → Schedule → Launch — AI handles calls, texts, follow-up, and appointment booking automatically like a real employee."

**Philosophy**:
- Ultra-simple, Apple-like UX
- Setup in < 3 minutes
- No CRM complexity
- "Hired an AI employee, not learned software"

---

## Three Product Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Text AI** | $50/mo | SMS automation, missed call text, drip campaigns |
| **Voice AI** | $75/mo | AI calls, transcripts, booking, transfer, voicemail |
| **Full AI Employee** | $100/mo | Everything from both tiers |

**All tiers include:**
- 100 AI edits/month (resets monthly)
- Unlimited testing (hidden 50/day cap)
- 50 voice plays/month (voice plans only)
- Knowledge base upload
- Contact management
- Phone number ($1/mo usage)

---

## Tech Stack

| Layer | Technology | Cost |
|-------|------------|------|
| **Framework** | Next.js 14 (App Router) | Free |
| **Database** | Supabase PostgreSQL | Free until 50k users |
| **Auth** | Clerk (Google OAuth) | Free until 10k users |
| **UI** | shadcn/ui + Tailwind + Framer Motion | Free |
| **Payments** | Stripe | 2.9% + $0.30 per transaction |
| **Telecom** | Telnyx | ~$0.004/SMS, ~$0.007/min |
| **Voice AI** | Vapi | ~$0.05/min |
| **Jobs** | BullMQ + Upstash Redis | Free tier available |
| **AI/LLM** | OpenAI GPT-4o-mini | ~$0.002/edit |
| **Email** | Resend | Free until 3k/mo |
| **Calendar** | Google Calendar API | Free |
| **Deploy** | Vercel | Free until high traffic |

**Total fixed cost until ~100 customers: $0/month**

---

## Billing Architecture (3 Separate Streams)

### Stream 1: Platform Subscription (To Us)
```
$50/mo Text | $75/mo Voice | $100/mo Full
- 7-day free trial (card required upfront)
- Managed via Stripe Subscriptions
- Upgrades: immediate, prorated
- Downgrades: end of billing period
- Cancels: end of billing period
```

### Stream 2: Telecom Usage (Prepaid Balance)
```
- User adds funds ($25 minimum to start)
- Costs:
  • SMS outbound: $0.004/msg
  • SMS inbound: $0.004/msg
  • Voice: $0.007/min
  • Phone number: $1/month
- Auto-reload when balance < $5 (configurable)
- Independent pause: text ≠ voice
```

### Stream 3: AI Usage (Monthly Limits)
```
Included with subscription (resets monthly):
- AI Edits: 100/month
- Testing: Unlimited (hidden 50/day cap prevents abuse)
- Voice Plays: 50/month (voice/full plans only)

Need more? Pay as you go:
- +10 AI Edits: $1
- +20 Voice Plays: $2

Margins (guaranteed 90%+):
- Text $50:   ~$3.30 cost → $46.70 profit (93.4%)
- Voice $75:  ~$6.30 cost → $68.70 profit (91.6%)
- Full $100:  ~$6.30 cost → $93.70 profit (93.7%)
```

---

## Dashboard Design (4 Tabs Only)

```
┌────────────┬─────────────────────────────────────────────────────────────────┐
│            │                                                                 │
│  📊 Home   │   Home: Stats + Recent Activity                                │
│            │                                                                 │
│  💬 Inbox  │   Inbox: All Conversations (filter by calls/texts)             │
│            │                                                                 │
│  ✏️ Edit AI │   Edit AI: Scripts, Knowledge, Contacts, Voice                 │
│            │                                                                 │
│  ⚙️ Account │   Account: Plan, Balance, Settings, Pause Controls             │
│            │                                                                 │
└────────────┴─────────────────────────────────────────────────────────────────┘
```

### Tab 1: 📊 Home
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  THIS WEEK                                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  📞 47       │ │  💬 123      │ │  📅 12       │ │  💰 $4.82    │        │
│  │  calls       │ │  texts       │ │  bookings    │ │  usage       │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                                              │
│  RECENT ACTIVITY                                                             │
│  🟢 2 min ago    Sarah M. booked appointment (Jan 15, 2pm)                  │
│  🟢 15 min ago   AI answered call from +1 415-555-1234                      │
│  🟢 1 hr ago     Follow-up text sent to Mike D.                             │
│  🟢 2 hrs ago    New lead: +1 510-555-5678 (inbound call)                   │
│                                                                              │
│  [View All in Inbox →]                                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Tab 2: 💬 Inbox
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [All]  [Calls]  [Texts]                                    🔍 Search        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 📞 Sarah Martinez                Today 2:34 PM              📅 Booked  │ │
│  │    "I need someone to fix my leaking pipe..."                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 💬 Mike Davis                    Today 1:15 PM              ↩️ Replied │ │
│  │    "Thanks! I'll call back tomorrow"                                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 📞 +1 510-555-1234               Today 11:22 AM            ❌ Missed   │ │
│  │    Voicemail left, auto-text sent                                      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Tab 3: ✏️ Edit AI
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ✏️ Edit Your AI                                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 🔊 VOICE AI                                              [💬 Edit]     ││
│  │ Greeting: "Hi, thanks for calling Acme Plumbing!..."                   ││
│  │ Voice: Rachel (Female, Friendly)                         [🔊 Change]   ││
│  │                                                          [▶️ Preview]  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 📱 TEXT AI                                               [💬 Edit]     ││
│  │ Missed call: "Hi! Sorry we missed your call..."                        ││
│  │ Follow-ups: Day 1, 7, 21, 30 ✓                          [👁️ Preview]  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 📚 KNOWLEDGE BASE                                        [+ Add]       ││
│  │ ✓ services.pdf • ✓ pricing info                                        ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 👥 CONTACTS                                              [+ Import]    ││
│  │ 48 contacts (12 imported, 36 from calls/texts)          [View All]     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ✨ 92 edits remaining  •  47 voice plays remaining                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Tab 4: ⚙️ Account
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ⚙️ Account                                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  YOUR PLAN                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Full AI Employee    $100/month              [Change Plan]             ││
│  │  Next billing: Jan 15, 2025                                            ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  USAGE BALANCE                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Balance: $18.50                             [+ Add Funds]             ││
│  │  ☑️ Auto-reload $25 when below $5                                      ││
│  │                                                                        ││
│  │  This month: 234 texts ($0.94) • 89 min calls ($0.62) = $2.56         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  CONNECTED ACCOUNTS                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  📧 Google: john@gmail.com (calendar synced)      [Change]             ││
│  │  📱 Phone: +1 (415) 555-0123                      [Change Number]      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  CONTROLS                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  📱 Text Automation    [ON ━━━━━○]                                     ││
│  │  📞 Voice AI           [ON ━━━━━○]                                     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [Cancel Subscription]                                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Chat-Based Editing Interface

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  💬 Edit: Voice Greeting                                            [✕]     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CURRENT:                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ "Hi, thanks for calling Acme Plumbing! I'm your AI assistant.         │ │
│  │  How can I help you today?"                                            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  💡 Try: "Make it more casual" • "Mention 24/7" • "Add free estimates"│ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  CHAT:                                                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  👤 Make it friendlier and mention we do emergency calls 24/7         │ │
│  │                                                                        │ │
│  │  🤖 Here's a friendlier version:                                      │ │
│  │                                                                        │ │
│  │     "Hey there! You've reached Acme Plumbing - your 24/7              │ │
│  │      emergency plumbing heroes! I'm here to help. What's              │ │
│  │      going on?"                                                        │ │
│  │                                                                        │ │
│  │     [✓ Use This]  [↻ Regenerate]  [Keep Editing]                      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Type what you want to change...                           [Send 📤]  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ✨ Edits: 47/50 free  •  Regenerations: 9/10 free                          │
│  After free tier: ~$0.05 per change                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Gating by Plan

| Feature | Text AI ($50) | Voice AI ($75) | Full ($100) |
|---------|---------------|----------------|-------------|
| Dashboard stats | Text only | Voice only | All |
| Inbox | Texts only | Calls only | All |
| Edit - Text section | ✅ | ❌ (upgrade prompt) | ✅ |
| Edit - Voice section | ❌ (upgrade prompt) | ✅ | ✅ |
| Knowledge Base | ✅ | ✅ | ✅ |
| Contacts | ✅ | ✅ | ✅ |
| Missed call text | ✅ | ❌ | ✅ |
| Drip campaigns | ✅ | ❌ | ✅ |
| AI answers calls | ❌ | ✅ | ✅ |
| Call transcripts | ❌ | ✅ | ✅ |
| Appointment booking | ❌ | ✅ | ✅ |
| Voice selection | ❌ | ✅ | ✅ |
| Google Calendar sync | ❌ | ✅ | ✅ |

---

## Onboarding Flow

### Required Steps (Cannot Skip)
1. **Sign up** - Google OAuth (auto-connects calendar)
2. **Business info** - Name + industry
3. **Choose plan** - Text / Voice / Full
4. **Get phone number** - Area code → provision
5. **Payment** - Card for trial + $25 usage balance
6. **Go live** - Preview + activate

### Skippable Steps
- **Teach AI** - Upload PDF/URL/text (uses industry defaults if skipped)
- **Pick voice** - Voice selection (uses default if skipped)
- **Import contacts** - CSV/Excel (starts with 0 contacts)

### Onboarding Screens

```
STEP 1: Sign Up
┌─────────────────────────────────────────┐
│  Create your AI employee in 3 minutes   │
│                                         │
│  [Continue with Google]                 │
└─────────────────────────────────────────┘

STEP 2: Business Info
┌─────────────────────────────────────────┐
│  What's your business called?           │
│  [Acme Plumbing_______________]         │
│                                         │
│  What industry?                         │
│  [Plumbing & HVAC         ▼]            │
│                                         │
│  [Continue]                             │
└─────────────────────────────────────────┘

STEP 3: Choose Plan
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  TEXT AI    │  │  VOICE AI   │  │  FULL AI EMPLOYEE       │ │
│  │   $50/mo    │  │   $75/mo    │  │   $100/mo  ⭐ POPULAR   │ │
│  │             │  │             │  │                         │ │
│  │ ✓ Auto-text │  │ ✓ AI calls  │  │ ✓ Everything            │ │
│  │ ✓ Follow-up │  │ ✓ Booking   │  │                         │ │
│  │ ✓ Drip SMS  │  │ ✓ Transfer  │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                                                                 │
│  Plus usage: ~$0.004/text, ~$0.007/min (pay only what you use) │
└─────────────────────────────────────────────────────────────────┘

STEP 4: Get Phone Number
┌─────────────────────────────────────────┐
│  Your AI needs a phone number!          │
│                                         │
│  Area code: [415]                       │
│  Available: +1 (415) 555-0123           │
│  Cost: $1/month                         │
│                                         │
│  [Get This Number]                      │
└─────────────────────────────────────────┘

STEP 5: Payment
┌─────────────────────────────────────────────────┐
│  YOUR COSTS:                                    │
│  ┌────────────────────────────────────────────┐│
│  │ Platform:     $100/month (your plan)       ││
│  │ ──────────────────────────────────────     ││
│  │ Usage (pay as you go):                     ││
│  │   • Texts: ~$0.004 each                    ││
│  │   • Calls: ~$0.007/min                     ││
│  │   • Phone: $1/month                        ││
│  │                                            ││
│  │ Starting balance: [$25]                    ││
│  └────────────────────────────────────────────┘│
│                                                 │
│  Today: $25 (usage balance only)               │
│  In 7 days: $100 (first subscription charge)   │
│                                                 │
│  Card: [________________________]               │
│  [Start 7-Day Free Trial]                       │
└─────────────────────────────────────────────────┘

STEP 6: Teach AI (Skippable)
┌─────────────────────────────────────────┐
│  Help your AI know your business        │
│                                         │
│  [📄 Upload PDF]  [🔗 Add URL]          │
│                                         │
│  Or describe your business:             │
│  [We're a 24/7 plumbing service...    ] │
│                                         │
│  [Continue]  [Skip for now]             │
└─────────────────────────────────────────┘

STEP 7: Pick Voice (Skippable, Voice/Full only)
┌─────────────────────────────────────────────────┐
│  Choose your AI's voice                         │
│                                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ Rachel │ │ James  │ │ Sofia  │ │ Marcus │  │
│  │ Female │ │ Male   │ │ Female │ │ Male   │  │
│  │Friendly│ │ Prof.  │ │ Warm   │ │ Casual │  │
│  │[▶Play] │ │[▶Play] │ │[▶Play] │ │[▶Play] │  │
│  └────────┘ └────────┘ └────────┘ └────────┘  │
│                                                 │
│  [Continue]  [Skip - use default]               │
└─────────────────────────────────────────────────┘

STEP 8: Import Contacts (Skippable)
┌─────────────────────────────────────────┐
│  Import your existing contacts          │
│                                         │
│  [📥 Upload CSV/Excel]                  │
│                                         │
│  [Continue]  [Skip for now]             │
└─────────────────────────────────────────┘

STEP 9: Preview & Go Live
┌─────────────────────────────────────────────────┐
│  🎉 Your AI is ready!                           │
│                                                 │
│  [▶️ Hear Sample Call]   [📱 See Sample Text]   │
│                                                 │
│  "Hey there! You've reached Acme Plumbing..."   │
│                                                 │
│  [💬 Edit via Chat]                             │
│                                                 │
│  [🚀 Go Live]                                   │
└─────────────────────────────────────────────────┘
```

---

## Voice AI Flows

### Inbound Call Flow
```
Incoming call → Telnyx webhook
    ↓
Identify organization by phone number
    ↓
Check: voice_enabled?
    ↓
No → Play "Please leave a message" → Record voicemail → Send missed call text
    ↓
Yes → Check business hours
    ↓
After hours + after_hours_action = 'voicemail'? → Voicemail
    ↓
Connect to Vapi AI
    ↓
AI greets caller using custom script + knowledge base
    ↓
AI handles conversation:
  • Answers questions (uses knowledge base)
  • Books appointments (checks Google Calendar)
  • Takes messages
  • Transfers to real phone if requested
    ↓
Call ends → Store transcript → Update contact → Log usage
```

### Appointment Booking (During Call)
```
Caller: "I'd like to book an appointment"
    ↓
AI: "Sure! What day works best for you?"
    ↓
Caller: "Thursday"
    ↓
AI checks Google Calendar availability
    ↓
AI: "I have 10am, 2pm, or 4pm on Thursday. Which works?"
    ↓
Caller: "2pm"
    ↓
AI: "Great! Can I get your name and email for confirmation?"
    ↓
Caller provides info
    ↓
AI creates Google Calendar event
    ↓
AI: "You're all set for Thursday at 2pm. You'll get a confirmation email."
    ↓
Appointment saved + calendar synced
```

### Call Transfer Flow
```
Caller: "Can I speak to someone?"
    ↓
AI: "Of course! Let me transfer you. One moment..."
    ↓
AI initiates warm transfer to owner's phone (transfer_phone)
    ↓
If answered → Call connected, AI drops off
If not answered (30s timeout) → AI returns
    ↓
AI: "Sorry, they're unavailable. Can I take a message or schedule a callback?"
```

---

## SMS Automation Flows

### Missed Call → Auto Text
```
Call ends with status = 'missed' or 'voicemail'
    ↓
Check: text_enabled? missed_call_text_enabled?
    ↓
Queue job: send text in 2 minutes (configurable)
    ↓
BullMQ processes job
    ↓
Check: contact opted_out?
    ↓
Send SMS via Telnyx
    ↓
Deduct from balance → Log usage
```

### Drip Campaign
```
Contact added (import, inbound call, inbound text)
    ↓
Check: drip_enabled?
    ↓
Schedule jobs: Day 1, 7, 21, 30
    ↓
BullMQ processes at scheduled time
    ↓
Check: contact opted_out? automation paused?
    ↓
Send personalized SMS ({{first_name}}, etc.)
    ↓
Deduct from balance → Log usage
```

### SMS Opt-Out (STOP)
```
Inbound SMS contains "STOP" (case insensitive)
    ↓
Immediately set contact.opted_out = true
    ↓
Reply: "You've been unsubscribed and won't receive further messages."
    ↓
Never send automated messages to this contact again
(Required by TCPA law)
```

---

## Database Schema

```sql
-- Organizations
organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  industry VARCHAR,
  timezone VARCHAR DEFAULT 'America/New_York',

  plan_tier VARCHAR NOT NULL, -- 'text' | 'voice' | 'full'
  text_enabled BOOLEAN DEFAULT true,
  voice_enabled BOOLEAN DEFAULT true,

  free_edits_remaining INT DEFAULT 50,
  free_regens_remaining INT DEFAULT 10,

  business_hours JSONB,
  after_hours_action VARCHAR DEFAULT 'voicemail',
  transfer_phone VARCHAR,

  missed_call_text_enabled BOOLEAN DEFAULT true,
  missed_call_text_delay_sec INT DEFAULT 120,
  drip_enabled BOOLEAN DEFAULT true,

  onboarding_step INT DEFAULT 1,
  onboarding_completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  clerk_user_id VARCHAR UNIQUE NOT NULL,
  email VARCHAR NOT NULL,
  name VARCHAR,

  google_access_token TEXT,
  google_refresh_token TEXT,
  google_token_expires_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID UNIQUE REFERENCES organizations(id),

  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,

  plan_tier VARCHAR NOT NULL,
  status VARCHAR NOT NULL, -- 'trialing'|'active'|'past_due'|'canceled'

  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Telecom Accounts
telecom_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID UNIQUE REFERENCES organizations(id),

  telnyx_connection_id VARCHAR,
  phone_number VARCHAR,
  phone_number_id VARCHAR,

  vapi_assistant_id VARCHAR,
  selected_voice_id VARCHAR DEFAULT 'rachel',

  prepaid_balance DECIMAL(10,2) DEFAULT 0,
  auto_reload_enabled BOOLEAN DEFAULT true,
  auto_reload_threshold DECIMAL(10,2) DEFAULT 5,
  auto_reload_amount DECIMAL(10,2) DEFAULT 25,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),

  phone VARCHAR NOT NULL,
  email VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR,

  source VARCHAR DEFAULT 'manual',
  status VARCHAR DEFAULT 'lead',

  opted_out BOOLEAN DEFAULT false,
  opted_out_at TIMESTAMPTZ,

  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(organization_id, phone)
);

-- Conversations
conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  contact_id UUID REFERENCES contacts(id),

  channel VARCHAR NOT NULL, -- 'sms' | 'voice'
  status VARCHAR DEFAULT 'active',

  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  organization_id UUID REFERENCES organizations(id),

  direction VARCHAR NOT NULL, -- 'inbound' | 'outbound'
  content TEXT NOT NULL,

  telnyx_message_id VARCHAR,
  status VARCHAR DEFAULT 'sent',
  automation_type VARCHAR,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calls
calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  organization_id UUID REFERENCES organizations(id),
  contact_id UUID REFERENCES contacts(id),

  direction VARCHAR NOT NULL,
  status VARCHAR NOT NULL,

  vapi_call_id VARCHAR,

  duration_seconds INT,
  recording_url TEXT,
  transcript TEXT,
  summary TEXT,

  outcome VARCHAR,
  transferred_to VARCHAR,

  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scripts
scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),

  type VARCHAR NOT NULL,
  content TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(organization_id, type)
);

-- Knowledge Sources
knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),

  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,

  original_filename VARCHAR,
  original_url VARCHAR,
  storage_path VARCHAR,

  extracted_text TEXT,
  embedding VECTOR(1536),

  status VARCHAR DEFAULT 'pending',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  contact_id UUID REFERENCES contacts(id),

  title VARCHAR NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 30,

  google_event_id VARCHAR,
  status VARCHAR DEFAULT 'scheduled',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Records
usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),

  type VARCHAR NOT NULL,
  quantity INT NOT NULL,
  unit_cost DECIMAL(10,4) NOT NULL,
  total_cost DECIMAL(10,4) NOT NULL,

  reference_type VARCHAR,
  reference_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Balance Transactions
balance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),

  type VARCHAR NOT NULL, -- 'credit' | 'debit'
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  description VARCHAR,

  stripe_payment_intent_id VARCHAR,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Jobs
scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  contact_id UUID REFERENCES contacts(id),

  type VARCHAR NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status VARCHAR DEFAULT 'pending',

  bullmq_job_id VARCHAR,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Project Structure

```
/app
  /(marketing)/
    page.tsx                    # Landing page
    pricing/page.tsx            # Pricing
    terms/page.tsx              # Terms of Service
    privacy/page.tsx            # Privacy Policy

  /(auth)/
    sign-in/[[...sign-in]]/page.tsx
    sign-up/[[...sign-up]]/page.tsx

  /(onboarding)/
    page.tsx                    # Onboarding wizard

  /(dashboard)/
    layout.tsx                  # 4-tab sidebar
    page.tsx                    # Home (stats + activity)
    inbox/
      page.tsx                  # Conversation list
      [id]/page.tsx             # Conversation detail
    edit/page.tsx               # Edit AI
    account/page.tsx            # Settings

  /api/
    webhooks/
      clerk/route.ts
      stripe/route.ts
      telnyx/
        sms/route.ts
        voice/route.ts
      vapi/route.ts

    onboarding/
      business/route.ts
      phone/route.ts
      payment/route.ts
      knowledge/route.ts
      voice/route.ts
      contacts/route.ts
      complete/route.ts

    stats/route.ts
    activity/route.ts
    conversations/route.ts
    conversations/[id]/route.ts
    scripts/route.ts
    scripts/[id]/route.ts
    chat-edit/route.ts
    knowledge/route.ts
    knowledge/[id]/route.ts
    contacts/route.ts
    contacts/import/route.ts
    subscription/route.ts
    subscription/change/route.ts
    subscription/cancel/route.ts
    balance/add/route.ts
    settings/route.ts
    usage/route.ts

/components
  /ui/                          # shadcn/ui
  /marketing/
    hero.tsx
    features.tsx
    pricing-cards.tsx
    testimonials.tsx
    footer.tsx
  /dashboard/
    sidebar.tsx
    header.tsx
    stats-cards.tsx
    activity-feed.tsx
  /inbox/
    conversation-list.tsx
    conversation-item.tsx
    conversation-detail.tsx
    message-bubble.tsx
    call-transcript.tsx
  /edit/
    script-card.tsx
    chat-editor.tsx
    voice-selector.tsx
    knowledge-uploader.tsx
    contact-importer.tsx
    contacts-list.tsx
  /account/
    plan-card.tsx
    balance-card.tsx
    connected-accounts.tsx
    pause-toggles.tsx
  /onboarding/
    wizard.tsx
    step-business.tsx
    step-plan.tsx
    step-phone.tsx
    step-payment.tsx
    step-knowledge.tsx
    step-voice.tsx
    step-contacts.tsx
    step-launch.tsx

/lib
  /db/
    supabase.ts                 # Client + types
    queries.ts                  # Common queries
  /services/
    stripe.ts                   # Subscriptions, payments
    telnyx.ts                   # Phone, SMS
    vapi.ts                     # Voice AI
    openai.ts                   # Chat editing
    google-calendar.ts          # Calendar sync
    resend.ts                   # Email
  /jobs/
    queue.ts                    # BullMQ setup
    missed-call.worker.ts
    drip-campaign.worker.ts
    process-knowledge.worker.ts
    low-balance-alert.worker.ts
  /hooks/
    use-stats.ts
    use-conversations.ts
    use-scripts.ts
    use-usage.ts
  /utils/
    format.ts                   # Phone, date, currency
    validate.ts                 # Zod schemas

/public
  /images/
  /fonts/
```

---

## Implementation Milestones

### Milestone 1: Foundation ✅ COMPLETED
- [x] Initialize Next.js 14 + TypeScript
- [x] Setup Tailwind + shadcn/ui
- [x] Configure Supabase + run migrations
- [x] Setup Clerk with Google OAuth
- [x] Create 4-tab dashboard layout shell
- [x] Build landing page with pricing
- [x] Add terms + privacy pages
- [x] Initialize git repo
- [x] Wire up database sync (Clerk → Supabase)

**Git commit**: `feat: foundation - auth, database, dashboard shell, landing page`

### Milestone 2: Dashboard UI ✅ COMPLETED
- [x] Build Home page with stats cards
- [x] Build activity feed component
- [x] Build Inbox page with conversation list
- [x] Build conversation detail view (call transcripts, text threads)
- [x] Build Account page UI (settings, profile, business info)
- [x] Build Edit AI page with polished UI
- [x] Polish all dashboard components

**Git commit**: `feat: dashboard - home stats, inbox, account UI`

### Milestone 3: Stats Drill-down & User Intervention ✅ COMPLETED
- [x] Add clickable stats cards with slide-over breakdown panels
- [x] Show inbound/outbound split for calls (AI answered vs AI initiated)
- [x] Show inbound/outbound split for texts (auto-replies vs drip/manual)
- [x] Show booking source breakdown (which channel drove the booking)
- [x] Show usage breakdown (SMS count, call minutes, AI edits, phone fee)
- [x] Add manual text sending in conversation detail view
- [x] Add click-to-call functionality (Telnyx call connect)
- [x] Update Edit AI with separate inbound/outbound script sections

**Git commit**: `feat: stats-drilldown - inbound/outbound breakdown, user intervention`

### Milestone 4: Edit AI Functionality (Filter-Based Design) ✅ COMPLETED
**Philosophy: Simplicity with smart filters**

**Dashboard Structure:**
- Edit AI tab → Scripts + Voice (with filter controls)
- Data tab → Knowledge Base + Contacts (one-time uploads)

**Filter-Based Script View:**
- Two simple filter rows at top:
  - Type: All | Voice | Text
  - Direction: All | Inbound | Outbound
- Scripts filtered in real-time based on selection
- Clean, unified list view (no nested tabs)

**Pre-Made Scripts (Ready to Deploy):**
- Voice Inbound: Greeting (during hours), After Hours Message
- Voice Outbound: Appointment Reminder, Follow-up Call, Cold Call
- Text Inbound: Auto-Reply, After Hours Reply
- Text Outbound: Missed Call Text, Appointment Confirmation, Follow-up Message, Cold Message

**Script Types by Trigger:**
1. Event-Triggered (automatic, no schedule):
   - When someone calls → Greeting, After Hours
   - After missed call → Missed Call Text
   - After booking → Appointment Confirmation
   - When someone texts → Auto-Reply, After Hours Reply

2. Proactive/Scheduled (needs frequency + timeslot):
   - Cold outreach (calls/texts) → User sets schedule
   - Follow-up campaigns → Day 1, 7, 21, 30
   - Appointment reminders → 1 day before

**Scheduling Settings (for proactive scripts):**
- Time window: "Send between 9am-5pm"
- Max per day: "Up to 20 contacts/day"
- Days: Mon-Fri, weekdays only, etc.

**Test AI Feature:**
- Test button on each script card
- Opens simulation modal showing AI response preview
- Voice: Audio preview of how AI sounds
- Text: Mock conversation preview
- Uses free test credits

**Simplified Free Tier:**
| Action | Free | After Free |
|--------|------|------------|
| Create scripts | Unlimited | Unlimited |
| AI Edits | 30 | ~$0.05/edit |
| AI Tests | 20 | ~$0.02/test |

**Completed:**
- [x] Filter UI (Type + Direction) for script list
- [x] Pre-made scripts for all categories (including cold outreach)
- [x] Create script modal with name editing & category selection
- [x] Script edit modal with chat-based AI editing
- [x] Test AI button + simulation modal
- [x] Scheduling UI for proactive scripts
- [x] Delete script and toggle on/off
- [x] Voice selector modal
- [x] Data tab for Knowledge Base + Contacts
- [x] Free tier: Edits (30) + Tests (20)

**Git commit**: `feat: edit-ai-complete - test AI, scheduling, cold outreach`

### Milestone 5: AI Backend
- [ ] Setup OpenAI integration (GPT-4o-mini)
- [ ] Implement PDF text extraction
- [ ] Implement URL scraping
- [ ] Generate vector embeddings (pgvector)
- [ ] Build AI script generation API
- [ ] Implement chat-edit API (streaming responses)
- [ ] Track and decrement free tier usage

**Git commit**: `feat: ai-backend - knowledge processing, chat editing API`

### Milestone 6: Telecom Integration
- [ ] Setup Telnyx account + API
- [ ] Implement phone number provisioning
- [ ] Build inbound SMS webhook handler
- [ ] Implement outbound SMS
- [ ] Handle STOP opt-out compliance (TCPA)
- [ ] Setup Vapi account + API
- [ ] Configure voice AI assistant with scripts
- [ ] Build inbound call webhook handler
- [ ] Implement call transfer
- [ ] Add call recording + transcription storage

**Git commit**: `feat: telecom - telnyx SMS, vapi voice AI, call handling`

### Milestone 7: Automations
- [ ] Setup BullMQ + Upstash Redis
- [ ] Implement missed call → text automation
- [ ] Build drip campaign system (Day 1, 7, 21, 30)
- [ ] Add pause/resume controls per organization
- [ ] Implement scheduled job tracking
- [ ] Add low balance email alerts

**Git commit**: `feat: automations - drip campaigns, missed call text`

### Milestone 8: Billing System (Stripe)
- [ ] Create Stripe products (3 tiers: $50, $75, $100)
- [ ] Implement checkout with 7-day trial
- [ ] Build subscription management (change plan, cancel)
- [ ] Implement prepaid balance system for usage
- [ ] Add auto-reload functionality
- [ ] Build usage tracking and billing
- [ ] Setup Stripe webhooks
- [ ] Connect billing to Account page

**Git commit**: `feat: billing - subscriptions, prepaid balance, usage tracking`

### Milestone 9: Onboarding Flow
- [ ] Build multi-step wizard component
- [ ] Business info step (name, industry)
- [ ] Plan selection step
- [ ] Phone number provisioning step
- [ ] Payment step (Stripe)
- [ ] Knowledge upload step (skippable)
- [ ] Voice selection step (skippable)
- [ ] Contact import step (skippable)
- [ ] Preview + go live step

**Git commit**: `feat: onboarding - complete wizard flow`

### Milestone 10: Polish & Launch
- [ ] Implement Google Calendar sync for appointments
- [ ] Add email notifications (Resend)
- [ ] Implement feature gating by plan tier
- [ ] Add real-time updates (Supabase Realtime)
- [ ] Complete error handling
- [ ] End-to-end testing
- [ ] Bug fixes & performance optimization

**Git commit**: `feat: polish - calendar sync, emails, testing, launch ready`

---

## Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Onboarding abandoned | Save state in Redis, allow resume |
| Phone provision fails | Show error, retry with different area code |
| Payment fails | Email + dashboard banner + 3-day grace period |
| Balance = $0 | Pause automations (not calls), email alert, banner |
| Card declined on renewal | Email + grace period + pause if not fixed |
| User texts STOP | Immediately opt out, required by law |
| Vapi API down | Fallback to voicemail |
| Knowledge processing fails | Show error, allow retry |
| AI generates inappropriate content | Content filter before sending |
| Rate limiting | Queue and retry with backoff |

---

## Security Checklist

- [ ] Verify Stripe webhook signatures
- [ ] Verify Telnyx webhook signatures
- [ ] Verify Vapi webhook signatures
- [ ] Implement Row Level Security (RLS) in Supabase
- [ ] Always filter queries by organization_id
- [ ] Validate all inputs with Zod
- [ ] Rate limit API endpoints
- [ ] Sanitize user-generated content
- [ ] Secure Google OAuth tokens
- [ ] HTTPS everywhere

---

## Success Metrics

- Onboarding completion rate (target: >80%)
- Time to first call answered (target: <5 min)
- Monthly churn rate (target: <5%)
- Customer satisfaction (NPS target: >50)
- Revenue per user (target: $150/mo including usage)
