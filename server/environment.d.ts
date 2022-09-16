declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [index: string]: any
        PORT: number | 3000
        REDIS_URI: string
        TOKEN_LENGTH: number | 15
        TOKEN_EXPIRY_TIME_IN_MINUTE: number | 10
      }
    }
  }
  
  export {}