const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const bookDetail = document.querySelector("#book-detail");
const editPanel = document.querySelector("#edit-panel");
const editForm = document.querySelector("#edit-form");

const editTitle = document.querySelector("#edit-title");
const editAuthor = document.querySelector("#edit-author");
const editGenre = document.querySelector("#edit-genre");
const editYear = document.querySelector("#edit-year");
const editRating = document.querySelector("#edit-rating");
const editPrice = document.querySelector("#edit-price");
const editPages = document.querySelector("#edit-pages");
const editLanguage = document.querySelector("#edit-language");
const editCover = document.querySelector("#edit-cover");
const editDescription = document.querySelector("#edit-description");

const editMessage = document.querySelector("#edit-message");
const saveButton = document.querySelector("#save-btn");
const cancelButton = document.querySelector("#cancel-edit-btn");

let currentBook = null;

// ===============================
// GET ONE BOOK
// ===============================

async function loadBook() {
  try {
    bookDetail.innerHTML = "<p>Loading book...</p>";

    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);

    if (!response.ok) {
      throw new Error("Book not found");
    }

    currentBook = await response.json();

    showBook(currentBook);
  } catch (error) {
    console.error(error);
    bookDetail.innerHTML = `<p>${error.message}</p>`;
  }
}

// ===============================
// SHOW BOOK
// ===============================

function showBook(book) {
  bookDetail.innerHTML = `
    <article class="book-detail-card">

      <img
        src="${getCoverImage(book)}"
        alt="Cover of ${book.title}"
        class="book-detail-image"
        onerror="this.onerror=null;this.src='./frontend/images/covers/placeholder.svg'"
      >

      <div class="book-detail-info">

        <h1>${book.title}</h1>

        <p><strong>Author:</strong> ${book.author}</p>

        <p><strong>Genre:</strong> ${book.genre}</p>

        <p><strong>Year:</strong> ${book.year || "N/A"}</p>

        <p><strong>Rating:</strong> ${book.rating || "N/A"}</p>

        <p><strong>Price:</strong> $${book.price || "N/A"}</p>

        <p><strong>Pages:</strong> ${book.pages || "N/A"}</p>

        <p><strong>Language:</strong> ${book.language || "N/A"}</p>

        <p>
          <strong>Description:</strong>
          ${book.description || "No description"}
        </p>

        <div class="form-actions">

          <button
            type="button"
            class="btn btn-primary"
            id="edit-book-btn"
          >
            Edit Book
          </button>

          <button
            type="button"
            class="btn btn-outline"
            id="delete-book-btn"
          >
            Delete Book
          </button>

        </div>

      </div>

    </article>
  `;

  document
    .querySelector("#edit-book-btn")
    .addEventListener("click", openEditForm);

  document
    .querySelector("#delete-book-btn")
    .addEventListener("click", deleteBook);
}

// ===============================
// OPEN EDIT FORM
// ===============================

function openEditForm() {
  editPanel.classList.remove("is-hidden");

  editTitle.value = currentBook.title || "";
  editAuthor.value = currentBook.author || "";
  editGenre.value = currentBook.genre || "";
  editYear.value = currentBook.year || "";
  editRating.value = currentBook.rating || "";
  editPrice.value = currentBook.price || "";
  editPages.value = currentBook.pages || "";
  editLanguage.value = currentBook.language || "";
  editCover.value = currentBook.cover || "";
  editDescription.value = currentBook.description || "";

  window.scrollTo({
    top: editPanel.offsetTop,
    behavior: "smooth",
  });
}

// ===============================
// SAVE EDIT
// ===============================

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const updatedBook = {
    title: editTitle.value.trim(),
    author: editAuthor.value.trim(),
    genre: editGenre.value,
    year: editYear.value ? Number(editYear.value) : null,
    rating: editRating.value ? Number(editRating.value) : null,
    price: editPrice.value ? Number(editPrice.value) : null,
    pages: editPages.value ? Number(editPages.value) : null,
    language: editLanguage.value.trim(),
    cover: editCover.value.trim(),
    description: editDescription.value.trim(),
  };

  if (!updatedBook.title || !updatedBook.author || !updatedBook.genre) {
    editMessage.textContent = "Title, Author and Genre are required.";

    editMessage.classList.remove("is-hidden");

    return;
  }

  try {
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update book");
    }

    currentBook = result;

    showBook(currentBook);

    editPanel.classList.add("is-hidden");

    editMessage.textContent = "Book updated successfully! ✅";
    editMessage.classList.remove("is-hidden");
  } catch (error) {
    console.error(error);

    editMessage.textContent = error.message;
    editMessage.classList.remove("is-hidden");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save changes";
  }
});

// ===============================
// CANCEL EDIT
// ===============================

cancelButton.addEventListener("click", () => {
  editPanel.classList.add("is-hidden");
});

// ===============================
// DELETE BOOK
// ===============================

async function deleteBook() {
  const confirmed = confirm("Are you sure you want to delete this book?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to delete book");
    }

    alert("Book deleted successfully! 🗑️");

    window.location.href = "index.html";
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

// Start
loadBook();
