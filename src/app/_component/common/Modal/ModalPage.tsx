'use client'

import { useRouter } from 'next/navigation'
import IcClose from '@/app/(loggedIn)/_component/svg/IcClose'
import style from './modal.module.scss'

function ModalPage({ children, title }) {
  const router = useRouter()

  const onClickClose = () => {
    router.back()
  }

  return (
    <>
      <div className={style.modalBg} onClick={onClickClose}></div>
      <div className={style.modal}>
        <div className={style.modalHeader}>
          {title}
          <button
            type="button"
            className={style.closeBtn}
            onClick={onClickClose}
          >
            <IcClose />
          </button>
        </div>
        <div className={style.modalContent}>{children}</div>
      </div>
    </>
  )
}

export default ModalPage
