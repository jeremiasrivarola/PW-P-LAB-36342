// ===============================
//  DATA 
// ===============================
let movies = [
  { id: 1, title: "Inception", year: 2010 },
  { id: 2, title: "Interstellar", year: 2014 }
];

// ===============================
// CONFIGURAÇÕES
// ===============================
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());            // permite pedidos externos
app.use(express.json());    // ler JSON do body
app.use(morgan("dev"));     // logs no terminal

// ===============================
// PORTA DO SERVIDOR
// ===============================
const PORT = process.env.SERVER_PORT || 3000;

// ===============================
// VALIDAR ID
// ===============================
function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  req.movieId = id;
  next();
}

// ===============================
// ROTAS CRUD
// ===============================

// GET /movies → listar todos
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// GET /movies/:id → buscar por ID
app.get("/movies/:id", validateId, (req, res) => {
  const movie = movies.find(m => m.id === req.movieId);

  if (!movie) {
    return res.status(404).json({ message: "Filme não encontrado" });
  }

  res.status(200).json(movie);
});

// POST /movies → criar filme
app.post("/movies", (req, res) => {
  const { title, year } = req.body;

  if (!title || !year) {
    return res.status(400).json({
      message: "Title e year são obrigatórios"
    });
  }

  const newMovie = {
    id: movies.length ? movies[movies.length - 1].id + 1 : 1,
    title,
    year
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

// PUT /movies/:id → atualizar filme
app.put("/movies/:id", validateId, (req, res) => {
  const { title, year } = req.body;

  const movie = movies.find(m => m.id === req.movieId);

  if (!movie) {
    return res.status(404).json({ message: "Filme não encontrado" });
  }

  if (!title || !year) {
    return res.status(400).json({
      message: "Title e year são obrigatórios"
    });
  }

  movie.title = title;
  movie.year = year;

  res.status(200).json(movie);
});

// DELETE /movies/:id → apagar filme
app.delete("/movies/:id", validateId, (req, res) => {
  const index = movies.findIndex(m => m.id === req.movieId);

  if (index === -1) {
    return res.status(404).json({ message: "Filme não encontrado" });
  }

  movies.splice(index, 1);

  res.status(204).send();
});

// ===============================
// 404 - ROTA NÃO ENCONTRADA
// ===============================
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// ===============================
// ERRO GLOBAL
// ===============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno do servidor" });
});

// ===============================
// INICIAR SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log(`✅ Servidor a correr em http://localhost:${PORT}`);
});
