import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';

type PlayerInfoProps = {
  player: { username: string; elo: string };
};

export const PlayerInfo = ({ player }: PlayerInfoProps) => {
  return (
    <div className="flex gap-10">
      <Avatar>
        <AvatarFallback>{player.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <span>{player.username}</span>
      <span>{player.elo}</span>
    </div>
  );
};
