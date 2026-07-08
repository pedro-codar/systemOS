'use server'

import { createClient } from '@/lib/supabase/server'

export async function triggerEmbedding(entry_id: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // verify entry belongs to user's company
  const { data: entry } = await supabase
    .from('knowledge_entries')
    .select('id')
    .eq('id', entry_id)
    .single()

  // RLS already ensures they can only see their own company's entries
  if (!entry) return { error: 'Entry not found' }

  // safe to call n8n now
  await fetch(process.env.N8N_WEBHOOK_URL_KNOWLEDGE!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ entry_id })
  })

  return { success: true }
}