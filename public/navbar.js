// In your navbar.js or in the script tag where you handle navbar logic

document.addEventListener("DOMContentLoaded", () => {
  const userType = localStorage.getItem("userType");

  if (userType === "admin") {
    const adminLinksHtml = `
      <li class="admin-link"><a href="bulkupload.html">Bulk Upload</a></li>
      <li class="admin-link"><a href="product-edit.html">Edit Product</a></li>
    `;
    const navLinks = document.querySelector(".nav-links");
    navLinks.insertAdjacentHTML("beforeend", adminLinksHtml);
  }
});
