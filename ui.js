/* ========================================
   ITConnect — UI Utilities
   ======================================== */

const UI = {

  // ── FORMATTERS ──────────────────────────────────────────────
  currency(amount) {
    if (!amount && amount !== 0) return 'Rp0';
    return 'Rp' + Number(amount).toLocaleString('id-ID');
  },

  date(ts) {
    if (!ts) return '-';
    return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  timeAgo(ts) {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    const hr = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);
    if (min < 1) return 'Baru saja';
    if (min < 60) return min + ' menit lalu';
    if (hr < 24) return hr + ' jam lalu';
    if (day < 7) return day + ' hari lalu';
    return UI.date(ts);
  },

  daysLeft(deadline) {
    const diff = deadline - Date.now();
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return 'Terlambat';
    if (days === 0) return 'Hari ini';
    return days + ' hari lagi';
  },

  stars(rating, max = 5) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < full; i++) html += '<i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i>';
    if (half) html += '<i data-lucide="star-half" class="w-3 h-3 fill-amber-400 text-amber-400"></i>';
    for (let i = full + (half ? 1 : 0); i < max; i++) html += '<i data-lucide="star" class="w-3 h-3 text-slate-600"></i>';
    return `<span class="inline-flex items-center gap-0.5">${html}</span>`;
  },

  avatar(user, size = 'md') {
    const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl', xl: 'w-20 h-20 text-2xl' };
    const cls = sizes[size] || sizes.md;
    if (user?.avatar) {
      return `<img src="${user.avatar}" class="${cls} rounded-full object-cover ring-1 ring-white/20" alt="${user.name}">`;
    }
    const initials = (user?.name || '?').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
    return `<div class="${cls} rounded-full bg-white/10 flex items-center justify-center font-bold text-white ring-1 ring-white/20 flex-shrink-0">${initials}</div>`;
  },

  categoryBadge(cat) {
    return `<span class="px-2 py-0.5 text-xs rounded-full border bg-white/10 text-white border-white/20">${cat}</span>`;
  },

  statusBadge(status) {
    const labels = { open: 'Open', 'in-progress': 'In Progress', completed: 'Selesai', cancelled: 'Dibatalkan' };
    return `<span class="px-2 py-0.5 text-xs rounded-full border bg-white/10 text-white border-white/20">${labels[status] || status}</span>`;
  },

  // ── TOAST ────────────────────────────────────────────────────
  toast(message, type = 'success', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
    const id = 'toast_' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl bg-black/90 border-white/20 text-white shadow-xl max-w-sm`;
    div.innerHTML = `<i data-lucide="${icons[type]}" class="w-5 h-5 flex-shrink-0"></i><span class="text-sm font-medium">${message}</span><button onclick="document.getElementById('${id}')?.remove()" class="ml-auto opacity-60 hover:opacity-100"><i data-lucide="x" class="w-4 h-4"></i></button>`;
    container.appendChild(div);
    if (window.lucide) lucide.createIcons({ nodes: [div] });
    setTimeout(() => { div.classList.add('toast-exit'); setTimeout(() => div.remove(), 300); }, duration);
  },

  // ── MODAL ────────────────────────────────────────────────────
  modal(content, opts = {}) {
    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    if (!overlay || !body) return;
    body.innerHTML = content;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    if (window.lucide) lucide.createIcons({ nodes: [body] });
    if (opts.onOpen) opts.onOpen();
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) { overlay.classList.add('hidden'); overlay.classList.remove('flex'); }
  },

  confirm(message, onConfirm, opts = {}) {
    UI.modal(`
      <div class="glass-card p-6 rounded-2xl max-w-sm w-full mx-4">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <i data-lucide="alert-triangle" class="w-5 h-5 text-white"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-white mb-1">${opts.title || 'Konfirmasi'}</h3>
            <p class="text-sm text-slate-400">${message}</p>
          </div>
        </div>
        <div class="flex gap-3 mt-5 justify-end">
          <button onclick="UI.closeModal()" class="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all">Batal</button>
          <button id="confirm-ok" class="btn-primary px-4 py-2 rounded-xl text-sm">${opts.confirmText || 'Oke'}</button>
        </div>
      </div>
    `);
    document.getElementById('confirm-ok')?.addEventListener('click', () => {
      UI.closeModal();
      onConfirm();
    });
  },

  // ── LOADING ──────────────────────────────────────────────────
  setLoading(bool) {
    const el = document.getElementById('page-loading');
    if (el) el.style.display = bool ? 'flex' : 'none';
  },

  // ── NAVIGATION (DOCK SYSTEM iOS 26) ──────────────────────────
  renderNav() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const user = Store.getCurrentUser();
    const notifCount = user ? Store.getUnreadCount(user.id) : 0;
    const msgCount = user ? Store.getTotalUnread(user.id) : 0;

    if (!user) {
      nav.innerHTML = `
        <div class="nav-container">
          <a href="#/" class="nav-logo">
            <span class="logo-icon"><i data-lucide="zap" class="w-5 h-5"></i></span>
            <span>ITConnect</span>
          </a>
          
          <div class="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1.5 rounded-full backdrop-blur-md shadow-inner">
            <a href="#/" title="Beranda" class="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-all">
              <i data-lucide="home" class="w-4 h-4"></i>
            </a>
            <a href="#/browse" title="Cari Proyek" class="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-all">
              <i data-lucide="compass" class="w-4 h-4"></i>
            </a>
            <a href="#/about" title="Tentang ITConnect" class="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-all">
              <i data-lucide="info" class="w-4 h-4"></i>
            </a>
          </div>

          <div class="flex items-center gap-3">
            <a href="#/login" class="nav-link hidden sm:block">Masuk</a>
            <a href="#/register" class="btn-primary px-4 py-2 rounded-xl text-sm">Daftar Gratis</a>
            <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-white/10 text-white">
              <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
        
        <div id="mobile-menu" class="hidden md:hidden px-4 pb-4 flex flex-col gap-2 border-t border-white/10 pt-3">
          <a href="#/" class="nav-link py-2 flex items-center gap-3"><i data-lucide="home" class="w-4 h-4"></i> Beranda</a>
          <a href="#/browse" class="nav-link py-2 flex items-center gap-3"><i data-lucide="compass" class="w-4 h-4"></i> Cari Proyek</a>
          <a href="#/login" class="nav-link py-2 flex items-center gap-3"><i data-lucide="log-in" class="w-4 h-4"></i> Masuk</a>
        </div>`;
    } else {
      nav.innerHTML = `
        <div class="nav-container">
          <a href="#/dashboard" class="nav-logo">
            <span class="logo-icon"><i data-lucide="zap" class="w-5 h-5"></i></span>
            <span>ITConnect</span>
          </a>
          
          <div class="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1.5 rounded-full backdrop-blur-md shadow-inner">
            <a href="#/dashboard" title="Dashboard" class="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-all">
              <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
            </a>
            <a href="#/browse" title="Proyek" class="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-all">
              <i data-lucide="briefcase" class="w-4 h-4"></i>
            </a>
            ${user.role === 'klien' ? `
            <a href="#/post-project" title="Post Proyek Baru" class="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-all">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </a>` : ''}
            <a href="#/messages" title="Pesan" class="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-all relative">
              <i data-lucide="message-square" class="w-4 h-4"></i>
              ${msgCount > 0 ? `<span class="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-black text-[9px] font-bold ring-2 ring-black">${msgCount > 9 ? '9+' : msgCount}</span>` : ''}
            </a>
            <a href="#/settings" title="Pengaturan" class="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-all">
              <i data-lucide="settings" class="w-4 h-4"></i>
            </a>
          </div>

          <div class="flex items-center gap-2">
            <a href="#/notifications" class="p-2.5 rounded-full hover:bg-white/15 transition-all relative text-slate-300 hover:text-white">
              <i data-lucide="bell" class="w-5 h-5"></i>
              ${notifCount > 0 ? `<span class="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-white text-black text-[10px] font-bold ring-2 ring-black">${notifCount > 9 ? '9+' : notifCount}</span>` : ''}
            </a>
            
            <div class="relative group ml-1">
              <button class="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                ${UI.avatar(user, 'sm')}
                <i data-lucide="chevron-down" class="w-3.5 h-3.5 opacity-60 hidden sm:block mr-1 text-white"></i>
              </button>
              
              <div class="dropdown-menu hidden group-hover:block absolute right-0 top-full mt-2 w-56">
                <div class="px-4 py-3 mb-1 border-b border-white/10">
                  <div class="text-sm font-bold text-white truncate">${user.name}</div>
                  <div class="text-xs text-slate-400 truncate mt-0.5">${user.email}</div>
                </div>
                <a href="#/profile" class="dropdown-item"><i data-lucide="user" class="w-4 h-4"></i> Profil Saya</a>
                <a href="#/payment" class="dropdown-item"><i data-lucide="wallet" class="w-4 h-4"></i> Dompet Keuangan</a>
                <div class="border-t border-white/10 mt-1 pt-1">
                  <button onclick="App.logout()" class="dropdown-item hover:bg-white/10 text-white w-full text-left"><i data-lucide="log-out" class="w-4 h-4"></i> Keluar</button>
                </div>
              </div>
            </div>
            
            <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-white/10 text-white ml-2">
              <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
        
        <div id="mobile-menu" class="hidden md:hidden px-4 pb-4 flex flex-col gap-1 border-t border-white/10 mt-2 pt-3">
          <a href="#/dashboard" class="nav-link py-2 flex items-center gap-3"><i data-lucide="layout-dashboard" class="w-4 h-4"></i> Dashboard</a>
          <a href="#/browse" class="nav-link py-2 flex items-center gap-3"><i data-lucide="briefcase" class="w-4 h-4"></i> Proyek</a>
          ${user.role === 'klien' ? '<a href="#/post-project" class="nav-link py-2 flex items-center gap-3"><i data-lucide="plus" class="w-4 h-4"></i> Post Proyek</a>' : ''}
          <a href="#/messages" class="nav-link py-2 flex items-center gap-3"><i data-lucide="message-square" class="w-4 h-4"></i> Pesan</a>
          <a href="#/settings" class="nav-link py-2 flex items-center gap-3"><i data-lucide="settings" class="w-4 h-4"></i> Pengaturan</a>
          <div class="border-t border-white/10 my-2"></div>
          <button onclick="App.logout()" class="nav-link py-2 text-left text-white flex items-center gap-3"><i data-lucide="log-out" class="w-4 h-4"></i> Keluar</button>
        </div>`;
    }

    if (window.lucide) lucide.createIcons({ nodes: [nav] });

    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      const menu = document.getElementById('mobile-menu');
      menu?.classList.toggle('hidden');
    });
  },

  // ── EMPTY STATE ──────────────────────────────────────────────
  emptyState(icon, title, desc, actionHtml = '') {
    return `
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <i data-lucide="${icon}" class="w-8 h-8 text-slate-500"></i>
        </div>
        <h3 class="font-semibold text-white mb-1">${title}</h3>
        <p class="text-slate-400 text-sm mb-4">${desc}</p>
        ${actionHtml}
      </div>`;
  },

  // ── PROJECT CARD ─────────────────────────────────────────────
  projectCard(proj, user) {
    const isSaved = user && (proj.saved || []).includes(user.id);
    const bidCount = Store.getBidsByProject(proj.id).length;
    const daysLeft = UI.daysLeft(proj.deadline);

    return `
    <div class="project-card group cursor-pointer" onclick="Router.go('/project/${proj.id}')">
      <div class="flex items-start justify-between gap-2 mb-3">
        <div class="flex items-center gap-2 flex-wrap">
          ${UI.categoryBadge(proj.category)}
          ${UI.statusBadge(proj.status)}
        </div>
        ${user ? `<button onclick="event.stopPropagation(); UI.handleSaveProject('${proj.id}')" class="p-1.5 rounded-lg hover:bg-white/10 transition-all flex-shrink-0">
          <i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="w-4 h-4 ${isSaved ? 'text-white' : 'text-slate-500'}"></i>
        </button>` : ''}
      </div>
      <h3 class="font-semibold text-white mb-2 line-clamp-2 transition-colors">${proj.title}</h3>
      <p class="text-slate-400 text-sm line-clamp-2 mb-3">${proj.description}</p>
      <div class="flex flex-wrap gap-1.5 mb-4">
        ${(proj.skills || []).slice(0,4).map(s => `<span class="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300">${s}</span>`).join('')}
        ${proj.skills?.length > 4 ? `<span class="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300">+${proj.skills.length - 4}</span>` : ''}
      </div>
      <div class="flex items-center justify-between pt-3 border-t border-white/10">
        <div>
          <div class="text-lg font-bold text-white">${UI.currency(proj.budget)}</div>
          <div class="text-xs text-slate-500">${proj.budgetType === 'fixed' ? 'Fixed Price' : 'Per Jam'}</div>
        </div>
        <div class="text-right">
          <div class="text-sm font-medium text-white">${daysLeft}</div>
          <div class="text-xs text-slate-500">${bidCount} penawaran</div>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
        ${UI.avatar({ name: proj.clientName }, 'xs')}
        <span class="text-xs text-slate-400 truncate">${proj.clientName}</span>
        <div class="ml-auto flex items-center gap-1">
          <i data-lucide="eye" class="w-3 h-3 text-slate-500"></i>
          <span class="text-xs text-slate-500">${proj.views || 0}</span>
        </div>
      </div>
    </div>`;
  },

  handleSaveProject(projectId) {
    const user = Store.getCurrentUser();
    if (!user) { Router.go('/login'); return; }
    const saved = Store.toggleSaveProject(projectId, user.id);
    UI.toast(saved ? 'Proyek disimpan!' : 'Proyek dihapus dari simpanan', 'info');
    lucide.createIcons();
  }
};

window.UI = UI;
