import { InputHTMLAttributes } from 'react';
import { removeFields } from '../../utils/field-manipulation.ts';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  $className?: string;
}

export default function InputField(props: InputFieldProps) {
  return (
    <label className={`relative form-control ${props.$className ? props.$className : ''}`}>
      {props.label && (
        <span className="label label-text p-0 pb-2 text-sm text-charcoal font-medium">
          {props.label}
        </span>
      )}
      <div
        className={`w-full input input-bordered flex items-center gap-2 ${props.error ? 'input-error' : ''}`}
      >
        <input className="grow" {...removeFields(props, 'label', 'error', '$className')} />
      </div>
      {props.error ? <span className="label label-text-alt">{props.error}</span> : null}
    </label>
  );
}
