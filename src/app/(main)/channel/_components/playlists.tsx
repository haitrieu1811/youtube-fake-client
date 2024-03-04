import PlaylistItem from '@/components/playlist-item'
import usePlaylists from '@/hooks/usePlaylists'

type ChannelPlaylistsProps = {
  username: string | undefined
}

const ChannelPlaylists = ({ username }: ChannelPlaylistsProps) => {
  const { playlists } = usePlaylists({ username })

  return (
    <div>
      <h2 className='font-semibold text-xl my-6'>Danh sách phát đã tạo</h2>
      {playlists.length > 0 && (
        <div className='grid grid-cols-10 gap-4'>
          {playlists
            .filter((playlist) => playlist.videoCount > 0)
            .map((playlist) => (
              <div key={playlist._id} className='col-span-2'>
                <PlaylistItem playlistData={playlist} />
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ChannelPlaylists
