import express, { Router, Request, Response } from 'express'
import AuthHandler from '../middleware/auth'

export default class SecuredRoute {
    private router: Router

    constructor() {
        this.router = express.Router()
        this.router.use(new AuthHandler().Handler())
        this.router.get('/ping', (req: Request, res: Response) => {
            if (req)
                res.send(new Date())
        })
    }

    public Router() {
        return this.router
    }
}