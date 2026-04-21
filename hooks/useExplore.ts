import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { MemorialDetail } from '../services/api';

export function useExplore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const typeParam = activeTab === 0 ? 'persona' : 'animale';

  const { data: memorials = [], isLoading, refetch } = useQuery({
    queryKey: ['memorials', typeParam, locationFilter],
    queryFn: () => api.getMemorials({
      type: typeParam,
      city: locationFilter || undefined,
    }),
  });

  const cities = useMemo(() =>
    [...new Set(memorials.map(m => m.city).filter(Boolean))].sort() as string[],
    [memorials]);

  const filteredResults = useMemo(() => {
    let results = [...memorials];

    if (typeFilter && activeTab === 1) {
      results = results.filter(m => m.animal_type === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(m =>
        m.full_name?.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q)
      );
    }

    return results;
  }, [memorials, searchQuery, activeTab, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    locationFilter,
    setLocationFilter,
    typeFilter,
    setTypeFilter,
    filteredResults,
    cities,
    isLoading,
    refetch,
  };
}
