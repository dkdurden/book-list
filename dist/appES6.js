class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  constructor() {
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

  loadClickEvents() {
    // Good practice, so events can be removed with removeEventListener
    this.addClickEventListener = this.displayModal.bind(this);
    this.removeClickEventListener = this.removeBook.bind(this);

    this.addBtnUI.addEventListener('click', this.addClickEventListener);
    this.bookListUI.addEventListener('click', this.removeClickEventListener);
  }

  displayModal() {
    this.modalUI = this.createModal();
    document.body.appendChild(this.modalUI);
  }

  // Static?
  createModal() {
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
  }

  hideModal() {
    this.formUI.removeEventListener('submit', this.submitEventListener);
    this.modalUI.remove();
  }

  displayBooksFromStore() {
    this.store.getBooksFromLS();

    if (this.store.books.length > 0) {
      this.store.books.forEach(book => this.addBook(book));
    }
  }

  handleBookSubmit(e) {
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
  }

  addBook(book) {
    const newBookUI = document.createElement('tr');
    const bookHtmlString = `
            <tr>
                <td class="book-number">${this.bookCount + 1}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>
                  <button class="btn book-list__remove-btn">X</button>
                </td>
            </tr>
        `;
    newBookUI.innerHTML = bookHtmlString;

    this.bookListUI.appendChild(newBookUI);
    this.updateNumbers();
  }

  removeBook(e) {
    if (e.target.className === 'btn book-list__remove-btn') {
      e.target.parentElement.parentElement.remove();
      this.updateNumbers();

      this.displayAlert('success', 'Book removed!');

      let isbnNode = e.target.parentElement.previousElementSibling;

      let authorNode = isbnNode.previousElementSibling;
      let titleNode = authorNode.previousElementSibling;
      let bookToRemove = new Book(
        titleNode.innerText,
        authorNode.innerText,
        isbnNode.innerText
      );

      this.store.removeBookFromLS(bookToRemove);
    }
  }

  updateNumbers() {
    const numbers = document.querySelectorAll('.book-number');
    if (numbers)
      numbers.forEach((number, index) => (number.textContent = index + 1));
  }

  displayError() {
    const errorMessage = document.createElement('p');
    errorMessage.innerText = 'Please fill in all the fields.';
    errorMessage.className = 'error';

    this.mainContentSectionUI.insertBefore(errorMessage, this.wrapperDivUI);

    setTimeout(() => {
      document.querySelector('.error').remove();
    }, 3000);
  }

  displayAlert(status, message) {
    const alert = document.createElement('p');

    alert.innerText = message;

    alert.className = status;

    this.mainContentSectionUI.insertBefore(alert, this.wrapperDivUI);

    setTimeout(() => {
      document.querySelector(`.${status}`).remove();
    }, 3000);
  }
}

class Store {
  constructor() {
    this.books = [];
  }

  getBooksFromLS() {
    if (localStorage.getItem('books') !== null)
      this.books = JSON.parse(localStorage.getItem('books'));
  }

  setBooksToLS() {
    localStorage.setItem('books', JSON.stringify(this.books));
  }

  addBookToLS(book) {
    this.getBooksFromLS();

    this.books.push(book);

    this.setBooksToLS();
  }

  removeBookFromLS(bookToRemove) {
    this.getBooksFromLS();

    this.books.forEach((book, index) => {
      if (
        book.isbn === bookToRemove.isbn &&
        book.author === bookToRemove.author &&
        book.title === bookToRemove.title
      )
        this.books.splice(index, 1);
    });

    this.setBooksToLS();
  }
}

// Main function
function main() {
  const ui = new UI();
  ui.displayBooksFromStore();
  ui.loadClickEvents();
}

main();
