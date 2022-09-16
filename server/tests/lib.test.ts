import exp from "constants"
import { IDataStore } from "../src/lib/iDataStore"
import RedisDataStore from "../src/lib/redisDataStore"
import { Session } from "../src/models/models"

const testUser = {
    username: "alee",
    password: "clmadm"
}

describe('Data store tests', () => {
    let dataStore: IDataStore
    let signInToken: string
    beforeAll(() => {
        dataStore = new RedisDataStore()
    })

    test('User sign up', async () => {
        const firstSignUpResult = await dataStore.signUpUser(testUser.username, testUser.password)
        expect(firstSignUpResult).toBe(true)
        const secondSignUpResult = await dataStore.signUpUser(testUser.username, testUser.password)
        expect(secondSignUpResult).toBe(false)
    })

    test('User sign in', async () => {
        const signedInSession = await dataStore.signInUser(testUser.username, testUser.password)
        expect(signedInSession).not.toBeNull()
        expect(signedInSession?.token).not.toBe('')
        signInToken = signedInSession ? signedInSession.token : ''
    })

    test('User use token to verify sign in status', async () => {
        const isUserSignedin = await dataStore.isUserSignedIn(testUser.username, signInToken)
        expect(isUserSignedin).toBeTruthy()
    })

    afterAll(() => {
        signInToken = ''
        dataStore.cleanRecords()
    })
})