const express = require('express');

const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello express!');
})

app.listen(3000, () => console.log('Server is running'));
