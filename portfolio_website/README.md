# 🚀 Hannah's Cybersecurity Portfolio - Supabase Connected! 🔒

**Cyberpunk purple theme** + **Live Supabase database** (no Python/server needed!)

## 🎯 Features
| Feature | Status |
|---------|--------|
| Pure JS + CDN Supabase | ✅ Live |
| Form → Supabase `contacts` table | ✅ Real DB |
| Fallback localStorage | ✅ Offline-safe |
| View submissions button | ✅ Console table |
| Purple cyberpunk theme | ✅ Readable |

## 🌐 Supabase Setup
```
✅ Project: https://lexaguznugrgpbjefnzc.supabase.co
✅ Anon key configured (client-side)
✅ Table: `contacts` (name, email, message, timestamp)
✅ RLS: Enable INSERT (Settings > Authentication > RLS)
```

## 🧪 Test Contact Form
1. **Submit message** → Goes to Supabase `contacts` table
2. **Click "View Messages"** → Shows DB count + console table
3. **Console**: `data` array from Supabase query
4. **Offline**: Saves to localStorage

## 📊 View Database (Supabase Dashboard)
```
1. Go to https://supabase.com/dashboard/project/lexaguznugrgpbjefnzc
2. Table Editor → contacts → See real submissions!
3. SQL Editor: SELECT * FROM contacts ORDER BY timestamp DESC;
```

## 🚀 Quick Commands
```cmd
REM Refresh site
start portfolio_website/index.html

REM Structure
dir portfolio_website /s

REM Open Supabase dashboard (copy to browser)
https://supabase.com/dashboard/project/lexaguznugrgpbjefnzc
```

## ⚠️ Production Notes
```
✅ Works now (public anon key)
⚠️ For prod: Use Supabase Edge Functions or Netlify Functions
   Move API key server-side (security)
✅ RLS policies: Allow public INSERT on contacts (or auth)
```

## 🎨 Customization
- Content: `index.html`
- Theme: `css/style.css` 
- Supabase logic: `js/script.js`

**Live database connected!** Test form → check Supabase dashboard. 🎉🔥
