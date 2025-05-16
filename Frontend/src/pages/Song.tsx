import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { songs } from "../data/songs";
import { transposeLyrics } from "../utils/transpose";
import ChordDiagram from "../components/ChordDiagram";
import { SongType } from "../types/Song";
import { toast } from "react-hot-toast";

function Song() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<SongType | null>(null);
  const [tone, setTone] = useState(0);
  // const [isScrolling, setIsScrolling] = useState(false); // Eliminado porque no se usa

  const [isEditing, setIsEditing] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState("");

  // Cargar canción desde localStorage o base
  useEffect(() => {
    const customSongs: SongType[] = JSON.parse(
      localStorage.getItem("customSongs") || "[]"
    );

    const foundSong =
      customSongs.find((s) => s.id === Number(id)) ||
      songs.find((s) => s.id === Number(id)) ||
      null;
    setSong(foundSong);
  }, [id]);

  const handleTranspose = (step: number) => {
    setTone((prev) => prev + step);
  };

  const handleSaveEdit = () => {
    if (!song) return;
    const updatedSong = { ...song, lyrics: editedLyrics };
    setSong(updatedSong);

    const customSongs: SongType[] = JSON.parse(
      localStorage.getItem("customSongs") || "[]"
    );
    const filtered = customSongs.filter((s) => s.id !== song.id);
    localStorage.setItem(
      "customSongs",
      JSON.stringify([...filtered, updatedSong])
    );
    setIsEditing(false);
    toast.success("¡Cambios guardados!");
  };

  const handleDeleteSong = () => {
    if (!song) return;
    const customSongs: SongType[] = JSON.parse(
      localStorage.getItem("customSongs") || "[]"
    );
    const updated = customSongs.filter((s) => s.id !== song.id);
    localStorage.setItem("customSongs", JSON.stringify(updated));
    toast.success("¡Canción eliminada!");
    setTimeout(() => navigate("/"), 1000);
  };

  if (!song) {
    return (
      <div className="p-6">
        <h2 className="text-2xl text-red-800">Canción no encontrada</h2>
      </div>
    );
  }

  // 🎸 Obtener acordes únicos de la letra
  const chordsUsed = Array.from(
    new Set(
      song.lyrics.match(/\b[A-G][#b]?(m|maj7|m7|7|sus4|dim|aug)?\b/g) || []
    )
  );

  return (
    <div className="p-4 max-w-3xl mx-auto font-mono text-gray-800">
      <h2 className="text-2xl font-bold mb-2">{song.title}</h2>
      <h3 className="text-lg mb-4 text-gray-600">{song.artist}</h3>

      {/* Botones */}
      <div className="flex flex-wrap gap-3 mb-5">
        <button
          onClick={() => handleTranspose(-1)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          -1
        </button>
        <button
          onClick={() => handleTranspose(1)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          +1
        </button>
        <button
          onClick={() => {
            setIsEditing(true);
            setEditedLyrics(song.lyrics);
          }}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Editar
        </button>
        <button
          onClick={handleDeleteSong}
          className="bg-red-700 text-white px-3 py-1 rounded"
        >
          Borrar
        </button>
      </div>

      {/* Área de letras */}
      {isEditing ? (
        <div>
          <textarea
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            className="w-full h-80 border p-2 mb-4"
          />
          <button
            onClick={handleSaveEdit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      ) : (
        <pre className="whitespace-pre-wrap text-base leading-6">
          {transposeLyrics(song.lyrics, tone)}
        </pre>
      )}

      {/* Diagramas de acordes */}
      {chordsUsed.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Acordes usados</h3>
          <div className="flex flex-wrap gap-4">
            {chordsUsed.map((chord) => (
              <ChordDiagram key={chord} chord={chord} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Song;
