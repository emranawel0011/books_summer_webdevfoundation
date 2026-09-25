const searchInput = document.querySelector("#search-input");
const genreSelect = document.querySelector("#genre-select");
const bookGrid = document.querySelector("#book-grid");
const resultCount = document.querySelector("#result-count");

let books = [];

async function fetchBooks() {
  try {
    bookGrid.innerHTML = "<p>Loading books...</p>";

    const response = await fetch(`${API_BASE_URL}/books`);

    if (!response.ok) {
      throw new Error("Failed to load books");
    }

    books = await response.json();

    displayBooks(books);
  } catch (error) {
    console.error(error);
    bookGrid.innerHTML = "<p>Unable to load books.</p>";
  }
}

function displayBooks(booksToDisplay) {
  resultCount.textContent = `Showing ${booksToDisplay.length} books`;

  if (booksToDisplay.length === 0) {
    bookGrid.innerHTML = "<p>No books found.</p>";
    return;
  }

  bookGrid.innerHTML = booksToDisplay
    .map(
      (book) => `
        <article class="book-card">
          <img
            src="${getCoverImage(book)}"
            alt="Cover of ${book.title}"
            class="book-card-cover"
            onerror="this.onerror=null;this.src='./frontend/images/covers/placeholder.svg'"
          >
          <div class="book-card-body">
            <h3 class="book-card-title">${book.title}</h3>
            <p class="book-card-author">${book.author}</p>
            <p>${book.genre}</p>
            <div class="book-card-actions">
              <a href="./frontend/HTML/details.html?id=${book.id}">View Details</a>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

async function fetchGenres() {
  try {
    const response = await fetch(`${API_BASE_URL}/genres`);

    if (!response.ok) {
      throw new Error("Failed to load genres");
    }

    const genres = await response.json();

    genres.forEach((genre) => {
      const option = document.createElement("option");

      option.value = genre;
      option.textContent = genre;

      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

function filterBooks() {
  const searchText = searchInput.value.toLowerCase();
  const selectedGenre = genreSelect.value;

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText);

    const matchesGenre = selectedGenre === "" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  displayBooks(filteredBooks);
}

fetchBooks();
fetchGenres();

searchInput.addEventListener("input", filterBooks);
genreSelect.addEventListener("change", filterBooks);
