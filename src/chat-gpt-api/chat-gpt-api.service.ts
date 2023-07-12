import { Injectable } from '@nestjs/common';
import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { Optional, OptionalResult } from 'src/util/dto/optional.dto';

@Injectable()
export class ChatGPTApiService {
    /**
     * ChatGPT 요청 전송
     */
    async requestChatGPTMessage(role: ChatCompletionRequestMessageRoleEnum, message: string) : Promise<Optional<CreateChatCompletionResponse>> {
        try {
            const configuration : Configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
    
            const openAI : OpenAIApi = new OpenAIApi(configuration);
    
            const chatResponse = await openAI.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: role,
                        content: message,
                    }
                ]
            });
    
            return { result: OptionalResult.SUCCESS, data: chatResponse.data };   
        }catch(error: any) {
            return { result: OptionalResult.FAIL, message: error };
        }
    }
}
