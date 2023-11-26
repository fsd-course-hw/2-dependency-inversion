import { createStrictContext } from "../lib/react";
import {Task} from "./type";

type TasksDeps = {
    getFromStorage: (key: string, value: unknown) => Task[];
    saveToStorage: <T>(key: string, defaultValue: T) => void;
};

export const tasksDepsContext = createStrictContext<TasksDeps | null>();