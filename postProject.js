/* ========================================
   ITConnect — Post Project View
   ======================================== */

const PostProjectView = {
  render() {
    const user = requireRole('klien');
    if (!user) return '';

    return `
      <div class="max-w-3xl mx-auto px-4 py-8 fade-in">
        <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div class="mb-6 border-b border-white/10 pb-4">
            <h1 class="text-2xl font-bold text-white flex items-center gap-2">
              <i data-lucide="folder-plus" class="text-cyan-400 w-6 h-6"></i> Post Proyek Baru
            </h1>
            <p class="text-slate-400 text-sm mt-1">Publikasikan kebutuhan digital Anda dan temukan mahasiswa IT terbaik.</p>
          </div>

          <form id="post-project-form" class="space-y-5">
            <div class="form-group">
              <label class="form-label">Judul Proyek *</label>
              <input type="text" id="post-title" placeholder="Contoh: Pembuatan Website E-Commerce UMKM Sembako" class="form-input" required>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Kategori Jasa *</label>
                <div class="relative">
                  <select id="post-category" class="form-input appearance-none bg-navy-900/50" required>
                    <option value="" disabled selected>Pilih Kategori</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                  </select>
                  <i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"></i>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Budget (Rupiah) *</label>
                <div class="input-icon-wrapper">
                  <span class="absolute left-3 text-sm font-semibold text-slate-500">Rp</span>
                  <input type="number" id="post-budget" placeholder="Contoh: 2500000" class="form-input pl-10" required>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Keahlian yang Dibutuhkan (Pisahkan dengan koma) *</label>
              <div class="input-icon-wrapper">
                <i data-lucide="tags" class="input-icon"></i>
                <input type="text" id="post-skills" placeholder="React.js, Node.js, MySQL, Tailwind CSS" class="form-input pl-10" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Deadline Penyelesaian *</label>
              <div class="input-icon-wrapper">
                <i data-lucide="calendar" class="input-icon"></i>
                <input type="date" id="post-deadline" class="form-input pl-10" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Deskripsi Lengkap Proyek *</label>
              <textarea id="post-description" rows="6" placeholder="Jelaskan secara detail mengenai fitur yang dibutuhkan, alur sistem, dan deliverable akhir yang Anda harapkan..." class="form-input py-3 resize-none" required></textarea>
            </div>

            <div class="flex gap-4 pt-4 justify-end border-t border-white/10">
              <button type="button" onclick="Router.go('/dashboard')" class="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">Batal</button>
              <button type="submit" class="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold">
                <i data-lucide="send" class="w-4 h-4 mr-2 inline"></i> Publikasikan Proyek
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  init() {
    if (window.lucide) lucide.createIcons();

    // Set minimal date untuk deadline adalah besok
    const deadlineInput = document.getElementById('post-deadline');
    if (deadlineInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      deadlineInput.min = tomorrow.toISOString().split('T')[0];
    }

    document.getElementById('post-project-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = Store.getCurrentUser();
      
      const title = document.getElementById('post-title').value.trim();
      const category = document.getElementById('post-category').value;
      const budget = parseInt(document.getElementById('post-budget').value);
      const skillsStr = document.getElementById('post-skills').value;
      const deadlineDate = document.getElementById('post-deadline').value;
      const description = document.getElementById('post-description').value.trim();

      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const deadline = new Date(deadlineDate).getTime();

      const proj = Store.createProject({
        title,
        description,
        category,
        skills,
        budget,
        budgetType: 'fixed',
        deadline,
        clientId: user.id,
        clientName: user.name,
        clientAvatar: user.avatar,
        clientRating: user.rating
      });

      UI.toast('Proyek berhasil dipublikasikan! 🎉', 'success');
      Router.go('/dashboard');
    });
  }
};

window.PostProjectView = PostProjectView;
