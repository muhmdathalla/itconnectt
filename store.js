/* ========================================
   ITConnect — Data Store (localStorage)
   ======================================== */

const ITC_KEYS = {
  USERS: 'itc_users',
  PROJECTS: 'itc_projects',
  BIDS: 'itc_bids',
  CONVERSATIONS: 'itc_conversations',
  PAYMENTS: 'itc_payments',
  NOTIFICATIONS: 'itc_notifications',
  CURRENT_USER: 'itc_current_user',
  SEEDED: 'itc_seeded'
};

// ─── Utilities ──────────────────────────────────────────────
function genId(prefix = 'id') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h.toString(36);
}

function read(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function readObj(key) {
  try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
}
function write(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// ─── Store Object ────────────────────────────────────────────
const Store = {

  // ── USERS ──
  getUsers() { return read(ITC_KEYS.USERS); },
  getUserById(id) { return this.getUsers().find(u => u.id === id) || null; },
  getUserByEmail(email) { return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null; },

  createUser(data) {
    const users = this.getUsers();
    const user = {
      id: genId('usr'),
      email: data.email,
      password: simpleHash(data.password),
      name: data.name,
      role: data.role, // 'mahasiswa' | 'klien'
      avatar: data.avatar || null,
      bio: data.bio || '',
      phone: data.phone || '',
      location: data.location || '',
      // Mahasiswa fields
      university: data.university || '',
      major: data.major || '',
      skills: data.skills || [],
      portfolio: data.portfolio || [],
      rating: data.rating || 0,
      reviewCount: data.reviewCount || 0,
      completedProjects: data.completedProjects || 0,
      earnings: data.earnings || 0,
      balance: data.balance || 0,
      // Klien fields
      company: data.company || '',
      website: data.website || '',
      totalSpent: data.totalSpent || 0,
      isPremium: data.isPremium || false,
      joinedAt: data.joinedAt || Date.now(),
      online: false
    };
    users.push(user);
    write(ITC_KEYS.USERS, users);
    return user;
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    write(ITC_KEYS.USERS, users);
    // Update cached current user too
    const cu = this.getCurrentUser();
    if (cu && cu.id === id) write(ITC_KEYS.CURRENT_USER, users[idx]);
    return users[idx];
  },

  verifyPassword(user, password) {
    return user.password === simpleHash(password);
  },

  // ── AUTH ──
  getCurrentUser() { return readObj(ITC_KEYS.CURRENT_USER); },
  setCurrentUser(user) { write(ITC_KEYS.CURRENT_USER, user); },
  clearCurrentUser() { localStorage.removeItem(ITC_KEYS.CURRENT_USER); },

  // ── PROJECTS ──
  getProjects() { return read(ITC_KEYS.PROJECTS); },
  getProjectById(id) { return this.getProjects().find(p => p.id === id) || null; },
  getProjectsByClient(clientId) { return this.getProjects().filter(p => p.clientId === clientId); },
  getProjectsByFreelancer(freelancerId) {
    return this.getProjects().filter(p => p.assignedTo === freelancerId);
  },
  getOpenProjects() { return this.getProjects().filter(p => p.status === 'open'); },

  createProject(data) {
    const projects = this.getProjects();
    const project = {
      id: genId('prj'),
      title: data.title,
      description: data.description,
      category: data.category,
      skills: data.skills || [],
      budget: data.budget,
      budgetType: data.budgetType || 'fixed',
      deadline: data.deadline,
      status: 'open',
      clientId: data.clientId,
      clientName: data.clientName,
      clientAvatar: data.clientAvatar || null,
      clientRating: data.clientRating || 0,
      assignedTo: null,
      assignedName: null,
      bids: [],
      views: 0,
      saved: [],
      attachments: data.attachments || [],
      tags: data.tags || [],
      createdAt: Date.now()
    };
    projects.push(project);
    write(ITC_KEYS.PROJECTS, projects);
    return project;
  },

  updateProject(id, updates) {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    projects[idx] = { ...projects[idx], ...updates };
    write(ITC_KEYS.PROJECTS, projects);
    return projects[idx];
  },

  incrementProjectViews(id) {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx >= 0) { projects[idx].views++; write(ITC_KEYS.PROJECTS, projects); }
  },

  toggleSaveProject(projectId, userId) {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) return;
    const saved = projects[idx].saved || [];
    const si = saved.indexOf(userId);
    if (si >= 0) saved.splice(si, 1); else saved.push(userId);
    projects[idx].saved = saved;
    write(ITC_KEYS.PROJECTS, projects);
    return si < 0; // true if now saved
  },

  // ── BIDS ──
  getBids() { return read(ITC_KEYS.BIDS); },
  getBidsByProject(projectId) { return this.getBids().filter(b => b.projectId === projectId); },
  getBidsByFreelancer(freelancerId) { return this.getBids().filter(b => b.freelancerId === freelancerId); },
  getBidById(id) { return this.getBids().find(b => b.id === id) || null; },

  createBid(data) {
    const bids = this.getBids();
    const bid = {
      id: genId('bid'),
      projectId: data.projectId,
      freelancerId: data.freelancerId,
      freelancerName: data.freelancerName,
      freelancerAvatar: data.freelancerAvatar || null,
      freelancerRating: data.freelancerRating || 0,
      freelancerCompleted: data.freelancerCompleted || 0,
      amount: data.amount,
      deliveryDays: data.deliveryDays,
      coverLetter: data.coverLetter,
      status: 'pending',
      createdAt: Date.now()
    };
    bids.push(bid);
    write(ITC_KEYS.BIDS, bids);
    // Add bid id to project
    const proj = this.getProjectById(data.projectId);
    if (proj) {
      const bidIds = proj.bids || [];
      bidIds.push(bid.id);
      this.updateProject(data.projectId, { bids: bidIds });
    }
    return bid;
  },

  updateBid(id, updates) {
    const bids = this.getBids();
    const idx = bids.findIndex(b => b.id === id);
    if (idx === -1) return null;
    bids[idx] = { ...bids[idx], ...updates };
    write(ITC_KEYS.BIDS, bids);
    return bids[idx];
  },

  acceptBid(bidId) {
    const bid = this.getBidById(bidId);
    if (!bid) return null;
    // Update bid status
    this.updateBid(bidId, { status: 'accepted' });
    // Reject all other bids for the same project
    const allBids = this.getBids();
    const updated = allBids.map(b =>
      b.projectId === bid.projectId && b.id !== bidId
        ? { ...b, status: 'rejected' }
        : b
    );
    write(ITC_KEYS.BIDS, updated);
    // Update project
    const freelancer = this.getUserById(bid.freelancerId);
    this.updateProject(bid.projectId, {
      status: 'in-progress',
      assignedTo: bid.freelancerId,
      assignedName: bid.freelancerName
    });
    return bid;
  },

  // ── CONVERSATIONS ──
  getConversations() { return read(ITC_KEYS.CONVERSATIONS); },
  getConversationsByUser(userId) {
    return this.getConversations().filter(c => c.participants.includes(userId));
  },
  getConversationById(id) { return this.getConversations().find(c => c.id === id) || null; },
  getConversationBetween(uid1, uid2) {
    return this.getConversations().find(c =>
      c.participants.includes(uid1) && c.participants.includes(uid2)
    ) || null;
  },

  createConversation(uid1, uid2, projectId = null) {
    const existing = this.getConversationBetween(uid1, uid2);
    if (existing) return existing;
    const convs = this.getConversations();
    const u1 = this.getUserById(uid1);
    const u2 = this.getUserById(uid2);
    const conv = {
      id: genId('conv'),
      participants: [uid1, uid2],
      participantNames: { [uid1]: u1?.name || 'User', [uid2]: u2?.name || 'User' },
      participantAvatars: { [uid1]: u1?.avatar || null, [uid2]: u2?.avatar || null },
      projectId,
      messages: [],
      lastMessage: '',
      lastMessageAt: Date.now(),
      unread: { [uid1]: 0, [uid2]: 0 },
      createdAt: Date.now()
    };
    convs.push(conv);
    write(ITC_KEYS.CONVERSATIONS, convs);
    return conv;
  },

  addMessage(convId, senderId, content, type = 'text') {
    const convs = this.getConversations();
    const idx = convs.findIndex(c => c.id === convId);
    if (idx === -1) return null;
    const msg = { id: genId('msg'), senderId, content, type, createdAt: Date.now() };
    convs[idx].messages.push(msg);
    convs[idx].lastMessage = content;
    convs[idx].lastMessageAt = Date.now();
    // Increment unread for the other participant
    convs[idx].participants.forEach(pid => {
      if (pid !== senderId) convs[idx].unread[pid] = (convs[idx].unread[pid] || 0) + 1;
    });
    write(ITC_KEYS.CONVERSATIONS, convs);
    return msg;
  },

  markConvRead(convId, userId) {
    const convs = this.getConversations();
    const idx = convs.findIndex(c => c.id === convId);
    if (idx >= 0) { convs[idx].unread[userId] = 0; write(ITC_KEYS.CONVERSATIONS, convs); }
  },

  getTotalUnread(userId) {
    return this.getConversationsByUser(userId)
      .reduce((sum, c) => sum + (c.unread[userId] || 0), 0);
  },

  // ── PAYMENTS ──
  getPayments() { return read(ITC_KEYS.PAYMENTS); },
  getPaymentByProject(projectId) { return this.getPayments().find(p => p.projectId === projectId) || null; },
  getPaymentsByUser(userId) {
    return this.getPayments().filter(p => p.clientId === userId || p.freelancerId === userId);
  },

  createPayment(data) {
    const payments = this.getPayments();
    const platformFee = Math.round(data.amount * 0.10);
    const payment = {
      id: genId('pay'),
      projectId: data.projectId,
      projectTitle: data.projectTitle,
      clientId: data.clientId,
      freelancerId: data.freelancerId,
      amount: data.amount,
      platformFee,
      freelancerAmount: data.amount - platformFee,
      status: 'escrow', // escrow | released | disputed | refunded
      createdAt: Date.now(),
      escrowDate: Date.now(),
      releaseDate: null,
      method: data.method || 'transfer'
    };
    payments.push(payment);
    write(ITC_KEYS.PAYMENTS, payments);
    return payment;
  },

  updatePayment(id, updates) {
    const payments = this.getPayments();
    const idx = payments.findIndex(p => p.id === id);
    if (idx === -1) return null;
    payments[idx] = { ...payments[idx], ...updates };
    write(ITC_KEYS.PAYMENTS, payments);
    return payments[idx];
  },

  // ── NOTIFICATIONS ──
  getNotifications() { return read(ITC_KEYS.NOTIFICATIONS); },
  getNotificationsByUser(userId) {
    return this.getNotifications()
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  getUnreadCount(userId) {
    return this.getNotificationsByUser(userId).filter(n => !n.read).length;
  },

  createNotification(userId, type, title, body, link = null) {
    const notifs = this.getNotifications();
    const n = {
      id: genId('ntf'),
      userId, type, title, body, link,
      read: false,
      createdAt: Date.now()
    };
    notifs.push(n);
    write(ITC_KEYS.NOTIFICATIONS, notifs);
    return n;
  },

  markNotifRead(id) {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx >= 0) { notifs[idx].read = true; write(ITC_KEYS.NOTIFICATIONS, notifs); }
  },

  markAllNotifsRead(userId) {
    const notifs = this.getNotifications().map(n =>
      n.userId === userId ? { ...n, read: true } : n
    );
    write(ITC_KEYS.NOTIFICATIONS, notifs);
  },

  deleteNotif(id) {
    const notifs = this.getNotifications().filter(n => n.id !== id);
    write(ITC_KEYS.NOTIFICATIONS, notifs);
  },

  // ── SEED DATA ────────────────────────────────────────────────
  seed() {
    if (localStorage.getItem(ITC_KEYS.SEEDED)) return;

    // Users
    const afiq = this.createUser({
      email: 'mahasiswa@demo.com', password: 'demo123',
      name: 'Afiq Fathurrahman', role: 'mahasiswa',
      bio: 'Mahasiswa Teknik Informatika semester 6, passionate di web development dan UI/UX. Sudah mengerjakan 12+ proyek freelance.',
      phone: '081234567890', location: 'Yogyakarta',
      university: 'Universitas XYZ', major: 'Teknik Informatika',
      skills: ['React.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MySQL', 'UI/UX Design'],
      portfolio: [
        { id: 'pf1', title: 'Website E-commerce Fashion', desc: 'Platform toko online dengan fitur keranjang, pembayaran, dan manajemen produk.', url: '#', tags: ['React', 'Node.js', 'MySQL'] },
        { id: 'pf2', title: 'Dashboard Admin Analytics', desc: 'Dashboard admin dengan chart real-time, manajemen user, dan laporan otomatis.', url: '#', tags: ['React', 'Chart.js', 'REST API'] },
        { id: 'pf3', title: 'Aplikasi Todo dengan Auth', desc: 'Fullstack todo app dengan JWT authentication dan fitur kolaborasi.', url: '#', tags: ['Vue.js', 'Express', 'MongoDB'] }
      ],
      rating: 4.8, reviewCount: 9, completedProjects: 12,
      earnings: 15600000, balance: 2400000,
      joinedAt: Date.now() - 86400000 * 180
    });

    const rina = this.createUser({
      email: 'rina@demo.com', password: 'demo123',
      name: 'Rina Kusuma', role: 'mahasiswa',
      bio: 'Mahasiswi Desain Komunikasi Visual semester 5, spesialis UI/UX dan mobile design. Menggunakan Figma sejak 2022.',
      phone: '082345678901', location: 'Bandung',
      university: 'Institut Teknologi Bandung', major: 'Desain Komunikasi Visual',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Flutter', 'Framer'],
      portfolio: [
        { id: 'pf4', title: 'Redesign Aplikasi Banking', desc: 'Redesign lengkap UI/UX aplikasi mobile banking dengan fokus pada kemudahan penggunaan.', url: '#', tags: ['Figma', 'Mobile', 'Banking'] },
        { id: 'pf5', title: 'Landing Page SaaS Product', desc: 'Landing page modern dengan conversion-focused design dan animasi halus.', url: '#', tags: ['Figma', 'Framer', 'Landing Page'] }
      ],
      rating: 4.9, reviewCount: 7, completedProjects: 8,
      earnings: 9200000, balance: 1800000,
      joinedAt: Date.now() - 86400000 * 120
    });

    const bagas = this.createUser({
      email: 'bagas@demo.com', password: 'demo123',
      name: 'Bagas Pratama', role: 'mahasiswa',
      bio: 'Mahasiswa Ilmu Komputer fokus di Data Science dan Machine Learning. Pengalaman dengan Kaggle competitions.',
      phone: '083456789012', location: 'Jakarta',
      university: 'Universitas Indonesia', major: 'Ilmu Komputer',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'Pandas', 'SQL'],
      portfolio: [
        { id: 'pf6', title: 'Sentiment Analysis Platform', desc: 'Web app untuk analisis sentimen review produk menggunakan NLP.', url: '#', tags: ['Python', 'Flask', 'NLP'] }
      ],
      rating: 4.7, reviewCount: 5, completedProjects: 6,
      earnings: 8400000, balance: 1200000,
      joinedAt: Date.now() - 86400000 * 90
    });

    const ptMaju = this.createUser({
      email: 'klien@demo.com', password: 'demo123',
      name: 'Budi Santoso', role: 'klien',
      bio: 'Owner PT Maju Digital, perusahaan IT consulting untuk UMKM di Jawa.',
      phone: '081122334455', location: 'Surabaya',
      company: 'PT Maju Digital', website: 'https://majudigital.co.id',
      rating: 4.6, reviewCount: 8,
      totalSpent: 18500000, balance: 5000000,
      isPremium: true,
      joinedAt: Date.now() - 86400000 * 200
    });

    const startup = this.createUser({
      email: 'startup@demo.com', password: 'demo123',
      name: 'Sarah Wijaya', role: 'klien',
      bio: 'Co-founder StartupKu, platform UMKM digital. Selalu cari developer & designer berbakat!',
      phone: '087788990011', location: 'Jakarta',
      company: 'StartupKu', website: 'https://startupku.id',
      rating: 4.4, reviewCount: 5,
      totalSpent: 12300000, balance: 8000000,
      isPremium: false,
      joinedAt: Date.now() - 86400000 * 150
    });

    const tokoBerkah = this.createUser({
      email: 'toko@demo.com', password: 'demo123',
      name: 'Ahmad Rizky', role: 'klien',
      bio: 'Pemilik Toko Berkah, usaha retail sembako yang sedang digitalisasi.',
      phone: '085566778899', location: 'Semarang',
      company: 'Toko Berkah', website: '',
      rating: 4.2, reviewCount: 3,
      totalSpent: 4200000, balance: 2000000,
      isPremium: false,
      joinedAt: Date.now() - 86400000 * 60
    });

    // Projects
    const p1 = this.createProject({
      title: 'Website Toko Online Pakaian Fashion',
      description: 'Dibutuhkan developer untuk membuat website e-commerce pakaian fashion. Fitur yang dibutuhkan: katalog produk, keranjang belanja, payment gateway (Midtrans), manajemen stok, dan panel admin. Desain harus modern, mobile-friendly, dan loading cepat.',
      category: 'Web Development',
      skills: ['React.js', 'Node.js', 'MySQL', 'Payment Gateway'],
      budget: 2500000, budgetType: 'fixed',
      deadline: Date.now() + 86400000 * 21,
      clientId: ptMaju.id, clientName: ptMaju.name, clientRating: 4.6,
      tags: ['e-commerce', 'fashion', 'react'],
      createdAt: Date.now() - 86400000 * 2
    });

    const p2 = this.createProject({
      title: 'Aplikasi Mobile Kasir Android & iOS',
      description: 'Butuh developer Flutter untuk membuat aplikasi kasir point-of-sale (POS) untuk toko retail. Fitur: scan barcode, manajemen produk, laporan penjualan harian/bulanan, export Excel, print struk via bluetooth printer. Desain sudah ada, tinggal coding.',
      category: 'Mobile App',
      skills: ['Flutter', 'Dart', 'Firebase', 'Bluetooth'],
      budget: 4500000, budgetType: 'fixed',
      deadline: Date.now() + 86400000 * 30,
      clientId: startup.id, clientName: startup.name, clientRating: 4.4,
      tags: ['kasir', 'pos', 'flutter', 'mobile'],
      createdAt: Date.now() - 86400000 * 1
    });

    const p3 = this.createProject({
      title: 'Redesign UI/UX Website Company Profile',
      description: 'Website company profile kami sudah outdated, butuh redesign total. Scope: halaman Home, About, Services, Portfolio, Contact. Deliverable: file Figma beserta design system, lalu di-convert ke HTML/CSS responsive. Referensi style: modern, clean, professional.',
      category: 'UI/UX Design',
      skills: ['Figma', 'HTML', 'CSS', 'Responsive Design'],
      budget: 1200000, budgetType: 'fixed',
      deadline: Date.now() + 86400000 * 14,
      clientId: tokoBerkah.id, clientName: tokoBerkah.name, clientRating: 4.2,
      tags: ['ui-ux', 'company-profile', 'figma'],
      status: 'in-progress',
      assignedTo: rina.id, assignedName: rina.name,
      createdAt: Date.now() - 86400000 * 5
    });

    const p4 = this.createProject({
      title: 'Sistem Manajemen Inventori Gudang',
      description: 'Diperlukan sistem web-based untuk manajemen inventori gudang distribusi. Fitur utama: tracking barang masuk/keluar, multi-lokasi gudang, laporan stok real-time, notifikasi stok menipis, history transaksi, export PDF/Excel. Tech stack bebas (PHP/Laravel atau Node.js).',
      category: 'Web Development',
      skills: ['Laravel', 'PHP', 'MySQL', 'REST API'],
      budget: 3500000, budgetType: 'fixed',
      deadline: Date.now() + 86400000 * 25,
      clientId: ptMaju.id, clientName: ptMaju.name, clientRating: 4.6,
      tags: ['inventory', 'laravel', 'gudang'],
      createdAt: Date.now() - 86400000 * 3
    });

    const p5 = this.createProject({
      title: 'Analisis Data Penjualan & Prediksi Demand',
      description: 'Butuh data scientist untuk menganalisis data penjualan 2 tahun terakhir dan membuat model prediksi demand untuk bulan ke depan. Data sudah tersedia dalam format Excel. Output: dashboard interaktif (Streamlit/Dash) + laporan insight + model prediksi.',
      category: 'Data Science',
      skills: ['Python', 'Pandas', 'Machine Learning', 'Streamlit'],
      budget: 2000000, budgetType: 'fixed',
      deadline: Date.now() + 86400000 * 18,
      clientId: startup.id, clientName: startup.name, clientRating: 4.4,
      tags: ['data-science', 'python', 'ml', 'analytics'],
      createdAt: Date.now() - 86400000 * 4
    });

    const p6 = this.createProject({
      title: 'Landing Page Produk Digital dengan Animasi',
      description: 'Butuh landing page premium untuk produk digital kami. Harus ada hero dengan video background, section fitur dengan animasi scroll, pricing table, testimonial carousel, dan CTA yang kuat. Mobile-first, performance score harus 90+. Konten dan aset sudah siap.',
      category: 'Frontend',
      skills: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Performance Optimization'],
      budget: 800000, budgetType: 'fixed',
      deadline: Date.now() + 86400000 * 10,
      clientId: tokoBerkah.id, clientName: tokoBerkah.name, clientRating: 4.2,
      tags: ['landing-page', 'animation', 'frontend'],
      createdAt: Date.now() - 86400000 * 1
    });

    const p7 = this.createProject({
      title: 'REST API Backend untuk Platform Edukasi',
      description: 'Membangun REST API backend untuk platform e-learning. Endpoint yang dibutuhkan: auth (JWT), manajemen kursus, progress tracking, quiz system, sertifikat digital, dan payment integration. Dokumentasi API lengkap dengan Swagger wajib ada.',
      category: 'Backend',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger'],
      budget: 3000000, budgetType: 'fixed',
      deadline: Date.now() + 86400000 * 28,
      clientId: startup.id, clientName: startup.name, clientRating: 4.4,
      tags: ['backend', 'api', 'edukasi', 'nodejs'],
      status: 'completed',
      assignedTo: afiq.id, assignedName: afiq.name,
      createdAt: Date.now() - 86400000 * 45
    });

    const p8 = this.createProject({
      title: 'Aplikasi Presensi Karyawan dengan QR Code',
      description: 'Aplikasi web untuk sistem presensi karyawan menggunakan QR Code dinamis (refresh setiap 30 detik untuk keamanan). Fitur: generate QR, scan via smartphone, rekap absensi otomatis, izin/cuti online, export laporan ke Excel. Backend Node.js/Laravel.',
      category: 'Web Development',
      skills: ['React.js', 'Node.js', 'QR Code', 'WebSocket'],
      budget: 2200000, budgetType: 'fixed',
      deadline: Date.now() + 86400000 * 20,
      clientId: ptMaju.id, clientName: ptMaju.name, clientRating: 4.6,
      tags: ['absensi', 'qr-code', 'hr', 'react'],
      createdAt: Date.now() - 86400000 * 0.5
    });

    // Bids
    const b1 = this.createBid({
      projectId: p1.id, freelancerId: afiq.id, freelancerName: afiq.name,
      freelancerRating: 4.8, freelancerCompleted: 12,
      amount: 2300000, deliveryDays: 18,
      coverLetter: 'Halo! Saya sangat tertarik dengan proyek ini. Saya memiliki pengalaman 2 tahun membangun e-commerce dengan React + Node.js + MySQL. Sudah pernah integrasi Midtrans sebelumnya. Estimasi saya bisa selesai dalam 18 hari dengan kualitas tinggi. Ready untuk diskusi lebih lanjut!'
    });

    const b2 = this.createBid({
      projectId: p1.id, freelancerId: bagas.id, freelancerName: bagas.name,
      freelancerRating: 4.7, freelancerCompleted: 6,
      amount: 2500000, deliveryDays: 21,
      coverLetter: 'Saya berpengalaman dalam full-stack web development. Portfolio saya include beberapa e-commerce site. Bisa deliver sesuai deadline dengan kualitas premium.'
    });

    const b3 = this.createBid({
      projectId: p4.id, freelancerId: afiq.id, freelancerName: afiq.name,
      freelancerRating: 4.8, freelancerCompleted: 12,
      amount: 3200000, deliveryDays: 22,
      coverLetter: 'Pengalaman saya di sistem inventori sangat relevan. Pernah buat sistem serupa untuk 3 klien berbeda. Saya akan gunakan Laravel + MySQL dengan fitur real-time menggunakan WebSocket.'
    });

    const b4 = this.createBid({
      projectId: p5.id, freelancerId: bagas.id, freelancerName: bagas.name,
      freelancerRating: 4.7, freelancerCompleted: 6,
      amount: 1800000, deliveryDays: 15,
      coverLetter: 'Data Science adalah keahlian utama saya! Saya akan menggunakan Python (Pandas, Scikit-learn, Prophet untuk time series forecasting) dan membuat dashboard interaktif dengan Streamlit. Deliverable lengkap.'
    });

    const b5 = this.createBid({
      projectId: p2.id, freelancerId: rina.id, freelancerName: rina.name,
      freelancerRating: 4.9, freelancerCompleted: 8,
      amount: 4200000, deliveryDays: 28,
      coverLetter: 'Flutter adalah skill utama saya. Pernah buat 3 aplikasi kasir serupa sebelumnya. UI akan saya buat semenarik mungkin dengan UX yang intuitif untuk pengguna non-teknis.'
    });

    // Accepted bid for p3
    const b6 = this.createBid({
      projectId: p3.id, freelancerId: rina.id, freelancerName: rina.name,
      freelancerRating: 4.9, freelancerCompleted: 8,
      amount: 1100000, deliveryDays: 12,
      coverLetter: 'UI/UX adalah passion saya! Saya akan buat redesign yang modern dan conversion-focused. Figma design system + HTML/CSS responsive siap dalam 12 hari.'
    });
    Store.updateBid(b6.id, { status: 'accepted' });

    // Bid for p8
    const b7 = this.createBid({
      projectId: p8.id, freelancerId: afiq.id, freelancerName: afiq.name,
      freelancerRating: 4.8, freelancerCompleted: 12,
      amount: 2000000, deliveryDays: 17,
      coverLetter: 'Sistem QR presensi dinamis adalah sesuatu yang pernah saya buat sebelumnya! Saya akan gunakan WebSocket untuk refresh QR real-time dan React untuk frontend yang responsif.'
    });

    // Accepted bid for p7 (completed)
    const b8 = this.createBid({
      projectId: p7.id, freelancerId: afiq.id, freelancerName: afiq.name,
      freelancerRating: 4.8, freelancerCompleted: 12,
      amount: 2800000, deliveryDays: 25,
      coverLetter: 'Node.js + Express + PostgreSQL adalah stack favorit saya. Swagger documentation akan saya buat sangat detail.'
    });
    Store.updateBid(b8.id, { status: 'accepted' });

    // Conversations
    const conv1 = this.createConversation(afiq.id, ptMaju.id, p1.id);
    this.addMessage(conv1.id, ptMaju.id, 'Halo Afiq! Saya lihat bid kamu untuk proyek website toko online. Bisa ceritain lebih detail rencana teknologi yang akan dipakai?');
    this.addMessage(conv1.id, afiq.id, 'Halo Pak Budi! Siap. Jadi saya rencananya pakai React.js untuk frontend, Node.js + Express untuk backend, dan MySQL untuk database. Payment gateway pake Midtrans karena lebih mudah integrasi dan sudah banyak dipakai UMKM Indonesia.');
    this.addMessage(conv1.id, ptMaju.id, 'Oke mantap! Kalau untuk admin panelnya bagaimana?');
    this.addMessage(conv1.id, afiq.id, 'Admin panel akan saya buat dengan React juga, ada fitur: manajemen produk & kategori, tracking order, laporan penjualan dengan chart, dan manajemen user. Estimasi 18 hari sudah termasuk testing.');
    this.addMessage(conv1.id, ptMaju.id, 'Bagus! Saya tertarik. Bisa kita mulai minggu ini?');
    Store.markConvRead(conv1.id, afiq.id);

    const conv2 = this.createConversation(rina.id, tokoBerkah.id, p3.id);
    this.addMessage(conv2.id, rina.id, 'Halo Pak Ahmad! Saya Rina, desainer yang mengerjakan proyek redesign website Bapak. Mau konfirmasi beberapa hal sebelum mulai: referensi warna brand Toko Berkah apa ya? Dan ada logo yang bisa saya pakai?');
    this.addMessage(conv2.id, tokoBerkah.id, 'Halo Rina! Warna brand kita hijau dan putih. Logo ada, nanti saya kirim via email ya. Konten untuk tiap halaman sudah saya siapkan di Google Docs, linknya: docs.google.com/xxx');
    this.addMessage(conv2.id, rina.id, 'Siap! Sudah saya akses dokumennya. Sangat membantu. Saya akan mulai dari halaman Home dulu, draft pertama bisa saya share Kamis ini.');
    Store.markConvRead(conv2.id, rina.id);
    Store.markConvRead(conv2.id, tokoBerkah.id);

    const conv3 = this.createConversation(bagas.id, startup.id, p5.id);
    this.addMessage(conv3.id, startup.id, 'Bagas, saya lihat bid kamu menarik. Data yang kami punya ada 24 bulan, format Excel. Bisa handle sebesar itu?');
    this.addMessage(conv3.id, bagas.id, 'Bisa banget Bu Sarah! 24 bulan data itu justru bagus untuk machine learning. Makin banyak data, makin akurat prediksinya. Saya akan pakai Prophet dari Meta untuk time series forecasting, proven untuk retail demand prediction.');
    Store.markConvRead(conv3.id, bagas.id);

    // Payments
    const pay1 = this.createPayment({
      projectId: p7.id, projectTitle: p7.title,
      clientId: startup.id, freelancerId: afiq.id,
      amount: 2800000, method: 'transfer'
    });
    this.updatePayment(pay1.id, {
      status: 'released', releaseDate: Date.now() - 86400000 * 5
    });
    this.updateUser(afiq.id, { earnings: 17720000, completedProjects: 13 });

    const pay2 = this.createPayment({
      projectId: p3.id, projectTitle: p3.title,
      clientId: tokoBerkah.id, freelancerId: rina.id,
      amount: 1100000, method: 'transfer'
    });

    // Notifications
    this.createNotification(afiq.id, 'bid', 'Bid Kamu Diterima! 🎉',
      'Budi Santoso menerima bid kamu untuk proyek "REST API Backend untuk Platform Edukasi". Proyek senilai Rp2.800.000 dimulai!', '#/project/' + p7.id);
    this.createNotification(afiq.id, 'message', 'Pesan Baru dari Budi Santoso',
      'Budi Santoso: "Halo Afiq! Saya lihat bid kamu..."', '#/messages/' + conv1.id);
    this.createNotification(afiq.id, 'payment', 'Pembayaran Diterima! 💰',
      'Dana escrow sebesar Rp2.520.000 (setelah komisi) telah masuk ke saldo kamu.', '#/payment');
    this.createNotification(afiq.id, 'project', 'Proyek Baru Sesuai Skill Kamu',
      '"Aplikasi Presensi Karyawan dengan QR Code" - Budget Rp2.200.000. Deadline 20 hari.', '#/project/' + p8.id);
    this.createNotification(afiq.id, 'system', 'Profil Kamu 90% Lengkap',
      'Tambahkan nomor telepon dan foto profil untuk meningkatkan kepercayaan klien!', '#/profile');

    this.createNotification(ptMaju.id, 'bid', 'Bid Baru Masuk!',
      'Afiq Fathurrahman mengajukan bid Rp2.300.000 untuk "Website Toko Online Pakaian Fashion".', '#/project/' + p1.id);
    this.createNotification(ptMaju.id, 'bid', 'Bid Baru Masuk!',
      'Bagas Pratama mengajukan bid Rp2.500.000 untuk "Website Toko Online Pakaian Fashion".', '#/project/' + p1.id);
    this.createNotification(ptMaju.id, 'bid', 'Bid Baru untuk Proyek Inventori',
      'Afiq Fathurrahman mengajukan bid Rp3.200.000 untuk "Sistem Manajemen Inventori Gudang".', '#/project/' + p4.id);
    this.createNotification(ptMaju.id, 'message', 'Pesan Baru',
      'Afiq Fathurrahman membalas pesanmu tentang Website Toko Online.', '#/messages/' + conv1.id);

    this.createNotification(rina.id, 'bid', 'Bid Kamu Diterima! 🎉',
      'Ahmad Rizky menerima bid kamu untuk proyek "Redesign UI/UX Website Company Profile". Yuk mulai!', '#/project/' + p3.id);
    this.createNotification(rina.id, 'payment', 'Escrow Masuk',
      'Dana Rp1.100.000 sudah di-escrow oleh klien untuk proyek Company Profile Toko Berkah.', '#/payment');

    localStorage.setItem(ITC_KEYS.SEEDED, '1');
    console.log('[ITConnect] Seed data loaded ✓');
  }
};

window.Store = Store;
