export const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("can not save");
  }
};

export const getFromStorage = <T>(key: string, defaultValue: T) => {
  try {
    return JSON.parse(
      localStorage.getItem(key) ?? JSON.stringify(defaultValue)
    ) as T;
  } catch {
    return defaultValue;
  }
};
