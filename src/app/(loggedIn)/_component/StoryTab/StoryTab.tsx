import React from 'react'
import Link from 'next/link'
import CircleProfile from '@/app/(loggedIn)/_component/CircleProfile'
import SliderWrapper from '@/app/(loggedIn)/_component/SliderWrapper'
import style from './storyTab.module.scss'

function StoryTab() {
  // 내가 팔로우한 유저들
  const users = [
    {
      id: 'h._seung',
      nickname: '랍뷰희승',
      image: '/user.jpg',
      updatedStory: true,
    },
    {
      id: 'veenoo',
      nickname: '조수빈',
      image: '/user.jpg',
      updatedStory: true,
    },
    {
      id: 'jin_woo',
      nickname: '김김진진우우',
      image: '/user.jpg',
      updatedStory: true,
    },
    {
      id: 'hyun_mori',
      nickname: '이현지',
      image: '/user.jpg',
      updatedStory: true,
    },
    {
      id: 'lovely_joo',
      nickname: '곽이주',
      image: '/user.jpg',
      updatedStory: true,
    },
    {
      id: 'jin_woo',
      nickname: '김김진진우우',
      image: '/user.jpg',
      updatedStory: false,
    },
    {
      id: 'hyun_mori',
      nickname: '이현지',
      image: '/user.jpg',
      updatedStory: false,
    },
    {
      id: 'lovely_joo',
      nickname: '곽이주',
      image: '/user.jpg',
      updatedStory: false,
    },
    {
      id: 'jin_woo',
      nickname: '김김진진우우',
      image: '/user.jpg',
      updatedStory: false,
    },
    {
      id: 'hyun_mori',
      nickname: '이현지',
      image: '/user.jpg',
      updatedStory: false,
    },
    {
      id: 'lovely_joo',
      nickname: '곽이주',
      image: '/user.jpg',
      updatedStory: false,
    },
  ]

  return (
    <div className={style.storyTab}>
      <div className={style.storyTabList}>
        <SliderWrapper
          dots={false}
          slidesToShow={7}
          slidesToScroll={3}
          className="multipleSlider"
        >
          {users?.map((user) => (
            <div>
              <div className={style.storyTabListItem} key={user.id}>
                <Link
                  href={`/${user?.id}`}
                  className={style.profileImageLink}
                >
                  <CircleProfile
                    src={user?.image}
                    size={70}
                    alt={user?.id}
                    ring
                    ringWeight={3}
                    active={user?.updatedStory}
                  />
                </Link>
                <div className={style.userName}>{user?.id}</div>
              </div>
            </div>
          ))}
        </SliderWrapper>
      </div>
    </div>
  )
}

export default StoryTab
