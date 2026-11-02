// =====================================
// ONLINE LIBRARY MANAGEMENT SYSTEM
// =====================================
// Get data from LocalStorage
let books = JSON.parse(localStorage.getItem("books")) || [];
let records = JSON.parse(localStorage.getItem("records")) || [];
// Demo books for first-time users
if (books.length === 0) {
 books = [
 {
 id: 1,
 isbn: "978001",
 title: "Python Programming",
 author: "Guido van Rossum",
 category: "Programming",
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 isIssued: false
 },
 {
 id: 2,
 isbn: "978002",
 title: "Web Development",
 author: "Jon Duckett",
 category: "Technology",
 isIssued: false
 },
 {
 id: 3,
 isbn: "978003",
 title: "Database Management",
 author: "Raghu Ramakrishnan",
 category: "Education",
 isIssued: false
 }
 ];
}
function saveData() {
 localStorage.setItem("books", JSON.stringify(books));
 localStorage.setItem("records", JSON.stringify(records));
}
// Generate local date in YYYY-MM-DD format
function today() {
 const d = new Date();
 const year = d.getFullYear();
 const month = String(d.getMonth() + 1).padStart(2, "0");
 const day = String(d.getDate()).padStart(2, "0");
 return `${year}-${month}-${day}`;
}
// Safely display user-entered text
function escapeHTML(value) {
 return String(value).replace(/[&<>"']/g, char => ({
 "&": "&amp;",
 "<": "&lt;",
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 ">": "&gt;",
 '"': "&quot;",
 "'": "&#39;"
 })[char]);
}
// =====================================
// NAVIGATION
// =====================================
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");
navButtons.forEach(button => {
 button.addEventListener("click", () => {
 navButtons.forEach(btn => btn.classList.remove("active"));
 pages.forEach(page => page.classList.remove("active"));
 button.classList.add("active");
 const pageId = button.dataset.page;
 document.getElementById(pageId).classList.add("active");
 const titles = {
 dashboard: "Dashboard",
 books: "Manage Books",
 issue: "Issue Book",
 records: "Issue & Return Records"
 };
 document.getElementById("page-title").textContent =
 titles[pageId];
 renderAll();
 });
});
// =====================================
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
// DASHBOARD
// =====================================
function renderDashboard() {
 document.getElementById("totalBooks").textContent =
 books.length;
 document.getElementById("availableBooks").textContent =
 books.filter(book => !book.isIssued).length;
 document.getElementById("issuedBooks").textContent =
 books.filter(book => book.isIssued).length;
 const students = new Set(
 records.map(record => record.studentId)
 );
 document.getElementById("totalStudents").textContent =
 students.size;
 const recent = [...records]
 .sort((a, b) => b.id - a.id)
 .slice(0, 5);
 document.getElementById("recentTable").innerHTML =
 recent.length
 ? recent.map(record => `
 <tr>
 <td>${escapeHTML(record.studentName)}</td>
 <td>${escapeHTML(record.bookTitle)}</td>
 <td>${escapeHTML(record.issueDate)}</td>
 <td>${escapeHTML(record.dueDate)}</td>
 </tr>
 `).join("")
 : `<tr><td colspan="4">No books issued yet.</td></tr>`;
}
// =====================================
// ADD AND UPDATE BOOKS
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
// =====================================
const bookForm = document.getElementById("bookForm");
bookForm.addEventListener("submit", function(e) {
 e.preventDefault();
 const editId = document.getElementById("editId").value;
 const isbn = document.getElementById("isbn").value.trim();
 const title = document.getElementById("title").value.trim();
 const author = document.getElementById("author").value.trim();
 const category = document.getElementById("category").value.trim();
 // Check duplicate ISBN
 const duplicate = books.some(book =>
 book.isbn.toLowerCase() === isbn.toLowerCase() &&
 String(book.id) !== editId
 );
 if (duplicate) {
 alert("A book with this ISBN already exists!");
 return;
 }
 if (editId) {
 const book = books.find(b => String(b.id) === editId);
 if (!book) return;
 book.isbn = isbn;
 book.title = title;
 book.author = author;
 book.category = category;
 // Update title in existing records
 records.forEach(record => {
 if (record.bookId === book.id) {
 record.bookTitle = title;
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 }
 });
 alert("Book updated successfully!");
 } else {
 const newBook = {
 id: Date.now(),
 isbn,
 title,
 author,
 category,
 isIssued: false
 };
 books.push(newBook);
 alert("Book added successfully!");
 }
 saveData();
 bookForm.reset();
 document.getElementById("editId").value = "";
 document.getElementById("cancelEdit").classList.add("hidden");
 renderAll();
});
// =====================================
// DISPLAY BOOKS
// =====================================
function renderBooks(search = "") {
 const table = document.getElementById("bookTable");
 const filtered = books.filter(book => {
 const text = (
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 book.title + " " +
 book.author + " " +
 book.isbn + " " +
 book.category
 ).toLowerCase();
 return text.includes(search.toLowerCase());
 });
 table.innerHTML = filtered.length
 ? filtered.map(book => `
 <tr>
 <td>${escapeHTML(book.isbn)}</td>
 <td>${escapeHTML(book.title)}</td>
 <td>${escapeHTML(book.author)}</td>
 <td>${escapeHTML(book.category)}</td>
 <td>
 <span class="status ${book.isIssued ? "issued" : "available"}">
 ${book.isIssued ? "Issued" : "Available"}
 </span>
 </td>
 <td>
 <button class="edit-btn"
 onclick="editBook(${book.id})">
 Edit
 </button>
 <button class="delete-btn"
 onclick="deleteBook(${book.id})">
 Delete
 </button>
 </td>
 </tr>
 `).join("")
 : `<tr><td colspan="6">No books found.</td></tr>`;
}
// Search books
document.getElementById("searchBook")
 .addEventListener("input", function() {
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 renderBooks(this.value);
 });
// Edit book
function editBook(id) {
 const book = books.find(b => b.id === id);
 if (!book) return;
 document.getElementById("editId").value = book.id;
 document.getElementById("isbn").value = book.isbn;
 document.getElementById("title").value = book.title;
 document.getElementById("author").value = book.author;
 document.getElementById("category").value = book.category;
 document.getElementById("cancelEdit").classList.remove("hidden");
 document.getElementById("bookForm").scrollIntoView({
 behavior: "smooth"
 });
}
// Cancel edit
document.getElementById("cancelEdit")
 .addEventListener("click", function() {
 bookForm.reset();
 document.getElementById("editId").value = "";
 this.classList.add("hidden");
 });
// Delete book
function deleteBook(id) {
 const book = books.find(b => b.id === id);
 if (!book) return;
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 if (book.isIssued) {
 alert("This book is currently issued. Return it before deleting.");
 return;
 }
 if (confirm("Are you sure you want to delete this book?")) {
 books = books.filter(b => b.id !== id);
 saveData();
 renderAll();
 alert("Book deleted successfully!");
 }
}
// =====================================
// ISSUE BOOK
// =====================================
function renderBookOptions() {
 const select = document.getElementById("bookSelect");
 const availableBooks = books.filter(book => !book.isIssued);
 select.innerHTML =
 `<option value="">Select a book</option>` +
 availableBooks.map(book => `
 <option value="${book.id}">
 ${escapeHTML(book.title)} - ${escapeHTML(book.author)}
 </option>
 `).join("");
}
// Set default issue date
document.getElementById("issueDate").value = today();
// Set default due date to 14 days later
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
const defaultDue = new Date();
defaultDue.setDate(defaultDue.getDate() + 14);
document.getElementById("dueDate").value =
 `${defaultDue.getFullYear()}-${String(defaultDue.getMonth() + 1).padStart(2, 
"0")}-${String(defaultDue.getDate()).padStart(2, "0")}`;
document.getElementById("issueForm")
 .addEventListener("submit", function(e) {
 e.preventDefault();
 const studentName =
 document.getElementById("studentName").value.trim();
 const studentId =
 document.getElementById("studentId").value.trim();
 const bookId = Number(
 document.getElementById("bookSelect").value
 );
 const issueDate =
 document.getElementById("issueDate").value;
 const dueDate =
 document.getElementById("dueDate").value;
 const book = books.find(b => b.id === bookId);
 if (!book || book.isIssued) {
 alert("Please select an available book.");
 return;
 }
 if (!issueDate || !dueDate || dueDate < issueDate) {
 alert("Due date cannot be earlier than issue date.");
 return;
 }
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 // Check whether the student already has this book
 const alreadyIssued = records.some(record =>
 record.studentId.toLowerCase() === studentId.toLowerCase() &&
 record.bookId === bookId &&
 record.status === "Issued"
 );
 if (alreadyIssued) {
 alert("This student has already issued this book.");
 return;
 }
 // Mark book as issued
 book.isIssued = true;
 // Create issue record
 const newRecord = {
 id: Date.now(),
 studentName,
 studentId,
 bookId,
 bookTitle: book.title,
 issueDate,
 dueDate,
 returnDate: "",
 fine: 0,
 status: "Issued"
 };
 records.push(newRecord);
 saveData();
 this.reset();
 document.getElementById("issueDate").value = today();
 const nextDue = new Date();
 nextDue.setDate(nextDue.getDate() + 14);
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 document.getElementById("dueDate").value =
 `${nextDue.getFullYear()}-${String(nextDue.getMonth() + 1).padStart(2, 
"0")}-${String(nextDue.getDate()).padStart(2, "0")}`;
 renderAll();
 alert("Book issued successfully!");
 });
// =====================================
// RETURN BOOK AND CALCULATE FINE
// =====================================
function returnBook(recordId) {
 const record = records.find(r => r.id === recordId);
 if (!record || record.status !== "Issued") return;
 const returnDate = today();
 // Calculate late days
 const due = new Date(record.dueDate + "T00:00:00");
 const returned = new Date(returnDate + "T00:00:00");
 const difference = Math.floor(
 (returned - due) / (1000 * 60 * 60 * 24)
 );
 const lateDays = Math.max(0, difference);
 // Fine = Rs. 5 per late day
 const fine = lateDays * 5;
 record.returnDate = returnDate;
 record.fine = fine;
 record.status = "Returned";
 // Make book available again
 const book = books.find(b => b.id === record.bookId);
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 if (book) {
 book.isIssued = false;
 }
 saveData();
 renderAll();
 alert(
 "Book returned successfully!\n" +
 "Late days: " + lateDays +
 "\nFine: ₹" + fine
 );
}
// =====================================
// DISPLAY ISSUE / RETURN RECORDS
// =====================================
function renderRecords(search = "") {
 const table = document.getElementById("recordTable");
 const filtered = records.filter(record => {
 const text = (
 record.studentName + " " +
 record.studentId + " " +
 record.bookTitle
 ).toLowerCase();
 return text.includes(search.toLowerCase());
 });
 table.innerHTML = filtered.length
 ? [...filtered].reverse().map(record => `
 <tr>
 <td>${escapeHTML(record.studentName)}</td>
 <td>${escapeHTML(record.studentId)}</td>
 <td>${escapeHTML(record.bookTitle)}</td>
KMC COLLEGE KHOPOLI DEPARTMENT OF COMPUTER SCIENCE PAGE NO.[ ]
 <td>${escapeHTML(record.issueDate)}</td>
 <td>${escapeHTML(record.dueDate)}</td>
 <td>${escapeHTML(record.returnDate || "-")}</td>
 <td>₹${Number(record.fine) || 0}</td>
 <td>
 ${
 record.status === "Issued"
 ? `<button class="return-btn"
 onclick="returnBook(${record.id})">
 Return
 </button>`
 : `<span class="status available">Returned</span>`
 }
 </td>
 </tr>
 `).join("")
 : `<tr><td colspan="8">No records found.</td></tr>`;
}
// Search issue/return records
document.getElementById("searchRecord")
 .addEventListener("input", function() {
 renderRecords(this.value);
 });
// =====================================
// UPDATE ALL SECTIONS
// =====================================
function renderAll() {
 saveData();
 renderDashboard();
 renderBooks(document.getElementById("searchBook").value);
 renderBookOptions();
 renderRecords(document.getElementById("searchRecord").value);
}
// Initialize application
renderAll();