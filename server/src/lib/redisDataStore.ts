import dotenv from 'dotenv'
import { createClient } from 'redis'
import { IDataStore } from './iDataStore'
import { Session} from '../models/models'
import Util from '../lib/util'
import { stringify } from 'querystring'

dotenv.config()
const TOKEN_LENGTH = process.env.TOKEN_LENGTH
const TOKEN_EXPIRY_TIME_IN_MINUTE = process.env.TOKEN_EXPIRY_TIME_IN_MINUTE
const REDIS_URI = process.env.REDIS_URI
const REDIS_PORT = process.env.REDIS_PORT
const globalRedisClient = createClient({
    url: REDIS_URI
})

globalRedisClient.connect()
globalRedisClient.on('error', () => {
    // tslint:disable-next-line:no-console
    console.log(`redis connection error`)
})


export default class RedisDataStore implements IDataStore {
    private client = globalRedisClient

    private async findUserSession(username: string, token: string): Promise<boolean> {
        try {
            const sessionExpriyDatetimeResult = await this.client.SMEMBERS(`user:${username}:token:${token}`)

            return sessionExpriyDatetimeResult !== null && sessionExpriyDatetimeResult !== undefined
        }
        catch (error) {
            return false
        }
    }

    public async signUpUser(username: string, password: string): Promise<boolean> {
        try {
            const userExists = await this.client.SISMEMBER('user', username)
            if (userExists) return false
            else {
                const addUserResult = await this.client.SADD('user', username)
                const addUserPwdResult = await this.client.SADD(`user:${username}:password`, password)

                return addUserPwdResult === 1 && addUserPwdResult === 1
            }
        }
        catch (error) {
            return false
        }
    }

    public async signInUser(username: string, password: string): Promise<Session | null> {
        try {
            const userSessionResult = await this.client.SISMEMBER(`user:${username}:password`, password)
            if (userSessionResult) {
                const date : Date = new Date()
                const expiryDatetime: Date = new Date(date.getTime() + TOKEN_EXPIRY_TIME_IN_MINUTE*60000)

                const token: string = Util.randomString(TOKEN_LENGTH)
                const results = await Promise.all([
                    this.client.SADD(`user:${username}:token:${token}`, expiryDatetime.getTime().toString()),
                    this.client.EXPIREAT(`user:${username}:token:${token}`, expiryDatetime.getTime())
                ])
                const session: Session = {username, token, expiryDatetime}
                return session
            } else {
                return null
            }
        }
        catch(error) {
            return null
        }
    }

    public async isUserSignedIn(username: string, token: string): Promise<boolean> {
        try {
            return await this.findUserSession(username, token)
        }
        catch (error) {
            return false
        }
    }

    public async cleanRecords(): Promise<boolean> {
        try {
            await this.client.FLUSHALL()
            await this.client.disconnect()
            return true
        }
        catch (error) {
            return false
        }
    }
}
