/* ========================================
   ITConnect — About View
   ======================================== */
const AboutView = {
  render() {
    return `
    <div class="max-w-4xl mx-auto px-4 py-12 fade-in">
      <div class="text-center mb-12">
        <div class="nav-logo justify-center text-3xl mb-6 inline-flex">
          <span class="logo-icon"><i data-lucide="zap" class="w-8 h-8"></i></span>
          IT<span class="text-cyan-400">Connect</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-black text-white mb-4">Tentang Kami</h1>
        <p class="text-slate-400 text-lg">Marketplace Jasa IT pertama yang didedikasikan khusus untuk mahasiswa di Indonesia.</p>
      </div>

      <div class="glass-card p-8 rounded-3xl mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">Visi & Misi</h2>
        <p class="text-slate-300 leading-relaxed mb-6">
          Seringkali mahasiswa IT memiliki keterampilan yang sangat mumpuni, namun kesulitan mencari wadah untuk menerapkan ilmunya di dunia nyata. Di sisi lain, banyak UMKM dan bisnis lokal yang membutuhkan digitalisasi dengan biaya yang terjangkau. ITConnect hadir untuk menjembatani keduanya melalui sistem yang aman dan transparan.
        </p>
        <div class="grid sm:grid-cols-2 gap-6 mt-8">
          <div class="bg-navy-900/50 p-5 rounded-2xl border border-white/5">
            <i data-lucide="graduation-cap" class="w-8 h-8 text-cyan-400 mb-3"></i>
            <h3 class="font-bold text-white mb-2">Pemberdayaan Mahasiswa</h3>
            <p class="text-sm text-slate-400">Membantu mahasiswa membangun portofolio profesional dan mendapatkan penghasilan tambahan sebelum lulus.</p>
          </div>
          <div class="bg-navy-900/50 p-5 rounded-2xl border border-white/5">
            <i data-lucide="rocket" class="w-8 h-8 text-violet-400 mb-3"></i>
            <h3 class="font-bold text-white mb-2">Digitalisasi UMKM</h3>
            <p class="text-sm text-slate-400">Memberikan akses ke talenta digital berkualitas dengan harga yang sesuai dengan anggaran bisnis lokal.</p>
          </div>
        </div>
      </div>
      
      <div class="text-center">
        <p class="text-slate-500 text-sm">Dikembangkan untuk tugas mata kuliah Technopreneurship.</p>
      </div>
    </div>`;
  }
};
window.AboutView = AboutView;