# Library Management System

A simple educational project that simulates an **electronic library management system**, built with **Object-Oriented Programming (OOP)** in **TypeScript**.
Only **HTML + CSS + TypeScript** are used — no external libraries (no jQuery, no Bootstrap).

---

## ✨ Features

- Books displayed as **cards** (title, author, category, availability)
- **Search** by book title or author
- **Category filter** (dropdown)
- **Toggle availability** (available / unavailable) with a switch
- **Add** a new book (or a reference book if a location code is entered)
- **Delete** a book
- **Pagination** (8 books per page)
- Search and category filter work **together**

---

## 🗂️ Project Structure

```
task-1-adv/
├── index.html            # User interface
├── style.css             # Styling
├── src/
│   ├── Book.ts           # Base class
│   ├── ReferenceBook.ts  # Child class (extends Book)
│   ├── Library.ts        # Manages the collection of books
│   └── main.ts           # Connects the classes to the UI (DOM)
├── dist/main.js          # Compiled output (loaded by index.html)
├── tsconfig.json
└── package.json
```

---

## 🧱 Classes

### `Book`

| Member | Description |
|---|---|
| `#title`, `#author`, `#category`, `#isAvailable` | Private properties |
| `getTitle()`, `getAuthor()`, `getCategory()`, `isAvailable()` | Getters |
| `setAvailability(value)`, `toggleAvailability()` | Change availability |
| `displayInfo()` | Returns the book information as text |

### `ReferenceBook extends Book`

| Member | Description |
|---|---|
| `#locationCode` | Where the book is located (e.g. "Floor 1 - Shelf A3") |
| `getLocationCode()` | Getter |
| `displayInfo()` | **Overridden** to also show the location |

### `Library`

| Method | Description |
|---|---|
| `addBook(book)` | Add a book |
| `removeBook(id)` | Remove a book |
| `searchBooks(query)` | Search by title or author |
| `filterByCategory(category)` | Filter by category |
| `toggleAvailability(id)` | Toggle a book's availability |

The books array inside `Library` is private (`#books`).

---

## 🧠 OOP Concepts Applied

| Concept | How it is applied |
|---|---|
| **Classes** | `Book`, `ReferenceBook`, `Library` |
| **Encapsulation** | All internal data uses private `#` fields (`#title`, `#isAvailable`, `#books`, ...) |
| **Abstraction** | Properties are never accessed directly, only through dedicated methods such as `getTitle()` and `toggleAvailability()` |
| **Inheritance** | `ReferenceBook extends Book` and adds `locationCode` |
| **Polymorphism** | `displayInfo()` is overridden in `ReferenceBook` and shows extra info; the "View details" button calls it on any book |

---

## 🚀 How to Run

```bash
npm install      # installs the TypeScript compiler only
npm run build    # compiles src/*.ts into dist/main.js
```

Then open `index.html` in your browser.

During development you can use `npm run watch` to recompile automatically.


