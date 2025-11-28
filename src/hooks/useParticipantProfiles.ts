import { useQuery } from '@tanstack/react-query';
import { getUsersByIds } from '@/lib/firestore';
import { User } from '@/types/user';

export const useParticipantProfiles = (participantIds: string[]) => {
  return useQuery<User[]>({
    queryKey: ['participants', ...participantIds.sort()],
    queryFn: () => getUsersByIds(participantIds),
    enabled: participantIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
