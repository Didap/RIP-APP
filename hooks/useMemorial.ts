import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useMemorial(slug: string) {
  return useQuery({
    queryKey: ['memorial', slug],
    queryFn: () => api.getMemorial(slug).then(res => res.data),
    enabled: !!slug,
  });
}
