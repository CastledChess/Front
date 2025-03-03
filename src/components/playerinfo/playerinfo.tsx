import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';

type PlayerInfoProps = {
  player: { username: string; rating: string };
};

export const PlayerInfo = ({ player }: PlayerInfoProps) => {
  if (!player.username) return null;

  return (
    <div className="flex gap-2 max-w-1/2 items-center h-6 lg:h-10">
      <Avatar className="lg:w-10 lg:h-10 w-7 h-7 lg:text-xl text-xs">
        <AvatarFallback>{player.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      <span className="font-bold lg:text-xl text-xs"> {player.username}</span>
      <span className="lg:text-xl text-xs">({player.rating})</span>
    </div>
  );
};
