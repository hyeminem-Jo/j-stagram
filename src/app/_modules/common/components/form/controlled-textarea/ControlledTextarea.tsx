import { Controller, FieldPath, FieldValues, Control, FieldError } from 'react-hook-form';
import Textarea from '@/app/_modules/common/components/form/textarea/Textarea';

interface ControlledTextareaProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  placeholder: string;
  error?: FieldError;
  maxLength?: number;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const ControlledTextarea = <T extends FieldValues>({
  name,
  control,
  placeholder,
  error,
  maxLength,
  rows,
  cols,
  resize,
}: ControlledTextareaProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Textarea
          id={name}
          placeholder={placeholder}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={error?.message}
          maxLength={maxLength}
          rows={rows}
          cols={cols}
          resize={resize}
        />
      )}
    />
  );
};

export default ControlledTextarea;
