import axios from "axios";

// Usa la URL del entorno si está definida, o fallback a localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Instancia de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tipo de canción
export interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  lyrics: string;
}

// Obtener todas las canciones
export const fetchSongs = async (): Promise<Song[]> => {
  try {
    const response = await api.get<Song[]>("/api/songs");
    if (!Array.isArray(response.data)) {
      console.error("⚠️ La respuesta no es un array:", response.data);
      return [];
    }
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener canciones:", error.message || error);
    return [];
  }
};

// Agregar una nueva canción
export const addSong = async (song: Omit<Song, "id">): Promise<Song> => {
  try {
    console.log("🎵 Enviando canción al backend:", song);
    // Ajusta aquí según la respuesta de tu backend
    const response = await api.post<Song>("/api/songs", song);
    // Si el backend devuelve la canción directamente:
    return response.data;
    // Si devuelve { song: Song }, usa:
    // return response.data.song;
  } catch (error: any) {
    console.error(
      "❌ Error al agregar canción:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};

// Obtener una canción por ID
export const fetchSongById = async (
  id: number | string
): Promise<Song | null> => {
  try {
    const response = await api.get<Song>(`/api/songs/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al obtener canción:",
      error.response?.data || error.message || error
    );
    return null;
  }
};
