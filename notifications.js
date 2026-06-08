/* ========================================
   ITConnect — Notifications View
   ======================================== */

const NotificationsView = {
  render() {
    const user = requireAuth();
    if (!user) return '';

    const notifications = Store.getNotificationsByUser(user.id);

    return `
      <div class="max-w-3xl mx-auto px-4 py-8 fade-in">
        <div class="flex items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div>
            <h1 class="text-2xl font-bold text-white flex items-center gap-2">
              <i data-lucide="bell" class="text-cyan-400 w-6 h-6"></i> Pusat Notifikasi
            </h1>
            <p class="text-slate-400 text-sm mt-0.5">Pantau terus perkembangan penawaran kontrak serta aktivitas sistem Anda.</p>
          </div>
          
          ${notifications.length > 0 ? `
            <button onclick="NotificationsView.handleMarkAllRead()" class="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              <i data-lucide="check-check" class="w-3.5 h-3.5"></i> Baca Semua
            </button>
          ` : ''}
        </div>

        <div class="space-y-2">
          ${notifications.length > 0 ? notifications.map(n => {
            const icons = { bid: 'gavel', message: 'message-square', payment: 'credit-card', project: 'folder-code', system: 'shield-alert' };
            const iconColor = n.read ? 'text-slate-600 bg-white/5' : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20';
            
            return `
              <div onclick="NotificationsView.handleNotifClick('${n.id}', '${n.link}')" class="glass-card p-4 rounded-xl border border-white/10 flex items-start gap-3.5 transition-all cursor-pointer ${n.read ? 'opacity-60' : 'hover:bg-white/10'}">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}">
                  <i data-lucide="${icons[n.type] || 'info'}" class="w-4 h-4"></i>
                </div>
                <div class="flex-1 overflow-hidden">
                  <div class="flex items-start justify-between gap-2">
                    <h3 class="text-xs sm:text-sm font-bold ${n.read ? 'text-slate-300' : 'text-white'}">${n.title}</h3>
                    <span class="text-[10px] text-slate-500 whitespace-nowrap flex-shrink-0 mt-0.5">${UI.timeAgo(n.createdAt)}</span>
                  </div>
                  <p class="text-xs text-slate-400 mt-1 leading-relaxed">${n.body}</p>
                </div>
              </div>
            `;
          }).join('') : UI.emptyState('bell-off', 'Kotak masuk kosong', 'Belum ada notifikasi atau pemberitahuan baru yang masuk.')}
        </div>
      </div>
    `;
  },

  init() {
    if (window.lucide) lucide.createIcons();
  },

  handleMarkAllRead() {
    const user = Store.getCurrentUser();
    if (!user) return;
    Store.markAllNotifsRead(user.id);
    UI.toast('Semua pemberitahuan ditandai telah dibaca.', 'info');
    Router.dispatch();
  },

  handleNotifClick(id, link) {
    Store.markNotifRead(id);
    if (link && link !== 'null' && link !== '#') {
      window.location.hash = link;
    } else {
      Router.dispatch();
    }
  }
};

window.NotificationsView = NotificationsView;
