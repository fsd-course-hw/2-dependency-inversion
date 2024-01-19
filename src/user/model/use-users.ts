import { useState } from "react";
import { User } from './types';

export function useUsers(): User[] {
  return useState(() => [
    { id: "user-1", name: "me" },
    { id: "user-2", name: "evgeny" },
  ])[0];
}
