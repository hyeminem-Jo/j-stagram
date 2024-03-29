'use client'

import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Button } from '@/app/_component/common/Button'
import cx from 'classnames'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import Textarea from '@/app/_component/common/Textarea'
import SliderWrapper from '@/app/(loggedIn)/_component/SliderWrapper'
import style from './postForm.module.scss'

function PostForm() {
  const {
    watch,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      post: '',
    },
  })

  const imageRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [isUploaded, setIsUploaded] = useState(false)

  // 더미데이터
  const me = {
    id: 'h._jinny',
    nickname: '혜진',
    image: '/profile_image.jpg',
  }

  // 이미지 데이터
  const imageArr = [
    {
      src: 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/22/da16af9b60070a4f7f7a5be7dcc98faf.jpeg',
      alt: '똥개1',
    },
    {
      src: 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/34/ca41e7f0f2232370d83d2ed6a4db3802.jpeg',
      alt: '똥개2',
    },
    {
      src: 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/158/a240b2bbb6c2a2b17aed88242233ee40.jpeg',
      alt: '똥개3',
    },
  ]

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (data) => {
      console.log(data)
      alert(data)
      reset()
    },
    [watch()],
  )

  const uploadBtn = () => {
    imageRef.current?.click()
    setIsUploaded(true)
  }

  const clickPrev = () => {
    if (step === 1) {
      alert('사진을 삭제하시겠습니까?')
      setIsUploaded(false)
    } else {
      setStep((prev) => prev - 1)
    }
  }

  const clickNext = (e) => {
    e.preventDefault() // step 이 2로 바뀌면서 리렌더링되고 '공유하기' 버튼이 누른것으로 인식되어 제출되는데 이를 방지
    console.log(step)
    if (step === 2) return
    setStep((prev) => prev + 1)
  }

  return (
    <form
      className={cx(style.postForm, step === 2 && style.postStep)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={style.postStep}>
        {isUploaded && (
          <button type="button" className={style.prevBtn} onClick={clickPrev}>
            <svg
              aria-label="돌아가기"
              className="x1lliihq x1n2onr6 x5n08af"
              fill="currentColor"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
            >
              <title>돌아가기</title>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="2.909"
                x2="22.001"
                y1="12.004"
                y2="12.004"
              />
              <polyline
                fill="none"
                points="9.276 4.726 2.001 12.004 9.276 19.274"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        )}
        {isUploaded && (
          <>
            {step === 1 ? (
              <button
                type="button"
                className={style.nextBtn}
                onClick={clickNext}
              >
                다음
              </button>
            ) : (
              <button type="submit" className={style.nextBtn}>
                공유하기
              </button>
            )}
          </>
        )}
      </div>
      <div className={style.postFormInner}>
        {step === 1 && !isUploaded && (
          <div className={style.desc}>
            <svg
              aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
              className="x1lliihq x1n2onr6 x5n08af"
              fill="currentColor"
              height="77"
              role="img"
              viewBox="0 0 97.6 77.3"
              width="96"
            >
              <title>이미지나 동영상과 같은 미디어를 나타내는 아이콘</title>
              <path
                d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                fill="currentColor"
              />
              <path
                d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                fill="currentColor"
              />
              <path
                d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                fill="currentColor"
              />
            </svg>
            <div>사진과 동영상을 여기에 끌어다 놓으세요</div>
            {/* TODO: 드래그해서 이미지 업로드 하는 기능 추가하기 */}
            <input
              type="file"
              name="imageFiles"
              multiple
              hidden
              ref={imageRef}
            />
            <Button type="button" onClick={uploadBtn} size="md" color="primary">
              이미지 업로드
            </Button>
          </div>
        )}
        {isUploaded && (
          <div className={style.formWrap}>
            <div className={style.formImageWrap}>
              {/* 업로드 할 이미지 */}
              {imageArr.length > 1 ? (
                <SliderWrapper
                  dots={false}
                  slidesToShow={1}
                  slidesToScroll={1}
                  className="slickPost"
                >
                  {imageArr.map((img, index) => (
                    <div className={style.image}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={550}
                        height={550}
                        objectFit="cover"
                      />
                    </div>
                  ))}
                </SliderWrapper>
              ) : (
                <div className={style.image}>
                  <Image
                    src={imageArr[0].src}
                    alt={imageArr[0].alt}
                    width={550}
                    height={600}
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
            {step === 2 && (
              <div className={style.formArea}>
                <Textarea
                  name="post"
                  control={control}
                  maxLength="1000"
                  placeholder="문구를 입력하세요..."
                  rows="15"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

export default PostForm
