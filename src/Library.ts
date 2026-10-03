
class Library {
  #books: Book[] = [];

  addBook(book: Book): void {
    this.#books.push(book);
  }

  removeBook(id: number): boolean {
    const index = this.#books.findIndex(b => b.getId() === id);
    if (index === -1) return false;
    this.#books.splice(index, 1);
    return true;
  }

  searchBooks(query: string, source: Book[] = this.#books): Book[] {
    const q = query.trim().toLowerCase();
    if (!q) return [...source];
    return source.filter(b =>
      b.getTitle().toLowerCase().includes(q) || b.getAuthor().toLowerCase().includes(q)
    );
  }

  filterByCategory(category: string, source: Book[] = this.#books): Book[] {
    if (category === "all") return [...source];
    return source.filter(b => b.getCategory() === category);
  }

  toggleAvailability(id: number): void {
    this.#books.find(b => b.getId() === id)?.toggleAvailability();
  }

  getCategories(): string[] {
    return [...new Set(this.#books.map(b => b.getCategory()))];
  }
}
