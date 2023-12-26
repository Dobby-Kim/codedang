import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { LoggerModule } from 'nestjs-pino'
import {
  JwtAuthModule,
  JwtAuthGuard,
  RolesModule,
  GroupLeaderGuard
} from '@libs/auth'
import { CacheConfigService } from '@libs/cache'
import { PrismaModule } from '@libs/prisma'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { ContestModule } from './contest/contest.module'
import { GroupModule } from './group/group.module'
import { ProblemModule } from './problem/problem.module'
import { StorageModule } from './storage/storage.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      introspection: true
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService
    }),
    JwtAuthModule,
    RolesModule,
    PrismaModule,
    ContestModule,
    ProblemModule,
    StorageModule,
    GroupModule,
    UserModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true }
              }
            : undefined,
        autoLogging: true,
        formatters: {
          level(label) {
            return { level: label }
          }
        }
      }
    })
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: GroupLeaderGuard }
  ]
})
export class AdminModule {}
