'use client'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './slickStyle/slickPost.scss'
import './slickStyle/slickPostPagination.scss'
import './slickStyle/slickMultipleItem.scss'

function SliderWrapper({
  children,
  dots = true,
  arrows = true,
  infinite = false,
  speed = 500,
  slidesToShow,
  slidesToScroll,
  className,
}) {
  const settings = {
    dots,
    arrows,
    infinite,
    speed,
    slidesToShow,
    slidesToScroll,
  }

  return (
    <div className={className}>
      <Slider {...settings}>{children}</Slider>
    </div>
  )
}

export default SliderWrapper
