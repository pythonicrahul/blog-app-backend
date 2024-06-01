export interface IRegistrationRequest {
    name: string;
    email: string;
    password: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}