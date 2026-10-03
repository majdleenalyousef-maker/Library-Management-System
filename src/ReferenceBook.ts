
class ReferenceBook extends Book {
  #locationCode: string;

  constructor(title: string, author: string, category: string, locationCode: string, isAvailable: boolean = true) {
    super(title, author, category, isAvailable);
    this.#locationCode = locationCode;
  }

  getLocationCode(): string { return this.#locationCode; }


  override displayInfo(): string {
    return `${super.displayInfo()} - مرجع | الموقع: ${this.#locationCode}`;
  }
}
