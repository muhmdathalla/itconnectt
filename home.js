/* ========================================
   ITConnect — Home / Landing Page View
   ======================================== */

const HomeView = {
  render() {
    const user = Store.getCurrentUser();
    if (user) { Router.go('/dashboard'); return ''; }
    return `
    <!-- HERO -->
    <section class="hero-section relative overflow-hidden">
      <div class="hero-grid"></div>
      <div class="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm mb-6">
          <i data-lucide="zap" class="w-4 h-4"></i>
          Platform Freelance #1 untuk Mahasiswa IT Indonesia
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
          Temukan Proyek IT<br>
          <span class="gradient-text">Impianmu Sekarang</span>
        </h1>
        <p class="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          ITConnect menghubungkan mahasiswa IT berbakat dengan klien yang membutuhkan jasa digital. Bangun portfolio, raih penghasilan, dan dapatkan pengalaman kerja nyata sejak kuliah.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a href="#/register?role=mahasiswa" class="btn-primary px-8 py-3.5 rounded-xl text-base font-semibold w-full sm:w-auto">
            <i data-lucide="graduation-cap" class="w-5 h-5 inline mr-2"></i> Daftar sebagai Mahasiswa
          </a>
          <a href="#/register?role=klien" class="btn-secondary px-8 py-3.5 rounded-xl text-base font-semibold w-full sm:w-auto">
            <i data-lucide="briefcase" class="w-5 h-5 inline mr-2"></i> Cari Freelancer
          </a>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          ${[
            ['500+', 'Mahasiswa Aktif', 'users'],
            ['120+', 'Proyek/Bulan', 'folder'],
            ['98%', 'Kepuasan Klien', 'heart'],
            ['Rp50jt+', 'Dana Diserap/Bln', 'trending-up']
          ].map(([num, label, icon]) => `
            <div class="stat-card">
              <i data-lucide="${icon}" class="w-5 h-5 text-cyan-400 mx-auto mb-1"></i>
              <div class="text-2xl font-black text-white">${num}</div>
              <div class="text-xs text-slate-400">${label}</div>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="py-16 px-4 max-w-6xl mx-auto">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-black text-white mb-3">Kategori Jasa IT</h2>
        <p class="text-slate-400">Temukan proyek sesuai keahlian kamu</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${[
          { icon: 'globe', name: 'Web Development', count: '45+ proyek', color: 'from-blue-500 to-cyan-500' },
          { icon: 'smartphone', name: 'Mobile App', count: '28+ proyek', color: 'from-purple-500 to-pink-500' },
          { icon: 'palette', name: 'UI/UX Design', count: '32+ proyek', color: 'from-pink-500 to-rose-500' },
          { icon: 'bar-chart-2', name: 'Data Science', count: '18+ proyek', color: 'from-emerald-500 to-teal-500' },
          { icon: 'server', name: 'Backend Dev', count: '22+ proyek', color: 'from-orange-500 to-amber-500' },
          { icon: 'layout-dashboard', name: 'Frontend Dev', count: '38+ proyek', color: 'from-cyan-500 to-blue-500' },
          { icon: 'brain-circuit', name: 'Machine Learning', count: '12+ proyek', color: 'from-teal-500 to-emerald-500' },
          { icon: 'shield', name: 'Cybersecurity', count: '8+ proyek', color: 'from-red-500 to-rose-500' },
        ].map(c => `
          <button onclick="Router.go('/browse?cat=${encodeURIComponent(c.name)}')" class="category-card group">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <i data-lucide="${c.icon}" class="w-6 h-6 text-white"></i>
            </div>
            <div class="font-semibold text-white text-sm mb-1">${c.name}</div>
            <div class="text-xs text-slate-400">${c.count}</div>
          </button>`).join('')}
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="py-16 px-4 bg-white/[0.02] border-y border-white/10">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-black text-white mb-3">Cara Kerja ITConnect</h2>
          <p class="text-slate-400">Proses mudah dan transparan</p>
        </div>
        <div class="grid md:grid-cols-2 gap-12">
          <!-- For Mahasiswa -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <i data-lucide="graduation-cap" class="w-5 h-5 text-cyan-400"></i>
              </div>
              <h3 class="text-xl font-bold text-white">Untuk Mahasiswa IT</h3>
            </div>
            <div class="space-y-4">
              ${[
                ['1', 'Daftar & Buat Profil', 'Buat profil profesional, tambahkan skills dan portfolio kamu.'],
                ['2', 'Temukan Proyek', 'Browse ratusan proyek sesuai keahlian dan budget yang cocok.'],
                ['3', 'Kirim Penawaran', 'Ajukan bid dengan proposal terbaik dan harga kompetitif.'],
                ['4', 'Kerjakan & Terima Bayaran', 'Kerjakan proyek dengan aman, dana dilindungi sistem escrow.']
              ].map(([num, title, desc]) => `
                <div class="flex gap-4">
                  <div class="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">${num}</div>
                  <div>
                    <div class="font-semibold text-white text-sm">${title}</div>
                    <div class="text-xs text-slate-400 mt-0.5">${desc}</div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
          <!-- For Klien -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <i data-lucide="briefcase" class="w-5 h-5 text-violet-400"></i>
              </div>
              <h3 class="text-xl font-bold text-white">Untuk Klien</h3>
            </div>
            <div class="space-y-4">
              ${[
                ['1', 'Post Proyek', 'Deskripikan kebutuhan, budget, dan deadline proyekmu.'],
                ['2', 'Terima Penawaran', 'Bandingkan penawaran dari mahasiswa IT terbaik.'],
                ['3', 'Pilih & Mulai', 'Pilih kandidat terbaik, dana masuk ke sistem escrow.'],
                ['4', 'Review & Rilis Dana', 'Cek hasil kerja, rilis dana jika puas. Aman & terjamin.']
              ].map(([num, title, desc]) => `
                <div class="flex gap-4">
                  <div class="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">${num}</div>
                  <div>
                    <div class="font-semibold text-white text-sm">${title}</div>
                    <div class="text-xs text-slate-400 mt-0.5">${desc}</div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED PROJECTS -->
    <section class="py-16 px-4 max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-black text-white mb-1">Proyek Terbaru</h2>
          <p class="text-slate-400">Peluang terbuka untuk kamu</p>
        </div>
        <a href="#/browse" class="btn-secondary px-4 py-2 rounded-xl text-sm">Lihat Semua <i data-lucide="arrow-right" class="w-4 h-4 inline ml-1"></i></a>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${Store.getOpenProjects().slice(0, 6).map(p => UI.projectCard(p, null)).join('')}
      </div>
    </section>

    <!-- VALUE PROPOSITION -->
    <section class="py-16 px-4 bg-white/[0.02] border-y border-white/10">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-black text-white mb-3">Kenapa ITConnect?</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          ${[
            { icon: 'shield-check', title: 'Pembayaran Aman', desc: 'Sistem escrow melindungi dana dari awal hingga akhir proyek. Tidak ada risiko penipuan.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: 'zap', title: 'Matching Otomatis', desc: 'Algoritma cerdas kami mencocokkan proyek dengan freelancer paling relevan secara otomatis.', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { icon: 'star', title: 'Freelancer Terverifikasi', desc: 'Semua mahasiswa terverifikasi status kemahasiswaannya. Kualitas dan kepercayaan terjamin.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: 'layout', title: 'Portfolio Builder', desc: 'Bangun portofolio digital profesional langsung dari proyek yang kamu kerjakan.', color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { icon: 'message-circle', title: 'Chat Real-time', desc: 'Komunikasi langsung antara klien dan freelancer dalam platform yang aman dan terintegrasi.', color: 'text-pink-400', bg: 'bg-pink-500/10' },
            { icon: 'trending-up', title: 'Rating & Review', desc: 'Sistem reputasi transparan membantu klien memilih freelancer dan freelancer membangun karir.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map(f => `
            <div class="feature-card">
              <div class="w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4">
                <i data-lucide="${f.icon}" class="w-6 h-6 ${f.color}"></i>
              </div>
              <h3 class="font-bold text-white mb-2">${f.title}</h3>
              <p class="text-slate-400 text-sm">${f.desc}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- PRICING / COMMISSION -->
    <section class="py-16 px-4 max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-black text-white mb-3">Model Bisnis Transparan</h2>
        <p class="text-slate-400">Tidak ada biaya tersembunyi</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        ${[
          { icon: 'gift', title: 'Freemium', desc: 'Akses dasar gratis untuk semua mahasiswa IT. Bisa langsung cari proyek tanpa bayar.', highlight: false },
          { icon: 'percent', title: 'Komisi 5–10%', desc: 'Platform hanya mengambil komisi 5–10% dari setiap transaksi proyek yang berhasil.', highlight: true },
          { icon: 'crown', title: 'Premium', desc: 'Fitur lanjutan: boost profil, prioritas matching, badge terverifikasi. Mulai Rp49.000/bln.', highlight: false },
          { icon: 'rocket', title: 'Boost & Promo', desc: 'Tingkatkan visibilitas profil atau listing proyek dengan fitur berbayar opsional.', highlight: false },
        ].map(p => `
          <div class="${p.highlight ? 'pricing-card-highlight' : 'pricing-card'}">
            ${p.highlight ? '<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 text-navy-950 text-xs font-bold rounded-full">Populer</div>' : ''}
            <div class="w-10 h-10 rounded-xl ${p.highlight ? 'bg-cyan-500/20' : 'bg-white/10'} flex items-center justify-center mb-3">
              <i data-lucide="${p.icon}" class="w-5 h-5 ${p.highlight ? 'text-cyan-400' : 'text-slate-300'}"></i>
            </div>
            <h3 class="font-bold text-white mb-2">${p.title}</h3>
            <p class="text-slate-400 text-sm">${p.desc}</p>
          </div>`).join('')}
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <div class="cta-card p-10 rounded-3xl">
          <h2 class="text-3xl font-black text-white mb-4">Siap Bergabung?</h2>
          <p class="text-slate-400 mb-8">Daftar gratis sekarang dan mulai perjalanan karirmu sebagai freelancer IT mahasiswa terbaik Indonesia.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#/register?role=mahasiswa" class="btn-primary px-8 py-3.5 rounded-xl font-semibold">
              <i data-lucide="graduation-cap" class="w-5 h-5 inline mr-2"></i> Saya Mahasiswa IT
            </a>
            <a href="#/register?role=klien" class="btn-secondary px-8 py-3.5 rounded-xl font-semibold">
              <i data-lucide="search" class="w-5 h-5 inline mr-2"></i> Saya Cari Freelancer
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-white/10 py-10 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="nav-logo mb-3">
              <span class="logo-icon"><i data-lucide="zap" class="w-4 h-4"></i></span>
              <span>IT<span class="text-cyan-400">Connect</span></span>
            </div>
            <p class="text-slate-400 text-sm">Marketplace Jasa IT Mahasiswa Indonesia. Menghubungkan bakat dengan peluang.</p>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3">Platform</h4>
            <div class="space-y-2 text-sm text-slate-400">
              <a href="#/browse" class="block hover:text-white transition-colors">Cari Proyek</a>
              <a href="#/register" class="block hover:text-white transition-colors">Daftar Gratis</a>
              <a href="#/about" class="block hover:text-white transition-colors">Tentang Kami</a>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3">Kategori</h4>
            <div class="space-y-2 text-sm text-slate-400">
              <a href="#/browse?cat=Web Development" class="block hover:text-white transition-colors">Web Development</a>
              <a href="#/browse?cat=Mobile App" class="block hover:text-white transition-colors">Mobile App</a>
              <a href="#/browse?cat=UI/UX Design" class="block hover:text-white transition-colors">UI/UX Design</a>
              <a href="#/browse?cat=Data Science" class="block hover:text-white transition-colors">Data Science</a>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3">Hubungi Kami</h4>
            <div class="space-y-2 text-sm text-slate-400">
              <div class="flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4"></i> hello@itconnect.id</div>
              <div class="flex items-center gap-2"><i data-lucide="instagram" class="w-4 h-4"></i> @itconnect.id</div>
              <div class="flex items-center gap-2"><i data-lucide="linkedin" class="w-4 h-4"></i> ITConnect Indonesia</div>
            </div>
          </div>
        </div>
        <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div>© 2025 ITConnect. Afiq Fathurrahman & Muhammad Athalla B. — Technopreneurship</div>
          <div class="flex gap-4">
            <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>`;
  },

  init() {
    if (window.lucide) lucide.createIcons();
  }
};

window.HomeView = HomeView;
