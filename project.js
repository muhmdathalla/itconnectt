/* ========================================
   ITConnect — Project Detail View
   ======================================== */

const ProjectView = {
  render(id) {
    const user = requireAuth();
    if (!user) return '';

    const proj = Store.getProjectById(id);
    if (!proj) return Views.notFound();

    const bids = Store.getBidsByProject(id);
    const userAlreadyBidded = bids.find(b => b.freelancerId === user.id);
    const isOwner = proj.clientId === user.id;

    return `
      <div class="max-w-6xl mx-auto px-4 py-8 fade-in">
        <div class="grid lg:grid-cols-3 gap-8">
          
          <!-- Kolom Utama: Detail Proyek -->
          <div class="lg:col-span-2 space-y-6">
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
              <div class="flex flex-wrap gap-2 mb-4">
                ${UI.categoryBadge(proj.category)}
                ${UI.statusBadge(proj.status)}
              </div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">${proj.title}</h1>
              
              <div class="flex items-center gap-4 text-xs text-slate-400 border-y border-white/10 py-3 mb-6">
                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> Diposting: ${UI.date(proj.createdAt)}</span>
                <span class="flex items-center gap-1"><i data-lucide="eye" class="w-3.5 h-3.5"></i> ${proj.views || 0} Dilihat</span>
                <span class="flex items-center gap-1"><i data-lucide="gavel" class="w-3.5 h-3.5"></i> ${bids.length} Penawaran</span>
              </div>

              <div class="space-y-4">
                <h2 class="text-base font-bold text-white uppercase tracking-wider">Deskripsi Proyek</h2>
                <p class="text-slate-300 text-sm leading-relaxed whitespace-pre-line">${proj.description}</p>
              </div>

              <div class="mt-8 space-y-3">
                <h2 class="text-base font-bold text-white uppercase tracking-wider">Keahlian Yang Diperlukan</h2>
                <div class="flex flex-wrap gap-2">
                  ${(proj.skills || []).map(s => `<span class="skill-tag">${s}</span>`).join('')}
                </div>
              </div>
            </div>

            <!-- Bagian Penawaran (Bids) -->
            ${isOwner ? this.renderClientBidsSection(proj, bids) : this.renderFreelancerBidForm(proj, user, userAlreadyBidded)}
          </div>

          <!-- Kolom Samping: Info Klien & Ringkasan Kontrak -->
          <div class="space-y-6">
            <div class="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Ringkasan Anggaran</h2>
              <div class="text-3xl font-black text-cyan-400 mb-1">${UI.currency(proj.budget)}</div>
              <div class="text-xs text-slate-500 mb-5">${proj.budgetType === 'fixed' ? 'Fixed Price' : 'Kontrak Per Jam'}</div>
              
              <div class="border-t border-white/10 pt-4 space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-400 flex items-center gap-1.5"><i data-lucide="hourglass" class="w-4 h-4 text-slate-500"></i> Sisa Waktu</span>
                  <span class="text-white font-medium">${UI.daysLeft(proj.deadline)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400 flex items-center gap-1.5"><i data-lucide="calendar-days" class="w-4 h-4 text-slate-500"></i> Batas Akhir</span>
                  <span class="text-white font-medium">${UI.date(proj.deadline)}</span>
                </div>
              </div>
            </div>

            <div class="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Mengenai Klien</h2>
              <div class="flex items-center gap-3 mb-4">
                ${UI.avatar({ name: proj.clientName }, 'md')}
                <div class="overflow-hidden">
                  <div class="font-bold text-white truncate">${proj.clientName}</div>
                  <div class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    ${UI.stars(proj.clientRating || 4.5)} <span>(${proj.clientRating || 4.5})</span>
                  </div>
                </div>
              </div>

              ${!isOwner ? `
                <button onclick="ProjectView.handleContactClient('${proj.clientId}', '${proj.id}')" class="btn-secondary w-full py-2.5 rounded-xl text-sm font-medium mt-2">
                  <i data-lucide="message-square" class="w-4 h-4 mr-2 inline"></i> Hubungi Klien
                </button>
              ` : ''}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  renderFreelancerBidForm(proj, user, userAlreadyBidded) {
    if (user.role !== 'mahasiswa') return '';

    if (proj.status !== 'open') {
      return `
        <div class="glass-card p-6 rounded-3xl border border-white/10 text-center text-slate-400">
          <i data-lucide="lock" class="w-8 h-8 text-slate-600 mx-auto mb-2"></i>
          Proyek ini sudah ditutup untuk penawaran baru. Status saat ini: <span class="text-cyan-400 font-semibold uppercase">${proj.status}</span>
        </div>
      `;
    }

    if (userAlreadyBidded) {
      return `
        <div class="glass-card p-6 rounded-3xl border border-cyan-500/30 bg-cyan-500/5 shadow-xl">
          <h3 class="font-bold text-white mb-2 flex items-center gap-2">
            <i data-lucide="check-circle" class="text-emerald-400 w-5 h-5"></i> Penawaran Anda Telah Dikirim
          </h3>
          <p class="text-slate-400 text-sm mb-4">Klien sedang meninjau proposal Anda. Berikut adalah ringkasan bid Anda:</p>
          <div class="grid grid-cols-2 gap-4 bg-navy-950/40 p-4 rounded-xl text-sm border border-white/5">
            <div>
              <div class="text-xs text-slate-500">Harga Penawaran</div>
              <div class="text-base font-bold text-cyan-400">${UI.currency(userAlreadyBidded.amount)}</div>
            </div>
            <div>
              <div class="text-xs text-slate-500">Durasi Kerja</div>
              <div class="text-base font-bold text-white">${userAlreadyBidded.deliveryDays} Hari</div>
            </div>
            <div class="col-span-2 border-t border-white/10 pt-2 mt-1">
              <div class="text-xs text-slate-500 mb-1">Surat Pengantar / Proposal</div>
              <p class="text-xs text-slate-300 italic">"${userAlreadyBidded.coverLetter}"</p>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
        <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <i data-lucide="gavel" class="text-cyan-400 w-5 h-5"></i> Ajukan Penawaran Jasa Anda
        </h3>
        <p class="text-slate-400 text-sm mb-6">Berikan penawaran harga terbaik dan yakinkan klien mengapa Anda adalah kandidat paling pas.</p>
        
        <form id="bid-form" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Harga Penawaran Anda *</label>
              <div class="input-icon-wrapper">
                <span class="absolute left-3 text-sm font-semibold text-slate-500">Rp</span>
                <input type="number" id="bid-amount" max="${proj.budget}" min="100000" value="${proj.budget}" class="form-input pl-10" required>
              </div>
              <p class="text-[10px] text-slate-500 mt-1">Maksimal sesuai budget klien: ${UI.currency(proj.budget)}</p>
            </div>
            <div class="form-group">
              <label class="form-label">Estimasi Waktu Kerja (Hari) *</label>
              <div class="input-icon-wrapper">
                <i data-lucide="clock" class="input-icon"></i>
                <input type="number" id="bid-days" min="1" placeholder="Contoh: 14" class="form-input pl-10" required>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Surat Pengantar / Proposal Ringkas *</label>
            <textarea id="bid-cover" rows="4" placeholder="Tulis pesan terbaik Anda kepada klien, jelaskan keahlian relevan Anda..." class="form-input py-3 resize-none" required></textarea>
          </div>

          <button type="submit" class="btn-primary w-full py-3 rounded-xl text-sm font-bold mt-2">
            Kirim Proposal Penawaran
          </button>
        </form>
      </div>
    `;
  },

  renderClientBidsSection(proj, bids) {
    return `
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <i data-lucide="users" class="text-cyan-400 w-5 h-5"></i> Proposal Masuk (${bids.length})
        </h3>
        
        <div class="space-y-3">
          ${bids.length > 0 ? bids.map(b => `
            <div class="glass-card p-5 rounded-2xl border border-white/10 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start gap-3">
                ${UI.avatar({ name: b.freelancerName }, 'md')}
                <div class="overflow-hidden">
                  <div class="font-bold text-white text-sm flex items-center gap-1.5 flex-wrap">
                    ${b.freelancerName}
                    <span class="text-xs font-normal text-amber-400 flex items-center gap-0.5">
                      <i data-lucide="star" class="w-3 h-3 fill-amber-400"></i> ${b.freelancerRating || 4.8}
                    </span>
                  </div>
                  <div class="text-xs text-slate-500 mt-0.5">${b.freelancerCompleted || 0} Proyek Selesai</div>
                  <p class="text-xs text-slate-300 mt-2 italic bg-white/5 p-2 rounded-lg border border-white/5">"${b.coverLetter}"</p>
                </div>
              </div>

              <div class="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10 flex-shrink-0 text-right">
                <div class="mb-2">
                  <div class="text-base font-bold text-cyan-400">${UI.currency(b.amount)}</div>
                  <div class="text-xs text-slate-500">${b.deliveryDays} Hari Kerja</div>
                </div>
                
                ${proj.status === 'open' ? `
                  <button onclick="ProjectView.handleAcceptBid('${b.id}')" class="btn-primary px-3 py-1.5 text-xs font-semibold rounded-lg">
                    Terima Bid
                  </button>
                ` : `
                  <span class="text-xs px-2 py-0.5 rounded border border-white/10 bg-white/5 text-slate-400 uppercase font-medium">${b.status}</span>
                `}
              </div>
            </div>
          `).join('') : UI.emptyState('gavel', 'Belum ada proposal', 'Belum ada mahasiswa yang mengirimkan penawaran untuk proyek ini.')}
        </div>
      </div>
    `;
  },

  init(id) {
    Store.incrementProjectViews(id);
    if (window.lucide) lucide.createIcons();

    document.getElementById('bid-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = Store.getCurrentUser();
      const amount = parseInt(document.getElementById('bid-amount').value);
      const deliveryDays = parseInt(document.getElementById('bid-days').value);
      const coverLetter = document.getElementById('bid-cover').value.trim();

      Store.createBid({
        projectId: id,
        freelancerId: user.id,
        freelancerName: user.name,
        freelancerAvatar: user.avatar,
        freelancerRating: user.rating,
        freelancerCompleted: user.completedProjects,
        amount,
        deliveryDays,
        coverLetter
      });

      UI.toast('Proposal penawaran Anda berhasil dikirim! 🚀', 'success');
      Router.dispatch();
    });
  },

  handleContactClient(clientId, projectId) {
    const user = Store.getCurrentUser();
    if (!user) { Router.go('/login'); return; }
    const conv = Store.createConversation(user.id, clientId, projectId);
    Router.go('/messages/' + conv.id);
  },

  handleAcceptBid(bidId) {
    UI.confirm('Apakah Anda yakin ingin menerima penawaran ini? Dana proyek akan masuk ke sistem escrow demi keamanan transaksi.', () => {
      const bid = Store.acceptBid(bidId);
      if (bid) {
        const proj = Store.getProjectById(bid.projectId);
        // Buat Pembayaran Escrow
        Store.createPayment({
          projectId: proj.id,
          projectTitle: proj.title,
          clientId: proj.clientId,
          freelancerId: bid.freelancerId,
          amount: bid.amount
        });

        // Buat notifikasi untuk mahasiswa
        Store.createNotification(
          bid.freelancerId,
          'bid',
          'Bid Penawaran Diterima! 🎉',
          `Selamat, klien menerima proposal Anda untuk proyek "${proj.title}". Kontrak dimulai!`,
          '#/project/' + proj.id
        );

        UI.toast('Penawaran diterima dan sistem kontrak/escrow aktif!', 'success');
        Router.dispatch();
      }
    }, { title: 'Terima Penawaran Jasa', confirmText: 'Ya, Setuju Kontrak' });
  }
};

window.ProjectView = ProjectView;
