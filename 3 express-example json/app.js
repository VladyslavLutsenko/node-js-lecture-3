const express = require('express');
const fs = require('fs/promises');
const moment = require('moment');
const cors = require('cors');
const {invokeAction} = require('./books');
const bodyParser = require('body-parser')


const app = express();

const loggerMiddleware = async (req, res, next) =>{
  const {method, url} = req;
  const timestamp = moment().format('YYYY-MM-DD_hh:mm:ss');

  const logData = `\n${method} ${url} ${timestamp}`;
  console.log(logData)

  await fs.appendFile('server.log', logData)
  next();
}

app.use(cors(),bodyParser.json(),loggerMiddleware);

app.get('/books', async (req, res) => {
  const books = await invokeAction({action: 'readAll'});
  res.json(books);
});

app.get('/books/:id', async (req, res) => {
  const {id} = req.params;
  const books = await invokeAction({action: 'findOne', bookId: id});
  res.json(books);
});

app.post('/books', async (req, res) => {
  const {title, author} = req.body;
  const book = await invokeAction({action: 'add', title, author})
  res.json(book);
});

app.patch('/books/:id', async (req, res) => {
  const {title, author} = req.body;
  const {id} = req.params;
  const book = await invokeAction({action: 'updateById', title, author, bookId: id})
  res.json(book);
});

app.delete('/books/:id', async (req, res) => {
  try {
    const {id} = req.params;
    await invokeAction({action: 'deleteById', bookId: id})
    res.status(204).send();
  } catch (error) {
    console.log(error)
  }
});

app.listen(3000, () => console.log('Server is running'));
