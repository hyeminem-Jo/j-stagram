import { Controller, FieldPath, FieldValues, Control, FieldError } from 'react-hook-form';
import Input from '@/app/_modules/common/components/form/input/Input';

interface ControlledInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  placeholder: string;
  error?: FieldError;
  type?: 'text' | 'password' | 'number';
  maxLength?: number;
}

const ControlledInput = <T extends FieldValues>({
  name,
  control,
  placeholder,
  error,
  type = 'text',
  maxLength,
}: ControlledInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          id={name}
          placeholder={placeholder}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={error?.message}
          type={type}
          maxLength={maxLength}
        />
      )}
    />
  );
};

export default ControlledInput;
