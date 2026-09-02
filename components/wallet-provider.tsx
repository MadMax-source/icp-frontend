'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface WalletState {
  connected: boolean
  address: string | null
  wrongNetwork: boolean
  connect: () => void
  disconnect: () => void
  switchNetwork: () => void
}

const MOCK_ADDRESS = '0x82F3aD4c6b1E9d0A7c5B2e8F1a4D6c9B3e7A091A'

const WalletContext = createContext<WalletState | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [wrongNetwork, setWrongNetwork] = useState(false)

  const connect = useCallback(() => setConnected(true), [])
  const disconnect = useCallback(() => {
    setConnected(false)
    setWrongNetwork(false)
  }, [])
  const switchNetwork = useCallback(() => setWrongNetwork(false), [])

  return (
    <WalletContext.Provider
      value={{
        connected,
        address: connected ? MOCK_ADDRESS : null,
        wrongNetwork,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
