import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import SigninRoute from './routes/signinRoute'
import OtherRoute from './routes/otherRoute'
import SecuredRoute from './routes/securedRoute'

export default class App {
    public app: Express// .Application
    public port: number

    constructor() {
        dotenv.config()
        this.app = express()
        this.port = process.env.PORT

        this.initRouter()
    }

    private initRouter() {
        this.app.use(bodyParser.urlencoded({ extended: true}))
        this.app.use(bodyParser.json())
        this.app.use('/', new SigninRoute().Router())
        this.app.use('/', new OtherRoute().Router())
        this.app.use('/secured', new SecuredRoute().Router())
    }

    public listen() {
        this.app.listen(this.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`⚡️[server]: Server is running at https://localhost:${this.port}`)
        })
    }
}

const app = new App()
app.listen()