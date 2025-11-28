import { User } from '@/types/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ParticipantAvatarsProps {
  participants: User[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  textClassName?: string;
}

export const ParticipantAvatars: React.FC<ParticipantAvatarsProps> = ({
  participants,
  maxDisplay = 3,
  size = 'md',
  textClassName = 'text-muted-foreground',
}) => {
  const displayedParticipants = participants.slice(0, maxDisplay);
  const remainingCount = Math.max(0, participants.length - maxDisplay);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const borderSizes = {
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-[3px]',
  };

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {displayedParticipants.map((participant, index) => (
          <Avatar
            key={participant.uid}
            className={`${sizeClasses[size]} ${borderSizes[size]} border-white relative transition-all duration-200 hover:scale-125 hover:z-20 hover:shadow-lg cursor-pointer`}
            style={{ zIndex: 10 - index }}
            title={participant.displayName}
          >
            <AvatarImage
              src={participant.photoURL}
              alt={participant.displayName}
            />
            <AvatarFallback className="bg-blue-500 text-white">
              {participant.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && (
          <div
            className={`${sizeClasses[size]} ${borderSizes[size]} border-white rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600 relative transition-all duration-200 hover:scale-125 hover:shadow-lg cursor-pointer`}
            style={{ zIndex: 0 }}
            title={`${remainingCount} more ${remainingCount === 1 ? 'participant' : 'participants'}`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
      <span className={`ml-3 text-sm ${textClassName}`}>
        {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
      </span>
    </div>
  );
};
