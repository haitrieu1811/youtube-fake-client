'use client'

import { useQuery } from '@tanstack/react-query'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import { useMemo } from 'react'

import videoApis from '@/apis/video.apis'

type WatchClientProps = {
  idName: string
}

const WatchClient = ({ idName }: WatchClientProps) => {
  // Query: Lấy thông tin chi tiết video
  const watchVideoQuery = useQuery({
    queryKey: ['watchVideo'],
    queryFn: () => videoApis.watchVideo(idName)
  })

  // Thông tin video
  const videoInfo = useMemo(() => watchVideoQuery.data?.data.data.video, [watchVideoQuery.data?.data.data.video])

  return (
    <div>
      <div className='flex justify-between'>
        <div className='w-2/3'>
          {videoInfo && (
            <MediaPlayer
              autoplay
              title={videoInfo.title}
              src={`http://localhost:4000/static/video-hls/${videoInfo.idName}/master.m3u8`}
              className='z-0'
            >
              <MediaProvider />
              <DefaultVideoLayout thumbnails={videoInfo.thumbnail} icons={defaultLayoutIcons} />
            </MediaPlayer>
          )}
        </div>

        <div></div>
      </div>
    </div>
  )
}

export default WatchClient
