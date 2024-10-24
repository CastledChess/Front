import Chessground from '@react-chess/chessground';

import './base.css';
import './brown.css';
import './cburnett.css';
import './3d.css';

type ChessboardProps = {
  width: number;
  height: number;
};

export const Chessboard = ({ width, height }: ChessboardProps) => {
  return (
    <Chessground
      width={width}
      height={height}
      config={{
        addPieceZIndex: true,
      }}
    />
  );
};
