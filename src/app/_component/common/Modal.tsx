'use client'

import { useRouter } from 'next/navigation'
import style from './modal.module.scss'

function Modal({ children, title }) {
  const router = useRouter()
  const onClickClose = () => {
    router.back()
    // TODO: 뒤로가기가 /home이 아니면 /home으로 보내기
  }

  return (
    <div className={style.modalBg}>
      <div className={style.modal}>
        <div className={style.modalHeader}>
          {title}
          <button className={style.closeBtn} onClick={onClickClose}>
            <svg
              width={24}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
            >
              <g>
                <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" />
              </g>
            </svg>
          </button>
        </div>
        <div className={style.modalContent}>{children}</div>
      </div>
    </div>
  )
}

export default Modal