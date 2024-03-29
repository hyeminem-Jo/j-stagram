import Image from 'next/image'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import CommentForm from '@/app/(loggedIn)/_component/CommentForm'
import ActionButton from '@/app/(loggedIn)/_component/ActionButton'
import CircleProfile from '@/app/(loggedIn)/_component/CircleProfile'
import SliderWrapper from '@/app/(loggedIn)/_component/SliderWrapper'
import style from './post.module.scss'

dayjs.locale('ko')
dayjs.extend(relativeTime)

function Post() {
  const target = {
    User: {
      id: 'nawm_eeee',
      nickname: '혜진',
      image: '/user-01.jpg',
    },
    content: '리액트 공부는 재밌어...',
    createdAt: new Date(),
    Images: [
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
    ],
    Comments: [
      {
        User: {
          id: 'h._seung',
        },
        content: '모찌리도후가 먹고싶엉',
      },
      {
        User: {
          id: 'veenoo',
        },
        content: '술먹자',
      },
    ],
    numOfLike: 5,
  }

  const { User, content, createdAt, Images, Comments, numOfLike } = target

  return (
    <article className={style.post}>
      <div className={style.postUser}>
        <div className={style.user}>
          <CircleProfile
            src={User?.image}
            width={40}
            height={40}
            alt={User?.id}
          />
          <strong className={style.userName}>{User?.id}</strong>
          <span className={style.dot}>•</span>
          <span className={style.date}>{dayjs(createdAt).fromNow(true)}</span>
        </div>
        <button type="button">
          <svg
            aria-label="옵션 더 보기"
            className="x1lliihq x1n2onr6 x5n08af"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <title>옵션 더 보기</title>
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="6" cy="12" r="1.5"></circle>
            <circle cx="18" cy="12" r="1.5"></circle>
          </svg>
        </button>
      </div>
      {Images.length > 1 ? (
        <div className={style.sliderWrap}>
          <SliderWrapper
            slidesToShow={1}
            slidesToScroll={1}
            className="slickPost slickPostPagination"
            ㅁ
          >
            {Images?.map((img) => (
              <div className={style.postImage}>
                <Image
                  src={img?.src}
                  alt={img?.alt}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </SliderWrapper>
        </div>
      ) : (
        <div className={style.postImage}>
          <Image
            src={Images[0]?.src}
            alt={Images[0]?.alt}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <div className={style.postBottom}>
        <ActionButton />
        <div className={style.like}>좋아요 {numOfLike}개</div>
        {/* TODO: 좋아요 수가 천단위가 넘어가면 ',' 붙이기 => util 함수로 빼기 */}
        <div className={style.postContent}>
          <span>{User.id}</span>
          <p className={style.desc}>{content}</p>
        </div>
        <button type="button" className={style.moreComment}>
          댓글 {Comments.length}개 {Comments.length > 1 && '모두 '}보기
        </button>
        <CommentForm />
      </div>
    </article>
  )
}

export default Post
