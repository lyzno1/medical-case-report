declare namespace NodeJS {
  interface ProcessEnv {
    COZE_API_KEY: string
    COZE_BOT_ID: string
    COZE_WORKFLOW_ID: string
    NODE_ENV: "development" | "production" | "test"
  }
}
