import { useState } from "react";

type User = {
  id: string;
  name: string;
};

export function useUsers(): User[] {
  return useState(() => [
    { id: "user-1", name: "me" },
    { id: "user-2", name: "evgeny" },
  ])[0];
}
