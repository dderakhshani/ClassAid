export class UserModel {
    id: number;
    fullName: string;
    username: string | undefined = undefined;
    password: string | undefined = undefined;
    token?: string;
}

