import PageTable from '../../app/components/page/PageTable.tsx';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../app/components/page/PageTitle.tsx';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import Pills from '../../app/components/Pills.tsx';
import { AddonType } from './domain/type.ts';
import { capitalize } from '../../utils/strings.ts';
import { useFetchAddonsQuery } from './domain/usecase.ts';
import AddonRow from './components/AddonRow.tsx';
import AddonsHeader from './components/AddonsHeader.tsx';

export default function AddonsScreen() {
  const navigate = useNavigate();

  const {
    type,
    setType,
    isPending,
    error,
    addons,
    filter,
    setFilter,
    filters,
    query,
    setQuery,
    totalCount,
    page,
    setPage,
    numberOfPages
  } = useFetchAddonsQuery();

  return (
    <>
      <PageTitle title={`Addon ${capitalize(type)}s`} />
      <Pills active={type} setActive={setType} items={Object.values(AddonType)} />
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
        button={type === AddonType.service ? 'New Addon' : 'New Client'}
        onButton={() => navigate(`/addons/${type}s/new`)}
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message || (addons.length == 0 ? 'No addons found' : undefined)}
        header={<AddonsHeader type={type} />}
        body={addons.map((addon) => (
          <AddonRow key={addon.id} {...addon} />
        ))}
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        pageItemCount={addons.length}
        totalItemCount={totalCount}
      />
    </>
  );
}
