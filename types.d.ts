export interface IUser {
    username: string;
    email: string;
    password: string;
    roles: string[];
    active?: boolean;
}

export interface INote {
    user: IUser;
    title: string;
    text: string;
    completed: boolean;
}