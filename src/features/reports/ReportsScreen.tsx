import PageTitle from '../../app/components/page/PageTitle.tsx';
import Pills from '../../app/components/Pills.tsx';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import PageTable from '../../app/components/page/PageTable.tsx';
import { ReportType } from './domain/types.ts';
import { useFetchReportsQuery } from './domain/usecase.ts';
import { useMemo, useRef, useState } from 'react';
import UsernameAndImage from '../users/components/UsernameAndImage.tsx';
import EmptyCell from '../../app/components/EmptyCell.tsx';
import ItemStatus from '../../app/components/ItemStatus.tsx';
import { Report } from './data/model.ts';
import ReportDetailsModal from './components/ReportDetailsModal.tsx';

export default function ReportsScreen() {
  const {
    query,
    setQuery,
    tab,
    setTab,
    reports,
    filter,
    filters,
    setFilter,
    isPending,
    error,
    page,
    setPage,
    numberOfPages,
    totalCount
  } = useFetchReportsQuery();

  const header = useMemo(
    () => ['Reporter', 'Chef', ...(tab === ReportType.menu ? ['Menu'] : []), 'Report', 'Status'],
    [tab]
  );

  const detailsRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Report>();

  return (
    <>
      <PageTitle title="Reports" />
      <Pills active={tab} setActive={setTab} items={Object.values(ReportType)} />
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message ?? (reports.length == 0 ? 'No reports found' : undefined)}
        header={
          <tr>
            {header.map((title) => (
              <th key={title} className="text-left">
                {title}
              </th>
            ))}
          </tr>
        }
        body={reports.map((item) => {
          const reporter = item.reported_by;
          const chef = item.chef ?? item.menu?.chef;
          return (
            <tr
              key={item.id}
              onClick={() => {
                setSelected(item);
                detailsRef.current?.showModal();
              }}
            >
              <td>
                {reporter ? (
                  <UsernameAndImage
                    name={`${reporter?.first_name} ${reporter?.last_name}`}
                    image={reporter?.photo}
                  />
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td>
                {chef ? (
                  <UsernameAndImage
                    name={`${chef?.first_name} ${chef?.last_name}`}
                    image={chef?.photo}
                  />
                ) : (
                  <EmptyCell />
                )}
              </td>
              {tab === ReportType.menu && <td>{item?.menu?.menu_name}</td>}
              <td>{item.reason}</td>
              <td>
                <ItemStatus
                  title={item.responded ? 'Responded' : 'Needs response'}
                  circleColor={item.responded ? 'bg-green' : 'bg-red-base'}
                  textColor={item.responded ? 'text-green' : 'text-red-base'}
                />
              </td>
            </tr>
          );
        })}
        page={page}
        numberOfPages={numberOfPages}
        totalItemCount={totalCount}
        pageItemCount={reports.length}
        onPageChange={setPage}
      />
      <ReportDetailsModal ref={detailsRef} type={tab} data={selected} />
    </>
  );
}
