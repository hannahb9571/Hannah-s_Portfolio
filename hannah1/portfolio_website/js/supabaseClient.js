// Supabase Client Configuration
// ⚠️ For production: Move keys to environment variables/serverless function
const SUPABASE_URL = 'https://lexaguznugrgpbjefnzc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGFndXpudWdyZ3BiamVmbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU5MTAsImV4cCI6MjA4OTU3MTkxMH0.R4q19HOumX9IqP582zC_RCeaNhws5RLa7C0R9K3acUc';

export const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function createSupabaseClient(url, key) {
    // Check if Supabase script loaded
    if (typeof window !== 'undefined' && window.supabase) {
        return window.supabase.createClient(url, key);
    }
    throw new Error('Supabase client not loaded. Add <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> to HTML');
}
