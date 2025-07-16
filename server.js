const express = require('express');
const app = express();
const puerto = 3000;

app.use(express.static('public'));

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
