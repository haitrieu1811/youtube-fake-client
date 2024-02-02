import classNames from 'classnames'

type VideoThumbnailFallbackProps = {
  wrapperClassName?: string
  textClassName?: string
  text?: string
}

const VideoThumbnailFallback = ({
  wrapperClassName = '',
  textClassName = '',
  text = 'Chưa tải hình thu nhỏ'
}: VideoThumbnailFallbackProps) => {
  return (
    <div
      className={classNames({
        'bg-muted flex justify-center items-center': true,
        [wrapperClassName]: !!wrapperClassName
      })}
    >
      <span
        className={classNames({
          'text-sm text-muted-foreground': true,
          [textClassName]: !!textClassName
        })}
      >
        {text}
      </span>
    </div>
  )
}

export default VideoThumbnailFallback
