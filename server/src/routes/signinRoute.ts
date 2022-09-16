import express, { Router, Request, Response } from 'express'
import { IDataStore } from '../lib/iDataStore'
import MemoryDataStore from '../lib/memoryDataStore'
import RedisDataStore from '../lib/redisDataStore'

export default class SigninRoute {
    private router: Router
    private dataStore: IDataStore = new RedisDataStore()

    constructor() {
        this.router = express.Router()
        this.router.post('/signup', (req: Request, res: Response) => {
            if (!req || !req.body.username || !req.body.password) {
                res.sendStatus(400)
            } else {
                this.dataStore.signUpUser(req.body.username, req.body.password)
                .then(result => {
                    if (result) {
                        res.statusCode = 200
                        res.send(`user ${req.body.username} is signed up`)
                    } else {
                        res.sendStatus(400)
                    }
                })
            }
        })
        this.router.post('/signin', (req: Request, res: Response) => {
            if (!req || !req.body.username || !req.body.password) {
                res.sendStatus(400)
            } else {
                this.dataStore.signInUser(req.body.username, req.body.password)
                .then(session => {
                    if (session) {
                        res.statusCode = 200
                        res.send(session)
                    } else {
                        res.sendStatus(400)
                    }}
                )
            }
        })
    }

    public Router() {
        return this.router
    }
}