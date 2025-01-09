import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables')
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('Starting git operation...');
    
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid token')
    }

    console.log('User authenticated:', user.id)

    // Get GitHub token
    const githubToken = Deno.env.get('GITHUB_PAT')
    if (!githubToken) {
      throw new Error('GitHub token not configured')
    }

    // Get request data
    const { branch = 'main', operation = 'push', logId, validateOnly = false } = await req.json()
    const repoOwner = 'imedia765'
    const repoName = 's-935078'
    const repoUrl = `https://${githubToken}@github.com/${repoOwner}/${repoName}.git`

    // Verify GitHub token is valid
    console.log('Verifying GitHub token...')
    const tokenCheckResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Supabase-Edge-Function'
      }
    })

    if (!tokenCheckResponse.ok) {
      const tokenError = await tokenCheckResponse.text()
      throw new Error(`Invalid GitHub token: ${tokenError}`)
    }
    console.log('GitHub token verified')

    // Get the current commit SHA
    console.log('Fetching current commit SHA...')
    const refResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/${branch}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Supabase-Edge-Function'
        }
      }
    )

    if (!refResponse.ok) {
      const refError = await refResponse.text()
      console.error('Failed to get ref:', refError)
      throw new Error(`Failed to get current commit SHA: ${refError}`)
    }

    const refData = await refResponse.json()
    const currentSha = refData.object.sha
    console.log('Current commit SHA:', currentSha)

    // If only validating access, return here
    if (validateOnly) {
      if (logId) {
        await supabase
          .from('git_operations_logs')
          .update({
            status: 'completed',
            message: `Successfully verified access to ${repoOwner}/${repoName}:${branch}`
          })
          .eq('id', logId)
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: `Successfully verified access to ${repoOwner}/${repoName}:${branch}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create an empty commit
    console.log('Creating empty commit...')
    const commitResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Supabase-Edge-Function',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Force commit: Pushing all files',
          tree: refData.object.sha,
          parents: [currentSha]
        })
      }
    )

    if (!commitResponse.ok) {
      const commitError = await commitResponse.text()
      throw new Error(`Failed to create commit: ${commitError}`)
    }

    const commitData = await commitResponse.json()
    console.log('Empty commit created:', commitData.sha)

    // Force push the new commit
    console.log('Force pushing to repository...')
    const pushResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/${branch}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Supabase-Edge-Function',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sha: commitData.sha,
          force: true
        })
      }
    )

    if (!pushResponse.ok) {
      const pushError = await pushResponse.text()
      throw new Error(`Push operation failed: ${pushError}`)
    }

    console.log('Force push successful')

    // Update log with success
    if (logId) {
      await supabase
        .from('git_operations_logs')
        .update({
          status: 'completed',
          message: `Successfully ${operation}ed to ${repoOwner}/${repoName}:${branch}`
        })
        .eq('id', logId)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        pushCompleted: true,
        message: `Successfully ${operation}ed to ${repoOwner}/${repoName}:${branch}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in git-operations:', error)

    // Update log with error if logId exists
    const { logId } = await req.json().catch(() => ({}))
    if (logId) {
      await supabase
        .from('git_operations_logs')
        .update({
          status: 'failed',
          message: 'Operation failed',
          error_details: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', logId)
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})