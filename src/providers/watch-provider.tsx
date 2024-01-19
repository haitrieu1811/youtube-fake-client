'use client'

import { usePathname } from 'next/navigation'
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react'

type WatchContextType = {
  isOpenPlaylist: boolean
  setIsOpenPlaylist: Dispatch<SetStateAction<boolean>>
  isRepeat: boolean
  setIsRepeat: Dispatch<SetStateAction<boolean>>
  isShuffle: boolean
  setIsShuffle: Dispatch<SetStateAction<boolean>>
  playlistVideoIndexHistory: number[]
  setPlaylistVideoIndexHistory: Dispatch<SetStateAction<number[]>>
  resetPlaylist: () => void
}

const initialContext: WatchContextType = {
  isOpenPlaylist: true,
  setIsOpenPlaylist: () => null,
  isRepeat: true,
  setIsRepeat: () => null,
  isShuffle: true,
  setIsShuffle: () => null,
  playlistVideoIndexHistory: [],
  setPlaylistVideoIndexHistory: () => null,
  resetPlaylist: () => null
}

export const WatchContext = createContext<WatchContextType>(initialContext)

const WatchProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  const [isOpenPlaylist, setIsOpenPlaylist] = useState<boolean>(initialContext.isOpenPlaylist)
  const [isRepeat, setIsRepeat] = useState<boolean>(initialContext.isRepeat)
  const [isShuffle, setIsShuffle] = useState<boolean>(initialContext.isShuffle)
  const [playlistVideoIndexHistory, setPlaylistVideoIndexHistory] = useState<number[]>(
    initialContext.playlistVideoIndexHistory
  )

  const resetPlaylist = () => {
    setIsRepeat(false)
    setIsShuffle(false)
    setPlaylistVideoIndexHistory([])
  }

  useEffect(() => {
    if (!pathname.includes('/watch')) resetPlaylist()
  }, [pathname])

  return (
    <WatchContext.Provider
      value={{
        isOpenPlaylist,
        setIsOpenPlaylist,
        isRepeat,
        setIsRepeat,
        isShuffle,
        setIsShuffle,
        playlistVideoIndexHistory,
        setPlaylistVideoIndexHistory,
        resetPlaylist
      }}
    >
      {children}
    </WatchContext.Provider>
  )
}

export default WatchProvider
