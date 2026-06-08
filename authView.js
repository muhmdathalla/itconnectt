/* ========================================
   ITConnect — Auth Views (Login / Register)
   ======================================== */

const AuthView = {

  renderLogin() {
    return `
    <div class="min-h-screen flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <a href="#/" class="nav-logo justify-center text-2xl mb-4 inline-flex">
            <span class="logo-icon"><i data-lucide="zap" class="w-5 h-5"></i></span>
            IT<span class="text-cyan-400">Connect</span>
          </a>
          <h1 class="text-2xl font-black text-white mt-4">Selamat Datang Kembali</h1>
          <p class="text-slate-400 mt-1 text-sm">Masuk ke akun ITConnect kamu</p>
        </div>

        <!-- Demo credentials -->
        <div class="glass-card rounded-xl p-4 mb-6 border border-cyan-500/20">
          <div class="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1.5">
            <i data-lucide="info" class="w-3.5 h-3.5"></i> Demo Akun Tersedia
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="AuthView.fillDemo('mahasiswa@demo.com','demo123')" class="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-xs">
              <div class="text-white font-medium">👨‍💻 Mahasiswa</div>
              <div class="text-slate-400">mahasiswa@demo.com</div>
            </button>
            <button onclick="AuthView.fillDemo('klien@demo.com','demo123')" class="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-xs">
              <div class="text-white font-medium">🏢 Klien</div>
              <div class="text-slate-400">klien@demo.com</div>
            </button>
          </div>
        </div>

        <form id="login-form" class="space-y-4">
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-icon-wrapper">
              <i data-lucide="mail" class="input-icon"></i>
              <input type="email" id="login-email" placeholder="email@example.com" class="form-input pl-10" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-icon-wrapper">
              <i data-lucide="lock" class="input-icon"></i>
              <input type="password" id="login-password" placeholder="Password kamu" class="form-input pl-10" required>
              <button type="button" id="toggle-pw" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" class="form-checkbox rounded">
              <span class="text-slate-400">Ingat saya</span>
            </label>
            <a href="#" class="text-cyan-400 hover:underline">Lupa password?</a>
          </div>
          <button type="submit" class="btn-primary w-full py-3 rounded-xl font-semibold">
            <i data-lucide="log-in" class="w-5 h-5 inline mr-2"></i> Masuk
          </button>
        </form>

        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 border-t border-white/10"></div>
          <span class="text-slate-500 text-sm">atau</span>
          <div class="flex-1 border-t border-white/10"></div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button onclick="UI.toast('Google login akan segera hadir!','info')" class="social-btn">
            <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button onclick="UI.toast('GitHub login akan segera hadir!','info')" class="social-btn">
            <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            GitHub
          </button>
        </div>

        <p class="text-center text-slate-400 text-sm mt-6">
          Belum punya akun? <a href="#/register" class="text-cyan-400 font-medium hover:underline">Daftar gratis</a>
        </p>
      </div>
    </div>`;
  },

  renderRegister() {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const defaultRole = params.get('role') || 'mahasiswa';
    return `
    <div class="min-h-screen flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-lg">
        <div class="text-center mb-8">
          <a href="#/" class="nav-logo justify-center text-2xl mb-4 inline-flex">
            <span class="logo-icon"><i data-lucide="zap" class="w-5 h-5"></i></span>
            IT<span class="text-cyan-400">Connect</span>
          </a>
          <h1 class="text-2xl font-black text-white mt-4">Buat Akun Baru</h1>
          <p class="text-slate-400 mt-1 text-sm">Gratis! Tidak perlu kartu kredit</p>
        </div>

        <!-- Role Selector -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <button id="role-mhs" onclick="AuthView.selectRole('mahasiswa')"
            class="role-btn ${defaultRole === 'mahasiswa' ? 'role-btn-active' : ''}">
            <i data-lucide="graduation-cap" class="w-6 h-6 mb-2"></i>
            <div class="font-semibold">Mahasiswa IT</div>
            <div class="text-xs opacity-70 mt-1">Cari proyek & bangun portfolio</div>
          </button>
          <button id="role-klien" onclick="AuthView.selectRole('klien')"
            class="role-btn ${defaultRole === 'klien' ? 'role-btn-active' : ''}">
            <i data-lucide="briefcase" class="w-6 h-6 mb-2"></i>
            <div class="font-semibold">Klien / Bisnis</div>
            <div class="text-xs opacity-70 mt-1">Post proyek & hire talent</div>
          </button>
        </div>
        <input type="hidden" id="reg-role" value="${defaultRole}">

        <form id="register-form" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Nama Lengkap *</label>
              <div class="input-icon-wrapper">
                <i data-lucide="user" class="input-icon"></i>
                <input type="text" id="reg-name" placeholder="Nama kamu" class="form-input pl-10" required>
              </div>
            </div>
            <div class="form-group" id="company-field" style="display:${defaultRole==='klien'?'block':'none'}">
              <label class="form-label">Nama Perusahaan</label>
              <div class="input-icon-wrapper">
                <i data-lucide="building-2" class="input-icon"></i>
                <input type="text" id="reg-company" placeholder="PT/CV/Startup..." class="form-input pl-10">
              </div>
            </div>
            <div class="form-group" id="university-field" style="display:${defaultRole==='mahasiswa'?'block':'none'}">
              <label class="form-label">Universitas *</label>
              <div class="input-icon-wrapper">
                <i data-lucide="book-open" class="input-icon"></i>
                <input type="text" id="reg-university" placeholder="Nama universitas" class="form-input pl-10">
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email *</label>
            <div class="input-icon-wrapper">
              <i data-lucide="mail" class="input-icon"></i>
              <input type="email" id="reg-email" placeholder="email@example.com" class="form-input pl-10" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Nomor HP</label>
            <div class="input-icon-wrapper">
              <i data-lucide="phone" class="input-icon"></i>
              <input type="tel" id="reg-phone" placeholder="08xxxxxxxxxx" class="form-input pl-10">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password *</label>
            <div class="input-icon-wrapper">
              <i data-lucide="lock" class="input-icon"></i>
              <input type="password" id="reg-password" placeholder="Minimal 6 karakter" class="form-input pl-10" required>
              <button type="button" id="toggle-reg-pw" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
            <div id="pw-strength" class="mt-1.5 flex gap-1 h-1">
              <div class="strength-bar"></div><div class="strength-bar"></div>
              <div class="strength-bar"></div><div class="strength-bar"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Konfirmasi Password *</label>
            <div class="input-icon-wrapper">
              <i data-lucide="lock-keyhole" class="input-icon"></i>
              <input type="password" id="reg-confirm" placeholder="Ulangi password" class="form-input pl-10" required>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input type="checkbox" id="reg-agree" class="form-checkbox mt-0.5 flex-shrink-0" required>
            <label for="reg-agree" class="text-sm text-slate-400 cursor-pointer">
              Saya menyetujui <a href="#" class="text-cyan-400 hover:underline">Syarat & Ketentuan</a> dan <a href="#" class="text-cyan-400 hover:underline">Kebijakan Privasi</a> ITConnect.
            </label>
          </div>

          <button type="submit" class="btn-primary w-full py-3 rounded-xl font-semibold">
            <i data-lucide="user-plus" class="w-5 h-5 inline mr-2"></i> Buat Akun Gratis
          </button>
        </form>

        <p class="text-center text-slate-400 text-sm mt-6">
          Sudah punya akun? <a href="#/login" class="text-cyan-400 font-medium hover:underline">Masuk di sini</a>
        </p>
      </div>
    </div>`;
  },

  fillDemo(email, pass) {
    const emailEl = document.getElementById('login-email');
    const passEl = document.getElementById('login-password');
    if (emailEl) emailEl.value = email;
    if (passEl) passEl.value = pass;
  },

  selectRole(role) {
    const input = document.getElementById('reg-role');
    if (input) input.value = role;
    document.getElementById('role-mhs')?.classList.toggle('role-btn-active', role === 'mahasiswa');
    document.getElementById('role-klien')?.classList.toggle('role-btn-active', role === 'klien');
    document.getElementById('university-field').style.display = role === 'mahasiswa' ? 'block' : 'none';
    document.getElementById('company-field').style.display = role === 'klien' ? 'block' : 'none';
  },

  initLogin() {
    // Toggle password visibility
    document.getElementById('toggle-pw')?.addEventListener('click', () => {
      const input = document.getElementById('login-password');
      const icon = document.querySelector('#toggle-pw i');
      if (input.type === 'password') { input.type = 'text'; icon.setAttribute('data-lucide', 'eye-off'); }
      else { input.type = 'password'; icon.setAttribute('data-lucide', 'eye'); }
      lucide.createIcons({ nodes: [document.getElementById('toggle-pw')] });
    });

    document.getElementById('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;
      const btn = e.target.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.innerHTML = '<div class="loading-spinner-sm inline-block mr-2"></div> Memproses...';
      setTimeout(() => {
        App.login(email, pass);
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="log-in" class="w-5 h-5 inline mr-2"></i> Masuk';
        lucide.createIcons({ nodes: [btn] });
      }, 600);
    });
  },

  initRegister() {
    // Toggle password
    document.getElementById('toggle-reg-pw')?.addEventListener('click', () => {
      const input = document.getElementById('reg-password');
      input.type = input.type === 'password' ? 'text' : 'password';
      const icon = document.querySelector('#toggle-reg-pw i');
      icon.setAttribute('data-lucide', input.type === 'password' ? 'eye' : 'eye-off');
      lucide.createIcons({ nodes: [document.getElementById('toggle-reg-pw')] });
    });

    // Password strength
    document.getElementById('reg-password')?.addEventListener('input', (e) => {
      const val = e.target.value;
      const bars = document.querySelectorAll('.strength-bar');
      let strength = 0;
      if (val.length >= 6) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500'];
      bars.forEach((bar, i) => {
        bar.className = `strength-bar ${i < strength ? colors[strength - 1] : 'bg-white/10'}`;
      });
    });

    document.getElementById('register-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      if (password !== confirm) { UI.toast('Password tidak cocok!', 'error'); return; }
      if (password.length < 6) { UI.toast('Password minimal 6 karakter!', 'error'); return; }
      const role = document.getElementById('reg-role').value;
      const btn = e.target.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.innerHTML = '<div class="loading-spinner-sm inline-block mr-2"></div> Membuat akun...';
      setTimeout(() => {
        App.register({
          name: document.getElementById('reg-name').value.trim(),
          email: document.getElementById('reg-email').value.trim(),
          password,
          phone: document.getElementById('reg-phone')?.value.trim() || '',
          role,
          university: document.getElementById('reg-university')?.value.trim() || '',
          company: document.getElementById('reg-company')?.value.trim() || '',
        });
        btn.disabled = false;
      }, 800);
    });
  }
};

window.AuthView = AuthView;
