type PlayerInfoProps = {
  player: { username: string; elo: string };
};

export const PlayerInfo = ({ player }: PlayerInfoProps) => {
  return (
    <div className="flex gap-10">
      <span>{player.username}</span>
      <span>{player.elo}</span>
    </div>
  );
};
