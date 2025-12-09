import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST() {
  try {
    const { userId } = auth()

    if (!userId) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    const user = await currentUser()

    if (!user) {
      return jsonResponse({ error: 'User not found' }, 404)
    }

    // Create Supabase client directly to avoid type issues
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, organization_id')
      .eq('clerk_id', userId)
      .single()

    if (existingUser) {
      // User already exists, fetch their organization
      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', existingUser.organization_id)
        .single()

      return jsonResponse({
        user: existingUser,
        organization: org,
        isNew: false
      })
    }

    // Create new organization for the user
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: `${user.firstName || 'My'}'s Business`,
        owner_clerk_id: userId,
      })
      .select()
      .single()

    if (orgError || !org) {
      console.error('Error creating organization:', orgError)
      return jsonResponse({ error: 'Failed to create organization' }, 500)
    }

    // Create user record
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        clerk_id: userId,
        organization_id: org.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        first_name: user.firstName,
        last_name: user.lastName,
        role: 'owner',
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user:', userError)
      return jsonResponse({ error: 'Failed to create user' }, 500)
    }

    return jsonResponse({
      user: newUser,
      organization: org,
      isNew: true
    })
  } catch (error) {
    console.error('Sync error:', error)
    return jsonResponse({ error: 'Internal server error' }, 500)
  }
}
