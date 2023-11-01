export const saveToStorage = (
  key: string,
  value: unknown,
  setItem: Storage['setItem'],
) => {
  try {
    setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("can not save: " + e);
  }
};

export const getFromStorage = <T>(
  key: string,
  defaultValue: T,
  getItem: Storage['getItem']
) => {
  try {
    return JSON.parse(
      getItem(key) ?? JSON.stringify(defaultValue)
    ) as T;
  } catch {
    return defaultValue;
  }
};
