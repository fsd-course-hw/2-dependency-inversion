import React from "react";
import {
    Context,
    createContext,
    useContext,
} from "react";

export const useStrictContext = <T,>(context: Context<T | null>) => {
    const value = useContext(context);
    if (value === null) {
        throw new Error();
    }
    return value;
};

export function createStrictContext<T>() {
    return createContext<T | null>(null);
}