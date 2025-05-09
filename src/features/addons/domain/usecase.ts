import { useMemo, useState } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api.ts';
import { AddonType } from './type.ts';
import { AddonClientStatus, AddonServiceStatus } from '../data/model.ts';
import { GetAllAddonsResponse } from '../data/dto.ts';

export function useFetchAddonsQuery(defaultType?: AddonType) {
  const [type, setType] = useQueryState('type', {
    defaultValue: defaultType || AddonType.service
  });
  const filters = useMemo(
    () => [
      'All',
      ...Object.values(type === AddonType.service ? AddonServiceStatus : AddonClientStatus)
    ],
    [type]
  );

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [query, setQuery] = useQueryState('search', {
    defaultValue: ''
  });

  const [filter, setFilter] = useState<string>(filters[0]);

  const debouncedQuery = useDebouncedValue(query, 500);

  const { isPending, data, error } = useQuery({
    queryKey: ['addons', type, filter, page, debouncedQuery],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, type, __, page, ___] = queryKey;
      const base = type === AddonType.service ? 'addons' : 'addons/clients';
      const response = await fetch({
        url: `${base}/?page=${page}&page_size=20`,
        method: 'GET'
      });
      return response.data as GetAllAddonsResponse;
    }
  });

  const addons = data?.data || [];

  return {
    type: type as AddonType,
    setType,
    isPending,
    error,
    page,
    setPage,
    addons,
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: addons.length,
    numberOfPages: 1
  };
}

export function useCreateAddon(type: AddonType) {
  return useMutation({
    mutationFn: async (request: FormData) => {
      const response = await fetch({
        url: type === AddonType.service ? 'addons/' : 'addons/clients/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: request
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['addons', type] });
    }
  });
}
