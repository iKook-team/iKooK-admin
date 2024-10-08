import InputField, { DropdownField } from './InputField.tsx';
import { FaSearch } from 'react-icons/fa';
import { ReactNode, useMemo } from 'react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineMoreHoriz
} from 'react-icons/md';
import { getImageUrl } from '../../utils/getImageUrl.ts';

export function GenericPageTitle({ title }: { title: string }) {
  return <h1 className="font-medium text-xl">{title}</h1>;
}

export function GenericPageSearchRow(props: {
  search?: string;
  onSearch?: (value: string) => void;
  dropdown?: string;
  dropdownOptions?: string[];
  onDropdown?: (value: string) => void;
  button?: string;
  onButton?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`w-full flex flex-row gap-3 items-center ${props.className ? props.className : ''}`}
    >
      <DropdownField
        value={props.dropdown}
        onChange={(e) => props.onDropdown?.(e.target.value)}
        options={props.dropdownOptions || []}
      />
      <div className="flex-1">
        <InputField
          className="w-full max-w-80"
          value={props.search}
          onChange={(e) => props.onSearch?.(e.target.value)}
          placeholder="Search by name, email, address..."
          trailing={<FaSearch />}
        />
      </div>
      <button onClick={props.onButton} className="btn btn-primary">
        {props.button}
      </button>
    </div>
  );
}

interface PaginationControlsProps {
  page: number;
  numberOfPages: number;
  pageItemCount?: number;
  totalItemCount?: number;
  onPageChange: (page: number) => void;
}

export interface GenericTableProps extends PaginationControlsProps {
  isFetching: boolean;
  emptyMessage?: string;
  header: ReactNode;
  body: ReactNode;
}

export function GenericTable(props: GenericTableProps) {
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
      ) : (
        <div className="overflow-x-auto flex-1">
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead className="text-black/40">{props.header}</thead>
            <tbody className="[&_td]:py-2 [&_td]:overflow-hidden [&_td]:overflow-ellipsis [&_td]:whitespace-nowrap [&.active]:bg-ghost-white">
              {props.body}
            </tbody>
          </table>
        </div>
      )}
      <PaginationControls {...props} />
    </>
  );
}

export function GenericTableActions({ children }: { children: ReactNode }) {
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <MdOutlineMoreHoriz tabIndex={0} role="button" />
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {children}
      </ul>
    </div>
  );
}

export function GenericTableAction(props: { icon: string; text: string; onClick: () => void }) {
  return (
    <li>
      <button className="flex flex-row items-center gap-2" onClick={props.onClick}>
        <img src={getImageUrl(`icons/${props.icon}.svg`)} alt={props.text} />
        <span>{props.text}</span>
      </button>
    </li>
  );
}

function PaginationControls(props: PaginationControlsProps) {
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
