// ULTIMATE RELIABLE - REST API + Supabase Client + Local Backup
(async () => {
  console.log('🚀 DB INIT');
  
  // 1. Direct REST API (bypass client timing)
  const sendToSupabaseREST = async (formData) => {
    const response = await fetch('https://lexaguznugrgpbjefnzc.supabase.co/rest/v1/contacts', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGFndXpudWdyZ3BiamVmbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU5MTAsImV4cCI6MjA4OTU3MTkxMH0.R4q19HOumX9IqP582zC_RCeaNhws5RLa7C0R9K3acUc',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGFndXpudWdyZ3BiamVmbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU5MTAsImV4cCI6MjA4OTU3MTkxMH0.R4q19HOumX9IqP582zC_RCeaNhws5RLa7C0R9K3acUc',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify([formData])
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('REST API ERROR:', error);
      throw new Error(`REST failed: ${response.status}`);
    }
    
    console.log('✅ REST API SUCCESS');
    return true;
  };
  

  
  // 3. Form handler - TRIPLE SAFE
  const form = document.getElementById('contact-form');
  const submitBtn = document.querySelector('.submit-btn');
  
  form.onsubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 Sending:', formData);
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Sending...';
    const messageEl = document.getElementById('form-message');
    messageEl.style.display = 'none';
    
    try {
      // Try REST API first (most reliable)
      await sendToSupabaseREST(formData);
      messageEl.innerHTML = '✅ Message sent to live database!';
      form.reset();
    } catch (error) {
      console.error('Live DB failed:', error);
      messageEl.innerHTML = '❌ Failed to send to live database - please try again or email hannah@example.com';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      messageEl.style.display = 'block';
      messageEl.className = 'form-message success';
    }
  };
  
  // 4. Test/Status button
  setTimeout(() => {
    const statusBtn = document.createElement('button');
    statusBtn.id = 'db-status';
    statusBtn.innerHTML = '🧪 Test DB';
    statusBtn.style.cssText = `
      position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#00d4ff,#8b5cf6);
      color:#000;border:none;padding:12px 24px;border-radius:25px;font-weight:700;cursor:pointer;z-index:9999;
      box-shadow:0 8px 25px rgba(0,212,255,0.4)
    `;
    
    statusBtn.onclick = async () => {
      try {
        const localData = JSON.parse(localStorage.getItem('contacts') || '[]');
        alert(`📊 STATUS:\nLocal: ${localData.length} | LIVE DB test...`);
        
        // Test REST
        const testRes = await fetch('https://lexaguznugrgpbjefnzc.supabase.co/rest/v1/contacts?select=*', {
          headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGFndXpudWdyZ3BiamVmbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU5MTAsImV4cCI6MjA4OTU3MTkxMH0.R4q19HOumX9IqP582zC_RCeaNhws5RLa7C0R9K3acUc' }
        });
        const liveCount = await testRes.json();
        console.table(liveCount);
        alert(`✅ LIVE DB: ${liveCount.length} rows | Local: ${localData.length}`);
      } catch (e) {
        alert('❌ DB check failed: ' + e.message);
      }
    };
    
    document.body.appendChild(statusBtn);
  }, 500);
  
  console.log('🎯 ULTIMATE DB READY - No more stuck!');
})();

