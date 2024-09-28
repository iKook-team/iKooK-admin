import InputField, { DropdownField } from './InputField.tsx';
import { FaSearch } from 'react-icons/fa';
import { ReactNode } from 'react';
import { MdOutlineMoreHoriz } from 'react-icons/md';
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
  pages: number;
  onPageChange: (page: number) => void;
}

export interface GenericTableProps extends PaginationControlsProps {
  isFetching: boolean;
  emptyMessage?: string;
  header: ReactNode;
  body: ReactNode;
}

export function GenericTable({
  isFetching,
  emptyMessage,
  header,
  body
  // page,
  // pages,
  // onPageChange
}: GenericTableProps) {
  return (
    <>
      {isFetching ? (
        <div className="flex flex-row gap-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
        </div>
      ) : emptyMessage ? (
        <p className="text-center">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead className="text-black/40">{header}</thead>
            <tbody className="[&_td]:py-2 [&.active]:bg-ghost-white">{body}</tbody>
          </table>
        </div>
      )}
      {/*<PaginationControls page={page} pages={pages} onPageChange={onPageChange} />*/}
    </>
  );
}

// function PaginationControls({ page, pages, onPageChange }: PaginationControlsProps) {
//   const [newPage, setNewPage] = useState(page + 1);
//
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 mt-6">
//       <div className="join flex justify-center">
//         <button className="join-item btn" onClick={() => onPageChange(0)} disabled={page === 0}>
//           First
//         </button>
//         <button
//           className="join-item btn"
//           onClick={() => onPageChange(page - 1)}
//           disabled={page === 0}
//         >
//           Previous
//         </button>
//         <span className="join-item btn btn-active">
//           Page {page + 1} of {pages}
//         </span>
//         <button
//           className="join-item btn"
//           onClick={() => onPageChange(page + 1)}
//           disabled={page === pages - 1}
//         >
//           Next
//         </button>
//         <button
//           className="join-item btn"
//           onClick={() => onPageChange(pages - 1)}
//           disabled={page === pages - 1}
//         >
//           Last
//         </button>
//       </div>
//       <div className="flex items-center justify-center gap-2">
//         <span className="text-neutral-500">Jump to page:</span>
//         <input
//           type="number"
//           className="input input-bordered w-16"
//           value={newPage}
//           onChange={(e) => {
//             const value = parseInt(e.target.value);
//             if (value > 0 && value <= pages) {
//               setNewPage(value);
//             }
//           }}
//         />
//         <button className="btn btn-primary" onClick={() => onPageChange(newPage - 1)}>
//           Go
//         </button>
//       </div>
//     </div>
//   );
// }

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
