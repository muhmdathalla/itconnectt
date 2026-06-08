/* ========================================
   ITConnect — Dashboard View
   ======================================== */

const DashboardView = {
  render() {
    // Memastikan hanya user yang sudah login yang bisa akses
    const user = requireAuth();
    if (!user) return '';

    // Merender tampilan berbeda berdasarkan Role (Mahasiswa vs Klien)
    if (user.role === 'mahasiswa') {
      return this.renderMahasiswa(user);
    } else {
      return this.renderKlien(user);
    }
  },

  // ── VIEW UNTUK MAHASISWA ──
  renderMahasiswa(user) {
    // Ambil maksimal 4 proyek terbaru yang statusnya masih 'open'
    const openProjects = Store.getOpenProjects().slice(0, 4);
    // Ambil total bid/penawaran yang sudah dikirim oleh mahasiswa ini
    const myBids = Store.getBidsByFreelancer(user.id);
    
    return `
      <div class="max-w-6xl mx-auto px-4 py-8 fade-in">
        <div class="mb-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1">Halo, ${user.name.split(' ')[0]}! 👋</h1>
          <p class="text-slate-400">Siap untuk mengerjakan proyek impianmu hari ini?</p>
        </div>

        <!-- Statistik Mahasiswa -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="stat-card">
            <i data-lucide="wallet" class="w-6 h-6 text-cyan-400 mx-auto mb-2"></i>
            <div class="text-xl font-bold text-white">${UI.currency(user.balance)}</div>
            <div class="text-xs text-slate-400">Saldo Aktif</div>
          </div>
          <div class="stat-card">
            <i data-lucide="check-circle" class="w-6 h-6 text-emerald-400 mx-auto mb-2"></i>
            <div class="text-xl font-bold text-white">${user.completedProjects || 0}</div>
            <div class="text-xs text-slate-400">Proyek Selesai</div>
          </div>
          <div class="stat-card">
            <i data-lucide="star" class="w-6 h-6 text-amber-400 mx-auto mb-2"></i>
            <div class="text-xl font-bold text-white flex items-center justify-center gap-1">
              ${user.rating || 0} <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
            </div>
            <div class="text-xs text-slate-400">${user.reviewCount} Ulasan</div>
          </div>
          <div class="stat-card">
            <i data-lucide="briefcase" class="w-6 h-6 text-violet-400 mx-auto mb-2"></i>
            <div class="text-xl font-bold text-white">${myBids.length}</div>
            <div class="text-xs text-slate-400">Bid Terkirim</div>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-white">Rekomendasi Proyek Terbaru</h2>
              <a href="#/browse" class="text-sm text-cyan-400 hover:underline">Lihat Semua</a>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              ${openProjects.length > 0 
                ? openProjects.map(p => UI.projectCard(p, user)).join('') 
                : UI.emptyState('folder-search', 'Belum ada proyek', 'Saat ini belum ada proyek baru yang tersedia.')}
            </div>
          </div>

          <div class="space-y-6">
            <!-- Profil Ringkas (Sidebar) -->
            <div class="glass-card p-5 rounded-2xl">
               <h2 class="text-base font-bold text-white mb-4">Profil Kamu</h2>
               <div class="flex items-center gap-3 mb-5">
                  ${UI.avatar(user, 'lg')}
                  <div class="overflow-hidden">
                     <div class="font-bold text-white truncate">${user.name}</div>
                     <div class="text-xs text-slate-400 truncate">${user.university || 'Mahasiswa IT'}</div>
                  </div>
               </div>
               <div class="space-y-3 mb-5">
                 <div class="flex justify-between text-sm">
                   <span class="text-slate-400">Kelengkapan Profil</span>
                   <span class="text-cyan-400 font-medium">85%</span>
                 </div>
                 <div class="w-full bg-navy-900 rounded-full h-1.5">
                   <div class="bg-cyan-500 h-1.5 rounded-full" style="width: 85%"></div>
                 </div>
               </div>
               <a href="#/profile" class="btn-secondary w-full py-2.5 rounded-xl text-sm font-medium">Lihat Profil Lengkap</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ── VIEW UNTUK KLIEN ──
  renderKlien(user) {
    // Ambil proyek yang diposting oleh klien yang sedang login
    const myProjects = Store.getProjectsByClient(user.id);
    
    return `
      <div class="max-w-6xl mx-auto px-4 py-8 fade-in">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1">Halo, ${user.name.split(' ')[0]}! 🏢</h1>
            <p class="text-slate-400">Kelola proyek dan temukan talenta IT mahasiswa terbaik.</p>
          </div>
          <a href="#/post-project" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap">
            <i data-lucide="plus" class="w-4 h-4 mr-2 inline"></i> Post Proyek Baru
          </a>
        </div>

        <!-- Statistik Klien -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div class="stat-card">
            <i data-lucide="folder-kanban" class="w-6 h-6 text-cyan-400 mx-auto mb-2"></i>
            <div class="text-xl font-bold text-white">${myProjects.length}</div>
            <div class="text-xs text-slate-400">Total Proyek Diposting</div>
          </div>
          <div class="stat-card">
            <i data-lucide="credit-card" class="w-6 h-6 text-emerald-400 mx-auto mb-2"></i>
            <div class="text-xl font-bold text-white">${UI.currency(user.totalSpent)}</div>
            <div class="text-xs text-slate-400">Total Pengeluaran</div>
          </div>
          <div class="stat-card">
            <i data-lucide="users" class="w-6 h-6 text-violet-400 mx-auto mb-2"></i>
            <div class="text-xl font-bold text-white">${user.reviewCount || 0}</div>
            <div class="text-xs text-slate-400">Freelancer Disewa</div>
          </div>
        </div>

        <div>
           <div class="flex items-center justify-between mb-4">
             <h2 class="text-lg font-bold text-white">Proyek Aktif Kamu</h2>
           </div>
           <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
             ${myProjects.length > 0 
               ? myProjects.map(p => UI.projectCard(p, user)).join('') 
               : UI.emptyState('folder-plus', 'Belum ada proyek', 'Kamu belum memposting proyek apapun. Mulai cari talent sekarang!', '<a href="#/post-project" class="btn-primary mt-4 px-4 py-2 rounded-xl text-sm">Post Proyek Perdana</a>')}
           </div>
        </div>
      </div>
    `;
  },

  init() {
    // Fungsi untuk me-render icon setelah HTML dimasukkan ke halaman
    if (window.lucide) lucide.createIcons();
  }
};

window.DashboardView = DashboardView;