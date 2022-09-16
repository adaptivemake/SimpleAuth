import dotenv from 'dotenv'
import { IDataStore } from './iDataStore'
import { User, UserSession, Session} from '../models/models'
import Util from '../lib/util'

dotenv.config()
const TOKEN_LENGTH = process.env.TOKEN_LENGTH
const globalUserList: User[] = []
const globalSessionList: UserSession[] = []


export default class MemoryDataStore implements IDataStore {
    private userList: User[]
    private sessionList: UserSession[]

    constructor() {
        this.userList = globalUserList
        this.sessionList = globalSessionList
    }
    private findUserSession(username: string, token: string): boolean {
        const result: UserSession | undefined = this.sessionList.find(
            (x:UserSession) => x.username === username && x.token === token
        )
        return result !== null && result !== undefined
    }

    private findUser(username: string): Promise<boolean> {
        return Promise.resolve(this.userList.find((x: User) => x.username === username))
        .then(result => result !== null && result !== undefined)
        .catch(() => false)
    }


    public signUpUser(username: string, password: string): Promise<boolean> {
        return this.findUser(username)
        .then(result => {
            if (result) return false
            else {
                this.userList.push({username, password})
                return true
            }
        })
    }

    public signInUser(username: string, password: string): Promise<Session | null> {
        return Promise.resolve(this.userList.find(x => x.username === username))
        .then(result => {
            if (result) {
                const date : Date = new Date()
                const exp = process.env.TOKEN_EXPIRY_TIME_IN_MINUTE
                const expiryDatetime: Date = new Date(date.getTime() + exp*60000)

                const token: string = Util.randomString(TOKEN_LENGTH)
                this.sessionList.push({username, token})
                return {username, token, expiryDatetime}
            } else return null
        })
        .catch(() => null)
    }

    public isUserSignedIn(username: string, token: string): Promise<boolean> {
        return Promise.resolve(this.findUserSession(username, token))
    }

    public async cleanRecords(): Promise<boolean> {
        try {
            this.userList = []
            this.sessionList = []
            return true
        }
        catch (error) {
            return false
        }
    }
}
