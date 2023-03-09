const fs = require('fs/promises');
const path = require('path');
const ObjectId = require('bson-objectid');

const booksPath = path.join(__dirname, 'books.json');

const updateFile = async (books) => {
  await fs.writeFile(booksPath, JSON.stringify(books, null, 2));
}

const readAll = async () => {
  const data = await fs.readFile(booksPath);
  const books = JSON.parse(data);
  return books;
}

const findOne = async (bookId) => {
  const books = await readAll();
  const book = books.find(({id}) => id === bookId);
  return book;
}

const add = async ({title, author}) => {
  const books = await readAll();
  const id =  ObjectId();
  const newBook = {
    title,
    author,
    id,
  };
  books.push(newBook);
  await updateFile(books);
  return id;
}

const deleteById = async (bookId) => {
  const books = await readAll();
  const bookIndex = books.findIndex(({id}) => id === bookId);
  if (bookIndex === -1) {
    console.log('Book not found');
    return;
  }

  const newBooks = books.filter(({id}) => id !== bookId);

  await updateFile(newBooks);
}

const updateById = async ({id: bookId, title, author}) => {
  const books = await readAll();
  console.log(bookId)
  const bookIndex = books.findIndex(({id}) => id === bookId);
  if (bookIndex === -1) {
    console.log('Book not found');
    return;
  }

  const newBooks = books.map((book) => {
    if (book.id !== bookId) {
      return book;
    }

    const newBook = book;
    if (title) {
      newBook.title = title;
    }
    if (author) {
      newBook.author = author;
    }

    return newBook;
  });

  await updateFile(newBooks);
}

const invokeAction = async ({ action, bookId, title, author }) => {
  switch (action) {
    case 'readAll':
      const books = await readAll();
      return books;
    case 'findOne':
      const book = await findOne(bookId);
      return book;
    case 'add':
      const id = await add({title, author});
      console.log(id);
      const newBook = await invokeAction({action: 'findOne', bookId: String(id)});
      console.log(newBook);
      return newBook;
    case 'deleteById':
      await deleteById(bookId);
      return;
    case 'updateById':
      await updateById({id: bookId, title, author});
      return await invokeAction({action: 'findOne', bookId});

    default:
      console.log('No such action!')
      break;
  }
}

module.exports = {
  invokeAction
}
