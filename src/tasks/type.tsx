export type Task = {
    id: string;
    title: string;
    done: boolean;
    ownerId?: string;
};