'use client'

import { useController } from 'react-hook-form'
import style from './textareaPost.module.scss'
import cx from "classnames";
import {useEffect} from "react";

function Textarea({
   control,
   name = '',
   rules = {},
   label = '',
   placeholder = '',
   className = '',
   disabled = false,
   size = '',
   resize = false,
   maxLength = 500,
   rows = 3,
   ...rest
}) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  })

  return (
    <div className={style.textAreaForm}>
      {label && (
        <label className={style.textAreaLabel} htmlFor={name}>
          {label}
        </label>
      )}
      <textarea
        id={name}
        value={field.value}
        // value={field.value || ''}
        className={cx(!resize && style.noResize, size === 'sm' && style.sm)}
        onChange={field.onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        {...rest}
      />
    </div>
  )
}

export default Textarea
