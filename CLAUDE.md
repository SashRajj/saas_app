# CLAUDE.md - AI Receptionist SaaS Project Reference

This file is my reference throughout development. It contains key decisions, current status, and things to remember.

## Project Overview

**Product**: AI Receptionist & AI Follow-Up SaaS
**Goal**: Ultra-simple AI employee that handles calls, texts, follow-ups, and booking
**Philosophy**: Setup in < 3 minutes, no CRM complexity, Apple-like UX

## Current Status

### Milestone 1: Foundation (COMPLETED)
- [x] Initialize Next.js 14 + TypeScript
- [x] Setup Tailwind + shadcn/ui
- [x] Configure Supabase + create database schema
- [x] Setup Clerk with Google OAuth
- [x] Create 4-tab dashboard layout shell
- [x] Build landing page with pricing
- [x] Add terms + privacy pages
- [x] Initialize git repo
- [x] Wire up database sync (Clerk → Supabase)

### Milestone 2: Dashboard UI (COMPLETED)
- [x] Build Home page with stats cards
- [x] Build activity feed component
- [x] Build Inbox page with conversation list
- [x] Build conversation detail view (call transcripts, text threads)
- [x] Build Account page UI (settings, profile, business info)
- [x] Build Edit AI page with polished UI

### Milestone 3: Stats Drill-down & User Intervention (COMPLETED)
- [x] Add clickable stats with slide-over breakdown panels
- [x] Show inbound/outbound split for calls and texts
- [x] Show booking source breakdown (which channel)
- [x] Show usage breakdown (SMS, minutes, AI edits, phone fee)
- [x] Add manual text sending in conversation view
- [x] Add click-to-call functionality
- [x] Update Edit AI with inbound/outbound script sections

### Milestone 4: Edit AI Functionality - Complete (COMPLETED)
**Key Design: Simplicity with smart filters + Test AI**

**Filter UI:**
- Type filter: All | Voice | Text
- Direction filter: All | Inbound | Outbound

**Pre-Made Scripts (including cold outreach):**
- Voice Inbound: Greeting, After Hours
- Voice Outbound: Appointment Reminder, Follow-up Call, Cold Call
- Text Inbound: Auto-Reply, After Hours Reply
- Text Outbound: Missed Call, Appointment Confirm, Follow-up, Cold Message

**Script Triggers:**
- Event-triggered: Greeting, After Hours, Missed Call, Confirmation (no schedule)
- Proactive/Scheduled: Cold outreach, Follow-ups (needs time window + max/day)

**Edit + Test Modal (Unified):**
- Separate Test (Play) and Edit (Pencil) buttons per script
- Both open same modal with Edit/Test toggle at top
- Edit mode: Chat with AI to refine script
- Test mode: Simulate conversation with AI
- Voice scripts: Optional "Play Audio" button (uses voice plays)

**Free Tier (resets monthly, 90%+ margins):**
- AI Edits: 100/month → +10 for $1 after
- Testing: Unlimited (hidden 50/day cap prevents abuse)
- Voice Plays: 50/month → +20 for $2 after (voice plans only)

**UI Layout (compact, no-scroll):**
- Compact filters inline (Type: All/Voice/Text, Direction: All/In/Out)
- Scripts list with scrollable area if needed
- Voice Selection + Monthly Usage side by side in one row
- Text plans show: "100 edits" | Voice plans: "100 edits • 50 voice plays"

- [x] Filter UI + pre-made scripts (including cold outreach)
- [x] Unified Edit+Test modal with toggle
- [x] Scheduling UI for proactive scripts
- [x] Delete/toggle scripts + Voice selector
- [x] Data tab (Knowledge Base + Contacts)
- [x] Free tier: 100 edits, unlimited tests, 50 voice plays

### Upcoming Milestones (Milestone 5 is NEXT)
- Milestone 5: AI Backend (OpenAI, embeddings, chat-edit API)
- Milestone 6: Telecom Integration (Telnyx SMS, Vapi Voice AI)
- Milestone 7: Automations (missed call text, drip campaigns)
- Milestone 8: Billing System (Stripe subscriptions, prepaid balance)
- Milestone 9: Onboarding Flow (multi-step wizard)
- Milestone 10: Polish & Launch

## Key Technical Decisions

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase PostgreSQL
- **Auth**: Clerk with Google OAuth
- **UI**: shadcn/ui + Tailwind + Framer Motion
- **Payments**: Stripe
- **Telecom**: Telnyx (NOT Twilio - 50% cheaper)
- **Voice AI**: Vapi (NOT Retell - cheaper at $0.05/min)
- **Jobs**: BullMQ + Upstash Redis
- **AI**: OpenAI GPT-4o-mini for chat editing
- **Email**: Resend
- **Calendar**: Google Calendar API
- **Deploy**: Vercel

### Pricing Tiers
- Text AI: $50/mo
- Voice AI: $75/mo
- Full AI Employee: $100/mo

### Billing Architecture (3 Streams)
1. Platform subscription (Stripe) - $50/$75/$100
2. Telecom usage (prepaid balance) - pay as you go
3. AI usage (after free tier) - 100 edits + 50 voice plays/month, unlimited testing

### Dashboard Structure (5 Tabs)
1. Home - Stats + activity feed
2. Inbox - Conversations (calls + texts)
3. Edit AI - Scripts + Voice only (simple, focused)
4. Data - Knowledge Base + Contacts (one-time uploads)
5. Account - Plan, balance, settings

**Design Philosophy:**
- Edit AI = Active configuration (scripts you edit frequently)
- Data = Passive uploads (knowledge base, contacts - set once)

### Onboarding (Required vs Skippable)
Required: Sign up, business info, plan, phone, payment, go live
Skippable: Teach AI, pick voice, import contacts

## Important Patterns

### Inbound vs Outbound (Key Concept)
**Voice AI:**
- Inbound: Customer calls → AI answers, handles questions, books appointments
- Outbound: AI calls customer → appointment reminders, follow-ups

**Text AI:**
- Inbound: Customer texts → AI auto-replies
- Outbound: Missed call text, drip campaigns (Day 1, 7, 21, 30), manual user texts

**Bookings tracked by source:**
- From inbound calls
- From outbound calls
- From inbound texts
- From outbound texts

### User Intervention (Manual Override)
Users can intervene at any time:
- **Manual texting**: Type & send from conversation view (via Telnyx)
- **Click-to-call**: User clicks → their phone rings → connected to contact
- All manual actions logged in conversation history

### Stats Drill-down
Clicking any stat card opens a slide-over panel showing:
- Inbound/outbound breakdown
- Recent items list
- Click to view full details in Inbox

### Feature Gating
- Text AI users: See text features only, voice shows "Upgrade"
- Voice AI users: See voice features only, text shows "Upgrade"
- Full users: See everything

### SMS Compliance
- MUST handle "STOP" → immediately opt out contact
- Required by TCPA law

### Balance at $0
- Pause automations (don't send texts/calls)
- But still allow inbound calls
- Show banner + send email

### Free Tier Tracking
```
organizations.ai_edits_remaining (default 100, resets monthly)
organizations.voice_plays_remaining (default 50, resets monthly)
organizations.daily_tests_count (resets daily, hidden cap at 50)
organizations.last_test_reset (timestamp for daily reset)
```

## Files Created

### Milestone 1
- `/CLAUDE.md` - This file
- `/PLAN.md` - Complete implementation plan

### Milestone 4
- `/src/components/edit/script-modal.tsx` - Unified Edit+Test modal with toggle
- `/src/components/edit/voice-selector-modal.tsx` - Voice selection with audio preview
- `/src/components/edit/knowledge-upload-modal.tsx` - File/URL/text knowledge upload
- `/src/components/edit/contacts-modal.tsx` - Contact list with import functionality
- `/src/app/dashboard/data/page.tsx` - Data page (Knowledge Base + Contacts)
- `/src/components/ui/table.tsx` - shadcn table component
- `/src/components/ui/radio-group.tsx` - shadcn radio group component

## Git Commits

After each milestone, commit with format:
`feat: [milestone] - [brief description]`

Example: `feat: foundation - auth, database, dashboard shell, landing page`

## Environment Variables Needed

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Telnyx
TELNYX_API_KEY=
TELNYX_PUBLIC_KEY=
TELNYX_WEBHOOK_SECRET=

# Vapi
VAPI_API_KEY=
VAPI_WEBHOOK_SECRET=

# OpenAI
OPENAI_API_KEY=

# Resend
RESEND_API_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Notes & Reminders

- Costs are $0/month until ~100 customers (all free tiers)
- 7-day free trial with card required
- Always filter queries by organization_id (multi-tenant)
- Verify all webhook signatures
- Use Zod for input validation
- Stream AI responses for better UX
