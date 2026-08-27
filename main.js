// Shared JavaScript for the website.
// Additional functionality can be added here as the site grows.

document.querySelectorAll(".year").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
