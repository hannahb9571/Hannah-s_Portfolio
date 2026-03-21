// SIMPLEST Supabase Fix - GitHub Pages Compatible
(async () => {
  // Wait DOM + Supabase
  await new Promise(r => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', r) : r());
  
  // Create client IMMEDIATE (no timing issues)
  const { createClient } = supabase;
  window.supabaseClient = createClient(
    'https://lexaguznugrgpbjefnzc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGFndXpudWdyZ3BiamVmbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU5MTAsImV4cCI6MjA4OTU3MTkxMH0.R4q19HOumX9IqP582zC_RCeaNhws5RLa7C0R9K3acUc'
  );
  
  console.log('🔥 Supabase ready!');
  
  const form = document.getElementById('contact-form');
  const submitBtn = document.querySelector('.submit-btn');
  
  form.onsubmit = async e => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Sending...';
    
    try {
      const { error } = await window.supabaseClient
        .from('contacts')
        .insert(formData);
      
      if (error) throw error;
      
      document.getElementById('form-message').innerHTML = '✅ Sent to LIVE database!';
      form.reset();
    } catch (error) {
      console.error(error);
      document.getElementById('form-message').innerHTML = `Error: ${error.message}`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message ✈️';
    }
  };
  
  // Test button
  setTimeout(() => {
    const testBtn = document.createElement('button');
    testBtn.textContent = 'Test DB';
    testBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#00d4ff;color:#000;padding:10px 20px;border:none;border-radius:20px;cursor:pointer;z-index:999';
    testBtn.onclick = async () => {
      const { data } = await window.supabaseClient.from('contacts').select();
      console.table(data);
      alert(data?.length || 0 + ' messages in DB');
    };
    document.body.append(testBtn);
  }, 1000);
})();

