import { TGetFromStorage, TSaveToStorage } from "../types";

export const saveToStorage: TSaveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("can not save");
  }
};

export const getFromStorage: TGetFromStorage = (key, defaultValue) => {
  try {
    return JSON.parse(
      localStorage.getItem(key) ?? JSON.stringify(defaultValue)
    ) as T;
  } catch {
    return defaultValue;
  }
};
