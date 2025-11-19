'use client';

import * as S from './styled';
import { useState } from 'react';
import { Ref } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name?: string;
  maxLength?: number;
  type?: 'text' | 'password' | 'number';
  width?: number;
  isSearch?: boolean;
  isUnderline?: boolean;
  isReadonly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isLineThrough?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  color?: 'white' | 'black';
  error?: string;
}

function Input({
  type = 'text',
  maxLength = 50,
  placeholder = '',
  onChange,
  onBlur,
  onFocus,
  disabled,
  width,
  isSearch = false,
  isUnderline = false,
  isReadonly = false,
  value = '',
  id,
  name,
  isLineThrough = false,
  color = 'white',
  inputRef,
  error,
  ...rest
}: InputProps) {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <S.InputFieldset $width={width}>
      <S.InputWrap>
        <S.Input
          id={id || name}
          name={name}
          type={type}
          value={value}
          maxLength={maxLength || undefined}
          $isFocus={isFocus}
          $isReadonly={isReadonly}
          $isUnderline={isUnderline}
          $error={!!error}
          onChange={onChange}
          onBlur={(e) => {
            onBlur?.(e);
            setIsFocus(false);
          }}
          onFocus={(e) => {
            onFocus?.(e);
            setIsFocus(true);
          }}
          placeholder={placeholder}
          disabled={disabled || isReadonly}
          $isLineThrough={isLineThrough && isReadonly}
          $color={color}
          ref={inputRef}
          {...rest}
        />
        {isSearch && (
          <S.InputSearch $color={color}>
            <i className='fa-solid fa-magnifying-glass'></i>
          </S.InputSearch>
        )}
      </S.InputWrap>
      {error && <S.InputError>{error}</S.InputError>}
    </S.InputFieldset>
  );
}

export default Input;
