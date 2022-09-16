

declare interface User {
    username: string
    password: string
}

declare interface UserSession {
    username: string
    token: string
}

declare interface Session {
    username: string
    token: string
    expiryDatetime: Date
}

export {User, UserSession, Session}