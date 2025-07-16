const express = require('express');
const app = express();
const puerto = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static('public'));

// Redireccionar raíz al archivo principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Iniciar el servidor
app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
