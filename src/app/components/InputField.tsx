import { InputHTMLAttributes, ReactNode } from 'react';
import { removeFields } from '../../utils/fieldManipulation.ts';

export default function InputField(
  props: InputHTMLAttributes<HTMLInputElement> &
    Omit<InputContainerProps, 'children'> & {
      trailing?: ReactNode;
    }
) {
  return (
    <InputContainer {...props}>
      <div
        className={`w-full input input-bordered flex items-center gap-2 ${props.error ? 'input-error' : ''}`}
      >
        <input {...removeFields(props, 'label', 'error', 'className')} className="w-full flex-1" />
        {props.trailing && <>{props.trailing}</>}
      </div>
    </InputContainer>
  );
}

export function DropdownField(
  props: InputHTMLAttributes<HTMLSelectElement> &
    Omit<InputContainerProps, 'children'> & {
      options: string[];
    }
) {
  return (
    <InputContainer {...props}>
      <select
        {...removeFields(props, 'label', 'error', 'className')}
        className={`w-full capitalize select select-bordered ${props.error ? 'select-error' : ''}`}
      >
        {props.placeholder && (
          <option disabled className="w-full">
            {props.placeholder}
          </option>
        )}
        {props.options.map((option) => (
          <option key={option} className="capitalize">
            {option}
          </option>
        ))}
      </select>
    </InputContainer>
  );
}

interface InputContainerProps {
  label?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

function InputContainer(props: InputContainerProps) {
  return (
    <label className={`relative form-control ${props.className ? props.className : ''}`}>
      {props.label && (
        <span className="label label-text p-0 pb-2 text-sm text-charcoal font-medium capitalize">
          {props.label}
        </span>
      )}
      {props.children}
      {props.error ? <span className="label label-text-alt">{props.error}</span> : null}
    </label>
  );
}
