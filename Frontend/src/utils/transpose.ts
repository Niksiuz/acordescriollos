const chords = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
];

export function transposeChord(chord: string, steps: number): string {
  const index = chords.indexOf(chord);
  if (index === -1) return chord;

  let newIndex = (index + steps) % chords.length;
  if (newIndex < 0) newIndex += chords.length;

  return chords[newIndex];
}

export function transposeLyrics(lyrics: string, steps: number): string {
  // 🎯 Mejoramos el regex para detectar SOLO acordes aislados
  const chordRegex = /\b([A-G][#b]?)(m|maj7|m7|7|sus4|dim|aug)?\b/g;

  return lyrics.replace(chordRegex, (match, base, suffix = "") => {
    if (!chords.includes(base)) {
      return match; // Si no es acorde real como "C", "G", etc., no tocamos
    }
    const transposed = transposeChord(base, steps);
    return `<span class="text-red-600 font-bold">${transposed}${suffix}</span>`;
  });
}
