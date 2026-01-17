import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error && (error.code === 'PGRST116' || error.code === 'PGRST116' || error.message?.includes('0 rows'))) {
      console.log('User credits not found, attempting to create...')
      
      const { data: insertData, error: insertError } = await supabase.rpc('handle_new_user_credits', {
        p_user_id: user.id
      })

      if (insertError) {
        console.error('Error creating user credits via RPC:', insertError)
        return NextResponse.json(
          { error: 'Failed to create user credits' },
          { status: 500 }
        )
      }

      data = insertData
      error = null
    }

    if (error) {
      console.error('Error fetching user credits:', error)
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in credits API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
