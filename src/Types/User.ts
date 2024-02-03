export type UserType = {
    Id:string,
    LoggedIn:boolean,
    ProfileImg:string,
    email:string,
    firstName:string,
    lastName:string,
    gender:string,
    password:string,
    phone:string,
    repeatPassword:string,
}

export interface UserState {
    User:UserType | null,
}