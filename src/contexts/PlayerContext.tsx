import { createContext, ReactNode, useContext, useState } from 'react'
import { DictionaryCache } from '../data/models/dictionary-cache'
import { makeCookieAdapter } from '../main/factories/cache'

// type PlayerContextData = {
//   wordList: string[]
//   currentWordIndex: number
//   isPlaying: boolean
//   play: (word: string) => void
//   playNext: () => void
//   playPrevious: () => void
//   playList: (list: string[], index: number) => void
//   togglePlay: () => void
//   clearPlayerState: () => void
//   hasNext: boolean
//   hasPrevious: boolean
//   setPlayingState: (state: boolean) => void
// }

type PlayerContextData = {
  currentWord: string
  setWord: (word: string) => void
  getCachedWords: () => DictionaryCache | object
  setCachedWord: (word: DictionaryCache) => void
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode
}

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [currentWord, setCurrentWord] = useState<string>('hello')

  const cookie = makeCookieAdapter()

  function setWord(word: string) {
    setCurrentWord(word)
  }

  function getCachedWords(): DictionaryCache | object {
    const cache = cookie.get('cache-words')
    if (cache) return JSON.parse(cache)
    return {}
  }

  function setCachedWord(word: any) {
    const cache = cookie.get('cache-words')
    const key = Object.keys(word)[0]
    if (cache) {
      const words = JSON.parse(cache)
      words[key] = word[key]
      cookie.set('cache-words', words)
    } else {
      cookie.set('cache-words', word)
    }
  }

  return (
    <PlayerContext.Provider
      value={{ currentWord, setWord, getCachedWords, setCachedWord }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}
