import { createContext, Dispatch, MutableRefObject, ReactNode, SetStateAction, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Api } from 'chessground/api';
import { SearchResults } from 'src/types/analysis.ts';

export type AnalysisContextProps = {
  pgn: string;
  chess: MutableRefObject<Chess>;
  chessGroundRef: MutableRefObject<HTMLDivElement | null>;
  chessGround: MutableRefObject<Api | null>;
  currentMove: number;
  loadedMoves: string[];
  setLoadedMoves: (moves: string[]) => void;
  setCurrentMove: (move: number) => void;
  setPgn: (pgn: string) => void;
  searchResults: SearchResults | null;
  setSearchResults: Dispatch<SetStateAction<SearchResults | null>>;
};

export const analysisContext = createContext<AnalysisContextProps>({} as AnalysisContextProps);

type AnalysisContextProviderProps = {
  children: ReactNode;
};

export const AnalysisContextProvider = ({ children }: AnalysisContextProviderProps) => {
  const chess = useRef(new Chess());
  const chessGroundRef = useRef<HTMLDivElement | null>(null);
  const chessGround = useRef<Api>(null);
  const [loadedMoves, setLoadedMoves] = useState<string[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [pgn, setPgn] = useState('');

  return (
    <analysisContext.Provider
      value={{
        pgn,
        setPgn,
        chess,
        chessGroundRef,
        chessGround,
        loadedMoves,
        setLoadedMoves,
        currentMove,
        setCurrentMove,
        setSearchResults,
        searchResults,
      }}
    >
      {children}
    </analysisContext.Provider>
  );
};
