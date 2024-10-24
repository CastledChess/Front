import { Chessboard } from '../../components/Sections/Chessboard/Chessboard.tsx';

const Analysis = () => {
  return (
    <div className="w-full h-full flex gap-20">
      <Chessboard width={700} height={700} />
    </div>
  );
};

export default Analysis;
