export type SaveToStorage = (key: string, value: unknown, setItem: Storage['setItem']) => void
export type GetFromStorage =
  <T>(key: string, defaultValue: T, setItem: Storage['getItem']) => T
