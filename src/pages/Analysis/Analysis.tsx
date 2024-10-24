import { Chessboard } from '../../components/Sections/Chessboard/Chessboard.tsx';

const Analysis = () => {
  return (
    <div className="w-full h-full flex gap-20">
      <div className="h-full">
        <Chessboard />
      </div>
    </div>
  );
};

export default Analysis;
