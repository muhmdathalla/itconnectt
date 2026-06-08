/* ========================================
   ITConnect — Payment / Wallet View
   ======================================== */

const PaymentView = {
  render() {
    const user = requireAuth();
    if (!user) return '';

    const payments = Store.getPaymentsByUser(user.id);

    return `
      <div class="max-w-4xl mx-auto px-4 py-8 fade-in border-white/10">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-white flex items-center gap-2">
            <i data-lucide="wallet" class="text-cyan-400 w-6 h-6"></i> Dompet Keuangan
          </h1>
          <p class="text-slate-400 text-sm mt-0.5">Kelola riwayat saldo keuangan dan pembayaran escrow proyek kontrak Anda.</p>
        </div>

        <!-- Kartu Utama Saldo -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl bg-gradient-to-br from-cyan-900/20 to-navy-950/40 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Terkini Anda</span>
            <div class="text-3xl sm:text-4xl font-black text-white mt-1">${UI.currency(user.balance)}</div>
            ${user.role === 'mahasiswa' ? `<p class="text-xs text-slate-500 mt-1">Total seluruh pendapatan bersih terkumpul: ${UI.currency(user.earnings)}</p>` : ''}
          </div>
          <button onclick="PaymentView.handleWithdrawDeposit()" class="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex-shrink-0">
            <i data-lucide="${user.role === 'mahasiswa' ? 'arrow-up-right' : 'plus'}" class="w-4 h-4 mr-2 inline"></i> 
            ${user.role === 'mahasiswa' ? 'Tarik Saldo Rekening' : 'Top Up Deposit'}
          </button>
        </div>

        <!-- Riwayat Transaksi -->
        <div class="space-y-4">
          <h3 class="font-bold text-white text-base flex items-center gap-2">
            <i data-lucide="history" class="w-4 h-4 text-cyan-400"></i> Log Riwayat Transaksi Kontrak
          </h3>
          
          <div class="space-y-2.5">
            ${payments.length > 0 ? payments.map(p => {
              const isClient = user.role === 'klien';
              const labelColor = p.status === 'released' ? 'text-emerald-400' : 'text-amber-400 border-amber-500/20 bg-amber-500/5';
              const labelStatus = p.status === 'released' ? 'Selesai / Cair' : 'Sistem Escrow';
              
              return `
                <div class="glass-card p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                  <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                      <i data-lucide="${isClient ? 'arrow-up-right' : 'arrow-down-left'}" class="w-4 h-4 ${isClient ? 'text-red-400' : 'text-emerald-400'}"></i>
                    </div>
                    <div>
                      <div class="font-semibold text-white">${p.projectTitle}</div>
                      <div class="text-[11px] text-slate-500 mt-0.5">ID Kontrak: ${p.id} • ${UI.date(p.createdAt)}</div>
                    </div>
                  </div>
                  
                  <div class="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2.5 sm:pt-0 border-white/5">
                    <div class="font-bold ${isClient ? 'text-slate-300' : 'text-cyan-400'}">${UI.currency(isClient ? p.amount : p.freelancerAmount)}</div>
                    <span class="text-[10px] font-medium uppercase mt-0.5 ${labelColor}">${labelStatus}</span>
                  </div>
                </div>
              `;
            }).join('') : UI.emptyState('receipt', 'Belum ada transaksi', 'Belum ada catatan transaksi keuangan yang terdaftar.')}
          </div>
        </div>

      </div>
    `;
  },

  init() {
    if (window.lucide) lucide.createIcons();
  },

  handleWithdrawDeposit() {
    const user = Store.getCurrentUser();
    if (user.role === 'mahasiswa') {
      if (user.balance <= 0) {
        UI.toast('Saldo aktif Anda kosong!', 'error');
        return;
      }
      UI.confirm(`Apakah Anda hendak menarik seluruh saldo tunai Anda sebesar ${UI.currency(user.balance)} ke rekening bank digital terdaftar?`, () => {
        Store.updateUser(user.id, { balance: 0 });
        UI.toast('Penarikan dana sukses diproses! Dana akan cair maksimal 1x24 jam. 🏦', 'success');
        Router.dispatch();
      }, { title: 'Tarik Saldo Keuangan', confirmText: 'Ya, Cairkan Dana' });
    } else {
      // Fitur Top Up Simulasi untuk Klien
      UI.confirm('Lakukan pengisian ulang (Top Up) deposit simulasi akun sebesar Rp2.000.000 untuk pendanaan proyek?', () => {
        const currentBalance = user.balance || 0;
        Store.updateUser(user.id, { balance: currentBalance + 2000000 });
        UI.toast('Top Up dana simulasi berhasil ditambahkan ke saldo! 💳', 'success');
        Router.dispatch();
      }, { title: 'Isi Deposit Akun', confirmText: 'Ya, Top Up' });
    }
  }
};

window.PaymentView = PaymentView;
