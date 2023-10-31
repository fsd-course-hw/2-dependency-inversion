export type TSaveToStorage = (key: string, value: unknown) => void;
export type TGetFromStorage = <T>(key: string, defaultValue: T) => T;
export type UserSelectProps = {
  userId?: string;
  onChangeUserId: (value: string) => void;
};
