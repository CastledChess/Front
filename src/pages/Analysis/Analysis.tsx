import { Chessboard } from '../../components/Sections/Chessboard/Chessboard.tsx';
import { useContext } from 'react';
import { analysisContext } from '../../contexts/analysisContext.tsx';

const Analysis = () => {
  const { setPgn, setCurrentMove, setLoadedMoves, chessGround, loadedMoves, chess, currentMove } =
    useContext(analysisContext);

  const importPgn = () => {
    const promptedPgn = prompt('Import a pgn');

    if (!promptedPgn) return;

    setPgn(promptedPgn);

    chess.current.loadPgn(promptedPgn);

    setLoadedMoves(chess.current.history());

    while (chess.current.history().length > 0) {
      chess.current.undo();
    }

    setCurrentMove(0);
  };

  const handleNextMove = () => {
    if (currentMove >= loadedMoves.length) return;

    setCurrentMove(currentMove + 1);
    chess.current.move(loadedMoves[currentMove]);
    chessGround.current?.set({
      fen: chess.current.fen(),
    });
  };

  const handlePrevMove = () => {
    if (currentMove <= 0) return;

    setCurrentMove(currentMove - 1);
    chess.current.undo();
    chessGround.current?.set({
      fen: chess.current.fen(),
    });
  };

  return (
    <div className="w-full h-full flex gap-20">
      <div className="h-full">
        <Chessboard />
      </div>

      <button type="button" onClick={importPgn}>
        Import PGN
      </button>

      <button type="button" onClick={handlePrevMove}>
        Prev
      </button>
      <button type="button" onClick={handleNextMove}>
        Next
      </button>
    </div>
  );
};

export default Analysis;
