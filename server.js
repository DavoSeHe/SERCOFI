
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const path = require('path');
const cors = require('cors'); // Para permitir peticiones desde el front-end


const app = express();
const PORT = process.env.PORT || 3000; // Si no se especifica un puerto, usa 3000

// const dataPath = './data/news.json';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Middleware para permitir CORS (Cross-Origin Resource Sharing)
// Esto es crucial para que tu front-end (servido desde otro lugar) pueda acceder a tu API
app.use(cors());


const blogPostsFilePath = path.join(__dirname, 'data', 'blog-posts.json');

// Ruta para obtener todas las entradas del blog
app.get('/api/blog-posts', (req, res) => {
  const filePath = path.join(__dirname, 'blog-posts.json');
  fs.readFile(blogPostsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de posts:', err);
      return res.status(500).json({ error: 'Error al cargar las entradas del blog.' });
    }
    try {
      const posts = JSON.parse(data);
      res.json(posts);
    } catch (parseErr) {
      console.error('Error al parsear el JSON de posts:', parseErr);
      res.status(500).json({ error: 'Formato de datos de blog inválido.' });
    }
  });
});

// Ruta para obtener una entrada de blog específica por ID
app.get('/api/blog-posts/data/:id', (req, res) => {
  const postId = req.params.id;
  const filePath = path.join(__dirname, 'blog-posts.json');
  fs.readFile(blogPostsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de posts:', err);
      return res.status(500).json({ error: 'Error al cargar la entrada del blog.' });
    }
    try {
      const posts = JSON.parse(data);
      const post = posts.find(p => p.id === postId);
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ error: 'Entrada de blog no encontrada.' });
      }
    } catch (parseErr) {
      console.error('Error al parsear el JSON de posts:', parseErr);
      res.status(500).json({ error: 'Formato de datos de blog inválido.' });
    }
  });
});





app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
