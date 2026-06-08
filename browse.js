/* ========================================
   ITConnect — Browse View (Cari Proyek)
   ======================================== */
const BrowseView = {
  render() {
    const user = Store.getCurrentUser();
    return `
    <div class="max-w-6xl mx-auto px-4 py-8 fade-in">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Cari Proyek IT</h1>
          <p class="text-slate-400">Temukan proyek yang sesuai dengan keahlianmu.</p>
        </div>
        <div class="flex gap-2">
          <div class="input-icon-wrapper w-full md:w-64">
            <i data-lucide="search" class="input-icon"></i>
            <input type="text" id="search-project" placeholder="Ketik kata kunci..." class="form-input pl-10">
          </div>
          <select id="filter-category" class="form-input w-full md:w-48 appearance-none bg-navy-900/50">
            <option value="">Semua Kategori</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Data Science">Data Science</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
          </select>
        </div>
      </div>

      <div id="browse-results" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        </div>
    </div>`;
  },

  init() {
    if (window.lucide) lucide.createIcons();
    this.urlFiltered = false;
    this.loadProjects();

    // Event listeners untuk fitur pencarian
    document.getElementById('search-project')?.addEventListener('input', () => this.loadProjects());
    document.getElementById('filter-category')?.addEventListener('change', () => this.loadProjects());
  },

  loadProjects() {
    const user = Store.getCurrentUser();
    const container = document.getElementById('browse-results');
    if (!container) return;

    const searchQuery = (document.getElementById('search-project')?.value || '').toLowerCase();
    const categoryFilter = document.getElementById('filter-category')?.value || '';

    // Deteksi jika user klik kategori dari halaman Home (URL params)
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const urlCategory = urlParams.get('cat');
    
    if (urlCategory && !categoryFilter && !this.urlFiltered) {
        const select = document.getElementById('filter-category');
        if (select) {
            let exists = Array.from(select.options).some(opt => opt.value === urlCategory);
            if (!exists) select.add(new Option(urlCategory, urlCategory));
            select.value = urlCategory;
        }
        this.urlFiltered = true; 
        this.loadProjects(); 
        return;
    }

    let projects = Store.getOpenProjects();

    // Logika Filter
    projects = projects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery) || 
                          p.description.toLowerCase().includes(searchQuery) ||
                          (p.skills || []).some(s => s.toLowerCase().includes(searchQuery));
      
      const activeCategory = categoryFilter || urlCategory;
      const matchCategory = activeCategory ? p.category === activeCategory : true;

      return matchSearch && matchCategory;
    });

    // Render ke HTML
    if (projects.length === 0) {
      container.innerHTML = `<div class="col-span-full">` + 
        UI.emptyState('search-x', 'Tidak ditemukan', 'Coba gunakan kata kunci atau kategori lain.') + 
        `</div>`;
    } else {
      container.innerHTML = projects.map(p => UI.projectCard(p, user)).join('');
    }
    
    if (window.lucide) lucide.createIcons({ nodes: [container] });
  }
};
window.BrowseView = BrowseView;