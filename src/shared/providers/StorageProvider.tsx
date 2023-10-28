import { ReactNode, createContext } from "react";
import { getFromStorage, saveToStorage } from "../lib/storage";

type StorageCtx = {
  get: <T>(key: string, defaultValue: T) => T,
  set: (key: string, value: unknown) => void,
};

export const storageDepsContext = createContext<StorageCtx | null>(null);

export const StorageProvider = ({ children }: { children?: ReactNode }) => {
  return (
    <storageDepsContext.Provider value={
      {
        get: getFromStorage,
        set: saveToStorage
      }
    }>
      {children}
    </storageDepsContext.Provider>
  )
}
