import { Metadata } from 'next'
import ChannelClient from '../channel/_components/channel-client'

export const metadata: Metadata = {
  title: 'Thông tin kênh',
  description: 'Thông tin kênh'
}

type ProfileProps = {
  params: {
    username: string
  }
}

const Profile = ({ params }: ProfileProps) => {
  const { username } = params
  const realUsername = username.replace(/[%40]/g, '')
  return <ChannelClient username={realUsername} />
}

export default Profile
