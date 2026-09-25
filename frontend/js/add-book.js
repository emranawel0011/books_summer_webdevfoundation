// Get the form
const bookForm = document.querySelector("#book-form");

// Get the inputs
const titleInput = document.querySelector("#title-input");
const authorInput = document.querySelector("#author-input");
const genreInput = document.querySelector("#genre-input");
const yearInput = document.querySelector("#year-input");
const ratingInput = document.querySelector("#rating-input");
const priceInput = document.querySelector("#price-input");
const pagesInput = document.querySelector("#pages-input");
const languageInput = document.querySelector("#language-input");
const coverInput = document.querySelector("#cover-input");
const descriptionInput = document.querySelector("#description-input");

const formMessage = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-btn");

bookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const bookData = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    genre: genreInput.value,
    year: yearInput.value ? Number(yearInput.value) : null,
    rating: ratingInput.value ? Number(ratingInput.value) : null,
    price: priceInput.value ? Number(priceInput.value) : null,
    pages: pagesInput.value ? Number(pagesInput.value) : null,
    language: languageInput.value.trim(),
    cover: coverInput.value.trim(),
    description: descriptionInput.value.trim()
  };

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Adding book...";

    const response = await fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookData)
    });

    const result = await response.json();

    if (!response.ok) {
    throw new Error(result.error || "Failed to add book");
}

showMessage("Book added successfully! 📚", "success");

bookForm.reset();
    formMessage.classList.remove("is-hidden");

    bookForm.reset();

  } catch (error) {
    console.error(error);

    formMessage.textContent = error.message;
    formMessage.classList.remove("is-hidden");

  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Add book";
  }
});