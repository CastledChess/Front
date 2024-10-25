type PlayerInfoProps = {
  username: string;
  elo: string;
};

export const PlayerInfo = ({ elo, username }: PlayerInfoProps) => {
  return (
    <div className="flex gap-10">
      <span>{username}</span>
      <span>{elo}</span>
    </div>
  );
};
