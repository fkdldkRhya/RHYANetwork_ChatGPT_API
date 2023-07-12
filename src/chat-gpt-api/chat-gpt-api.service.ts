import { Injectable } from '@nestjs/common';
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';

@Injectable()
export class ChatGPTApiService {
    /**
     * ChatGPT 요청 전송
     */
    async requestChatGPTMessage(messages: ChatCompletionRequestMessage[]) : Promise<Optional<CreateChatCompletionResponse>> {
        try {
            const configuration : Configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
    
            const openAI : OpenAIApi = new OpenAIApi(configuration);
    
            const chatResponse = await openAI.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
    
            return { result: OptionalResult.SUCCESS, data: chatResponse.data };   
        }catch(error: any) {
            return { result: OptionalResult.FAIL, message: error };
        }
    }
}
