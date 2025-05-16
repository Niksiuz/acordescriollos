import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchSongById } from "../api/songsApi";

interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  lyrics: string;
}

export default function SongDetail() {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const numericId = parseInt(id, 10);
          const data = await fetchSongById(numericId);
          setSong(data);
        }
      } catch (err) {
        console.error("❌ Error al cargar la canción:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>🎵 Cargando canción...</p>;
  if (!song) return <p>❌ Canción no encontrada.</p>;

  return (
    <div className="container mt-5">
      <h2>{song.title}</h2>
      <p>
        <strong>Artista:</strong> {song.artist}
      </p>
      <p>
        <strong>Género:</strong> {song.genre}
      </p>
      <pre>{song.lyrics}</pre>
    </div>
  );
}
