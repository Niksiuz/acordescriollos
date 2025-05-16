import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchSongs } from "../api/songsApi";

type HomeProps = {
  search: string;
};

type Song = {
  id: number;
  title: string;
  artist: string;
  genre: string;
};

function Home({ search }: HomeProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSongs = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSongs();
        setSongs(data);
      } catch (error) {
        console.error("Error al obtener canciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSongs();
  }, []);

  // Lista de géneros únicos (sin duplicados)
  const genres = [
    "Todos",
    ...Array.from(new Set(songs.map((song) => song.genre))).filter(Boolean),
  ];

  // Filtro combinado por búsqueda y género
  const filteredSongs = songs.filter((song) => {
    const query = search.toLowerCase();
    const matchesSearch =
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.genre.toLowerCase().includes(query);

    const matchesGenre =
      selectedGenre === "Todos" || song.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container py-4">
      <h2 className="text-2xl fw-bold text-danger mb-4">Lista de Canciones</h2>

      {/* Filtros por género */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`btn border ${
              selectedGenre === genre
                ? "btn-danger text-white"
                : "btn-outline-danger"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Lista de canciones */}
      {isLoading ? (
        <Loader />
      ) : filteredSongs.length > 0 ? (
        <ul className="list-unstyled">
          {filteredSongs.map((song) => (
            <li key={song.id} className="mb-3 border-bottom pb-2">
              <Link
                to={`/song/${song.id}`}
                className="text-decoration-none text-danger fw-bold"
              >
                {song.title}
              </Link>{" "}
              -{" "}
              <Link
                to={`/artist/${encodeURIComponent(song.artist)}`}
                className="text-decoration-none text-secondary"
              >
                {song.artist}
              </Link>
              <div className="text-muted small">Género: {song.genre}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-muted fst-italic">
          No se encontraron canciones.
        </div>
      )}
    </div>
  );
}

export default Home;
