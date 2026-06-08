/* ========================================
   ITConnect — Messages / Real-time Chat View
   ======================================== */

const MessagesView = {
  render(convId) {
    const user = requireAuth();
    if (!user) return '';

    const conversations = Store.getConversationsByUser(user.id);
    const activeConv = convId ? Store.getConversationById(convId) : (conversations[0] || null);

    return `
      <div class="max-w-6xl mx-auto px-4 py-6 fade-in h-[calc(100vh-5rem)] min-h-[450px]">
        <div class="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden h-full flex flex-col md:flex-row">
          
          <!-- Sisi Kiri: Daftar Obrolan -->
          <div class="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 flex flex-col flex-shrink-0 bg-navy-950/20">
            <div class="p-4 border-b border-white/10">
              <h1 class="text-base font-bold text-white flex items-center gap-2">
                <i data-lucide="message-square" class="text-cyan-400 w-5 h-5"></i> Kontak Obrolan
              </h1>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-white/5">
              ${conversations.length > 0 ? conversations.map(c => {
                const partnerId = c.participants.find(p => p !== user.id);
                const partnerName = c.participantNames[partnerId] || 'User';
                const unread = c.unread[user.id] || 0;
                const isActive = activeConv && activeConv.id === c.id;
                
                return `
                  <div onclick="Router.go('/messages/${c.id}')" class="p-3.5 flex items-center gap-3 cursor-pointer transition-all ${isActive ? 'bg-white/10 border-l-4 border-cyan-500' : 'hover:bg-white/5'}">
                    ${UI.avatar({ name: partnerName }, 'sm')}
                    <div class="flex-1 overflow-hidden">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-semibold text-white truncate w-36">${partnerName}</span>
                        <span class="text-[9px] text-slate-500">${UI.timeAgo(c.lastMessageAt)}</span>
                      </div>
                      <p class="text-xs text-slate-400 truncate mt-0.5">${c.lastMessage || 'Belum ada pesan.'}</p>
                    </div>
                    ${unread > 0 ? `<span class="bg-red-500 text-white font-bold text-[10px] rounded-full h-4 w-4 flex items-center justify-center">${unread}</span>` : ''}
                  </div>
                `;
              }).join('') : `<div class="p-6 text-center text-xs text-slate-500">Belum memiliki obrolan aktif.</div>`}
            </div>
          </div>

          <!-- Sisi Kanan: Area Isi Chat -->
          <div class="flex-1 flex flex-col bg-navy-900/10 relative">
            ${activeConv ? this.renderActiveChat(activeConv, user) : `
              <div class="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-3">
                  <i data-lucide="message-circle" class="w-6 h-6 text-slate-600"></i>
                </div>
                <h3 class="font-semibold text-white text-sm mb-0.5">Ruang Obrolan Kosong</h3>
                <p class="text-xs">Pilih salah satu obrolan aktif di panel kiri untuk mulai bertukar pesan.</p>
              </div>
            `}
          </div>

        </div>
      </div>
    `;
  },

  renderActiveChat(conv, user) {
    const partnerId = conv.participants.find(p => p !== user.id);
    const partnerName = conv.participantNames[partnerId] || 'User';
    
    return `
      <!-- Header Chat -->
      <div class="px-4 py-3 border-b border-white/10 flex items-center gap-3 bg-navy-950/40">
        ${UI.avatar({ name: partnerName }, 'sm')}
        <div>
          <div class="text-sm font-bold text-white">${partnerName}</div>
          <div class="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Online</div>
        </div>
      </div>

      <!-- Area Flow Pesan -->
      <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 max-h-[calc(100vh-17rem)] min-h-[220px]">
        ${conv.messages.map(m => {
          const isMe = m.senderId === user.id;
          return `
            <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
              <div class="max-w-[75%] rounded-2xl px-4 py-2 text-xs border shadow-sm ${isMe ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-500/20 rounded-tr-none' : 'bg-white/5 border-white/5 text-slate-200 rounded-tl-none'}">
                <p class="leading-relaxed break-words whitespace-pre-wrap">${m.content}</p>
                <div class="text-[9px] mt-1 text-right opacity-60">${new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Footer Form Kirim Input -->
      <div class="p-3 border-t border-white/10 bg-navy-950/40">
        <form id="chat-send-form" class="flex gap-2">
          <input type="text" id="chat-input" placeholder="Tulis pesan Anda disini..." class="form-input py-2.5" autocomplete="off" required>
          <button type="submit" class="btn-primary p-3 rounded-xl flex-shrink-0">
            <i data-lucide="send" class="w-4 h-4"></i>
          </button>
        </form>
      </div>
    `;
  },

  init(convId) {
    if (window.lucide) lucide.createIcons();

    const user = Store.getCurrentUser();
    if (!user) return;

    // Tentukan ID obrolan yang aktif
    let activeConvId = convId;
    if (!activeConvId) {
      const conversations = Store.getConversationsByUser(user.id);
      if (conversations.length > 0) activeConvId = conversations[0].id;
    }

    if (activeConvId) {
      // Tandai pesan sudah dibaca
      Store.markConvRead(activeConvId, user.id);
      UI.renderNav(); // Update badge notifikasi di navbar

      // Scroll otomatis ke pesan paling bawah
      const container = document.getElementById('chat-messages');
      if (container) container.scrollTop = container.scrollHeight;

      // Event Submit Kirim Pesan
      document.getElementById('chat-send-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const content = input.value.trim();
        if (!content) return;

        Store.addMessage(activeConvId, user.id, content);
        input.value = '';
        
        // Render ulang area chat
        Router.dispatch();
      });
    }
  }
};

window.MessagesView = MessagesView;
