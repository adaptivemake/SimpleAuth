export interface IDataStore {
    signUpUser(username: string, password: string): Promise<boolean>

    signInUser(username: string, password: string): Promise<import("../models/models").Session | null>

    isUserSignedIn(username: string, token: string): Promise<boolean>

    cleanRecords(): Promise<boolean>
}