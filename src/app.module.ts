import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ChatGPTApiModule } from './chat-gpt-api/chat-gpt-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV_BACKEND === 'prod' ? '.env.prod' : '.env.dev'
    }),

    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
          timeout: configService.get('HTTP_TIMEOUT'),
          maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
    }),

    ChatGPTApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
