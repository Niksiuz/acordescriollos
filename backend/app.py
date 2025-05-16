from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

SONGS_FILE = os.path.join("api", "songs", "songs.json")

# Función para cargar canciones desde archivo
def load_songs():
    try:
        with open(SONGS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except Exception as e:
        print("Error al cargar canciones:", e)
        return []

# Función para guardar canciones en archivo
def save_songs(songs):
    try:
        with open(SONGS_FILE, "w", encoding="utf-8") as f:
            json.dump(songs, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print("Error al guardar canciones:", e)
        return False

@app.route("/")
def home():
    return "Backend de Acordes Criollos funcionando!"

@app.route("/analizar", methods=["POST"])
def analizar():
    data = request.get_json()
    texto = data.get("texto", "")
    acordes_detectados = "Acorde simulado para: " + texto
    return jsonify({"acordes": acordes_detectados})

@app.route("/api/songs", methods=["GET"])
def get_songs():
    songs = load_songs()
    return jsonify(songs)

@app.route("/api/songs", methods=["POST"])
def add_song():
    data = request.get_json()
    songs = load_songs()

    # Validar datos mínimos
    if not data.get("title") or not data.get("artist") or not data.get("genre") or not data.get("lyrics"):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    # Asignar nuevo ID incremental
    new_id = max([song["id"] for song in songs], default=0) + 1

    new_song = {
        "id": new_id,
        "title": data["title"],
        "artist": data["artist"],
        "genre": data["genre"],
        "lyrics": data["lyrics"]
    }

    songs.append(new_song)

    if save_songs(songs):
        return jsonify(new_song), 201
    else:
        return jsonify({"error": "No se pudo guardar la canción"}), 500

@app.route("/api/songs/<int:song_id>", methods=["GET"])
def get_song_by_id(song_id):
    songs = load_songs()
    song = next((s for s in songs if s["id"] == song_id), None)
    if song:
        return jsonify(song)
    else:
        return jsonify({"error": "Canción no encontrada"}), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
