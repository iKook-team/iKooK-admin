import InputField, {
  DropdownField,
  DropdownFieldProps,
  InputContainer,
  InputFieldProps
} from './InputField.tsx';
import MultiSelectDropdown from '../../features/users/components/MultiSelectDropDown.tsx';
import Field from '../domain/field.ts';

type FormFieldProps = (InputFieldProps & DropdownFieldProps) & {
  field: Field;
  error?: string;
};

export default function FormField({ field, className, error, value, ...props }: FormFieldProps) {
  if (field.type === 'multiselect') {
    return (
      <InputContainer key={field.id} error={error} className={className}>
        <MultiSelectDropdown
          title={field.label!}
          placeholder={field.placeholder}
          options={field.options}
          value={value || []}
          {...props}
        />
      </InputContainer>
    );
  } else {
    const Field = field.type === 'select' ? DropdownField : InputField;
    return (
      <Field
        key={field.id}
        label={field.label}
        name={field.id}
        type={field.type}
        placeholder={field.placeholder}
        className={`${field.hidden ? 'hidden' : ''} ${className}`}
        error={error}
        options={field.options}
        value={value || ''}
        {...props}
      />
    );
  }
}
