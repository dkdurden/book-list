// Book object
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// User interface object
function UI() {
  // UI variables
  this.addBtnUI = document.querySelector('.book-list__add-btn');
  this.bookListUI = document.querySelector('tbody');
  this.mainContentSectionUI = document.querySelector('.book-list__content');
  this.wrapperDivUI = document.querySelector('.scroll-wrapper');
  this.modalUI = null;
  this.formUI = null;

  // Store
  this.store = new Store();
}

/* UI Methods */

UI.prototype.loadClickEvents = function () {
  this.addClickEventListener = this.displayModal.bind(this);
  this.removeClickEventListener = this.removeBook.bind(this);
  this.addBtnUI.addEventListener('click', this.addClickEventListener);
  this.bookListUI.addEventListener('click', this.removeClickEventListener);
};

UI.prototype.displayModal = function () {
  this.modalUI = this.createModal();
  document.body.appendChild(this.modalUI);
};

// Static?
UI.prototype.createModal = function () {
  const modalUI = document.createElement('div');
  modalUI.className = 'modal flex';

  let modalInnerHtml = `
        <h2>Add a book</h2>
        <form class="modal__form">
            <div class="modal__form-control">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" />
            </div>
            <div class="modal__form-control">
                <label for="author">Author</label>
                <input type="text" name="author" id="author" />
            </div>
            <div class="modal__form-control">
                <label for="isbn">ISBN</label>
                <input type="text" name="isbn" id="isbn" />
            </div>
            <input type="submit" value="Submit" class="btn modal__submit-btn" />
        </form>
      `;

  modalUI.innerHTML = modalInnerHtml;

  this.formUI = modalUI.querySelector('form');
  this.submitEventListener = this.handleBookSubmit.bind(this);

  this.formUI.addEventListener('submit', this.submitEventListener);

  return modalUI;
};

UI.prototype.hideModal = function () {
  this.formUI.removeEventListener('submit', this.submitEventListener);
  this.modalUI.remove();
};

UI.prototype.displayBooksFromStore = function () {
  this.store.getBooksFromLS();

  if (this.store.books.length > 0) {
    this.store.books.forEach(book => this.addBook(book));
  }
};

UI.prototype.handleBookSubmit = function (e) {
  e.preventDefault();

  const bookTitle = document.querySelector('#title').value;
  const bookAuthor = document.querySelector('#author').value;
  const bookIsbn = document.querySelector('#isbn').value;

  const newBook = new Book(bookTitle, bookAuthor, bookIsbn);

  if (bookTitle && bookAuthor && bookIsbn) {
    this.addBook(newBook);
    this.displayAlert('success', 'Book added!');
    this.store.addBookToLS(newBook);
  } else this.displayAlert('error', 'Please fill in all fields.');

  this.hideModal();
};

UI.prototype.addBook = function (book) {
  const newBookUI = document.createElement('tr');
  const bookHtmlString = `
          <tr>
              <td class="book-number">${this.bookCount + 1}</td>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${book.isbn}</td>
              <td>
                <button class="btn book-list__remove-btn">x</button>
              </td>
          </tr>
      `;
  newBookUI.innerHTML = bookHtmlString;

  this.bookListUI.appendChild(newBookUI);
  this.updateNumbers();
};

UI.prototype.removeBook = function (e) {
  if ((e.target.className = 'btn book-list__remove-btn')) {
    e.target.parentElement.parentElement.remove();
    this.updateNumbers();

    let isbnNode = e.target.parentElement.previousElementSibling;

    let authorNode = isbnNode.previousElementSibling;
    let titleNode = authorNode.previousElementSibling;
    let bookToRemove = new Book(
      titleNode.innerText,
      authorNode.innerText,
      isbnNode.innerText
    );

    console.log(bookToRemove);

    this.store.removeBookFromLS(bookToRemove);
  }
};

UI.prototype.updateNumbers = function () {
  const numbers = document.querySelectorAll('.book-number');
  if (numbers)
    numbers.forEach((number, index) => (number.textContent = index + 1));
};

UI.prototype.displayError = function () {
  const errorMessage = document.createElement('p');
  errorMessage.innerText = 'Please fill in all the fields.';
  errorMessage.className = 'error';

  this.mainContentSectionUI.insertBefore(errorMessage, this.wrapperDivUI);

  setTimeout(() => {
    document.querySelector('.error').remove();
  }, 3000);
};

UI.prototype.displayAlert = function (status, message) {
  const alert = document.createElement('p');

  alert.innerText = message;

  alert.className = status;

  this.mainContentSectionUI.insertBefore(alert, this.wrapperDivUI);

  setTimeout(() => {
    document.querySelector(`.${status}`).remove();
  }, 3000);
};

function Store() {
  this.books = [];
}

Store.prototype.getBooksFromLS = function () {
  if (localStorage.getItem('books') !== null)
    this.books = JSON.parse(localStorage.getItem('books'));
};

Store.prototype.setBooksToLS = function () {
  localStorage.setItem('books', JSON.stringify(this.books));
};

Store.prototype.addBookToLS = function (book) {
  this.getBooksFromLS();

  this.books.push(book);

  this.setBooksToLS();
};

Store.prototype.removeBookFromLS = function (bookToRemove) {
  this.getBooksFromLS();

  console.log(bookToRemove);

  this.books.forEach((book, index) => {
    if (
      book.isbn === bookToRemove.isbn &&
      book.author === bookToRemove.author &&
      book.title === bookToRemove.title
    )
      this.books.splice(index, 1);
  });

  console.log(this.books);

  this.setBooksToLS();
};

function main() {
  const ui = new UI();
  ui.displayBooksFromStore();
  ui.loadClickEvents();
}

main();

//let bookCount = 0;

//loadEventListeners();

// function loadEventListeners() {
//   addBtnUI.addEventListener('click', displayModal);
// }

// function displayModal() {
//   const modalUI = createModal();
//   document.body.appendChild(modalUI);
// }

// function hideModal() {
//   const modalUI = document.querySelector('.modal');
//   modalUI.querySelector('form').removeEventListener('submit', handleBookSubmit);
//   modalUI.remove();
// }

// function createModal() {
//   const modalUI = document.createElement('div');
//   modalUI.className = 'modal flex';

//   let modalInnerHtml = `
//     <h2>Add a book</h2>
//     <form class="modal__form">
//         <div class="modal__form-control">
//             <label for="title">Title</label>
//             <input type="text" name="title" id="title" />
//         </div>
//         <div class="modal__form-control">
//             <label for="author">Author</label>
//             <input type="text" name="author" id="author" />
//         </div>
//         <div class="modal__form-control">
//             <label for="isbn">ISBN</label>
//             <input type="text" name="isbn" id="isbn" />
//         </div>
//         <input type="submit" value="Submit" class="btn modal__submit-btn" />
//     </form>
//   `;

//   modalUI.innerHTML = modalInnerHtml;

//   modalUI.querySelector('form').addEventListener('submit', handleBookSubmit);

//   return modalUI;
// }

// function handleBookSubmit(e) {
//   e.preventDefault();

//   const bookTitle = document.querySelector('#title').value;
//   const bookAuthor = document.querySelector('#author').value;
//   const bookIsbn = document.querySelector('#isbn').value;

//   const newBook = new Book(bookTitle, bookAuthor, bookIsbn);

//   addBook(newBook);

//   hideModal();
// }

// function addBook(book) {
//   const newBookUI = document.createElement('tr');
//   const bookHtmlString = `
//         <tr>
//             <td>${bookCount + 1}</td>
//             <td>${book.title}</td>
//             <td>${book.author}</td>
//             <td>${book.isbn}</td>
//         </tr>
//     `;
//   newBookUI.innerHTML = bookHtmlString;

//   bookListUI.appendChild(newBookUI);
//   bookCount++;
// }
