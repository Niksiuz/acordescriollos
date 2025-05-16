import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchSongs } from "../api/songsApi"; // 👈🏻 Usamos el servicio

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
  const [songs, setSongs] = useState<Song[]>([]); // ✅ Por defecto es un array

  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSongs = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSongs(); // ✅ Reutilizamos la función
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSongs();
  }, []);

  const genres = [
    "Todos",
    ...Array.from(new Set(songs.map((song) => song.genre))),
  ];

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase()) ||
      song.genre.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
      selectedGenre === "Todos" || song.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-red-800">
        Lista de Canciones
      </h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-lg border transition ${
              selectedGenre === genre
                ? "bg-red-600 text-white"
                : "bg-white text-red-600"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <ul className="space-y-3">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <li key={song.id} className="border-b pb-2">
                <Link
                  to={`/song/${song.id}`}
                  className="text-red-700 hover:underline text-lg"
                >
                  {song.title}
                </Link>{" "}
                -{" "}
                <Link
                  to={`/artist/${encodeURIComponent(song.artist)}`}
                  className="text-gray-600 hover:underline"
                >
                  {song.artist}
                </Link>
                <div className="text-sm text-amber-600">
                  Género: {song.genre}
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic animate-fadeIn">
              No se encontraron canciones.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default Home;
