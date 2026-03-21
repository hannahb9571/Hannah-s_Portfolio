// FIXED Supabase Form - No reset + Better errors + GitHub Pages safe
console.log('🔧 Loading Hannah Portfolio v2.0...');

let supabaseClient = null;

// Wait for DOM + Supabase CDN
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM ready');
  
  // Wait for Supabase CDN (max 5s)
  let attempts = 0;
  while (!window.supabase && attempts < 50) {
    await new Promise(r => setTimeout(r, 100));
    attempts++;
  }
  
  if (window.supabase) {
    const supabaseUrl = 'https://lexaguznugrgpbjefnzc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGFndXpudWdyZ3BiamVmbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU5MTAsImV4cCI6MjA4OTU3MTkxMH0.R4q19HOumX9IqP582zC_RCeaNhws5RLa7C0R9K3acUc';
    
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created');
    
    // Test table exists
    try {
      const { data, error } = await supabaseClient
        .from('contacts')
        .select('count', { count: 'exact', head: true });
      
      if (error) throw error;
      console.log('📊 Table ready:', data);
    } catch (e) {
      console.error('❌ Table error - Check RLS:', e.message);
    }
  } else {
    console.error('❌ Supabase CDN failed to load');
  }
  
  initApp();
});

function initApp() {
  // Mobile menu
  document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.toggle('active');
  });

  // Smooth scroll
  document.querySelectorAll('a[href^=\"#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Form handler (no early reset!)
  const form = document.getElementById('contact-form');
  const submitBtn = document.querySelector('.submit-btn');
  const messageDiv = document.getElementById('form-message');

  form.onsubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Form submit started');

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim(),
      created_at: new Date().toISOString()
    };

    console.log('📤 Data:', formData);

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      showMessage('Please fill all fields', 'error');
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      if (!supabaseClient) {
        throw new Error('Supabase not ready');
      }

      console.log('🚀 Sending to Supabase...');
      const { data, error } = await supabaseClient
        .from('contacts')
        .insert([formData]);

      console.log('📨 Response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Database error');
      }

      showMessage('✅ Message saved to LIVE database!', 'success');
      form.reset();  // Only reset on SUCCESS
      console.log('✅ Full success flow');

    } catch (error) {
      console.error('❌ Full error:', error);
      
      // Save to localStorage for demo
      const submissions = JSON.parse(localStorage.getItem('hannah_contacts') || '[]');
      submissions.unshift(formData);
      localStorage.setItem('hannah_contacts', JSON.stringify(submissions.slice(0, 50))); // Limit
      
      showMessage(`💾 Saved locally (${submissions.length + 1} total) - Error: ${error.message.slice(0, 50)}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  };

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 6000);
  }

  // View data button
  setTimeout(() => {
    const btn = document.createElement('button');
    btn.id = 'db-btn';
    btn.innerHTML = '<i class="fas fa-database"></i> View Data';
    btn.onclick = async () => {
      console.group('📊 Database Check');
      
      if (supabaseClient) {
        try {
          const { data } = await supabaseClient
            .from('contacts')
            .select()
            .order('created_at', { ascending: false })
            .limit(10);
          console.table(data);
        } catch (e) {
          console.error('View error:', e);
        }
      }
      
      const local = JSON.parse(localStorage.getItem('hannah_contacts') || '[]');
      console.table(local);
      console.groupEnd();
      
      alert(`Supabase + Local: Check F12 Console`);
    };
    document.body.appendChild(btn);
  }, 1000);

  console.log('✅ App initialized');
}

// Global client access
window.hannahApp = { supabaseClient };

console.log('🔧 Script loaded');
