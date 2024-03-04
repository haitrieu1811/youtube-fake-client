import classNames from 'classnames'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ChangeEvent, useMemo, useRef, useState } from 'react'

import { Button, buttonVariants } from './ui/button'

type VideoCategoryItemType = {
  value: string
  label: string
}

type VideoCategoriesSliderProps = {
  step?: number
  videoCategories: VideoCategoryItemType[]
  onChange: (videoCategoryId: string) => void
}

const VideoCategoriesSlider = ({ videoCategories, step = 300, onChange }: VideoCategoriesSliderProps) => {
  const [currentVideoCategoryId, setCurrentVideoIdCategory] = useState<string>(videoCategories[0].value)
  const [sliderTranslatePosition, setSliderTranslatePosition] = useState<number>(0)

  const videoCategoriesRef = useRef<HTMLDivElement>(null)

  const handleChangeVideoCategoryId = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    onChange(value)
    setCurrentVideoIdCategory(value)
  }

  const isFinishedSlider = useMemo(() => {
    if (!videoCategoriesRef.current) return
    return (
      videoCategoriesRef.current.scrollWidth - Math.abs(sliderTranslatePosition) <=
      videoCategoriesRef.current.offsetWidth
    )
  }, [videoCategoriesRef.current, sliderTranslatePosition])

  const handleNextSlider = () => {
    if (!videoCategoriesRef.current) return
    const isFinished =
      videoCategoriesRef.current.scrollWidth - Math.abs(sliderTranslatePosition - step) <
      videoCategoriesRef.current.offsetWidth
    if (!isFinished) {
      setSliderTranslatePosition((prevState) => (prevState -= step))
    } else {
      setSliderTranslatePosition(0 - (videoCategoriesRef.current.scrollWidth - videoCategoriesRef.current.offsetWidth))
    }
  }

  const handlePrevSlider = () => {
    if (Math.abs(sliderTranslatePosition) < step) setSliderTranslatePosition(0)
    else setSliderTranslatePosition((prevState) => (prevState += step))
  }

  return (
    <div className='relative overflow-hidden'>
      {/* Prev button */}
      {sliderTranslatePosition < 0 && (
        <div className='absolute left-0 top-0 bottom-0 z-[1] bg-gradient-to-r bg from-background via-background/90 to-transparent w-[100px]'>
          <Button size='icon' variant='ghost' className='rounded-full' onClick={handlePrevSlider}>
            <ChevronLeft strokeWidth={1.5} />
          </Button>
        </div>
      )}
      {/* Video categories */}
      <div
        ref={videoCategoriesRef}
        className='flex space-x-3 max-w-6xl py-1 duration-200'
        style={{ transform: `translateX(${sliderTranslatePosition}px)` }}
      >
        {videoCategories.map((videoCategory) => (
          <div key={videoCategory.value}>
            <input
              hidden
              type='radio'
              name='videoCategoryId'
              id={videoCategory.value}
              value={videoCategory.value}
              onChange={handleChangeVideoCategoryId}
            />
            <label
              htmlFor={videoCategory.value}
              className={buttonVariants({
                variant: videoCategory.value !== currentVideoCategoryId ? 'secondary' : 'default',
                className: classNames({
                  'cursor-pointer duration-0': true
                })
              })}
            >
              {videoCategory.label}
            </label>
          </div>
        ))}
      </div>
      {/* Next button */}
      {!isFinishedSlider && (
        <div className='absolute right-0 top-0 bottom-0 z-[1] bg-gradient-to-l bg from-background via-background/90 to-transparent w-[100px] flex justify-end'>
          <Button size='icon' variant='ghost' className='rounded-full' onClick={handleNextSlider}>
            <ChevronRight strokeWidth={1.5} />
          </Button>
        </div>
      )}
    </div>
  )
}

export default VideoCategoriesSlider
