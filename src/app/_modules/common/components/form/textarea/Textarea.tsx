import * as S from './styled';

interface TextareaProps {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const Textarea = ({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
  disabled = false,
  maxLength,
  rows = 4,
  cols,
  resize = 'none',
}: TextareaProps) => {
  return (
    <S.TextareaContainer>
      <S.Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        ref={inputRef}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        cols={cols}
        $resize={resize}
        $hasError={!!error}
      />
      {error && <S.TextareaError>{error}</S.TextareaError>}
    </S.TextareaContainer>
  );
};

export default Textarea;
