# Google Auth Fix Guide

1. Go to console.cloud.google.com
2. Go to APIs & Services > Credentials
3. Find your OAuth 2.0 Client IDs
4. Click to edit it
5. Under "Authorized JavaScript origins" ADD:
   https://careerguide-phi.vercel.app

6. Under "Authorized redirect URIs" ADD:
   https://zksgxdjrjvbpjzjvneux.supabase.co/auth/v1/callback

7. Save
8. In Supabase Dashboard -> Authentication -> Providers -> Google:
   Make sure you paste the new/updated Client ID and Secret if you regenerate them.
