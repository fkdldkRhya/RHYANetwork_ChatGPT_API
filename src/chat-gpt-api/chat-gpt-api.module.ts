import { Module } from '@nestjs/common';
import { ChatGPTApiController } from './chat-gpt-api.controller';
import { ChatGPTApiService } from './chat-gpt-api.service';

@Module({
  controllers: [ChatGPTApiController],
  providers: [ChatGPTApiService]
})
export class ChatGPTApiModule {}
