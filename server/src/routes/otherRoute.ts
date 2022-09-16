import express, { Router, Request, Response } from 'express'

export default class OtherRoute {
    private router: Router

    constructor() {
        this.router = express.Router()
        this.router.get('/ping', (req: Request, res: Response) => {
            if (req)
                res.send(new Date())
        })
    }

    public Router() {
        return this.router
    }
}