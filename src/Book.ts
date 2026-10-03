
class Book {
  static #nextId = 1;

  readonly #id: number;
  #title: string;
  #author: string;
  #category: string;
  #isAvailable: boolean;

  constructor(title: string, author: string, category: string, isAvailable: boolean = true) {
    this.#id = Book.#nextId++;
    this.#title = title;
    this.#author = author;
    this.#category = category;
    this.#isAvailable = isAvailable;
  }

  getId(): number { return this.#id; }
  getTitle(): string { return this.#title; }
  getAuthor(): string { return this.#author; }
  getCategory(): string { return this.#category; }
  isAvailable(): boolean { return this.#isAvailable; }

  setAvailability(value: boolean): void { this.#isAvailable = value; }
  toggleAvailability(): void { this.#isAvailable = !this.#isAvailable; }

  displayInfo(): string {
    const status = this.#isAvailable ? "متاح" : "غير متاح";
    return `${this.#title} - ${this.#author} (${this.#category}) - ${status}`;
  }
}
