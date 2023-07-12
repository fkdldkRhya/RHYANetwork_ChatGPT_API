import { Body, Controller, Post } from '@nestjs/common';
import { ChatGPTApiService } from './chat-gpt-api.service';
import { checkAuthorizationHeaderValue, useAccessKey } from 'src/util/auth/authorization-header-checker.util';
import { prisma } from 'src/util/database/prisma.util';
import { ChatGPTApiRequestMessageDTO } from './dto/chat-gpt-api-request-message.dto';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';

@Controller('chat-gpt-api')
export class ChatGPTApiController {
    constructor(private readonly chatGPTApiService: ChatGPTApiService) {}

    /**
     * ChatGPT 요청 전송
     * 
     * @param body 전송 필요 데이터
     * @returns 전송 결과
     */
    @Post("request-chat-gpt-message")
    async requestChatGPTMessage(@Body() body: ChatGPTApiRequestMessageDTO) : Promise<Optional<any>> {
        const accessKeyCheckResult = await checkAuthorizationHeaderValue(prisma, body.accessKey);
        if (accessKeyCheckResult.result == OptionalResult.SUCCESS && accessKeyCheckResult.data) {
            const gptResult = await this.chatGPTApiService.requestChatGPTMessage(body.messages);
            if (gptResult.result == OptionalResult.SUCCESS) {
                await useAccessKey(prisma, body.accessKey);
            }

            return gptResult;
        }else {
            return accessKeyCheckResult;
        }
    }
}
