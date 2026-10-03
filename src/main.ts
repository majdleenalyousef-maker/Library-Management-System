const PAGE_SIZE = 8;   
let currentPage = 1;   

const library = new Library();

[
  new Book("إدارة الأعمال", "د. ندى الحسن", "إدارة الأعمال"),
  new Book("التاريخ الإسلامي", "د. سامر الخطيب", "التاريخ"),
  new Book("علم النفس العام", "د. ريم ناصر", "علم النفس", false),
  new Book("الذكاء الاصطناعي", "د. عمر الكيلاني", "علوم الحاسوب"),
  new Book("الاقتصاد الكلي", "د. ليلى مراد", "الاقتصاد", false),
  new Book("التحليل الإحصائي", "د. خالد مصطفى", "الإحصاء"),
  new Book("التسويق الحديث", "د. رانيا قاسم", "التسويق"),
  new Book("الشبكات وأمن المعلومات", "د. إياد منصور", "علوم الحاسوب", false),
 
].forEach(book => library.addBook(book));

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const searchInput = $<HTMLInputElement>("search");
const categorySelect = $<HTMLSelectElement>("category");
const categoryList = $<HTMLDataListElement>("category-list");
const booksEl = $<HTMLElement>("books");
const totalEl = $<HTMLElement>("total");
const pagesEl = $<HTMLElement>("pages");
const addDialog = $<HTMLDialogElement>("add-dialog");
const addForm = $<HTMLFormElement>("add-form");



function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", text = ""): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}


function hueOf(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

function closeMenus(): void {
  document.querySelectorAll<HTMLElement>(".dropdown").forEach(d => (d.hidden = true));
}

function createCard(book: Book): HTMLElement {
  const card = el("article", "card");
  card.style.setProperty("--hue", String(hueOf(book.getCategory())));


  const info = el("div", "info");
  info.append(
    el("h3", "", book.getTitle()),
    el("p", "author", book.getAuthor()),
    el("span", "pill cat", book.getCategory()),
    el("span", "pill " + (book.isAvailable() ? "ok" : "no"), book.isAvailable() ? "متاح حالياً" : "غير متاح حالياً")
  );
  if (book instanceof ReferenceBook) {
    info.append(el("span", "location", "الموقع: " + book.getLocationCode()));
  }
  const cover = el("div", "cover");
  cover.append(el("span", "", book.getTitle()));
  const top = el("div", "card-top");
  top.append(info, cover);


  const toggleInput = el("input");
  toggleInput.type = "checkbox";
  toggleInput.checked = book.isAvailable();
  toggleInput.setAttribute("aria-label", "تغيير حالة " + book.getTitle());
  toggleInput.addEventListener("change", () => {
    library.toggleAvailability(book.getId());
    render();
  });
  const sw = el("label", "switch");
  sw.append(toggleInput, el("span", "slider"));


  const kebab = el("button", "kebab", "⋮");
  kebab.type = "button";
  kebab.setAttribute("aria-label", "خيارات الكتاب");
  const dropdown = el("div", "dropdown");
  dropdown.hidden = true;
  const detailsBtn = el("button", "", "عرض التفاصيل");
  detailsBtn.addEventListener("click", () => alert(book.displayInfo())); // تعدد الأشكال
  const deleteBtn = el("button", "danger", "حذف الكتاب");
  deleteBtn.addEventListener("click", () => {
    library.removeBook(book.getId());
    refreshCategories();
    render();
  });
  dropdown.append(detailsBtn, deleteBtn);
  kebab.addEventListener("click", (e: Event) => {
    e.stopPropagation();               // حتى لا يغلقها click الصفحة فورًا
    const wasHidden = dropdown.hidden;
    closeMenus();
    dropdown.hidden = !wasHidden;
  });
  const menu = el("div", "menu");
  menu.append(kebab, dropdown);

  const foot = el("div", "card-foot");
  foot.append(sw, el("span", "switch-text", book.isAvailable() ? "متاح" : "غير متاح"), menu);

  card.append(top, foot);
  return card;
}  
function renderPagination(totalPages: number): void {
  const makeButton = (label: string, page: number, disabled = false, active = false): HTMLButtonElement => {
    const b = el("button", active ? "active" : "", label);
    b.type = "button";
    b.disabled = disabled;
    b.addEventListener("click", () => {
      currentPage = page;
      render();
    });
    return b;
  };
  const buttons = [makeButton("‹", currentPage - 1, currentPage === 1)];
  for (let p = 1; p <= totalPages; p++) {
    buttons.push(makeButton(String(p), p, false, p === currentPage));
  }
  buttons.push(makeButton("›", currentPage + 1, currentPage === totalPages));
  pagesEl.replaceChildren(...buttons);
}

function render(): void {

  const result = library.filterByCategory(categorySelect.value, library.searchBooks(searchInput.value));


  const totalPages = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;


  booksEl.replaceChildren(...result.slice(start, start + PAGE_SIZE).map(createCard));
  if (result.length === 0) {
    booksEl.append(el("p", "empty", "لا توجد كتب مطابقة. جرّب تغيير البحث أو الفئة."));
  }
  totalEl.textContent = `إجمالي الكتب: ${result.length} كتاب`;
  renderPagination(totalPages);
}

function refreshCategories(): void {
  const current = categorySelect.value || "all";
  const categories = library.getCategories();
  categorySelect.replaceChildren(new Option("جميع الفئات", "all"), ...categories.map(c => new Option(c, c)));
  categorySelect.value = categories.includes(current) ? current : "all";
  categoryList.replaceChildren(...categories.map(c => new Option(c))); 
}
searchInput.addEventListener("input", () => { currentPage = 1; render(); });
categorySelect.addEventListener("change", () => { currentPage = 1; render(); });
document.addEventListener("click", closeMenus);

$("open-add").addEventListener("click", () => addDialog.showModal());
$("cancel-add").addEventListener("click", () => addDialog.close());

addForm.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const data = new FormData(addForm);
  const title = String(data.get("title") ?? "").trim();
  const author = String(data.get("author") ?? "").trim();
  const category = String(data.get("category") ?? "").trim();
  const code = String(data.get("locationCode") ?? "").trim();
  if (!title || !author || !category) return;

  library.addBook(code ? new ReferenceBook(title, author, category, code) : new Book(title, author, category));
  addForm.reset();
  addDialog.close();
  refreshCategories();
  searchInput.value = "";
  categorySelect.value = "all";
  currentPage = Number.MAX_SAFE_INTEGER; // render() 
  render();
});

refreshCategories();
render();