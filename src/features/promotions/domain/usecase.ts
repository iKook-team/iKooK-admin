import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api.ts';
import { PromotionType } from './types.ts';
import { CreateGiftCardRequest, CreatePromoCodeRequest, GetAllGiftCardsResponse } from './dto.ts';
import { CURRENCIES } from '../../../utils/formatter.ts';

export function useFetchPromotionsQuery() {
  const [tab, setTab] = useState<PromotionType>(PromotionType.gifts);
  const filters = CURRENCIES;
  const [filter, setFilter] = useState<string>(filters[0]);
  const [query, setQuery] = useState<string>();
  const [page, setPage] = useState(1);

  const { isPending, data, error } = useQuery({
    queryKey: ['promotions', tab === PromotionType.promo ? 'promo' : 'gifts', filter, page],
    queryFn: async ({ queryKey }) => {
      const [_, tab, currency, page] = queryKey;
      const baseUrl =
        tab === undefined ? 'promotions/get-gift-cards' : 'promotions/get-all-gift-cards';
      const response = await fetch({
        url: `${baseUrl}?page_number=${page}&page_size=20&currency=${currency}`,
        method: 'GET'
      });
      return response.data as GetAllGiftCardsResponse;
    }
  });

  const items = useMemo(() => {
    let items = data?.data?.items || [];
    if (tab === PromotionType.purchased) {
      items = items.filter((card) => card.purchased_by !== null);
    }

    if (!query || !data) {
      return items;
    }

    const cleanedQuery = query!.toLowerCase();

    return items.filter((card) => {
      return (
        card.card_number.includes(cleanedQuery) ||
        card?.purchased_by?.username?.toLowerCase().includes(cleanedQuery) ||
        card?.purchased_by?.first_name.toLowerCase().includes(cleanedQuery) ||
        card?.purchased_by?.last_name.toLowerCase().includes(cleanedQuery)
      );
    });
  }, [query, data, tab]);

  return {
    tab,
    setTab,
    isPending,
    error,
    page,
    setPage,
    items,
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.total_count ?? 0,
    numberOfPages: data?.data?.number_of_pages ?? 0
  };
}

export function useCreateGiftCard() {
  return useMutation({
    mutationFn: (data: CreateGiftCardRequest) => {
      return fetch({
        url: `/promotions/create-gift-card`,
        method: 'POST',
        data
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promotions', 'gift'] });
    }
  });
}

export function useCreatePromoCode() {
  return useMutation({
    mutationFn: (data: CreatePromoCodeRequest) => {
      return fetch({
        url: `/promotions/create-coupon-code`,
        method: 'POST',
        data
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promotions', 'promo'] });
    }
  });
}
