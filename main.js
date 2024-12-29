// Menyimpan data buku
let books = JSON.parse(localStorage.getItem("books")) || [];

// Elemen DOM
const bookForm = document.getElementById("bookForm");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const searchBookForm = document.getElementById("searchBook");

// Fungsi untuk menyimpan ke localStorage
function saveBooksToStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

// Fungsi untuk membuat elemen buku
function createBookElement(book) {
  const bookElement = document.createElement("div");
  bookElement.setAttribute("data-bookid", book.id);
  bookElement.setAttribute("data-testid", "bookItem");

  bookElement.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${
        book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
      }</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  // Event Listener untuk tombol
  const isCompleteButton = bookElement.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );
  const deleteButton = bookElement.querySelector(
    '[data-testid="bookItemDeleteButton"]'
  );
  const editButton = bookElement.querySelector(
    '[data-testid="bookItemEditButton"]'
  );

  isCompleteButton.addEventListener("click", () => toggleBookCompletion(book.id));
  deleteButton.addEventListener("click", () => deleteBook(book.id));
  editButton.addEventListener("click", () => editBook(book));

  return bookElement;
}

// Fungsi untuk merender ulang daftar buku
function renderBooks() {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Fungsi untuk menambah buku
bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: new Date().getTime(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooksToStorage();
  renderBooks();

  bookForm.reset();
});

// Fungsi untuk menghapus buku
function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveBooksToStorage();
  renderBooks();
}

// Fungsi untuk memindahkan buku antar rak
function toggleBookCompletion(bookId) {
  const book = books.find((book) => book.id === bookId);
  book.isComplete = !book.isComplete;
  saveBooksToStorage();
  renderBooks();
}

// Fungsi untuk mengedit buku
function editBook(book) {
  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  deleteBook(book.id);
}

// Fungsi untuk pencarian buku
searchBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchQuery = document.getElementById("searchBookTitle").value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery)
  );

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
});

// Render awal
renderBooks();
