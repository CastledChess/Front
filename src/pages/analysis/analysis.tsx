import { Chessboard } from '@/components/Chessboard/Chessboard.tsx';
import { useContext, useEffect, useMemo } from 'react';
import { analysisContext } from '../../contexts/analysisContext.tsx';
import { DrawShape } from 'chessground/draw';
import { SearchResults } from 'src/types/analysis.ts';
import { PlayerInfo } from '@/components/Chessboard/PlayerInfo.tsx';

const Analysis = () => {
  const {
    setPgn,
    setCurrentMove,
    setLoadedMoves,
    setSearchResults,
    searchResults,
    chessGround,
    loadedMoves,
    chess,
    pgn,
    currentMove,
  } = useContext(analysisContext);

  const importPgn = () => {
    const promptedPgn = prompt('Import a pgn');

    if (!promptedPgn) return;

    setPgn(promptedPgn);

    chess.current.loadPgn(promptedPgn);

    setLoadedMoves(chess.current.history());

    while (chess.current.history().length > 0) {
      chess.current.undo();
    }
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

  const handleRequest = () => {
    const socket = new WebSocket('wss://chess-api.com/v1');

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          variants: 1,
          fen: chess.current.fen(),
        }),
      );
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (['info', 'log'].includes(data.type)) return;

      setSearchResults(data as SearchResults);
    });
  };

  useEffect(() => {
    if (!searchResults) return;

    chessGround.current?.set({
      drawable: {
        shapes: [
          {
            orig: searchResults.from,
            dest: searchResults.to,
            brush: 'green',
          },
        ] as DrawShape[],
      },
    });
  }, [searchResults]);

  const header = useMemo(() => chess.current.header(), [pgn]);
  const blackPlayer = useMemo(
    () => ({
      username: header.Black,
      elo: header.BlackElo,
    }),
    [header],
  );
  const whitePlayer = useMemo(
    () => ({
      username: header.White,
      elo: header.WhiteElo,
    }),
    [header],
  );

  console.log(whitePlayer, header);

  return (
    <div className="w-full h-full flex gap-20">
      <div className="h-full">
        <PlayerInfo player={blackPlayer} />
        <Chessboard onAfterChange={handleRequest} />
        <PlayerInfo player={whitePlayer} />
      </div>

      <div className="flex flex-col gap-10">
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
    </div>
  );
};

export default Analysis;
