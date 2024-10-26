import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';

type PlayerInfoProps = {
  player: { username: string; rating: string };
};

export const PlayerInfo = ({ player }: PlayerInfoProps) => {
  return (
    <div className="flex gap-2 items-center h-10">
      <Avatar>
        <AvatarFallback>{player.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      <span className="font-bold"> {player.username}</span>
      <span>({player.rating})</span>
    </div>
  );
};
