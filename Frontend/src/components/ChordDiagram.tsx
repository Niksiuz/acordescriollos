interface ChordDiagramProps {
  chord: string;
}

function ChordDiagram({ chord }: ChordDiagramProps) {
  const chordImage = `/chords/${chord}.png`; // 👈🏻 Esta ruta busca en /public/chords/

  return (
    <div className="flex flex-col items-center">
      <img
        src={chordImage}
        alt={`Diagrama del acorde ${chord}`}
        className="w-20 h-28 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none"; // 👈🏻 Si no existe la imagen, la oculta
        }}
      />
      <span className="text-sm mt-1">{chord}</span>
    </div>
  );
}

export default ChordDiagram;
