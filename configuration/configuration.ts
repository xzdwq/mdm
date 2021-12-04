const MODE = process.env.NODE_ENV || 'production'
/**
 * Выбранный уровень в конфигурации не будет писать вышестоящие уровни
 * @example{ logger.info('msg', ctx) }
 */
const logger_levels = {
  0: 'silly',
  1: 'debug',
  2: 'verbose',
  3: 'info',
  4: 'warn',
  5: 'error'
}

export default (): object => ({
  mode: MODE,
  port: +process.env.PORT,
  session_secret_key: process.env.SESSION_SECRET_KEY,
  session_age: +process.env.SESSION_AGE,
  // Настройки БД
  db: {
    pg_mdm: {
      type: process.env.PG_DB_TYPE,
      host: process.env.PG_DB_HOST,
      port: +process.env.PG_DB_PORT,
      username: process.env.PG_DB_USER,
      password: process.env.PG_DB_PASS,
      database: process.env.PG_DB_NAME,
      synchronize: process.env.PG_DB_SYNCHRONIZE,
      prefix: process.env.PG_DB_PREFIX
    }
  },
  // Настройки логгирования
  logger: {
    level: logger_levels[MODE === 'production' ? 3 : 0],
    other_ctx: 'CORE',
    http_resolve_log: false,
    noauth_user_mask: 'noauthuser',
    morgan_format: '[:user] :method :url :status, res-time: :response-time ms',
    filename: './logs/logs-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '2m',
    maxFiles: '7d',
    handleException: true,
    format: 'DD.MM.YYYY HH:mm:ss'
  }
})