import InputField, { DropdownField } from '../InputField.tsx';
import { FaSearch } from 'react-icons/fa';
import { LoadingSpinner } from '../LoadingSpinner.tsx';

export default function PageSearchRow(props: {
  search?: string;
  onSearch?: (value: string) => void;
  dropdown?: string;
  dropdownOptions?: string[];
  onDropdown?: (value: string) => void;
  button?: string;
  onButton?: () => void;
  isLoading?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`w-full flex flex-row gap-3 items-center ${props.className ? props.className : ''}`}
    >
      {props.dropdownOptions && (
        <DropdownField
          value={props.dropdown}
          onChange={(e) => props.onDropdown?.(e.target.value)}
          options={props.dropdownOptions}
        />
      )}
      <div className="flex-1">
        <InputField
          className="w-full max-w-80"
          value={props.search}
          onChange={(e) => props.onSearch?.(e.target.value)}
          placeholder="Search by name, email, address..."
          trailing={<FaSearch />}
        />
      </div>
      {props.button && (
        <button onClick={props.onButton} className="btn btn-primary" disabled={props.isLoading}>
          <LoadingSpinner isLoading={props.isLoading ?? false}>{props.button}</LoadingSpinner>
        </button>
      )}
    </div>
  );
}
