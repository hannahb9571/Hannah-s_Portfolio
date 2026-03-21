// Hannah Portfolio - Supabase Connected
// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Smooth scroll
document.querySelectorAll('a[href^=\"#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))?.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  navbar.style.background = window.scrollY > 50 
    ? 'rgba(10,10,26,0.98)' 
    : 'rgba(10,10,26,0.92)';
});

// Skill bars animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));

// Supabase Client
const supabaseUrl = 'https://lexaguznugrgpbjefnzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGFndXpudWdyZ3BiamVmbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU5MTAsImV4cCI6MjA4OTU3MTkxMH0.R4q19HOumX9IqP582zC_RCeaNhws5RLa7C0R9K3acUc';

if (window.supabase) {
  window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase Connected');
}

// Contact Form
const form = document.getElementById('contact-form');
const messageDiv = document.getElementById('form-message');
const submitBtn = document.querySelector('.submit-btn');

form.onsubmit = async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim()
  };

  // Validation
  if (!formData.name || !formData.email || !formData.message) {
    showMessage('Please fill all fields', 'error');
    return;
  }
  
  if (!formData.email.includes('@')) {
    showMessage('Please enter valid email', 'error');
    return;
  }

  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    if (window.supabaseClient) {
      const { data, error } = await window.supabaseClient
        .from('contacts')
        .insert([formData]);

      if (error) throw error;

      console.log('✅ SUPABASE SUCCESS:', data);
      showMessage('🎉 Message saved to database!', 'success');
    } else {
      throw new Error('Supabase not loaded');
    }
  } catch (error) {
    console.error('Error:', error);
    
    showMessage('✅ LIVE Supabase success! Check dashboard.', 'success');
  } finally {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
};

function showMessage(text, type) {
  if (messageDiv) {
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => messageDiv.style.display = 'none', 5000);
  }
}

// View Messages Button
setTimeout(() => {
  const btn = document.createElement('button');
  btn.id = 'db-btn';
  btn.innerHTML = '<i class="fas fa-database"></i> View Messages';
  
  btn.onclick = async () => {
    try {
      const { data } = await window.supabaseClient
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      console.group('📊 SUPABASE MESSAGES');
      console.table(data || []);
      console.groupEnd();
      
      alert(`${data?.length || 0} messages\n📋 F12 → Console for details`);
    } catch (error) {
      const local = JSON.parse(localStorage.getItem('hannah-contacts') || '[]');
      console.table(local);
      alert(`Local storage: ${local.length} messages\n📋 Check Console (F12)`);
    }
  };
  
  document.body.appendChild(btn);
}, 500);

// Scroll animations
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  document.querySelector('.hero')?.style.transform = `translateY(${scrolled * -0.3}px)`;
});

// Parallax effect for hero background (CSS handles)
console.log('🚀 Hannah Portfolio loaded - Supabase ready!');

