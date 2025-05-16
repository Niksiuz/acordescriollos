import { useParams, Link } from "react-router-dom";
import { songs } from "../data/songs";

function ArtistPage() {
  const { artistName } = useParams<{ artistName: string }>();

  const artistSongs = songs.filter(
    (song) => song.artist.toLowerCase() === artistName?.toLowerCase()
  );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-red-800 mb-4">
        Canciones de {artistName}
      </h2>

      {artistSongs.length > 0 ? (
        <ul className="space-y-4">
          {artistSongs.map((song) => (
            <li key={song.id}>
              <Link
                to={`/song/${song.id}`}
                className="text-red-700 hover:underline text-lg"
              >
                {song.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          No se encontraron canciones de este artista.
        </p>
      )}

      <div className="mt-6">
        <Link to="/" className="text-blue-600 underline">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default ArtistPage;
