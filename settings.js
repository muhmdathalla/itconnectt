/* ========================================
   ITConnect — Account Configuration Settings
   ======================================== */

const SettingsView = {
  render() {
    const user = requireAuth();
    if (!user) return '';

    return `
      <div class="max-w-2xl mx-auto px-4 py-8 fade-in">
        <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div class="mb-6 border-b border-white/10 pb-4">
            <h1 class="text-2xl font-bold text-white flex items-center gap-2">
              <i data-lucide="settings" class="text-cyan-400 w-6 h-6"></i> Pengaturan Akun
            </h1>
            <p class="text-slate-400 text-sm mt-1">Kelola konfigurasi privasi, preferensi keamanan, dan autentikasi Anda.</p>
          </div>

          <form id="settings-password-form" class="space-y-4">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5"><i data-lucide="shield-check" class="w-4 h-4 text-cyan-400"></i> Perbarui Kata Sandi</h3>
            
            <div class="form-group">
              <label class="form-label">Password Saat Ini *</label>
              <input type="password" id="current-pw" placeholder="Ketik sandi lama Anda" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password Baru Baru *</label>
              <input type="password" id="new-pw" placeholder="Minimal 6 karakter baru" class="form-input" required>
            </div>

            <div class="form-group">
              <label class="form-label">Konfirmasi Password Baru *</label>
              <input type="password" id="confirm-new-pw" placeholder="Ulangi sandi baru Anda" class="form-input" required>
            </div>

            <div class="pt-2">
              <button type="submit" class="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold">
                Ganti Password Akun
              </button>
            </div>
          </form>

          <div class="border-t border-white/10 mt-8 pt-6 space-y-4">
            <h3 class="text-sm font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><i data-lucide="alert-triangle" class="w-4 h-4"></i> Zona Berbahaya</h3>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
              <div>
                <h4 class="text-xs sm:text-sm font-bold text-white">Deaktivasi Hapus Akun ITConnect</h4>
                <p class="text-xs text-slate-400 mt-0.5">Sekali dihapus, semua log riwayat, portofolio, dan transaksi dana akan hilang permanen.</p>
              </div>
              <button onclick="SettingsView.handleDeleteAccount()" class="px-4 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex-shrink-0">
                Hapus Akun
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  init() {
    if (window.lucide) lucide.createIcons();

    document.getElementById('settings-password-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = Store.getCurrentUser();
      const currentPw = document.getElementById('current-pw').value;
      const newPw = document.getElementById('new-pw').value;
      const confirmNew = document.getElementById('confirm-new-pw').value;

      if (!Store.verifyPassword(user, currentPw)) {
        UI.toast('Password saat ini salah!', 'error');
        return;
      }
      if (newPw.length < 6) {
        UI.toast('Password baru minimal 6 karakter!', 'error');
        return;
      }
      if (newPw !== confirmNew) {
        UI.toast('Konfirmasi password baru tidak sesuai!', 'error');
        return;
      }

      // Update password dengan hashing sederhana
      Store.updateUser(user.id, { password: simpleHash(newPw) });
      UI.toast('Password berhasil diperbarui! Keamanan terjaga. 🔐', 'success');
      e.target.reset();
    });
  },

  handleDeleteAccount() {
    UI.confirm('Apakah Anda benar-benar yakin ingin menghapus akun ITConnect secara permanen? Tindakan ini tidak dapat dibatalkan.', () => {
      const user = Store.getCurrentUser();
      const users = Store.getUsers().filter(u => u.id !== user.id);
      localStorage.setItem('itc_users', JSON.stringify(users));
      Store.clearCurrentUser();
      UI.toast('Akun Anda berhasil dihapus dari sistem. Terima kasih telah menggunakan ITConnect.', 'info');
      Router.go('/');
    }, { title: 'Hapus Akun Permanen', confirmText: 'Ya, Hapus Akun' });
  }
};

window.SettingsView = SettingsView;
