import { ReactNode } from 'react'
import style from '@/app/(loggedOut)/_component/main.module.scss'

type Props = { children: ReactNode }
export default function LoggedOutLayout({ children, modal }: Props) {
  return (
    <div className={style.container}>
      {modal}
      {children}
    </div>
  )
}
