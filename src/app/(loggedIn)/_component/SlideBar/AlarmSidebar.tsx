'use client'

import cx from 'classnames'
import style from '../sidebar.module.scss'
import React, { useEffect, useState } from 'react'
import AlarmList from '@/app/(loggedIn)/_component/SlideBar/AlarmList'

function AlarmSidebar({ isOpen }) {
  // 1. 내 댓글에 좋아요 누름
  // 1-2. 내 댓글에 좋아요 누름 (여러 명)
  // 2. 내 스토리에 좋아요 누름
  // 2-2. 내 스토리에 좋아요 누름 (여러 명)
  // 3. 내 게시물에 좋아요 누름
  // 3-2. 내 게시물에 좋아요 누름 (여러 명)
  // 4. 댓글에 나를 태그함

  const alarmData = [
    {
      alarmId: 1,
      User: [
        {
          id: 'min_00a',
          nickname: '민아',
          image: '/user.jpg',
        },
      ],
      type: 'follow',
      text: `님이 회원님을 팔로우하기 시작했습니다`,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 0)), // 오늘
      // createdAt: new Date(new Date().setDate(new Date().getDate() - 0)), // 오늘
    },
    {
      alarmId: 2,
      User: [
        {
          id: 'nawm_eeee',
          nickname: '김진명',
          image: '/user-01.jpg',
        },
      ],
      type: 'likePost',
      text: '게시글을 좋아합니다',
      Content: {
        desc: '',
        image: '/media01.png',
      },
      createdAt: new Date(new Date().setDate(new Date().getDate() - 0)), //  오늘
    },
    {
      alarmId: 3,
      User: [
        {
          id: 'veenoo',
          nickname: '조수빈',
          image: '/user.jpg',
        },
      ],
      type: 'mention',
      text: '님이 댓글에서 회원님을 언급했습니다',
      Content: {
        desc: '이거 봄?ㅋㅋㅋㅋ',
        image: '/media01.png',
      },
      createdAt: new Date(new Date().setDate(new Date().getDate() - 3)), // 3일 전
    },
    {
      alarmId: 4,
      User: [
        {
          id: 'jj_jinny',
          nickname: '조혜진',
          image: '/user.jpg',
        },
        {
          id: 'veenoo',
          nickname: '조수빈',
          image: '/user.jpg',
        },
        {
          id: 'h._seung',
          nickname: '랍뷰희승',
          image: '/user.jpg',
        },
        {
          id: 'jin_woo',
          nickname: '김김진진우우',
          image: '/user.jpg',
        },
        {
          id: 'min_00a',
          nickname: '민아',
          image: '/user.jpg',
        },
      ],
      type: 'likePost',
      text: '게시글을 좋아합니다',
      Content: {
        desc: '',
        image: '/media01.png',
      },
      createdAt: new Date(new Date().setDate(new Date().getDate() - 4)), // 4일 전
    },
    {
      alarmId: 5,
      User: [
        {
          id: 'h._seung',
          nickname: '랍뷰희승',
          image: '/user.jpg',
        },
      ],
      type: 'mention',
      text: '님이 댓글에서 회원님을 언급했습니다',
      Content: {
        desc: '그러자!!',
        image: '/media02.png',
      },
      createdAt: new Date(new Date().setDate(new Date().getDate() - 5)), // 5일 전
    },
    {
      alarmId: 6,
      User: [
        {
          id: 'jin_woo',
          nickname: '김김진진우우',
          image: '/user.jpg',
        },
      ],
      type: 'comment',
      text: '님이 게시글에 댓글을 작성했습니다',
      Content: {
        desc: '잘나왔네',
        image: '/media02.png',
      },
      createdAt: new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)),
      ), // 7일 전
    },
    {
      alarmId: 7,
      User: [
        {
          id: 'jin_woo',
          nickname: '김김진진우우',
          image: '/user.jpg',
        },
      ],
      type: 'comment',
      text: '님이 게시글에 댓글을 작성했습니다',
      Content: {
        desc: '잘나왔네',
        image: '/media02.png',
      },
      createdAt: new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)),
      ), // 7일 전
    },
    {
      alarmId: 8,
      User: [
        {
          id: 'jin_woo',
          nickname: '김김진진우우',
          image: '/user.jpg',
        },
      ],
      type: 'comment',
      text: '님이 게시글에 댓글을 작성했습니다',
      Content: {
        desc: '잘나왔네',
        image: '/media02.png',
      },
      createdAt: new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)),
      ), // 7일 전
    },
    {
      alarmId: 9,
      User: [
        {
          id: 'jin_woo',
          nickname: '김김진진우우',
          image: '/user.jpg',
        },
      ],
      type: 'comment',
      text: '님이 게시글에 댓글을 작성했습니다',
      Content: {
        desc: '잘나왔네',
        image: '/media02.png',
      },
      createdAt: new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)),
      ), // 7일 전
    },
    {
      alarmId: 10,
      User: [
        {
          id: 'jin_woo',
          nickname: '김김진진우우',
          image: '/user.jpg',
        },
      ],
      type: 'comment',
      text: '님이 게시글에 댓글을 작성했습니다',
      Content: {
        desc: '잘나왔네',
        image: '/media02.png',
      },
      createdAt: new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)),
      ), // 7일 전
    },
    {
      alarmId: 11,
      User: [
        {
          id: 'jin_woo',
          nickname: '김김진진우우',
          image: '/user.jpg',
        },
      ],
      type: 'comment',
      text: '님이 게시글에 댓글을 작성했습니다',
      Content: {
        desc: '잘나왔네',
        image: '/media02.png',
      },
      createdAt: new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)),
      ), // 7일 전
    },
    {
      alarmId: 12,
      User: [
        {
          id: 'jin_woo',
          nickname: '김김진진우우',
          image: '/user.jpg',
        },
      ],
      type: 'comment',
      text: '님이 게시글에 댓글을 작성했습니다',
      Content: {
        desc: '잘나왔네',
        image: '/media02.png',
      },
      createdAt: new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)),
      ), // 7일 전
    },
    {
      alarmId: 13,
      User: [
        {
          id: 'jin_woo',
          nickname: '김김진진우우',
          image: '/user.jpg',
        },
      ],
      type: 'comment',
      text: '님이 게시글에 댓글을 작성했습니다',
      Content: {
        desc: '잘나왔네',
        image: '/media02.png',
      },
      createdAt: new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)),
      ), // 7일 전
    },
  ]

  const [todayAlarm, setTodayAlarm] = useState([])
  const [thisWeekAlarm, setThisWeekAlarm] = useState([])
  const [thisMonthAlarm, setThisMonthAlarm] = useState([])

  useEffect(() => {
    // 오늘 알림을 임시 배열로 수집
    const tempTodayAlarm = []
    const tempThisWeekAlarm = []
    const tempThisMonthAlarm = []

    alarmData.map((data, index) => {
      const now = new Date()
      const nowDate = now.getDate()
      const nowMonth = now.getMonth()
      const nowYear = now.getFullYear()

      const day = new Date(data?.createdAt)
      const today = new Date(nowYear, nowMonth, nowDate)

      // 이번 주의 첫 번째 날 (일요일)
      const firstDayOfThisWeek = new Date(
        today.setDate(today.getDate() - today.getDay()),
      )

      if (
        nowYear === day.getFullYear() &&
        nowMonth === day.getMonth() &&
        nowDate === day.getDate()
      ) {
        // 오늘
        if (!tempTodayAlarm.some((alarm) => alarm === data)) {
          tempTodayAlarm.push(data)
        }
      } else if (
        firstDayOfThisWeek.getFullYear() === day.getFullYear() &&
        firstDayOfThisWeek.getMonth() === day.getMonth() &&
        firstDayOfThisWeek.getDate() <= day.getDate()
      ) {
        // 이번 주
        tempThisWeekAlarm.push(data)
      } else if (firstDayOfThisWeek.getFullYear() === day.getFullYear()) {
        // 이번 달
        tempThisMonthAlarm.push(data)
      }
    })
    // 상태를 한 번만 업데이트
    setTodayAlarm(tempTodayAlarm)
    setThisWeekAlarm(tempThisWeekAlarm)
    setThisMonthAlarm(tempThisMonthAlarm)
  }, [alarmData.length])

  return (
    <div
      className={cx(style.sidebarInner, style.alarm, isOpen && style.openedBar)}
    >
      <h3 className={style.sidebarTitle}>알림</h3>
      <div className={style.sideBarContentWrap}>
        {alarmData.length > 0 ? (
          <>
            {todayAlarm.length > 0 && (
              <div className={style.sideBarContent}>
                <h4 className={style.sidebarSubTitle}>
                  <span>오늘</span>
                </h4>
                <AlarmList data={todayAlarm} />
              </div>
            )}
            {thisWeekAlarm.length > 0 && (
              <div className={style.sideBarContent}>
                <h4 className={style.sidebarSubTitle}>
                  <span>이번 주</span>
                </h4>
                <AlarmList data={thisWeekAlarm} />
              </div>
            )}
            {thisMonthAlarm.length > 0 && (
              <div className={style.sideBarContent}>
                <h4 className={style.sidebarSubTitle}>
                  <span>이번 달</span>
                </h4>
                <AlarmList data={thisMonthAlarm} />
              </div>
            )}
          </>
        ) : (
          <h4 className={cx(style.sidebarSubTitle, style.noData)}>알림이 없습니다</h4>
        )}
      </div>
    </div>
  )
}

export default AlarmSidebar
