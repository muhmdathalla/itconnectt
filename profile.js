/* ========================================
   ITConnect — Profile Customization View
   ======================================== */

const ProfileView = {
  render(id) {
    const me = Store.getCurrentUser();
    if (!me && !id) { Router.go('/login'); return ''; }

    // Jika parameter id kosong, tampilkan profil user yang sedang login
    const userId = id || me.id;
    const user = Store.getUserById(userId);
    if (!user) return Views.notFound();

    const isMyProfile = me && me.id === user.id;

    return `
      <div class="max-w-5xl mx-auto px-4 py-8 fade-in">
        <div class="grid md:grid-cols-3 gap-6">
          
          <!-- Kartu Profil Kiri -->
          <div class="space-y-4">
            <div class="glass-card p-6 rounded-3xl border border-white/10 text-center shadow-xl relative overflow-hidden">
              <div class="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"></div>
              
              <div class="relative pt-6 flex flex-col items-center">
                ${UI.avatar(user, 'xl')}
                <h2 class="text-xl font-bold text-white mt-4">${user.name}</h2>
                <span class="text-xs px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-semibold uppercase mt-1.5 tracking-wider">${user.role === 'mahasiswa' ? '👨‍💻 Mahasiswa IT' : '🏢 Klien / UMKM'}</span>
                
                <p class="text-xs text-slate-400 mt-4 flex items-center gap-1 justify-center"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${user.location || 'Indonesia'}</p>
                ${user.phone ? `<p class="text-xs text-slate-500 mt-1 flex items-center gap-1 justify-center"><i data-lucide="phone" class="w-3.5 h-3.5"></i> ${user.phone}</p>` : ''}
              </div>

              <div class="border-t border-white/10 mt-6 pt-5 grid grid-cols-2 gap-2 text-center">
                <div>
                  <div class="text-lg font-black text-white">${user.rating || 0} ⭐</div>
                  <div class="text-[10px] text-slate-500 uppercase tracking-wide">Reputasi Rating</div>
                </div>
                <div>
                  <div class="text-lg font-black text-white">${user.completedProjects || user.reviewCount || 0}</div>
                  <div class="text-[10px] text-slate-500 uppercase tracking-wide">${user.role === 'mahasiswa' ? 'Proyek Selesai' : 'Freelancer Disewa'}</div>
                </div>
              </div>

              ${isMyProfile ? `
                <button onclick="ProfileView.openEditModal()" class="btn-secondary w-full py-2.5 rounded-xl text-xs font-semibold mt-6">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5 mr-1.5 inline"></i> Edit Profil Saya
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Informasi Detail Kanan -->
          <div class="md:col-span-2 space-y-6">
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
              <h3 class="text-base font-bold text-white border-b border-white/10 pb-3 mb-4 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="user" class="w-4 h-4 text-cyan-400"></i> Biografi Deskripsi
              </h3>
              <p class="text-slate-300 text-sm leading-relaxed">${user.bio || 'Belum ada deskripsi profil.'}</p>
            </div>

            ${user.role === 'mahasiswa' ? `
              <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
                <h3 class="text-base font-bold text-white border-b border-white/10 pb-3 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="graduation-cap" class="w-4 h-4 text-cyan-400"></i> Latar Belakang Pendidikan
                </h3>
                <div class="text-sm">
                  <div class="font-bold text-white">${user.university || 'Universitas Belum Diatur'}</div>
                  <div class="text-slate-400 mt-0.5">${user.major || 'Program Studi / Jurusan'}</div>
                </div>
              </div>

              <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
                <h3 class="text-base font-bold text-white border-b border-white/10 pb-3 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="code" class="w-4 h-4 text-cyan-400"></i> Penguasaan Tech Skills
                </h3>
                <div class="flex flex-wrap gap-2">
                  ${(user.skills && user.skills.length > 0) 
                    ? user.skills.map(s => `<span class="skill-tag">${s}</span>`).join('') 
                    : '<span class="text-xs text-slate-500">Belum menambahkan skill kuasai.</span>'}
                </div>
              </div>
            ` : `
              <div class="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
                <h3 class="text-base font-bold text-white border-b border-white/10 pb-3 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="building-2" class="w-4 h-4 text-cyan-400"></i> Informasi Perusahaan
                </h3>
                <div class="space-y-2 text-sm">
                  <div class="flex"><span class="text-slate-500 w-28">Nama Bisnis:</span> <span class="text-white font-medium">${user.company || '-'}</span></div>
                  <div class="flex"><span class="text-slate-500 w-28">Website Resmi:</span> <a href="${user.website || '#'}" target="_blank" class="text-cyan-400 hover:underline">${user.website || '-'}</a></div>
                </div>
              </div>
            `}
          </div>

        </div>
      </div>
    `;
  },

  init(id) {
    if (window.lucide) lucide.createIcons();
  },

  openEditModal() {
    const user = Store.getCurrentUser();
    if (!user) return;

    const modalHtml = `
      <div class="glass-card p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl relative">
        <button onclick="UI.closeModal()" class="absolute right-4 top-4 opacity-60 hover:opacity-100 text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
        <h3 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Kustomisasi Edit Profil</h3>
        
        <form id="edit-profile-form" class="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          <div class="form-group">
            <label class="form-label">Nama Lengkap *</label>
            <input type="text" id="edit-name" value="${user.name}" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Kota / Lokasi Domisili</label>
            <input type="text" id="edit-location" value="${user.location || ''}" placeholder="Contoh: Yogyakarta" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Nomor WhatsApp / HP</label>
            <input type="tel" id="edit-phone" value="${user.phone || ''}" placeholder="08xxxxxxxxxx" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Biografi Ringkas</label>
            <textarea id="edit-bio" rows="3" placeholder="Ceritakan profil singkat Anda..." class="form-input py-2 resize-none">${user.bio || ''}</textarea>
          </div>
          
          ${user.role === 'mahasiswa' ? `
            <div class="form-group">
              <label class="form-label">Universitas / Kampus</label>
              <input type="text" id="edit-university" value="${user.university || ''}" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Program Studi / Jurusan</label>
              <input type="text" id="edit-major" value="${user.major || ''}" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Keahlian / Skills (Pisahkan dengan koma)</label>
              <input type="text" id="edit-skills" value="${(user.skills || []).join(', ')}" placeholder="React, Node, Figma" class="form-input">
            </div>
          ` : `
            <div class="form-group">
              <label class="form-label">Nama Instansi / Perusahaan</label>
              <input type="text" id="edit-company" value="${user.company || ''}" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Link Website</label>
              <input type="url" id="edit-website" value="${user.website || ''}" placeholder="https://..." class="form-input">
            </div>
          `}

          <div class="flex gap-2 justify-end pt-2 border-t border-white/10">
            <button type="button" onclick="UI.closeModal()" class="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white">Batal</button>
            <button type="submit" class="btn-primary px-5 py-2 rounded-xl text-sm font-semibold">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    `;

    UI.modal(modalHtml, {
      onOpen: () => {
        document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('edit-name').value.trim();
          const location = document.getElementById('edit-location').value.trim();
          const phone = document.getElementById('edit-phone').value.trim();
          const bio = document.getElementById('edit-bio').value.trim();

          const updates = { name, location, phone, bio };

          if (user.role === 'mahasiswa') {
            updates.university = document.getElementById('edit-university').value.trim();
            updates.major = document.getElementById('edit-major').value.trim();
            const skillsStr = document.getElementById('edit-skills').value;
            updates.skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
          } else {
            updates.company = document.getElementById('edit-company').value.trim();
            updates.website = document.getElementById('edit-website').value.trim();
          }

          Store.updateUser(user.id, updates);
          UI.closeModal();
          UI.toast('Profil berhasil diperbarui!', 'success');
          Router.dispatch();
        });
      }
    });
  }
};

window.ProfileView = ProfileView;
