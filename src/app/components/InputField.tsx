import { InputHTMLAttributes, ReactNode } from 'react';
import { removeFields } from '../../utils/fieldManipulation.ts';

interface InputContainerProps {
  label?: string;
  'label-class-name'?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

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
        <input
          {...removeFields(props, 'label', 'label-class-name', 'error', 'className')}
          className="w-full flex-1"
        />
        {props.trailing && <>{props.trailing}</>}
      </div>
    </InputContainer>
  );
}

export function DropdownField(
  props: InputHTMLAttributes<HTMLSelectElement> &
    Omit<InputContainerProps, 'children'> & {
      options: string[];
      'get-label'?: (value: string) => string;
    }
) {
  return (
    <InputContainer {...props}>
      <select
        {...removeFields(props, 'label', 'label-class-name', 'error', 'className', 'get-label')}
        className={`w-full capitalize select select-bordered ${props.error ? 'select-error' : ''}`}
      >
        {props.placeholder && (
          <option disabled className="w-full" value="">
            {props.placeholder}
          </option>
        )}
        {props.options.map((option) => (
          <option key={option} className="capitalize" value={option}>
            {props['get-label'] ? props['get-label'](option) : option}
          </option>
        ))}
      </select>
    </InputContainer>
  );
}

export function ToggleField(
  props: InputHTMLAttributes<HTMLInputElement> &
    Omit<Omit<InputContainerProps, 'children'>, 'error'>
) {
  return (
    <div className={`relative form-control ${props.className ? props.className : ''}`}>
      <label className="label cursor-pointer p-0">
        <InputLabel title={props.label ?? ''} className={props['label-class-name']} />
        <input
          {...removeFields(props, 'label', 'className')}
          type="checkbox"
          className="toggle toggle-primary"
        />
      </label>
    </div>
  );
}

export function InputLabel(props: { title: string; className?: string }) {
  return (
    <span
      className={`label label-text text-sm text-charcoal font-medium capitalize ${props.className ? props.className : ''}`}
    >
      {props.title}
    </span>
  );
}

export function InputContainer(props: InputContainerProps) {
  return (
    <label className={`relative form-control ${props.className ? props.className : ''}`}>
      {props.label && (
        <InputLabel
          title={props.label}
          className={`p-0 pb-2 ${props['label-class-name'] ? props['label-class-name'] : ''}`}
        />
      )}
      {props.children}
      {props.error ? (
        <span className="label label-text-alt text-red-base">{props.error}</span>
      ) : null}
    </label>
  );
}
