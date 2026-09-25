// BookNest Utility Functions

// Show a message on the page
function showMessage(element, message, type = "success") {
  if (!element) return;

  element.textContent = message;
  element.classList.remove("is-hidden", "is-success", "is-error");

  if (type === "success") {
    element.classList.add("is-success");
  } else if (type === "error") {
    element.classList.add("is-error");
  }
}

// Escape HTML to prevent unwanted HTML from being inserted
function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Format a number as a price
function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "N/A";
  }

  return `$${Number(price).toFixed(2)}`;
}

// Create a safe image URL
function getCoverImage(book) {
  const cover = book && typeof book.cover === "string" ? book.cover.trim() : "";

  if (!cover) {
    return "./frontend/images/covers/placeholder.svg";
  }

  if (/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(cover)) {
    return cover;
  }

  return `./frontend/${cover.replace(/^(?:\.\/)+/, "")}`;
}
