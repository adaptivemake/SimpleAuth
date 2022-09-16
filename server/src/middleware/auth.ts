import express, { RequestHandler, Request, Response, NextFunction } from 'express'
import { IDataStore } from '../lib/iDataStore'
import MemoryDataStore from '../lib/memoryDataStore'
import RedisDataStore from '../lib/redisDataStore'

export default class AuthHandler {
    private handler: RequestHandler
    private dataStore: IDataStore = new RedisDataStore()

    constructor() {
        this.handler = async (req: Request, res: Response, next: NextFunction) => {
            const username: string | undefined = req.header('username')
            const token: string | undefined = req.header('token')
            if (!req || !req.headers || !username || !token) {
                res.sendStatus(401)
            } else {
                const authed = await this.dataStore.isUserSignedIn(username, token)
                if (authed) {
                    next()
                } else {
                    res.sendStatus(401)
                }
            }
        }
    }

    public Handler() : RequestHandler {
        return this.handler
    }
}