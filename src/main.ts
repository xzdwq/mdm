import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import * as session from 'express-session'
import * as passport from 'passport'
import { getRepository } from 'typeorm'
import { TypeormStore } from 'connect-typeorm'
import * as morgan from 'morgan'
const process = require('process')

import { AppModule } from '@src/app.module'
import { SessionEntity } from '@src/orm/entities/cfg/session.entity'
import logger from '@src/core/logger'

async function run() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  })
  const config = app.get(ConfigService),
        sessionRepository = getRepository(SessionEntity),
        http_resolve_log = config.get('logger').http_resolve_log,
        noauth_user_mask = config.get('logger').noauth_user_mask

  app.setGlobalPrefix('api')
  app.enableCors()

  // Сессия
  app.use(
    session({
      secret: config.get('session_secret_key'),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: +config.get('session_age')
      },
      store: new TypeormStore().connect(sessionRepository)
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())

  // Логирование HTTP запросов в зависимости от значения http_resolve_log
  morgan.token('user', (req, res) => req.user ? req.user.email : noauth_user_mask )
  morgan.format('combined', config.get('logger').morgan_format)
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode >= 400,
    stream: {
      write: (message: string) => { http_resolve_log ? logger.info(message) : null }
    }
  }))

  const PORT = config.get('port'),
        MODE = config.get('mode')
  await app.listen(
    PORT,
    '0.0.0.0',
    async () => logger.info(`Server running on port ${PORT}. Application on url ${await app.getUrl()}. Process ID: ${process.pid}. MODE: ${MODE}`, 'NestApp')
  )
}
run()
