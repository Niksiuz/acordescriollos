const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const SONGS_FILE = path.join(__dirname, "songs.json");

app.use(cors());
app.use(express.json());

// Verificar si el archivo existe y tiene contenido válido
try {
  if (
    !fs.existsSync(SONGS_FILE) ||
    fs.readFileSync(SONGS_FILE, "utf8").trim() === ""
  ) {
    fs.writeFileSync(SONGS_FILE, JSON.stringify([], null, 2));
  } else {
    // Validar que sea JSON válido
    JSON.parse(fs.readFileSync(SONGS_FILE, "utf8"));
  }
} catch (error) {
  console.error("❌ Archivo songs.json inválido. Se reinicializa como []");
  fs.writeFileSync(SONGS_FILE, JSON.stringify([], null, 2));
}

app.get("/", (req, res) => {
  res.send("Backend de Acordes Criollos funcionando ✅");
});

// Obtener todas las canciones
app.get("/api/songs", (req, res) => {
  try {
    const data = fs.readFileSync(SONGS_FILE, "utf8");
    const songs = JSON.parse(data);
    res.json(songs);
  } catch (error) {
    console.error("❌ Error al leer canciones:", error);
    res.status(500).json({ message: "Error al leer las canciones." });
  }
});

// Obtener una canción por ID
app.get("/api/songs/:id", (req, res) => {
  try {
    const songId = parseInt(req.params.id, 10);
    const data = fs.readFileSync(SONGS_FILE, "utf8");
    const songs = JSON.parse(data);
    const song = songs.find((s) => s.id === songId);

    if (!song) {
      return res.status(404).json({ message: "Canción no encontrada." });
    }

    res.json(song);
  } catch (error) {
    console.error("❌ Error al buscar canción:", error);
    res.status(500).json({ message: "Error al buscar la canción." });
  }
});

// Agregar una nueva canción
app.post("/api/songs", (req, res) => {
  try {
    const { title, artist, genre, lyrics } = req.body;

    if (!title || !artist || !genre || !lyrics) {
      return res.status(400).json({ message: "Faltan datos de la canción." });
    }

    const data = fs.readFileSync(SONGS_FILE, "utf8");
    const songs = JSON.parse(data);

    const newSong = {
      id: songs.length ? songs[songs.length - 1].id + 1 : 1,
      title,
      artist,
      genre,
      lyrics,
    };

    songs.push(newSong);
    fs.writeFileSync(SONGS_FILE, JSON.stringify(songs, null, 2));

    res.status(201).json({
      message: "Canción guardada exitosamente.",
      song: newSong,
    });
  } catch (error) {
    console.error("❌ Error al guardar canción:", error);
    res.status(500).json({ message: "Error al guardar la canción." });
  }
});

// Docker-friendly binding
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
