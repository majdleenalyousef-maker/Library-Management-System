
class Book {
    static #nextId = 1;
    #id;
    #title;
    #author;
    #category;
    #isAvailable;
    constructor(title, author, category, isAvailable = true) {
        this.#id = Book.#nextId++;
        this.#title = title;
        this.#author = author;
        this.#category = category;
        this.#isAvailable = isAvailable;
    }
    getId() { return this.#id; }
    getTitle() { return this.#title; }
    getAuthor() { return this.#author; }
    getCategory() { return this.#category; }
    isAvailable() { return this.#isAvailable; }
    setAvailability(value) { this.#isAvailable = value; }
    toggleAvailability() { this.#isAvailable = !this.#isAvailable; }
    displayInfo() {
        const status = this.#isAvailable ? "متاح" : "غير متاح";
        return `${this.#title} - ${this.#author} (${this.#category}) - ${status}`;
    }
}

class ReferenceBook extends Book {
    #locationCode;
    constructor(title, author, category, locationCode, isAvailable = true) {
        super(title, author, category, isAvailable);
        this.#locationCode = locationCode;
    }
    getLocationCode() { return this.#locationCode; }

    displayInfo() {
        return `${super.displayInfo()} - مرجع | الموقع: ${this.#locationCode}`;
    }
}

class Library {
    #books = [];
    addBook(book) {
        this.#books.push(book);
    }
    removeBook(id) {
        const index = this.#books.findIndex(b => b.getId() === id);
        if (index === -1)
            return false;
        this.#books.splice(index, 1);
        return true;
    }
    searchBooks(query, source = this.#books) {
        const q = query.trim().toLowerCase();
        if (!q)
            return [...source];
        return source.filter(b => b.getTitle().toLowerCase().includes(q) || b.getAuthor().toLowerCase().includes(q));
    }
    filterByCategory(category, source = this.#books) {
        if (category === "all")
            return [...source];
        return source.filter(b => b.getCategory() === category);
    }
    toggleAvailability(id) {
        this.#books.find(b => b.getId() === id)?.toggleAvailability();
    }
    getCategories() {
        return [...new Set(this.#books.map(b => b.getCategory()))];
    }
}
const PAGE_SIZE = 8; // عدد الكتب في الصفحة
let currentPage = 1; // الصفحة الحالية
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
    new Book("قواعد البيانات", "د. هاني سليم", "علوم الحاسوب"),
    new Book("الفيزياء العامة", "د. سلمى عيسى", "الفيزياء"),
    new ReferenceBook("معجم اللغة العربية", "مجمع اللغة العربية", "مراجع", "الطابق 1 - رف A3"),
    new ReferenceBook("موسوعة العلوم", "مجموعة مؤلفين", "مراجع", "الطابق 2 - رف B1"),
].forEach(book => library.addBook(book));
const $ = (id) => document.getElementById(id);
const searchInput = $("search");
const categorySelect = $("category");
const categoryList = $("category-list");
const booksEl = $("books");
const totalEl = $("total");
const pagesEl = $("pages");
const addDialog = $("add-dialog");
const addForm = $("add-form");

function el(tag, className = "", text = "") {
    const node = document.createElement(tag);
    if (className)
        node.className = className;
    if (text)
        node.textContent = text;
    return node;
}

function hueOf(text) {
    let h = 0;
    for (const ch of text)
        h = (h * 31 + ch.charCodeAt(0)) % 360;
    return h;
}

function closeMenus() {
    document.querySelectorAll(".dropdown").forEach(d => (d.hidden = true));
}
function createCard(book) {
    const card = el("article", "card");
    card.style.setProperty("--hue", String(hueOf(book.getCategory())));

    const info = el("div", "info");
    info.append(el("h3", "", book.getTitle()), el("p", "author", book.getAuthor()), el("span", "pill cat", book.getCategory()), el("span", "pill " + (book.isAvailable() ? "ok" : "no"), book.isAvailable() ? "متاح حالياً" : "غير متاح حالياً"));
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
    kebab.addEventListener("click", (e) => {
        e.stopPropagation(); // حتى لا يغلقها click الصفحة فورًا
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
function renderPagination(totalPages) {
    const makeButton = (label, page, disabled = false, active = false) => {
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
function render() {

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
function refreshCategories() {
    const current = categorySelect.value || "all";
    const categories = library.getCategories();
    categorySelect.replaceChildren(new Option("جميع الفئات", "all"), ...categories.map(c => new Option(c, c)));
    categorySelect.value = categories.includes(current) ? current : "all";
    categoryList.replaceChildren(...categories.map(c => new Option(c))); // اقتراحات حقل الفئة في الفورم
}
searchInput.addEventListener("input", () => { currentPage = 1; render(); });
categorySelect.addEventListener("change", () => { currentPage = 1; render(); });
document.addEventListener("click", closeMenus);
$("open-add").addEventListener("click", () => addDialog.showModal());
$("cancel-add").addEventListener("click", () => addDialog.close());
addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(addForm);
    const title = String(data.get("title") ?? "").trim();
    const author = String(data.get("author") ?? "").trim();
    const category = String(data.get("category") ?? "").trim();
    const code = String(data.get("locationCode") ?? "").trim();
    if (!title || !author || !category)
        return;
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
