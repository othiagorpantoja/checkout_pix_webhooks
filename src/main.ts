import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { ValidationPipe } from '@nestjs/common'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import express from 'express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import pinoHttp from 'pino-http'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.enableShutdownHooks()
  app.use(helmet())
  app.use(
    '/stripe/webhook',
    express.raw({ type: '*/*' })
  )
  app.use(pinoHttp())
  app.use(
    rateLimit({ windowMs: 60_000, max: 200, standardHeaders: true, legacyHeaders: false })
  )
  const config = new DocumentBuilder()
    .setTitle('Checkout Pix Webhooks')
    .setDescription('API de cobrança Pix e webhooks resilientes')
    .setVersion('0.1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000)
}

bootstrap()
