import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useFeed(page = 1) {
  return useQuery({
    queryKey: ['feed', page],
    queryFn: () => api.getFeed(page),
  });
}
