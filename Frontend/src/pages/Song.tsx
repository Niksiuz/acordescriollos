import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
  const [isScrolling, setIsScrolling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState("");

  // Buscar canción en localStorage o lista original
  useEffect(() => {
    const customSongs: SongType[] = JSON.parse(
      localStorage.getItem("customSongs") || "[]"
    );

    const foundCustom = customSongs.find((s) => s.id === Number(id));
    const foundOriginal = songs.find((s) => s.id === Number(id));

    setSong(foundCustom || foundOriginal || null);
  }, [id]);

  // Auto-scroll
  useEffect(() => {
    if (!isScrolling) return;
    const interval = setInterval(() => window.scrollBy(0, 1), 10);
    return () => clearInterval(interval);
  }, [isScrolling]);

  const handleTranspose = (step: number) => {
    setTone((prev) => prev + step);
  };

  const handleSaveEdit = () => {
    if (!song) return;
    const updated = { ...song, lyrics: editedLyrics };
    setSong(updated);

    const customSongs: SongType[] = JSON.parse(
      localStorage.getItem("customSongs") || "[]"
    );

    const newList = [...customSongs.filter((s) => s.id !== song.id), updated];
    localStorage.setItem("customSongs", JSON.stringify(newList));
    setIsEditing(false);
    toast.success("¡Canción guardada correctamente!");
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

  const chordsUsed = useMemo(() => {
    if (!song) return [];
    return Array.from(
      new Set(
        song.lyrics.match(/\b[A-G][#b]?(m|maj7|m7|7|sus4|dim|aug)?\b/g) || []
      )
    );
  }, [song]);

  const renderedLyrics = useMemo(() => {
    if (!song) return "";
    return transposeLyrics(song.lyrics, tone);
  }, [song, tone]);

  if (!song) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-red-800">
          Canción no encontrada
        </h2>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-2 text-red-800">{song.title}</h2>
      <h3 className="text-xl font-medium mb-6 text-red-600">{song.artist}</h3>

      {/* 🎛 Controles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => handleTranspose(-1)} className="btn-red">
          -1 Tono
        </button>
        <button onClick={() => handleTranspose(1)} className="btn-red">
          +1 Tono
        </button>
        <button
          onClick={() => setIsScrolling(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ▶️ Auto Scroll
        </button>
        <button
          onClick={() => setIsScrolling(false)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          ⏸️ Pausar
        </button>
        <button
          onClick={() => {
            setIsEditing(true);
            setEditedLyrics(song.lyrics);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          ✏️ Editar Letra
        </button>
        <button
          onClick={handleDeleteSong}
          className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded"
        >
          🗑️ Borrar Canción
        </button>
      </div>

      {/* 📝 Edición o visualización */}
      {isEditing ? (
        <div className="bg-white p-4 rounded-lg shadow text-gray-800">
          <textarea
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            rows={10}
            className="w-full border rounded p-2 mb-4"
          />
          <button
            onClick={handleSaveEdit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            💾 Guardar Cambios
          </button>
        </div>
      ) : (
        <pre className="bg-white p-4 rounded shadow text-gray-800 whitespace-pre-wrap">
          {renderedLyrics}
        </pre>
      )}

      {/* 🎸 Acordes */}
      {chordsUsed.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4 text-red-800">
            Diagramas de acordes:
          </h3>
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
