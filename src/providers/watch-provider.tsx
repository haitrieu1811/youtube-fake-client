'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react'

type WatchContextType = {
  isOpenPlaylist: boolean
  setIsOpenPlaylist: Dispatch<SetStateAction<boolean>>
  isRepeat: boolean
  setIsRepeat: Dispatch<SetStateAction<boolean>>
  isShuffle: boolean
  setIsShuffle: Dispatch<SetStateAction<boolean>>
}

const initialContext: WatchContextType = {
  isOpenPlaylist: true,
  setIsOpenPlaylist: () => null,
  isRepeat: true,
  setIsRepeat: () => null,
  isShuffle: true,
  setIsShuffle: () => null
}

export const WatchContext = createContext<WatchContextType>(initialContext)

const WatchProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenPlaylist, setIsOpenPlaylist] = useState<boolean>(true)
  const [isRepeat, setIsRepeat] = useState<boolean>(false)
  const [isShuffle, setIsShuffle] = useState<boolean>(false)

  return (
    <WatchContext.Provider
      value={{
        isOpenPlaylist,
        setIsOpenPlaylist,
        isRepeat,
        setIsRepeat,
        isShuffle,
        setIsShuffle
      }}
    >
      {children}
    </WatchContext.Provider>
  )
}

export default WatchProvider
