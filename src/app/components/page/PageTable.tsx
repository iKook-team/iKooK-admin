import { ReactNode, useMemo } from 'react';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

interface PaginationControlsProps {
  page: number;
  numberOfPages: number;
  pageItemCount?: number;
  totalItemCount?: number;
  onPageChange: (page: number) => void;
}

interface GenericTableProps extends PaginationControlsProps {
  isFetching: boolean;
  emptyMessage?: string;
  header: ReactNode;
  body: ReactNode;

  /**
   * If undefined/true, the default table wrapper will be used. If false, the body will be rendered directly.
   */
  useDefaultWrapper?: boolean;
}

export default function PageTable(props: GenericTableProps) {
  return (
    <>
      {props.isFetching ? (
        <div className="flex flex-row gap-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
        </div>
      ) : props.emptyMessage ? (
        <p className="text-center">{props.emptyMessage}</p>
      ) : props.useDefaultWrapper !== false ? (
        <div className="overflow-x-auto flex-1 relative">
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead className="text-black/40">{props.header}</thead>
            <tbody className="[&_tr]:transition [&_tr]:ease-in-out [&_td]:py-2 [&_td]:truncate [&.active]:bg-ghost-white">
              {props.body}
            </tbody>
          </table>
        </div>
      ) : (
        props.body
      )}
      <PaginationControls {...props} />
    </>
  );
}

export function PaginationControls(props: PaginationControlsProps) {
  const range = useMemo(() => {
    const start = Math.max(1, props.page - 2);
    const end = Math.min(props.numberOfPages, start + 3);
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  }, [props.page, props.numberOfPages]);
  return (
    <div className="mt-12 flex flex-row items-center justify-between">
      <span className="text-sm font-medium text-purple-taupe">
        Showing {props.pageItemCount} from {props.totalItemCount} item(s)
      </span>
      <div className="join flex justify-center shadow-sm">
        <button
          className="join-item btn btn-ghost"
          onClick={() => props.onPageChange(1)}
          disabled={props.page === 1}
        >
          <MdKeyboardDoubleArrowLeft />
        </button>
        {range.map((page) => (
          <button
            key={page}
            className={`join-item btn ${page === props.page ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => props.onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="join-item btn btn-ghost"
          onClick={() => props.onPageChange(props.numberOfPages)}
          disabled={props.page === props.numberOfPages}
        >
          <MdKeyboardDoubleArrowRight />
        </button>
      </div>
    </div>
  );
}
