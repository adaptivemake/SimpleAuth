# SimpleAuth
Simple Auth project implements a simple authentication API by using Redis as data store

## Code structure
```
server
   |-- tests
   |-- src
        |-- lib
        |-- middleware
        |-- models
        |-- routes
        |-- index.ts
        |-- environment.d.ts
        |-- package.json
        |-- tsconfig.json
        |-- tslint.json
```

Here the api is in the server directory, where src contains implementation code and tests contains unit tests. The api main entry is ./server/src/index.ts

## DotENV
The code requires the following ENV variables to run <br/>
PORT: which port the API is running, default value is 3000
REDIS_URI: the endpoint uri of redis, default value is localhost
TOKEN_LENGTH: number: the generated user session token string length, default is 15
TOKEN_EXPIRY_TIME_IN_MINUTE: the user session expiry time in minutes, default is 10

## How to run the code
1. Clone the repo and enter the project directory
   ```
   git clone https://github.com/henryliang21/SimpleAuth.git
   cd SimpleAuth
   ```
2. go into server directory `cd server`
3. install package by run
   `npm install`
   or `yarn`
4. build the project by run `npm run build`
5. test the project by run `npm run test`
6. run the project by run `npm start`
7. then use postman to load `http://localhost:3000` where the port number is set in .env file, or 3000 as default port
8. you may test the API by load `http://localhost:3000/ping` to get current time, without authentication. The api will return status code 200
9. use postman to sign up user, POST json data to `http://localhost:3000/signup`, the json data format is:
   ```
   {
    "username": "[user defined username]",
    "password": "[user defined password]"
   }
   ```
   please note that in the auth system, username must be unique for successful sign up.
10. then POST same json data to `http://localhost:3000/signin` to sign in the user, the returned response will contains the token and expiry timestamp.
11. next, you can use the username and token in the headers to visit secured url `http://localhost:3000/secured/ping`, where key are "username" and "token" correspondingly. Without correct username and token, or the current time has passed the expiry date time of the token, the API will return 401 status code.

## Technical explanation
The main logic is in the `lib` in `server` directory. The `IDataStore` defines the key method, where I provide 2 implementation by using Redis as data store, as well as the MemoryDataStore uses arrays to store the user info and user sign-in session info.
The routes in `routes` defines how the http requests are handled, where `middleware` contains auth.ts authentication middleware, used by the route for secured urls (`/secured/ping`)
The API follows RESTFUL standard, using http verbs and status code to indicate the response status (200 as OK, 400 as incorrect user-entered-info, 401 as unauthorized)
   