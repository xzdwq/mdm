import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

import { HttpErrorFilter } from '@src/core/httperror.filter'
import configuration from '@cfg/configuration'
import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { entities } from '@src/orm'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'production'}`
      ],
      load: [
        configuration
      ]
    }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get('db').pg_mdm.type,
        host: config.get('db').pg_mdm.host,
        port: config.get('db').pg_mdm.port,
        username: config.get('db').pg_mdm.username,
        password: config.get('db').pg_mdm.password,
        database: config.get('db').pg_mdm.database,
        synchronize: config.get('db').pg_mdm.synchronize,
        migrationsTableName: `${config.get('db').pg_mdm.prefix}_migrations`,
        entities,
        extra: {
          max: 10,
          connectionTimeoutMillis: 1000
        },
        logging: [ 'error' ],
        migrations: [ 'src/orm/migration/*{.ts,.js}' ],
        cli: { migrationsDir: 'src/orm/migration' }
      })
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    }
  ]
})
export class AppModule {}
