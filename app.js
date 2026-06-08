/* ========================================
   ITConnect — Router & App Core
   ======================================== */

const Router = {
  routes: {},

  add(path, fn) { this.routes[path] = fn; },

  go(path) {
    window.location.hash = '#' + path;
  },

  getCurrentPath() {
    const hash = window.location.hash || '#/';
    return hash.slice(1); // remove '#'
  },

  async dispatch() {
    const root = document.getElementById('app-root');
    if (!root) return;

    const fullPath = this.getCurrentPath();
    const segments = fullPath.split('/').filter(Boolean);
    const basePath = '/' + (segments[0] || '');
    const param = segments[1] || null;

    // Scroll to top
    window.scrollTo(0, 0);

    // Re-render nav
    UI.renderNav();

    // Find and execute route
    let handled = false;
    const dynamicRoutes = ['/project', '/profile'];

    for (const routePath of Object.keys(this.routes)) {
      const isMatch = routePath === fullPath ||
        (dynamicRoutes.includes(routePath) && basePath === routePath);
      if (isMatch) {
        try {
          root.innerHTML = '<div class="flex items-center justify-center min-h-screen"><div class="loading-spinner"></div></div>';
          await this.routes[routePath](param);
          handled = true;
        } catch (e) {
          console.error('Route error:', e);
          root.innerHTML = Views.error('Terjadi kesalahan. Silakan coba lagi.');
        }
        break;
      }
    }

    if (!handled) {
      if (this.routes[basePath]) {
        try {
          root.innerHTML = '<div class="flex items-center justify-center min-h-screen"><div class="loading-spinner"></div></div>';
          await this.routes[basePath](param);
        } catch(e) {
          root.innerHTML = Views.error();
        }
      } else {
        root.innerHTML = Views.notFound();
      }
    }

    // Always reinit Lucide icons
    if (window.lucide) lucide.createIcons();
  },

  init() {
    window.addEventListener('hashchange', () => this.dispatch());
    this.dispatch();
  }
};

// ── VIEWS DISPATCHER ────────────────────────────────────────────
const Views = {
  error(msg = 'Terjadi kesalahan.') {
    return `<div class="flex flex-col items-center justify-center min-h-screen gap-4">
      <i data-lucide="alert-circle" class="w-12 h-12 text-red-400"></i>
      <p class="text-slate-300">${msg}</p>
      <a href="#/" class="btn-primary px-4 py-2 rounded-xl">Kembali ke Beranda</a>
    </div>`;
  },

  notFound() {
    return `<div class="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <div class="text-8xl font-black text-cyan-400/20">404</div>
      <h2 class="text-2xl font-bold text-white">Halaman Tidak Ditemukan</h2>
      <p class="text-slate-400">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <a href="#/" class="btn-primary px-6 py-2.5 rounded-xl">Kembali ke Beranda</a>
    </div>`;
  }
};

// ── AUTH GUARDS ──────────────────────────────────────────────────
function requireAuth() {
  const user = Store.getCurrentUser();
  if (!user) { Router.go('/login'); return null; }
  return user;
}

function requireRole(role) {
  const user = requireAuth();
  if (!user) return null;
  if (user.role !== role) {
    UI.toast('Akses ditolak untuk role kamu.', 'error');
    Router.go('/dashboard');
    return null;
  }
  return user;
}

// ── APP ──────────────────────────────────────────────────────────
const App = {
  init() {
    // Seed data on first load
    Store.seed();

    // Set up routes
    Router.add('/', () => { document.getElementById('app-root').innerHTML = HomeView.render(); HomeView.init(); });
    Router.add('/login', () => { document.getElementById('app-root').innerHTML = AuthView.renderLogin(); AuthView.initLogin(); });
    Router.add('/register', () => { document.getElementById('app-root').innerHTML = AuthView.renderRegister(); AuthView.initRegister(); });
    Router.add('/dashboard', () => { document.getElementById('app-root').innerHTML = DashboardView.render(); DashboardView.init(); });
    Router.add('/browse', () => { document.getElementById('app-root').innerHTML = BrowseView.render(); BrowseView.init(); });
    Router.add('/project', (id) => { document.getElementById('app-root').innerHTML = ProjectView.render(id); ProjectView.init(id); });
    Router.add('/post-project', () => { document.getElementById('app-root').innerHTML = PostProjectView.render(); PostProjectView.init(); });
    Router.add('/profile', (id) => { document.getElementById('app-root').innerHTML = ProfileView.render(id); ProfileView.init(id); });
    Router.add('/messages', (convId) => { document.getElementById('app-root').innerHTML = MessagesView.render(convId); MessagesView.init(convId); });
    Router.add('/payment', () => { document.getElementById('app-root').innerHTML = PaymentView.render(); PaymentView.init(); });
    Router.add('/notifications', () => { document.getElementById('app-root').innerHTML = NotificationsView.render(); NotificationsView.init(); });
    Router.add('/settings', () => { document.getElementById('app-root').innerHTML = SettingsView.render(); SettingsView.init(); });
    Router.add('/about', () => { document.getElementById('app-root').innerHTML = AboutView.render(); });

    // Modal close on overlay click
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) UI.closeModal();
    });

    // Init router
    Router.init();
  },

  login(email, password) {
    const user = Store.getUserByEmail(email);
    if (!user || !Store.verifyPassword(user, password)) {
      UI.toast('Email atau password salah.', 'error');
      return false;
    }
    Store.setCurrentUser(user);
    UI.toast(`Selamat datang, ${user.name.split(' ')[0]}! 👋`, 'success');
    Router.go('/dashboard');
    return true;
  },

  register(data) {
    const existing = Store.getUserByEmail(data.email);
    if (existing) { UI.toast('Email sudah terdaftar.', 'error'); return false; }
    const user = Store.createUser(data);
    Store.setCurrentUser(user);
    Store.createNotification(user.id, 'system', 'Selamat Datang di ITConnect! 🎉',
      'Akun kamu berhasil dibuat. Lengkapi profil untuk meningkatkan kepercayaan klien.', '#/profile');
    UI.toast(`Akun berhasil dibuat! Selamat bergabung 🎉`, 'success');
    Router.go('/dashboard');
    return true;
  },

  logout() {
    UI.confirm('Yakin mau keluar dari ITConnect?', () => {
      Store.clearCurrentUser();
      UI.toast('Berhasil keluar. Sampai jumpa!', 'info');
      Router.go('/');
    }, { title: 'Keluar', confirmText: 'Ya, Keluar' });
  }
};

window.Router = Router;
window.App = App;
window.requireAuth = requireAuth;
window.requireRole = requireRole;
window.Views = Views;
