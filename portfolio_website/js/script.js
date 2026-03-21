// FIXED: No ES6 modules, pure browser JS for file:// + Supabase CDN
// Mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.onclick = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.onclick = () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        };
    });
}

// Navbar
window.onscroll = () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.background = window.scrollY > 100 ? 'rgba(10,10,21,0.98)' : 'rgba(10,10,21,0.92)';
};

// Smooth scroll
document.querySelectorAll('a[href^=\"#"]').forEach(a => {
    a.onclick = e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
    };
});

// Skills
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.progress').forEach(p => {
                p.style.width = p.dataset.width + '%';
            });
        }
    });
}, {threshold: 0.6});

document.querySelectorAll('.skill-category').forEach(c => observer.observe(c));

// SUPABASE FORM (Direct CDN - no modules)
let supabase = null;
const form = document.getElementById('contact-form');
const msgDiv = document.getElementById('form-message');
const btn = document.querySelector('.submit-btn');

async function getSupabase() {
    if (supabase) return supabase;
    
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase CDN missing');
        return null;
    }
    
    supabase = window.supabase.createClient(
        'https://lexaguznugrgpbjefnzc.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGFndXpudWdyZ3BiamVmbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU5MTAsImV4cCI6MjA4OTU3MTkxMH0.R4q19HOumX9IqP582zC_RCeaNhws5RLa7C0R9K3acUc'
    );
    
    console.log('✅ Supabase ready');
    return supabase;
}

if (form) {
    form.onsubmit = async e => {
        e.preventDefault();
        
        const data = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        if (!data.name || !data.email || !data.message || !/\S+@\S+\.\S+/.test(data.email)) {
            showMsg('Fill all fields + valid email', 'error');
            return;
        }
        
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        
        try {
            const client = await getSupabase();
            if (client) {
                const {data: result, error} = await client
                    .from('contacts')
                    .insert([{name: data.name, email: data.email, message: data.message}]);
                
                if (error) throw error;
                
                console.log('✅ LIVE DATA:', result);
                showMsg('🎉 Saved to Supabase database!', 'success');
            }
        } catch (e) {
            console.error('DB Error:', e);
            // localStorage fallback
            let subs = JSON.parse(localStorage.getItem('subs') || '[]');
            subs.unshift(data);
            localStorage.setItem('subs', JSON.stringify(subs));
            showMsg('💾 Saved locally', 'success');
        } finally {
            form.reset();
            btn.disabled = false;
            btn.innerHTML = original;
        }
    };
}

function showMsg(text, type) {
    if (msgDiv) {
        msgDiv.textContent = text;
        msgDiv.className = `form-message ${type}`;
        msgDiv.style.display = 'block';
        if (type === 'success') setTimeout(() => msgDiv.style.display = 'none', 4e3);
    }
}

// VIEW BUTTON (BOTTOM RIGHT - GUARANTEED)
setTimeout(() => { // Wait DOM
    const btn = document.createElement('button');
    btn.textContent = '📊 View Data';
    btn.id = 'db-btn';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '25px',
        right: '25px',
        zIndex: '99999',
        background: 'linear-gradient(135deg, #5b3fd8, #8b5cf6)',
        color: 'white',
        border: 'none',
        padding: '15px 25px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        fontSize: '14px',
        boxShadow: '0 10px 30px rgba(91,63,216,0.5)',
        transition: 'all 0.3s'
    });
    
    btn.onmouseover = () => btn.style.transform = 'translateY(-5px)';
    btn.onmouseout = () => btn.style.transform = '';
    
    btn.onclick = async () => {
        const client = await getSupabase();
        if (client) {
            const {data, error, count} = await client.from('contacts').select('*').limit(100);
            console.group('📋 SUPABASE DATA:');
            console.table(data || []);
            console.groupEnd();
            alert(`📊 ${data?.length || 0} records\nF12 Console ← Table data`);
        } else {
            const local = JSON.parse(localStorage.getItem('subs') || '[]');
            console.table(local);
            alert(`Local: ${local.length}`);
        }
    };
    
    document.body.appendChild(btn);
    console.log('✅ VIEW BUTTON added - bottom right!');
}, 500);

// Parallax
window.onscroll = () => {
    document.querySelector('.hero')?.style.setProperty('transform', `translateY(${window.scrollY * -0.4}px)`);
};
