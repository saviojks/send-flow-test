import { useEffect, useEffectEvent, useState } from 'react'
import type { Subscriber } from '../types'

type LiveState<T> = {
  key: string
  data: T | undefined
  error: Error | null
}

export type LiveData<T> = {
  data: T | undefined
  error: Error | null
  loading: boolean
}

export const useSubscription = <T>(key: string | null, subscribe: Subscriber<T>): LiveData<T> => {
  const [state, setState] = useState<LiveState<T> | null>(null)

  const start = useEffectEvent((currentKey: string) =>
    subscribe(
      (data) => setState({ key: currentKey, data, error: null }),
      (error) => setState({ key: currentKey, data: undefined, error }),
    ),
  )

  useEffect(() => {
    if (!key) return
    return start(key)
  }, [key])

  const isCurrent = key !== null && state?.key === key

  return {
    data: isCurrent ? state.data : undefined,
    error: isCurrent ? state.error : null,
    loading: key !== null && !isCurrent,
  }
}
