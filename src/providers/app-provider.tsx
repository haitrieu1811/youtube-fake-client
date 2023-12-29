'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react'

import { getAccessTokenFromLS, getAccountFromLS } from '@/lib/auth'
import { AccountType } from '@/types/account.types'

type AppContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  account: AccountType | null
  setAccount: Dispatch<SetStateAction<AccountType | null>>
}

const initialAppContext: AppContextType = {
  isAuthenticated: !!getAccessTokenFromLS(),
  setIsAuthenticated: () => null,
  account: getAccountFromLS(),
  setAccount: () => null
}

export const AppContext = createContext<AppContextType>(initialAppContext)

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [account, setAccount] = useState<AccountType | null>(initialAppContext.account)

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        account,
        setAccount
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
